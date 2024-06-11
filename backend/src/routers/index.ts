import { Router } from "express";
import userRoute from "./user-router.js";
import chatRoute from "./chat-router.js";

const appRoute = Router();

appRoute.use("/user", userRoute); //domain/api/v1/user
appRoute.use("/chat", chatRoute); //domain/api/v1/chat

export default appRoute;