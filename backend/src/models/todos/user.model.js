// Import mongoose and Schema from mongoose for defining and interacting with MongoDB schemas
import mongoose, { Schema } from 'mongoose';

// Import JWT for token generation (used in access and refresh token methods)
import jwt from "jsonwebtoken";

// Import bcrypt for hashing passwords
import bcrypt from "bcrypt"

// Define the user schema with various fields and validation rules
const userSchema = new mongoose.Schema({

   // Username field: must be unique, lowercase, trimmed, and indexed
   userName: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      index: true
   },

   // Email field: must be unique, lowercase, trimmed, and required
   email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true
   },

   // Full name: required, trimmed, and indexed for search
   fullName: {
      type: String,
      required: true,
      trim: true,
      index: true
   },

   // Avatar image URL: required
   avatar: {
      type: String,
      required: true
   },

   // Optional cover image URL
   coverImage: {
      type: String
   },

   // Watch history: array of ObjectIds referencing the "video" model
   watchHistory: [
      {
         type: Schema.Types.ObjectId,
         ref: "video"
      }
   ],

   // Password: required and will be hashed before saving
   password: {
      type: String,
      required: [true, "password is required"]
   },

   // Optional refresh token for managing session authentication
   refreshToken: {
      type: String
   }

}, {
   // Automatically adds `createdAt` and `updatedAt` fields
   timestamps: true
});


// Pre-save middleware to hash the password if it has been modified
userSchema.pre("save", async function (next) {
   // Only hash the password if it has been modified (corrected typo from isModiefied to isModified)
   if (this.isModified("password")) {
      // Hash the password using bcrypt with a salt round of 8
      this.password = await bcrypt.hash(this.password, 8);
   }
   next(); // Proceed to the next middleware or save
});


// Instance method to compare entered password with stored hashed password
userSchema.methods.isPasswordCorrect = async function(password) {
   return await bcrypt.compare(password, this.password);
}


// Instance method to generate an access token using JWT
userSchema.methods.generateAccessToken = function(){
   return jwt.sign(
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
   );
}

// Instance method to generate a refresh token using JWT
userSchema.methods.generateRefreshToken = function(){
   return jwt.sign(
      {
         _id : this._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
         expiresIn: process.env.REFRESH_TOKEN_EXPIRY
      }
   );
}


// Export the User model to use it in other parts of the application
export const User = mongoose.model("User", userSchema);
