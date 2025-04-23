// Import multer for handling multipart/form-data (used for file uploads)
import multer from 'multer';

// Configure storage settings for multer
const storage = multer.diskStorage({

    // Set the destination folder for uploaded files
    destination: function (req, file, cb) {
        cb(null, "./public/temp"); // Files will be saved in this local directory
    },

    // Define the filename for the uploaded file
    filename: function (req, file, cb) {
        // Currently using the original file name as is
        cb(null, file.originalname);

        // Optional enhancement:
        // To avoid filename collisions, you can uncomment below and use a unique suffix:
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});

// Create and export the multer upload middleware using the defined storage configuration
export const upload = multer({ storage });
