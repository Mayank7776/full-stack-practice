// Import required modules and utilities
import { apiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import JWT from "jsonwebtoken";
import { User } from "../models/todos/user.model";

// Middleware to verify JWT (JSON Web Token) for authentication
export const verifyJwt = asyncHandler(async (req, res, next) => {
    try {
        // Retrieve token from cookies or Authorization header
        const Token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        // If no token is found, throw an Unauthorized error
        if (!Token) {
            throw new apiError(401, "Unauthorized request");
        }
        
        // Verify and decode the token using the secret key
        const decodedToken = JWT.verify(Token, process.env.ACCESS_TOKEN_SECRET);
        
        // Find the user associated with the decoded token, exclude sensitive fields
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        
        // If user is not found, throw an error
        if (!user) {
            throw new apiError(401, "Invalid Access Token");
        }
        
        // Attach the user object to the request for further use in other middlewares/controllers
        req.user = user;
        
        // Call the next middleware/controller
        next();
    } catch (error) {
        // Handle any error during verification
        throw new apiError(401, error?.message || "Invalid Access Token");
    }
});
