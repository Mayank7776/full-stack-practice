// Import Router from Express to define routes
import { Router } from "express";

// Import controller functions for registration and login
import { registerUser, loginUser } from "../controllers/user.controller.js";

// Create a new router instance for user-related routes
const userRouter = Router();

// Define POST route for user registration
userRouter.route("/register").post(registerUser);

// Define POST route for user login
userRouter.route("/login").post(loginUser);

// Export the router (corrected to export directly instead of as an object)
export default userRouter;
