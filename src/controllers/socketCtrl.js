const { MessageModel } = require("../models/messageModel");
const { UserModel } = require("../models/userModel");

exports.socketCtrl = {
  chatUpdate: async (req, res) => {
    let message = await UserModel.findOne({ _id: req.body.userID }).populate({
      path: "messages",
      select: "roomID",
    });
    try {
      if (
        !message.messages.some((el) => el.roomID === req.body.messageObj.roomID)
      ) {
        let newMessage = new MessageModel(req.body.messageObj);
        newMessage.save();
        let user = await UserModel.updateOne(
          { _id: req.body.userID },
          { $push: { messages: newMessage._id } }
        );
        let creator = await UserModel.updateOne(
          { _id: req.body.creatorID },
          { $push: { messages: newMessage._id } }
        );
        return res.status(200).json({ user, creator });
      } else {
        let message = await MessageModel.findOneAndUpdate(
          { roomID: req.body.messageObj.roomID },
          { messagesArr: req.body.messageObj.messagesArr }
        );
        message.save();
      }
      return res.status(200).json(message);
    } catch (err) {
      console.error(err);
      res.status(500).json({ err: err });
    }
  },
  getChatByRoomID: async (req, res) => {
    let message = await UserModel.findOne({ _id: req.tokenData._id }).populate({
      path: "messages",
    });
    let roomID = req.params.roomID;
    if (roomID) {
      try {
        let messages = message.messages.filter((msg) => msg.roomID === roomID);
        return res.status(200).json(messages);
      } catch (err) {
        res.status(500).json({ err: err });
      }
    } else return res.status(404).json({ msg: "Chat not found" });
  },
  getUserChats: async (req, res) => {
    let message = await UserModel.findOne({ _id: req.tokenData._id }).populate({
      path: "messages",
    });
    try {
      let messages = message.messages.sort(function (a, b) {
        var keyA = new Date(a.updatedAt),
          keyB = new Date(b.updatedAt);
        // Compare the 2 dates
        if (keyA > keyB) return -1;
        if (keyA < keyB) return 1;
        return 0;
      });
      return res.status(200).json(messages);
    } catch (err) {
      res.status(500).json({ err: err });
    }
  },
  deleteMessage: async (req, res) => {
    let msgID = req.params.msgID;
    let roomID = req.params.roomID;
    try {
      let chat = await MessageModel.findOne({ roomID: roomID });
      chat.messagesArr.splice(msgID, 1);
      await chat.save();

      if (chat.messagesArr.length < 1) {
        try {
          let owner = await UserModel.findById(chat.creatorID).populate({
            path: "messages",
          });
          owner.messages = owner.messages.filter(
            (msg) => String(msg._id) !== String(chat._id)
          );
          await owner.save();
          let user = await UserModel.findById(req.tokenData._id).populate({
            path: "messages",
          });
          user.messages = await user.messages.filter(
            (msg) => String(msg._id) !== String(chat._id)
          );
          await user.save();
          await MessageModel.deleteOne({ _id: chat._id });
          return res.status(200).json({ user, owner });
        } catch (err) {
          res.status(500).json({ err: err });
        }
      }
      return res.sendStatus(200);
    } catch (err) {
      res.status(500).json({ err: err });
    }
  },
  deleteChat: async (req, res) => {
    let chatID = req.params.chatID;
    let chat = await MessageModel.findById(chatID);
    try {
      let user = await UserModel.findById(chat.userID).populate({
        path: "messages",
      });
      user.messages = await user.messages.filter((msg) => msg._id !== chatID);
      await user.save();
      let owner = await UserModel.findById(chat.creatorID).populate({
        path: "messages",
      });
      owner.messages = await owner.messages.filter((msg) => msg._id !== chatID);
      await owner.save();
      await MessageModel.deleteOne({ _id: chatID });
      return res.status(200).json({ user, owner });
    } catch (err) {
      res.status(500).json({ err: err });
    }
  },
};
