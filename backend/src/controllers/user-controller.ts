import { NextFunction, Response, Request } from "express"
import User from "../models/User.js";
import { hash, compare } from "bcrypt";
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";


export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    // Get details of the user from DB
    try {
        const users = await User.find(); // we can write querry inside or else it will return all the user details.
        return res.status(200).json({ message: "OK", users });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "ERROR", cause: error.message });
    }
};

export const userSignup = async (req: Request, res: Response, next: NextFunction) => {
    // Get details of the user from DB
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(401).send("User is already registered"); // 401 - Unauthorized. 
        }
        const hashPassword = await hash(password, 10);
        const user = new User({ name, email, password: hashPassword });
        await user.save(); // Save a new record in the DB

        // create and store cookie
        res.clearCookie(COOKIE_NAME, {
            path: "/",
            domain: "localhost",
            httpOnly: true,
            signed: true,
        })

        const token = createToken(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7)
        res.cookie(COOKIE_NAME, token, {
            path: "/",
            domain: "localhost",
            expires,
            httpOnly: true,
            signed: true,
        });

        return res.status(201).json({ message: "OK", id: user._id.toString(), email: user.email, name: user.name });
    } catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};

export const userLogin = async (req: Request, res: Response, next: NextFunction) => {
    // console.log("Coming to User Controller");
    // res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send("User is not registered");
        }
        const result = await compare(password, user.password);
        if (!result) {
            return res.status(403).send("Password is Incorrect"); // 403 - Forbidden.
        }

        // Clear previously present cookie (JWT Token)
        res.clearCookie(COOKIE_NAME, {
            path: "/",
            domain: "localhost",
            httpOnly: true,
            signed: true,
        });

        // crete and update te cookie
        const token = createToken(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7)
        res.cookie(COOKIE_NAME, token, {
            path: "/",
            domain: "localhost",
            expires,
            httpOnly: true,
            signed: true,
        });
        return res.status(200).json({ message: "OK", email: user.email, name: user.name });
    } catch (error) {
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
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
        return res.status(200).json({ message: "OK", email: user.email, name: user.name });
    } catch (error) {
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};


export const userLogout = async (req: Request, res: Response, next: NextFunction) => {
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

        res.clearCookie(COOKIE_NAME, {
            path: "/",
            domain: "localhost",
            httpOnly: true,
            signed: true,
        });

        return res.status(200).json({ message: "OK", email: user.email, name: user.name });
    } catch (error) {
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};