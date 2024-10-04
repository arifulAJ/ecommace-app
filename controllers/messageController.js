// const Response = require("../../helpers/response");

const Chat = require("../models/Chat");
const jwt = require("jsonwebtoken");
const Response = require("../helpers/response");
const Message = require("../models/Message");
const pagination = require("../helpers/pagination");


const createMessage=async(req,res)=>{
    try {
         // Get the token from the request headers
    const tokenWithBearer = req.headers.authorization;
    let token;

    if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
        // Extract the token without the 'Bearer ' prefix
        token = tokenWithBearer.slice(7);
    }

    if (!token) {
        return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.', status: 'failed' }));
    }
    

 
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log(decoded)
        const {chatId,textMessage,reciverId}=req.body

        const data={
            chatId:chatId,
            senderId:decoded._id,
            reciverId:reciverId,
            textMessage:textMessage,
            messageType:"text"
            
        }

        const message=await Message.create(data)
      

        return res.status(200).json(Response({ statusCode: 200, message: 'message created successfully.', status: 'success', data: message })); 





        
    } catch (error) {
        return res.status(500).json(Response({ statusCode: 500, message: error.message, status: 'server error ' }));

        
    }
}

const showMessageOfUser=async(req,res)=>{
    try {
        // for pagination 
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) ;
         // Get the token from the request headers
    const tokenWithBearer = req.headers.authorization;
    let token;

    if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
        // Extract the token without the 'Bearer ' prefix
        token = tokenWithBearer.slice(7);
    }

    if (!token) {
        return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.', status: 'failed' }));
    }
    

 
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userId = decoded._id;
        const {id}=req.query
        const messagesLength = await Message.find(
            {chatId:id}
            ).countDocuments()
       // Fetch messages where the user is either the sender or receiver
       const messages = await Message.find(
       {chatId:id}
       ).sort({ createdAt: -1 })
       .skip((page - 1) * limit)
    .limit(limit);
     // Optional: Sort messages by creation date in descending order

    if(messages.length===0){
        return res.status(404).json(Response({ statusCode: 404, message: 'you don not have message yet.', status: 'failed' }));

        
    }
    const paginationOfProduct= pagination(messagesLength,limit,page)

    return res.status(200).json(Response({ statusCode: 200, message: 'message created successfully.', status: 'success', data: messages,pagination:paginationOfProduct })); 

    } catch (error) {
        return res.status(500).json(Response({ statusCode: 500, message: error.message, status: 'server error ' }));

        
    }
}

const editMessage=async(req,res)=>{
    try {
        // Get the token from the request headers
    const tokenWithBearer = req.headers.authorization;
    let token;

    if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
        // Extract the token without the 'Bearer ' prefix
        token = tokenWithBearer.slice(7);
    }

    if (!token) {
        return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.', status: 'failed' }));
    }
    

 
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userId = decoded._id;
        
        const {id,text}=req.body
        const message=await Message.findById(id)
        
        if(message.senderId.toString()===userId){

            const updateMessage=await Message.findByIdAndUpdate(id,{textMessage:text},{new:true})
            return res.status(200).json(Response({ statusCode: 200, message: 'message updated  successfully.', status: 'success', data: updateMessage })); 

        }else{
            return res.status(404).json(Response({ statusCode: 404, message: 'this is not your message.', status: 'failed' }));
        }
      


        
    } catch (error) {
        return res.status(500).json(Response({ statusCode: 500, message: error.message, status: 'server error ' }));

        
    }
}

const createMessageByImage=async(req,res)=>{
    try {
         // Get the token from the request headers
    const tokenWithBearer = req.headers.authorization;
    let token;

    if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
        // Extract the token without the 'Bearer ' prefix
        token = tokenWithBearer.slice(7);
    }

    if (!token) {
        return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.', status: 'failed' }));
    }
    

 
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userId = decoded._id;

        const {chatId,reciverId}=req.body
        const {messageImage}= req.files;
        console.log(messageImage,"==-----------------")
        
const files = [];
if (req.files) {
    messageImage.forEach((messageImage) => {
    const publicFileUrl = `/images/users/${messageImage.filename}`;
    
    files.push({
      publicFileUrl,
      path: messageImage.filename,
    });
    // console.log(files);
  });
}

if(files.length===0){
    return res.status(404).json(Response({ statusCode: 404, message: 'plese uplode image', status: 'failed' }));


}

        const data={
            chatId:chatId,
            senderId:userId,
            reciverId:reciverId,
            messageImage:files[0],
            messageType:"image"

        }
       

        const createImageMessage=await Message.create(data)

        const messageEvent = `sendMessage::${chatId}`;
        io.emit(messageEvent, { message: createImageMessage });
        // const updatechatLastMessage=await Chat.findByIdAndUpdate(chatId,{lastMessage:files[0]},{new:true})
        // // emait the message
        // const lastmessage=`lastMessage::${chatId}`
        // io.emit(lastmessage,{message:updatechatLastMessage})
        // console.log(lastmessage,"------------","==========================")
        return res.status(200).json(Response({ statusCode: 200, message: 'image send successfully.', status: 'success', data: createImageMessage })); 


        
    } catch (error) {
        return res.status(500).json(Response({ statusCode: 500, message: error.message, status: 'server error ' }));

        
    }
}
module.exports={
    createMessage,
    showMessageOfUser,
    editMessage,
    createMessageByImage
}    