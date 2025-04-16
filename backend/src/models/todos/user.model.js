import mongoose from 'mongoose'

// to create Schema use new keyword 

const userSchema = new mongoose.Schema(
    {
     username : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
     },
     email : {
        type: String,
        required: true,
        unique: true,
        lowercase : true,
     },
     isActive : Boolean,
     password : {
        type: String,
        // required feild also takes an array where u can write a custom msg.
        required: [true, "Password is required"],
        unique: true,
        lowercase : true,
     }
    },
    // timestamps automatically add two feild created at, updated at.
    { timestamps:true }
)

export const User = mongoose.model("User", userSchema)