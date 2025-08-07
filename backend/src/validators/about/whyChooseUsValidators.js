import { body, validationResult } from 'express-validator';

// Validation middleware for why choose us content
export const validateWhyChooseUs = [
    body('heading')
        .trim()
        .notEmpty()
        .withMessage('Heading is required')
        .isLength({ min: 2, max: 200 })
        .withMessage('Heading must be between 2 and 200 characters'),

    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 2, max: 300 })
        .withMessage('Title must be between 2 and 300 characters'),

    body('button.text')
        .trim()
        .notEmpty()
        .withMessage('Button text is required')
        .isLength({ min: 1, max: 50 })
        .withMessage('Button text must be between 1 and 50 characters'),

    body('button.link')
        .trim()
        .notEmpty()
        .withMessage('Button link is required')
        .isURL({ require_protocol: false })
        .withMessage('Button link must be a valid URL'),

    body('points')
        .optional()
        .isArray()
        .withMessage('Points must be an array'),

    body('points.*.icon')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Point icon must be between 1 and 100 characters'),

    body('points.*.title')
        .optional()
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Point title must be between 1 and 200 characters'),

    body('points.*.description')
        .optional()
        .trim()
        .isLength({ min: 1, max: 500 })
        .withMessage('Point description must be between 1 and 500 characters'),

    body('points.*.order')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Point order must be a non-negative integer'),

    body('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be a boolean'),

    body('order')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Order must be a non-negative integer'),

    // Custom validation middleware to check results
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array().map(error => ({
                    field: error.path,
                    message: error.msg,
                    value: error.value
                }))
            });
        }
        next();
    }
];

// Validation for adding/updating points
export const validatePoint = [
    body('icon')
        .trim()
        .notEmpty()
        .withMessage('Icon is required')
        .isLength({ min: 1, max: 100 })
        .withMessage('Icon must be between 1 and 100 characters'),

    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 1, max: 200 })
        .withMessage('Title must be between 1 and 200 characters'),

    body('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ min: 1, max: 500 })
        .withMessage('Description must be between 1 and 500 characters'),

    body('order')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Order must be a non-negative integer'),

    // Custom validation middleware to check results
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array().map(error => ({
                    field: error.path,
                    message: error.msg,
                    value: error.value
                }))
            });
        }
        next();
    }
];

// Validation for query parameters
export const validateQuery = [
    body('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),

    body('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),

    body('active')
        .optional()
        .isIn(['true', 'false'])
        .withMessage('Active must be true or false'),

    // Custom validation middleware to check results
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array().map(error => ({
                    field: error.path,
                    message: error.msg,
                    value: error.value
                }))
            });
        }
        next();
    }
];
