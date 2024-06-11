import { Router } from "express";
import { getAllUsers, userLogin, userLogout, userSignup, verifyUser } from "../controllers/user-controller.js";
import { validate, signupValidator, loginValidator } from "../utils/validators.js";
import { verifyToken } from "../utils/token-manager.js";
const userRoute = Router();
userRoute.get("/", getAllUsers);
userRoute.post("/signup", validate(signupValidator), userSignup);
userRoute.post("/login", validate(loginValidator), userLogin);
userRoute.get("/auth-status", verifyToken, verifyUser);
userRoute.get("/logout", verifyToken, userLogout);
export default userRoute;
//# sourceMappingURL=user-router.js.map