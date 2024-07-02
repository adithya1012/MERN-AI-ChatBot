import User from "../models/User.js";
// import { configureOpenAI } from "../utils/openai-config.js";/
// import { OpenAIApi } from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
export const generateChatCompletion_gemini = async (req, res, next) => {
    const { message } = req.body;
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).json({ message: "User not registered OR Token is malfunctioned" });
        }
        // get the chat from the user
        const chats = user.chats_gemini.map(({ role, parts }) => ({ role, parts })); // this line will copy the parts of all the user.chats to chats.
        // console.log(chats)
        // console.log(user.chats)
        // ----- Jugad Code ------
        // chats.push({ parts: message, role: "user" });
        // user.chats.push({ parts: message, role: "user" });
        // console.log(chats)
        // console.log(user.chats)
        // user.chats.push({ parts: "Currently ChatGPT is not responding. I did a Jugad to give this message. No Paisa Right now. Later i will do it properly Heehhaahhahah", role: "assistant" });
        // user.chats.push({ parts: "In Python, a list is a mutable, ordered collection of items. Lists can be created using square brackets `[]` or using the `list()` constructor. Here's the syntax for creating a list:\n\n1. **Using square brackets:**\n\n```python\n# Creating an empty list\nmy_list = []\n\n# Creating a list with elements\nmy_list = [1, 2, 3, 'a', 'b', 'c']\n```\n\n2. **Using the `list()` constructor:**\n\n```python\n# Creating an empty list\nmy_list = list()\n\n# Creating a list from an iterable\nmy_list = list([1, 2, 3, 'a', 'b', 'c'])\n```\n\nLists are versatile and can contain elements of different types, including other lists. Here are some examples of common list operations:\n\n```python\n# Accessing elements\nprint(my_list[0])  # Output: 1\nprint(my_list[-1])  # Output: 'c'\n\n# Adding elements\nmy_list.append('d')\nmy_list.insert(2, 'z')\n\n# Removing elements\nmy_list.remove('a')\nremoved_element = my_list.pop(3)\n\n# Slicing\nsub_list = my_list[1:4]\n\n# Length of the list\nlength = len(my_list)\n\n# Iterating through the list\nfor item in my_list:\n    print(item)\n```", role: "assistant" });
        // console.log(user.chats);
        // await user.save();
        // return res.status(200).json({ chats: user.chats });
        // ----- Jugad Code ended -----
        // send all the chats including the new one (question) to OpenAI API
        // const config = configureOpenAI();
        chats.push({ parts: [{ text: message }], role: "user" });
        user.chats_gemini.push({ parts: [{ text: message }], role: "user" });
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const a = {
            history: chats
        };
        console.log(a);
        const chat = model.startChat({
            history: 
            // {
            //     role: "user",
            //     parts: [{ text: "Hello, I have 2 dogs in my house." }],
            // },
            // {
            //     role: "model",
            //     parts: [{ text: "Great to meet you. What would you like to know?" }],
            // },
            chats,
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });
        // const msg = "How many paws are in my house?";
        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();
        // const text = response.text().replace(/\n/g, '<br />');
        console.log(text);
        user.chats_gemini.push({ parts: [{ text: text }], role: "model" });
        // console.log(user.chats[1].parts);
        await user.save();
        return res.status(200).json({ chats: user.chats_gemini });
        // return res.status(200).json({ chats: "this is adithya ```hello```" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ messgae: "Something went wrong" });
    }
};
export const sendChatToUser_gemini = async (req, res, next) => {
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
        return res.status(200).json({ message: "OK", chats: user.chats_gemini });
    }
    catch (error) {
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};
export const deleteChats_gemini = async (req, res, next) => {
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
        user.chats_gemini = [];
        await user.save();
        return res.status(200).json({ message: "OK", });
    }
    catch (error) {
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};
//# sourceMappingURL=chat-controllers.js.map
//# sourceMappingURL=chat-controllers_gemini.js.map