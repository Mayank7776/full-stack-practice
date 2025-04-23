// Import mongoose and Schema from mongoose for database operations
import mongoose, { Schema } from 'mongoose';
// Import JWT for token generation (not used in this snippet)
import jwt, { JsonWebTokenError } from "jsonwebtoken";
// Import bcrypt for password hashing
import bcrypt from "bcrypt"

// Define the user schema with various fields
const userSchema = new mongoose.Schema({

   // Username field with several constraints and formatting options
   userName: {
      type: String,         // Value must be a string
      unique: true,         // Username must be unique
      required: true,       // Field is mandatory
      lowercase: true,      // Convert input to lowercase
      trim: true,           // Remove leading/trailing spaces
      index: true           // Indexed for faster search
   },

   // Email field with similar constraints as username
   email: {
      type: String,
      unique: true,         // Email must be unique
      required: true,       // Mandatory field
      lowercase: true,
      trim: true
   },

   // Full name of the user
   fullName: {
      type: String,
      required: true,       // Cannot be empty
      trim: true,
      index: true           // Useful for searching/filtering
   },

   // Avatar URL (e.g., profile picture)
   Avatar: {
      type: String,
      required: true
   },

   // Optional cover image (e.g., profile banner)
   coverImage: {
      type: String
   },

   // Array of ObjectIds referencing videos the user has watched
   watchHistory: [
      {
         type: Schema.Types.ObjectId, // Link to another document
         ref: "video"                // Reference to the "video" model
      }
   ],

   // Hashed password (will be hashed before saving)
   password: {
      type: String,
      required: [true, "password is required"] // Custom error message if not provided
   },

   // Optional refresh token for handling JWT sessions
   refreshToken: {
      type: String
   }

}, {
   timestamps: true // Automatically adds `createdAt` and `updatedAt` timestamps
});


// Middleware to hash password before saving the user document
userSchema.pre("save", async function (next) {
   // Check if password field was modified
   if (this.isModiefied("password")) {
      // Hash the password using bcrypt with a salt round of 8
      this.password = bcrypt.hash(this.password, 8)
      next(); // Continue to the next step
   } else {
      next(); // If not modified, skip hashing
   }
});


// Custom method to compare plain text password with hashed password
userSchema.methods.isPasswordCorrect = async function(password) {
   // bcrypt.compare returns true if passwords match
   return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
   jwt.sign(
      {
         _id : this._id,
         email: this.email,
         userName: this.userName,
         fullName: this.fullName,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
         expiresIn: process.env.ACCESS_TOKEN_EXPIRY
      }
   )
}
userSchema.methods.generateRefreshToken = function(){
   jwt.sign(
      {
         _id : this._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
         expiresIn: process.env.REFRESH_TOKEN_EXPIRY
      }
   )
}


// Export the User model so it can be used elsewhere in the project
export const User = mongoose.model("User", userSchema);
