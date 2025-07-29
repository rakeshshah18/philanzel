import express from 'express';
import {  verifyToken, requireRole } from '../adminAuth/middleware/authMiddleware.js';
import { createServices, getAllServices, updateServices, deleteServices } from '../controllers/servicesController.js';

const router = express.Router();

router.post('/', verifyToken, requireRole('admin'), createServices);
router.get('/', verifyToken, requireRole('admin'), getAllServices);
router.put('/:id', verifyToken, requireRole('admin'), updateServices);
router.delete('/:id', verifyToken, requireRole('admin'), deleteServices);

export default router;
