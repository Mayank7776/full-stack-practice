// Import required modules
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// Create an instance of the Express app
const app = express();

// ---------------------------- CORS Middleware ----------------------------
// CORS (Cross-Origin Resource Sharing) allows your frontend to communicate with the backend.
// For security reasons, browsers block requests between different origins unless CORS is enabled.

// Configure CORS middleware
app.use(cors({
    origin: process.env.CORS_Origin, // Allow requests from this origin (defined in your environment variables)
    credentials: true // Allow cookies and credentials to be sent with the request
}));

// ---------------------- Middleware to Parse JSON ----------------------
// Parses incoming requests with JSON payloads.
// 'limit' controls the max size of the JSON body to avoid overload or attacks.
app.use(express.json({
    limit: "16kb", // Accept JSON bodies up to 16 kilobytes
}));

// --------------------- Middleware for URL Encoded Data ---------------------
// Parses incoming requests with URL-encoded payloads (e.g., form submissions)
// 'extended: true' allows rich objects and arrays to be encoded into the URL-encoded format.
app.use(express.urlencoded({
    extended: true,
    limit: "16kb" // Limit size to 16 kilobytes
}));

// ---------------------- Serve Static Files ----------------------
// Serve files (like images, CSS, JS) from the 'public' directory
// Accessible via URL like: http://yourdomain.com/image.png
app.use(express.static("public"));

// ---------------------- Cookie Parser Middleware ----------------------
// Parses cookies attached to the client request object.
// Helpful for managing user sessions, authentication tokens, etc.
app.use(cookieParser());

// Export the app instance to be used in the main server file (e.g., index.js or server.js)
export { app };
