import express from 'express';
import tabbingServicesSettingsController from '../controllers/tabbingServicesSettingsController.js';
import imageUpload from '../config/imageUpload.js';
import { verifyToken } from '../adminAuth/middleware/authMiddleware.js';

const router = express.Router();

// Public GET tabbing services settings (no auth)
router.get('/settings', tabbingServicesSettingsController.getSettings);

// Update common background image
router.put('/settings/common-background',
    verifyToken,
    imageUpload.single('commonBackgroundImage'),
    tabbingServicesSettingsController.updateCommonBackgroundImage
);

// Reset common background image to default
router.put('/settings/reset-common-background',
    verifyToken,
    tabbingServicesSettingsController.resetCommonBackgroundImage
);

// Update common section settings (description and button)
router.put('/settings/common-section',
    verifyToken,
    tabbingServicesSettingsController.updateCommonSettings
);

export default router;
