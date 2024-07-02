import { Router } from "express";
import { verifyToken } from "../utils/token-manager.js";
import { chatCompletionValidator, validate } from "../utils/validators.js";
import { deleteChats_gemini, generateChatCompletion_gemini, sendChatToUser_gemini } from "../controllers/chat-controllers_gemini.js";
import { deleteChats_openai, generateChatCompletion_openai, sendChatToUser_openai } from "../controllers/chat-controllers_openai.js";
// Protected API
const chatRoute = Router();
chatRoute.post("/new_gemini", validate(chatCompletionValidator), //Middlewear
verifyToken, //Middlewear - 2 middlewears are added because protected API
generateChatCompletion_gemini);
chatRoute.get("/all-chats_gemini", verifyToken, //Middlewear - 2 middlewears are added because protected API
sendChatToUser_gemini);
chatRoute.delete("/delete_gemini", verifyToken, //Middlewear - 2 middlewears are added because protected API
deleteChats_gemini);
chatRoute.post("/new_openai", validate(chatCompletionValidator), //Middlewear
verifyToken, //Middlewear - 2 middlewears are added because protected API
generateChatCompletion_openai);
chatRoute.get("/all-chats_openai", verifyToken, //Middlewear - 2 middlewears are added because protected API
sendChatToUser_openai);
chatRoute.delete("/delete_openai", verifyToken, //Middlewear - 2 middlewears are added because protected API
deleteChats_openai);
export default chatRoute;
//# sourceMappingURL=chat-router.js.map
//# sourceMappingURL=chat-router.js.map