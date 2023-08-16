import express from "express";

import { createConversation,  } from "../controllers/conversationController.js";
import { createChat, getChat } from "../controllers/chatController.js";


const conversationRoutes = express.Router();


conversationRoutes.post('/', createConversation)
// conversationRoutes.get('/', getConversation)
conversationRoutes.post('/message', createChat)
conversationRoutes.get('/message', getChat)

export default conversationRoutes