import multer from 'multer';
import path from 'path';

const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/uploads/images');
    },
    filename: (req, file, cb) => {
        // Create unique filename to prevent conflicts
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileName = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
        console.log(`Image uploaded: ${fileName} (Original: ${file.originalname})`);
        cb(null, fileName);
    },
});

// File filter to allow only image files
const imageFileFilter = (req, file, cb) => {
    // Allow only image files
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype) ||
        file.mimetype.startsWith('image/');

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files (JPEG, JPG, PNG, GIF, WebP) are allowed!'));
    }
};

const imageUpload = multer({
    storage: imageStorage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB file size limit
    },
    onError: (err, next) => {
        console.log('Image upload error:', err);
        next(err);
    }
});

export default imageUpload;
