// Import necessary modules
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"; // For handling file uploads
import { registerUser, loginUser, logoutUser } from "../controllers/user.controller.js"; // User controllers
import { verifyJwt } from "../middlewares/auth.middleware.js"; // JWT authentication middleware

// Initialize the router
const userRouter = Router();

// Route to register a new user
// Uploads avatar and optional cover image using multer
userRouter.post(
    "/register",
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ]),
    registerUser
);

// Route to login a user
userRouter.route("/login").post(loginUser);

// Secured route: Logout user
// verifyJwt middleware ensures only authenticated users can logout
userRouter.post("/logout", verifyJwt, logoutUser);

// Export the router
export default userRouter;
