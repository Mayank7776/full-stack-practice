// Import custom asyncHandler utility to handle exceptions in async route handlers
import { asyncHandler } from "../utils/asyncHandler.js";

// Controller to handle user registration
const registerUser = asyncHandler(async (req, res) => {
    console.log("register route hit")
    // Placeholder response for registration
    res.status(200).json({
        message: "User registered successfully"
    });
});

// Controller to handle user login
const loginUser = asyncHandler(async (req, res) => {
    // Placeholder response for login
    res.status(200).json({
        message: "User login successful"
    });
});

// Export both controller functions for use in routes
export { registerUser, loginUser };
