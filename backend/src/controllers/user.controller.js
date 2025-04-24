// Import custom asyncHandler utility to handle exceptions in async route handlers
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { User } from "../models/todos/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Controller to handle user registration
const registerUser = asyncHandler(async (req, res) => {
    const { userName, fullName, email, password } = req.body;

    // Validate required fields
    if ([fullName, email, userName, password].some(field => !field?.trim())) {
        throw new apiError(400, "All fields are compulsory");
    }

    // Check if user already exists (by username or email)
    const existedUser = await User.findOne({
        $or: [{ userName: userName.toLowerCase() }, { email }]
    });

    if (existedUser) {
        throw new apiError(409, "User already exists with the same username or email");
    }

    // Validate avatar and cover image file paths
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) {
        throw new apiError(400, "Avatar file is required");
    }

    // Upload images to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

    if (!avatar) {
        throw new apiError(400, "Avatar upload failed");
    }

    // Create user in the database
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        userName: userName.toLowerCase(),
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) {
        throw new apiError(500, "Something went wrong while registering the user");
    }

    // Send successful response
    return res.status(201).json(
        new apiResponse(200, createdUser, "User registered successfully")
    );
});

// Controller to handle user login
const loginUser = asyncHandler(async (req, res) => {
    // Placeholder response for login
    res.status(200).json({
        message: "User login successful"
    });
});

// Export both controller functions
export { registerUser, loginUser };
