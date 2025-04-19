// Importing the Express app instance
import { app } from './app.js';

// Importing the database connection function
import { ConnectDB } from './db/index.js';

// Call ConnectDB, which returns a Promise
ConnectDB()
    .then(() => {
        console.log("✅ DB connected successfully");

        // Handle DB connection errors using the app instance
        app.on('error', (error) => {
            console.log('❌ Application is not able to talk to the database');
            throw error;
        });


        // Start the server after successful DB connection
        app.listen(process.env.PORT, () => {
            console.log(`🚀 Server running at Port: ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        // Catch and log any DB connection errors
        console.log("❌ Failed to connect to DB:", error);
    });


/*
import express from 'express';
import mongoose from 'mongoose'; // Make sure to import mongoose if you're using it

const app = express();
const PORT = process.env.PORT || 5000;
const DB_NAME = process.env.DB_NAME;

// Using an IIFE to connect to the database and start the server
;(async () => {
    try {
        // Connecting to the MongoDB database
        await mongoose.connect(`${process.env.URL}/${DB_NAME}`);

        // Handle DB connection errors using the app instance
        app.on('error', (error) => {
            console.log('❌ Application is not able to talk to the database');
            throw error;
        });

        // Start the server after successful DB connection
        app.listen(PORT, () => {
            console.log(`🚀 Server listening at Port: ${PORT}`);
        });

    } catch (error) {
        // Catch and log errors during DB connection or server startup
        console.log("❌ Error during startup:", error);
    }
})();
*/
