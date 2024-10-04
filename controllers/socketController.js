const { createServer } = require('node:http');
const { Server } = require('socket.io');



const { connectToDatabase } = require('../helpers/connection');
const app = require('../app');
const User = require('../models/User');
const Driver = require('../models/Driver');
const Response = require('../helpers/response');
const pagination = require('../helpers/pagination');
const Location = require('../models/Location');
const Order = require('../models/Order');
const Message = require('../models/Message');
const Chat = require('../models/Chat');
const  mongoose = require('mongoose');



const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*'
    }
});


// Connect to the MongoDB database
connectToDatabase();




const socketIO = (io) => {
    console.log("Socket server is listening on port 300");

    io.on('connection', async(socket) => {
        console.log(`New client connected`);
         
    // socket.on('userActive',async(data)=>{
        
    //     const user = await User.findById(data.id);
    //     console.log(data.id,data.status)
    //     // console.log(user)
    //     user.status = data.status;
    //     await user.save();
    // })
    socket.on('userActive', async (data) => {
        try {
            console.log(data)
            // Check if data and required fields are present
            if (!data || !data.id || !data.status) {

                return socket.emit('error', { message: 'Invalid data' });
            }
    
            // Find the user by ID
            const user = await User.findById(data.id);
            console.log(user,"-------------")
    
            // Check if the user was found
            if (!user) {
                return socket.emit('error', { message: 'User not found' });
            }
    
            // Update the user's status
            user.status = data.status;
            await user.save();
    
            console.log(`User status updated: ${data.id} -> ${data.status}`);
        } catch (error) {
            console.error('Error handling userActive event:', error);
            socket.emit('error', { message: 'Internal server error' });
        }
    });
    

    
      
socket.on('locationUpdate',async(data)=>{
   
    try {

        const { id, latitute, longitude,status,deliveryTime } = data;
        
    // Check if id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid userId provided');
    }
        const locationFind = await Location.find({userId:id});
        // console.log(locationFind,"------------------------location find",id);
        const location=locationFind[0]
      
    
        location.latitude = latitute;
        location.longitude = longitude;
    
        await location.save();
        const user=await Location.find({userId:id})

    
const orderTrac = await Order.find({ assignedDriver:id, assignedDrivertrack: status }).populate("assignedDriver")

        
        if (orderTrac && orderTrac.length > 0) {
            
const event=`orderStatus`
            io.emit(event, { orderId: orderTrac[0]._id, status: orderTrac[0].status, assignedDrivertrack: orderTrac[0].assignedDrivertrack,location:user[0],deliveryTime:deliveryTime });
            console.log("Order status emitted successfully!");
            
        } else {
            console.log("Driver is not currently tracking any order.",);
        }



    } catch (error) {
        console.error("Error updating location:", error);

    }
    
})

socket.on('message', async (data, ack) => {
    try {const  parsedData = JSON.parse(data);
        const { text, chatId, receiverId, sendId } = parsedData;
        console.log(parsedData,"----------nerjsdhfjklhsdkljfsdlkfjlsdkfj")

        // Validate input
        if (!text || !chatId || !receiverId || !sendId) {
            // console.log(data,"---------------------")
            throw new Error('Missing required fields');
        }
        console.log(text)
        // Check if the chat exists
        const chat = await Chat.findById(chatId);
       
        if (!chat) {
            throw new Error('Chat not found');
        }

        // Check if the sender exists
        const sender = await User.findById(sendId);
    
        if (!sender) {
            throw new Error('Sender not found');
        }

        // Check if the receiver exists
        const receiver = await User.findById(receiverId);
      
        if (!receiver) {
            throw new Error('Receiver not found');
        }

        const message = {
            chatId: chatId,
            senderId: sendId,
            reciverId: receiverId,
            textMessage: text,
            messageType: 'text'
        };

        // Save the message
        const createMessage = await Message.create(message);

        // Emit message to the chat room
        const messageEvent = `sendMessage::${chatId}`;
        io.emit(messageEvent, { message: createMessage });
        const updatechatLastMessage=await Chat.findByIdAndUpdate(chatId,{lastMessage:text},{new:true})
        // emait the message
        const lastmessage=`lastMessage::${chatId}`
        io.emit(lastmessage,{message:updatechatLastMessage})

        // Emit acknowledgment with success response
        if (ack) {
            ack({ message: createMessage });
        }

    } catch (error) {
        // console.error( error.message);

        // Emit acknowledgment with error response
        if (ack) {
            ack({ error: error.message });
        }
    }
});




        socket.on('disconnect', async() => {
            console.log("you are disconnect")
            
        });


    });
};



module.exports = socketIO;


