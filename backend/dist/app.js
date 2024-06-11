import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import appRoute from "./routers/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
// import bodyParser from 'body-parser';
config();
const app = express();
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};
// Apply CORS middleware
app.use(cors(corsOptions));
// Middleware to parse incoming JSON requests
// app.use(bodyParser.json());
// Handle preflight requests
// app.options('*', cors(corsOptions));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
//remove this from prod
app.use(morgan("dev"));
app.use("/api/v1", appRoute);
export default app;
//# sourceMappingURL=app.js.map