// const Response = require("../../helpers/response");
const Chat = require("../models/Chat");
const jwt = require("jsonwebtoken");
const Response = require("../helpers/response");
const Message = require("../models/Message");
const pagination = require("../helpers/pagination");
const createChat = async (req, res) => {
    try {
        // Get the token from the request headers
        const tokenWithBearer = req.headers.authorization;
        let token;

        if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
            // Extract the token without the 'Bearer ' prefix
            token = tokenWithBearer.slice(7);
        }

        if (!token) {
            return res.status(401).json(
                Response({ statusCode: 401, message: 'Token is missing.', status: 'failed' })
            );
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const { id } = req.body;

        if (!id) {
            return res.status(404).json(
                Response({ statusCode: 404, message: 'User ID is required.', status: 'failed' })
            );
        }

        // Check if a chat already exists between the two users
        const existingChat = await Chat.findOne({
            $or: [
                { first: decoded._id, second: id },
                { first: id, second: decoded._id }
            ]
        }).populate("second first")
         // Return the new chat with populated details and last message
        //  const otherParticipant1 = existingChat.first._id.equals(decoded._id) ? existingChat.second : existingChat.first;

        if (existingChat) {
            const lastMessage = await Message.findOne({ chat: existingChat._id }).sort({ createdAt: -1 });
            const otherParticipant1 = existingChat.first._id.equals(decoded._id) ? existingChat.second : existingChat.first;
          
            return res.status(200).json(Response({ statusCode: 200, message: 'Chat already exists.', status: 'failed',data: {
                chatId: existingChat._id,
                otherParticipant:otherParticipant1,
                lastMessage
                
            } }));
        }
        // Create a new chat
        const newChat = await Chat.create({
            first: decoded._id,
            second: id
        });

        // Populate the newly created chat
        const populatedChat = await Chat.findById(newChat._id).populate("first second");

        // Populate the last message for the new chat
        const lastMessage = await Message.findOne({ chat: newChat._id }).sort({ createdAt: -1 });

        // Return the new chat with populated details and last message
        const otherParticipant = populatedChat.first._id.equals(decoded._id) ? populatedChat.second : populatedChat.first;

        return res.status(200).json(
            Response({
                statusCode: 200,
                message: 'Chat created successfully.',
                status: 'success',
                data: {
                    chatId: populatedChat._id,
                    otherParticipant,
                    lastMessage
                }
            })
        );

    } catch (error) {
        return res.status(500).json(
            Response({ statusCode: 500, message: error.message, status: 'server error' })
        );
    }
};



// const createChat = async (req, res) => {
//     try {
//         // Get the token from the request headers
//         const tokenWithBearer = req.headers.authorization;
//         let token;

//         if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
//             // Extract the token without the 'Bearer ' prefix
//             token = tokenWithBearer.slice(7);
//         }

//         if (!token) {
//             return res.status(401).json(
//                 Response({ statusCode: 401, message: 'Token is missing.', status: 'failed' })
//             );
//         }

//         // Verify the token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//         console.log(decoded);

//         const { id } = req.body;

//         if (!id) {
//             return res.status(400).json(
//                 Response({ statusCode: 400, message: 'User ID is required.', status: 'failed' })
//             );
//         }

//         // Check if a chat already exists between the two users
//         let existingChat = await Chat.findOne({
//             $or: [
//                 { first: decoded._id, second: id },
//                 { first: id, second: decoded._id }
//             ]
//         }).populate("second");

//         if (existingChat) {
//             // Check if the existing chat has any messages
//             const hasMessages = await Message.countDocuments({ chat: existingChat._id }) > 0;

//             if (hasMessages) {
//                 return res.status(200).json(
//                     Response({ statusCode: 200, message: 'Chat already exists.', status: 'failed', data: existingChat })
//                 );
//             } else {
//                 // If no messages, create a new chat and delete the old one
//                 await Chat.deleteOne({ _id: existingChat._id });
//             }
//         }

//         // Create a new chat
//         const data = {
//             first: decoded._id,
//             second: id
//         };

//         const newChat = await Chat.create(data);
//         // Optionally populate the fields if needed
//         // await newChat.populate("second").execPopulate();

//         return res.status(200).json(
//             Response({ statusCode: 200, message: 'Chat created successfully.', status: 'success', data: newChat })
//         );

//     } catch (error) {
//         return res.status(500).json(
//             Response({ statusCode: 500, message: error.message, status: 'server error' })
//         );
//     }
// };


// const createChat = async (req, res) => {
//     try {
         
//         // Get the token from the request headers
//         const tokenWithBearer = req.headers.authorization;
//         let token;

//         if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
//             // Extract the token without the 'Bearer ' prefix
//             token = tokenWithBearer.slice(7);
//         }

