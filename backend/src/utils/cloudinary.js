// Import Cloudinary v2 for media uploads
import { v2 as cloudinary } from "cloudinary";

// Import fs (File System) module to handle local file operations
import fs from "fs"; // Corrected the casing from "fS" to "fs"

// Configure Cloudinary with credentials from environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload a file to Cloudinary
const uploadOnCloudinary = async (localFilePath) => {
    try {
        // If no file path is provided, exit early
        if (!localFilePath) return null;

        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto" // Automatically detect file type (image, video, etc.)
        });

        // Log the URL of the uploaded file
        console.log("File is uploaded to Cloudinary:", response.url);

        return response; // Return the Cloudinary response
    } catch (error) {
        // If upload fails, delete the local temporary file to clean up
        fs.unlinkSync(localFilePath);
        console.error("Cloudinary upload error:", error.message);
        return null;
    }
}

// Export the upload function for use in other modules
export { uploadOnCloudinary };
