// Import mongoose for MongoDB connection
import mongoose from 'mongoose';

// Import the database name constant
import { DB_NAME } from "../constants.js";

// Define and export an async function to connect to MongoDB
export const ConnectDB = async () => {
    try {
        // Connect to MongoDB using the connection URL and DB name
        const connectionInstance = await mongoose.connect(`${process.env.URL}/${DB_NAME}`);

        // Log success message with the host where DB is connected
        console.log(`✅ MONGO DB CONNECTED!! DB_HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        // Log any error that occurs during the connection attempt
        console.log("❌ Error connecting to MongoDB:", error);

        // Exit the Node.js process with failure code (1)
        // process.exit(1) means the app shuts down immediately
        // Use this when DB connection is critical and app shouldn't run without it
        process.exit(1);
    }
};
