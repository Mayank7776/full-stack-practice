// --------------------------- Import Required Modules ---------------------------
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// --------------------------- Initialize Express App ---------------------------
const app = express();

// ---------------------------- CORS Middleware ----------------------------
// Enables CORS to allow cross-origin requests (e.g., frontend <-> backend communication)
app.use(cors({
    origin: process.env.CORS_Origin, // Define allowed origin via environment variable
    credentials: true                // Allow cookies and credentials to be included in requests
}));

// ---------------------- Middleware to Parse JSON ----------------------
// Parses incoming JSON requests. Limit set to prevent DoS via large payloads
app.use(express.json({
    limit: "16kb"
}));

// --------------------- Middleware for URL-Encoded Data ---------------------
// Parses form submissions or other URL-encoded payloads
app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}));

// ---------------------- Serve Static Files ----------------------
// Expose the "public" directory to serve static files like images or styles
app.use(express.static("public"));

// ---------------------- Cookie Parser Middleware ----------------------
// Parses cookies sent by the client (useful for sessions and auth)
app.use(cookieParser());

// ---------------------- Import and Use Routes ----------------------
import userRouter from "./routes/user.routes.js";

// Register user-related API routes under the given base path
app.use("/api/v1/users", userRouter);
// Example endpoint: POST https://localhost:4000/api/v1/users/register

// ---------------------- Export App Instance ----------------------
// The exported app can be used in a server file like `index.js` or `server.js`
export { app };
