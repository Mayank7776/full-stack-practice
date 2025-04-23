// ----------------------------- Load Environment Variables -----------------------------
import dotenv from "dotenv";
dotenv.config({ path: './env' }); // Make sure your .env file exists and has the correct keys

// ----------------------------- Import App and DB Utilities -----------------------------
import { app } from './app.js';         // Express app instance
import { ConnectDB } from './db/index.js'; // Function to establish DB connection

// ----------------------------- Start Server after DB Connection -----------------------------
ConnectDB()
    .then(() => {
        console.log("✅ Database connected successfully");

        // If the app encounters a runtime error, log and throw
        app.on('error', (error) => {
            console.error('❌ App failed to communicate with the database');
            throw error;
        });

        // Start the Express server
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`🚀 Server is running at http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("❌ Failed to connect to the database:", error);
    });
