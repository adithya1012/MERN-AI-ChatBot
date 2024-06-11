import { connect, disconnect } from "mongoose";
async function connectToDB() {
    try {
        await connect(process.env.MONGODB_URL);
    }
    catch (error) {
        console.log(error);
        throw new Error("Couldnot connect DB");
    }
}
async function disconnectFromDB() {
    try {
        await disconnect();
    }
    catch (error) {
        console.log(error);
        throw new Error("Couldnot disconnect DB");
    }
}
export { connectToDB, disconnectFromDB };
//# sourceMappingURL=connection.js.map