import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "./constants.js";



export const createToken = (id: String, email: String, expiresIn: String) => {
    const payload = { id, email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });
    return token;
}

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    console.log("VerifyToken");
    const token = req.signedCookies[`${COOKIE_NAME}`];
    if (!token || token.trim() === "") {
        return res.status(401).json({ message: "Token not received" });
    }
    // console.log(token);
    return new Promise<void>((resolve, reject) => {
        return jwt.verify(token, process.env.JWT_SECRET, (err, success) => {
            if (err) {
                reject(err.message);
                return res.status(401).json({ message: "Token Expired" });
            }
            else {
                console.log("Token Verification is successful");
                resolve();
                res.locals.jwtData = success; // this is the locals variable set from the middlewear. And this will be utilized in the backend functions. 
                return next();
            }
        });
    })

    // return token;
}
