// Import necessary utility functions and models
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { User } from "../models/todos/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { access } from "fs"; // (Not used in the code currently)

// Internal method to generate access and refresh tokens
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId); // Find user by ID
        const accessToken = user.generateAccessToken; // Generate access token
        const refreshToken = user.generateRefreshToken; // Generate refresh token

        user.refreshToken = refreshToken; // Save refresh token to user document
        await user.save({ validateBeforeSave: false }); // Save without validation

        return { accessToken, refreshToken }; // Return generated tokens
    } catch (error) {
        throw new apiError(500, "Something went wrong while generating refresh and access token");
    }
}

// Controller to handle user registration
const registerUser = asyncHandler(async (req, res) => {
    const { userName, fullName, email, password } = req.body;

    // Check if all fields are provided
    if ([fullName, email, userName, password].some(field => !field?.trim())) {
        throw new apiError(400, "All fields are compulsory");
    }

    // Check if user already exists with given email or username
    const existedUser = await User.findOne({
        $or: [{ userName }, { email }]
    });

    if (existedUser) {
        throw new apiError(409, "User already exists with the same username or email");
    }

    // Get paths of uploaded files
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) {
        throw new apiError(400, "Avatar file is required");
    }

    // Upload avatar and cover image to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

    if (!avatar) {
        throw new apiError(400, "Avatar upload failed");
    }

    // Create new user
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        userName,
    });

    // Fetch newly created user excluding sensitive fields
    const createdUser = await user.findById(user._id).select("-password -refreshToken");
    if (!createdUser) {
        throw new apiError(500, "Something went wrong while registering the user");
    }

    console.log(createdUser);

    // Send successful response
    return res.status(201).json(
        new apiResponse(200, createdUser, "User registered successfully")
    );
});

// Controller to handle user login
const loginUser = asyncHandler(async (req, res) => {
    const { userName, email, password } = req.body;

    // Check if username/email and password are provided
    if (!userName || !email) {
        throw new apiError(400, "Username and email required");
    }

    // Find user with username or email
    const userExist = await User.findOne({
        $or: [{ userName }, { email }]
    });

    if (!userExist) {
        throw new apiError(400, "User doesn't exist");
    }

    // Validate password
    const isPasswordValid = await userExist.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new apiError(401, "Password incorrect");
    }

    // Generate access and refresh tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(userExist._id);
    const loggedInUser = await User.findById(userExist._id).select("-password -refreshToken");

    // Set cookie options
    const options = {
        httpOnly: true,
        secure: true,
    };

    // Send tokens and user data in response
    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new apiResponse(
                200,
                { user: loggedInUser, accessToken, refreshToken },
                "User logged in successfully"
            )
        );
});

// Controller to handle user logout
const logoutUser = asyncHandler(async (req, res) => {
    // Remove refresh token from user document
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: { refreshToken: undefined },
        },
        { new: true }
    );

    // Set cookie options
    const options = {
        httpOnly: true,
        secure: true,
    };

    // Clear access and refresh token cookies and send response
    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new apiResponse(200, {}, "User logged out successfully"));
});

// Export all controllers
export { registerUser, loginUser, logoutUser };
