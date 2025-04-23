// Import mongoose and Schema for database schema creation
import mongoose, { Schema } from "mongoose";

// Import pagination plugin for aggregate queries
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

// Define the schema for a video document in the database
const videoSchema = new mongoose.Schema({

  // URL of the actual video file (e.g., stored in Cloudinary or any cloud storage)
  videoFile: {
    type: String,
    required: true // This field must be provided
  },

  // URL of the video's thumbnail image
  thumbnail: {
    type: String,
    required: true, // Thumbnail is mandatory
    unique: true    // Each video must have a unique thumbnail URL
  },

  // The user who uploaded the video (linked to User model)
  owner: {
    type: Schema.Types.ObjectId, // Stores the _id of the user
    ref: "User"                  // Reference to the "User" collection
  },

  // Title of the video
  title: {
    type: String,
    required: true // Cannot save video without a title
  },

  // Detailed description of the video content
  description: {
    type: String,
    required: true // Description is also required
  },

  // Whether the video is publicly visible or not
  isPublished: {
    type: Boolean,
    default: true // By default, the video is marked as published
  },

  // Duration of the video (in seconds or minutes)
  duration: {
    type: Number,
    required: true // Duration is required to understand video length
  },

  // Number of views this video has received
  views: {
    type: Number,
    default: 0 // When video is first uploaded, view count is 0
  }

}, {
  timestamps: true // Adds `createdAt` and `updatedAt` fields automatically
});

// Add pagination support for aggregate queries using the plugin
// An aggregate query is used to transform and analyze collections of documents in MongoDB using multiple operations like filtering, grouping, sorting, projecting, etc.
videoSchema.plugin(mongooseAggregatePaginate);

// Export the Video model to use in other parts of the application
export const Video = mongoose.model("Video", videoSchema);
