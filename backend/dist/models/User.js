import mongoose from "mongoose";
import { randomUUID } from "crypto";
const chatSchema = new mongoose.Schema({
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
    chats: [chatSchema] // this is an array of chatSchema
});
export default mongoose.model("User", userSchema);
//# sourceMappingURL=User.js.map