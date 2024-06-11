import User from "../models/User.js";
import { configureOpenAI } from "../utils/openai-config.js";
import { OpenAIApi } from "openai";
export const generateChatCompletion = async (req, res, next) => {
    const { message } = req.body;
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).json({ message: "User not registered OR Token is malfunctioned" });
        }
        // get the chat from the user
        console.log("Stage1");
        const chats = user.chats.map(({ role, content }) => ({ role, content }));
        chats.push({ content: message, role: "user" });
        user.chats.push({ content: message, role: "user" });
        // ----- Jugad Code ------
        user.chats.push({ content: "Currently ChatGPT is not responding. I did a Jugad to give this message. No Paisa Right now. Later i will do it properly Heehhaahhahah", role: "assistant" });
        // console.log(user.chats);
        await user.save();
        return res.status(200).json({ chats: user.chats });
        // ----- Jugad Code ended -----
        // send all the chats including the new one (question) to OpenAI API
        const config = configureOpenAI();
        const openai = new OpenAIApi(config);
        console.log("Stage3");
        // get the laest response
        const chatResponse = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: chats,
        });
        console.log("Stage3.5");
        user.chats.push(chatResponse.data.choices[0].message);
        console.log("Stage4");
        await user.save();
        return res.status(200).json({ chats: user.chats });
    }
    catch (error) {
        // console.log(error)
        return res.status(500).json({ messgae: "Something went wrong" });
    }
};
export const sendChatToUser = async (req, res, next) => {
    console.log("sendChatToUser");
    try {
        // Verifing the token 
        //const user = await User.findOne({ email: res.locals.jwtData.email }); // even this works
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User is not registered or Token malfunctioned");
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permission didn't match ");
        }
        return res.status(200).json({ message: "OK", chats: user.chats });
    }
    catch (error) {
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};
export const deleteChats = async (req, res, next) => {
    try {
        // Verifing the token 
        //const user = await User.findOne({ email: res.locals.jwtData.email }); // even this works
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User is not registered or Token malfunctioned");
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permission didn't match ");
        }
        //@ts-ignore
        user.chats = [];
        await user.save();
        return res.status(200).json({ message: "OK", });
    }
    catch (error) {
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};
//# sourceMappingURL=chat-controllers.js.map