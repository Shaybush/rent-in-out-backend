

exports.sockets = (socket) => {
  socket.on('send-messege',({message , roomID , userName , sender})=>{
    socket.to(roomID).emit('messege-back', {message , userName , sender});
  });
  socket.on('typing-start',({roomID})=>{
    socket.to(roomID).emit('recieve-typing');
  });
  socket.on('typing-end',({roomID})=>{
    socket.to(roomID).emit('notRecieve-typing');
  });
  socket.on('join-room',({roomID})=>{
    socket.join(roomID);
  });
  socket.on('disconnect', ({messageObj , userID})=>{
    // let user = await UserModel.findById(userId).populate({path:'messages', model: "message"});
    // let user = await UserModel.updateOne({_id: userID}).populate({path:'messages', $push: "message"});
  });
};
