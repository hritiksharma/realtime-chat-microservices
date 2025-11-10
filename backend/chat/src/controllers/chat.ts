import axios from "axios";
import TryCatch from "../config/TryCatch.js";
import type { AuthenticatedRequest } from "../middlewares/isAuth.js";
import { Chat } from "../models/Chat.js";
import { Messages } from "../models/Messages.js";


export const createNewChat = TryCatch(async (req:AuthenticatedRequest, res) => {
    const userId = req.user?._id; 
    const {otherUserId} = req.body; 
    if(!otherUserId) {
        res.status(400).json({ message: 'otherUserId is required' });
        return;
    }
    
    const existingChat = await Chat.findOne({ 
        users:{ $all: [userId, otherUserId], $size:2 }
    })

    if(existingChat) {
        res.json({ 
            message: 'Chat already exists',
            chatId: existingChat._id,
        })
        return; 
    }
    const newChat = await Chat.create({ 
        users:[userId, otherUserId],
    });

    res.status(201).json({ 
        message: "New Chat created", 
        chatId: newChat._id,
    })
});

export const fetchAllChats = TryCatch(async (req:AuthenticatedRequest, res) => {
    const userId = req.user?._id;
    if(!userId) {
        res.status(400).json({ message: 'UserID is missing' });
        return;
    }   
    const chats = await Chat.find({users:userId}).sort({updatedAt:-1});
    const chatWithUserData = await Promise.all(chats.map(async(chat) => {
        const otherUserId = chat.users.find(id => id !== userId);

        const unseenCount = await Messages.countDocuments({ 
            chatId: chat._id, 
            sender:{ $ne: userId}, 
            seen:false,
        })

        try {
            const {data} = await axios.get(`${process.env.USER_SERVICE}/api/v1/user/${otherUserId}`);
            return { 
                user: data, 
                chat: { 
                    ...chat.toObject(),
                    latestMessage: chat.latestMessage || null,
                    unseenCount: unseenCount, 
                }
            }

        } catch (error) {
            console.log(error)
            return {
                user:{ id:otherUserId, name:"unknown User"},
                chat: { 
                    ...chat.toObject(),
                    latestMessage: chat.latestMessage || null,
                    unseenCount: unseenCount, 
                }
            }
        }
    }))
    res.json({ chats: chatWithUserData });
})