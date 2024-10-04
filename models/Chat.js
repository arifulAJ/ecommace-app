// const mongoose = require("mongoose");

// const chatSchema = new mongoose.Schema({
    
        
//             senderId: {
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: "User",
//                 required: true
//             },
//             receiverId: {
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: "User",
//                 required: true
//             }
        
    
// }, {
//     timestamps: true
// });

// const Chat = mongoose.model("Chat", chatSchema);
// module.exports = Chat;
const mongoose = require('mongoose');

const chatSechema=new mongoose.Schema({

    first:{ type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    second:{ type: mongoose.Schema.ObjectId, ref: 'User', required: false },
    // member:[{ type: mongoose.Schema.ObjectId, ref: 'User', required: false }],
    lastMessage:{type:String,enum:["text","image"],required:false}

},{
    timestamps:true
})
const Chat=mongoose.model("Chat",chatSechema)

module.exports=Chat