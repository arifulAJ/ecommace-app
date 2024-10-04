// const mongoose = require("mongoose");

// const messageSchema = new mongoose.Schema({
//    chatId:{type:mongoose.Schema.Types.ObjectId,ref:"Chat",required:true},
//    senderId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
//    receiverId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
//    text:{type:String,required:false},
//    image:{type:Object,default:false},
//    messageType:{type:String,required:true,enum:["text","file",]}
// }, {
//     timestamps: true
// });

// const Message = mongoose.model("Message", messageSchema);
// module.exports = Message;
const mongoose = require('mongoose');

const messageSchema=new mongoose.Schema({
    chatId:{ type: mongoose.Schema.ObjectId, ref: 'Chat', required: true },
    senderId:{ type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    reciverId:{ type: mongoose.Schema.ObjectId, ref: 'User', required: true },

    textMessage:{type:String,required:false},
    messageImage:{type:Object,required:false},
    messageType:{type:String,enum:["text","image"]}

},{timestamps:true})

const Message=mongoose.model("Message",messageSchema)

module.exports=Message