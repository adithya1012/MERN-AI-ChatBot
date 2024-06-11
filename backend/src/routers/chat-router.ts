import { Router } from "express";
import { verifyToken } from "../utils/token-manager.js";
import { chatCompletionValidator, validate } from "../utils/validators.js";
import { deleteChats, generateChatCompletion, sendChatToUser } from "../controllers/chat-controllers.js";

// Protected API
const chatRoute = Router();
chatRoute.post("/new",
    validate(chatCompletionValidator), //Middlewear
    verifyToken, //Middlewear - 2 middlewears are added because protected API
    generateChatCompletion);

chatRoute.get("/all-chats",
    verifyToken, //Middlewear - 2 middlewears are added because protected API
    sendChatToUser);

chatRoute.delete("/delete",
    verifyToken, //Middlewear - 2 middlewears are added because protected API
    deleteChats);

export default chatRoute;