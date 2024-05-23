
const mongoose = require("mongoose");
const messageObj ={
    sender: String,
    userName:String,
    message: String
}

const messageSchema = new mongoose.Schema({
    ownerName: String,
    ownerImg: String,
    userName: String,
    userImg: String,
    roomID: String,
    creatorID: String,
    userID : String,
    messagesArr:[messageObj]
} , { timestamps: true })

exports.MessageModel = mongoose.model("messages", messageSchema);