//         if (!token) {
//             return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.', status: 'failed' }));
//         }

//         // Verify the token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//         console.log(decoded);

//         const { id } = req.body;

//         if (!id) {
//             return res.status(400).json(Response({ statusCode: 400, message: 'User ID is required.', status: 'failed' }));
//         }

//         // Check if a chat already exists between the two users
//         const existingChat = await Chat.findOne({
//             $or: [
//                 { first: decoded._id, second: id },
//                 { first: id, second: decoded._id }
//             ]
//         }).populate("second")

//         if (existingChat) {
//             return res.status(200).json(Response({ statusCode: 200, message: 'Chat already exists.', status: 'failed',data:existingChat }));
//         }

//         // Create a new chat
//         const data = {
//             first: decoded._id,
//             second: id
//         };

//         const newChat = (await Chat.create(data)).populate("second")
//         // Check if the chat has any messages
//         const hasMessages = await Message.countDocuments({ chat: newChat._id }) > 0;

//         if (!hasMessages) {
//             // Delete the chat if there are no messages
//             await Chat.deleteOne({ _id: newChat._id });
//             return res.status(200).json(
//                 Response({ statusCode: 200, message: 'Chat created but deleted as it has no messages.', status: 'info' })
//             );
//         }

//         return res.status(200).json(Response({ statusCode: 200, message: 'Chat created successfully.', status: 'success', data: newChat }));

//     } catch (error) {
//         return res.status(500).json(Response({ statusCode: 500, message: error.message, status: 'server error' }));
//     }
// };


// const showChat = async (req, res) => {
//     try {
//          // for pagination 
// const page = parseInt(req.query.page) || 1;
// const limit = parseInt(req.query.limit) || 10;
//         // Get the token from the request headers
//         const tokenWithBearer = req.headers.authorization;
//         let token;

//         if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
//             // Extract the token without the 'Bearer ' prefix
//             token = tokenWithBearer.slice(7);
//         }

//         if (!token) {
//             return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.', status: 'failed' }));
//         }

//         // Verify the token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

//         // Find chats where the logged-in user is a participant
//         const chats = await Chat.find({
//             $or: [
//                 { first: decoded._id },
//                 { second: decoded._id },
//                 // { member: decoded._id } // For group chats
//             ]
//         }).populate("second first").sort({ updatedAt: -1 }).skip((page - 1) * limit)
//         .limit(limit);// Sort by updatedAt to get the most recent chats first

       
//         const paginationOfProduct= pagination(chats.length,limit,page)

//         return res.status(200).json(Response({ statusCode: 200, message: 'Chats fetched successfully.', status: 'success', data: chats,pagination:paginationOfProduct }));

//     } catch (error) {
//         return res.status(500).json(Response({ statusCode: 500, message: error.message, status: 'server error' }));
//     }
// };

const showChat = async (req, res) => {
    try {
        // For pagination 
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Get the token from the request headers
        const tokenWithBearer = req.headers.authorization;
        let token;

        if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
            // Extract the token without the 'Bearer ' prefix
            token = tokenWithBearer.slice(7);
        }

        if (!token) {
            return res.status(401).json(
                Response({ statusCode: 401, message: 'Token is missing.', status: 'failed' })
            );
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Find chats where the logged-in user is a participant
        const chatslength = await Chat.find({
            $or: [
                { first: decoded._id },
                { second: decoded._id },
                // { member: decoded._id } // For group chats
            ]
        }).countDocuments()
        const chats = await Chat.find({
            $or: [
                { first: decoded._id },
                { second: decoded._id },
                // { member: decoded._id } // For group chats
            ]
        }).populate("second first").sort({ updatedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

        // Transform chats to exclude the logged-in user and include only the other participant's ID
        const transformedChats = chats.map(chat => {
            let otherParticipantId;
        
            if (chat.first._id.toString()=== decoded._id) {
           
                otherParticipantId = chat.second;
            }
            
            
            else {
               
                otherParticipantId = chat.first;
            }
     
            return {
                chatId: chat._id,
                otherParticipantId,
                // You can include other relevant information if needed
                updatedAt: chat.updatedAt,
                lastMessage:chat.lastMessage
            };
        });
        
        
       
if(chatslength===0){
    return res.status(404).json(Response({statusCode:404,message:"message is empty",status:"faild"}))
}
        // For pagination
        const paginationOfChat = pagination(chatslength, limit, page);

        return res.status(200).json(
            Response({
                statusCode: 200,
                message: 'Chats fetched successfully.',
                status: 'success',
                data: transformedChats,
                pagination: paginationOfChat
            })
        );

    } catch (error) {
        return res.status(500).json(
            Response({ statusCode: 500, message: error.message, status: 'server error' })
        );
    }
};


module.exports={
    createChat,
    showChat
}