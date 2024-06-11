import app from "./app.js";
import { connectToDB } from "./db/connection.js";
// Connections and Listener.
const PORT = process.env.PORT || 3000;
connectToDB().then(() => {
    app.listen(PORT, () => console.log("Server Open and Connected to DataBase"));
}).catch((error) => {
    console.log(error);
});
//# sourceMappingURL=index.js.map