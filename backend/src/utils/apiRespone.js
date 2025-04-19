// Define a class to standardize API responses
class apiResponse {
    // The constructor takes a status code, some data, and a message
    constructor(statusCode, data, message) {
        // Set the HTTP status code (e.g., 200 for OK, 404 for Not Found, etc.)
        this.statusCode = statusCode;

        // Set the response data (can be any result you want to return to the client)
        this.data = data;

        // Set a message to describe the result (e.g., "Success", "User not found", etc.)
        this.message = message;

        // Set a boolean 'success' flag based on the status code
        // If statusCode is less than 400, it's considered a successful response
        this.success = statusCode < 400;
    }
}
