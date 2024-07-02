import mongoose from "mongoose";
import { randomUUID } from "crypto";
const chatSchema_openai = new mongoose.Schema({
    id: {
        type: String,
        default: randomUUID
    },
    role: {
        type: String,
        require: true,
    },
    content: {
        type: String,
        require: true,
    }
});
const chatSchema_gemini = new mongoose.Schema({
    id: {
        type: String,
        default: randomUUID
    },
    role: {
        type: String,
        require: true,
    },
    parts: {
        type: Array,
        require: true,
    }
});
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    },
    chats_gemini: [chatSchema_gemini], // this is an array of chatSchema for Gemini
    chats_openai: [chatSchema_openai] // this is an array of chatSchema for Openai
});
export default mongoose.model("User", userSchema);
//# sourceMappingURL=User.js.map
//# sourceMappingURL=User.js.map