// This file defines async handler functions to simplify error handling in async route functions.

// ---------- First Method: Using Promises ----------

// asyncHandler is a higher-order function that takes a request handler (async function) as an argument
const asyncHandler = (requestHandler) => {
    // It returns a new function that takes the usual Express parameters: req, res, next
    return (req, res, next) => {
        // The request handler is called, and its result (a Promise) is resolved
        // If there's an error in the async function, it is caught and passed to next()
        // This triggers Express's error-handling middleware
        Promise.resolve(requestHandler(req, res, next)).catch((error) => next(error));
    };
};

// ---------- Second Method: Using try-catch ----------

// This function does the same thing as above but uses async/await with try-catch
// NOTE: There is a small syntax error in your code. Here's the corrected version:

const asyncHandle = (func) => async (req, res, next) => {
    try {
        // Await the execution of the passed async function
        await func(req, res, next);
    } catch (error) {
        // If an error occurs, respond with a JSON containing the error message
        // Use a custom status code from the error (if available), otherwise default to 500
        res.status(error.code || 500).json({
            success: false,
            message: error.msg
        });
    }
};

// Export only the asyncHandler function so it can be used in other files
export { asyncHandler };

// If you want to export asyncHandle as well, you can add it like this:
// export { asyncHandler, asyncHandle };
