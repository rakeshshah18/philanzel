import express from 'express';
import multer from 'multer';
import {
    getAllCareerPosts,
    getCareerPost,
    createCareerPost,
    updateCareerPost,
    deleteCareerPost
} from '../../controllers/careerPostController.js';

const router = express.Router();

// Multer configuration for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/uploads/images/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = file.originalname.split('.').pop();
        cb(null, 'career-' + uniqueSuffix + '.' + fileExtension);
    }
});

const fileFilter = (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Multer error handling middleware
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                status: 'error',
                message: 'File too large. Maximum size allowed is 5MB.'
            });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                status: 'error',
                message: 'Unexpected file field. Only "image" field is allowed.'
            });
        }
    }

    if (err.message && err.message.includes('Only image files')) {
        return res.status(400).json({
            status: 'error',
            message: err.message
        });
    }

    next(err);
};

// Routes
router.get('/', getAllCareerPosts);
router.get('/:id', getCareerPost);
router.post('/', upload.single('image'), handleMulterError, createCareerPost);
router.put('/:id', upload.single('image'), handleMulterError, updateCareerPost);
router.delete('/:id', deleteCareerPost);

export default router;
