// Define a custom error class that extends the built-in JavaScript Error class
class apiError extends Error {
    constructor(
        statusCode,               // HTTP status code (e.g., 400, 500)
        message = "something went wrong", // Default error message if not provided
        errors = [],              // Optional array of detailed error messages
        stack = ""                // Optional custom stack trace
    ) {
        super(message);          // Call the parent Error constructor with the message

        this.statusCode = statusCode; // Set the HTTP status code
        this.data = null;            // No data is returned when there's an error
        this.message = message;      // Set the error message
        this.success = false;        // Errors are always marked as unsuccessful
        this.errors = errors;        // Set additional error details (e.g., validation issues)

        // If a custom stack trace is provided, use it
        // Otherwise, capture the current stack trace using built-in Error method
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

// Export the apiError class for use in other files
export { apiError };
