import { body, param } from 'express-validator';

export const createOurFounderValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),

    body('designation')
        .trim()
        .notEmpty()
        .withMessage('Designation is required')
        .isLength({ min: 2, max: 150 })
        .withMessage('Designation must be between 2 and 150 characters'),

    body('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ min: 10, max: 2000 })
        .withMessage('Description must be between 10 and 2000 characters')
];

export const updateOurFounderValidation = [
    param('id')
        .isMongoId()
        .withMessage('Invalid founder ID'),

    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),

    body('designation')
        .optional()
        .trim()
        .isLength({ min: 2, max: 150 })
        .withMessage('Designation must be between 2 and 150 characters'),

    body('description')
        .optional()
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('Description must be between 10 and 2000 characters')
];

export const getOurFounderByIdValidation = [
    param('id')
        .isMongoId()
        .withMessage('Invalid founder ID')
];

export const deleteOurFounderValidation = [
    param('id')
        .isMongoId()
        .withMessage('Invalid founder ID')
];
