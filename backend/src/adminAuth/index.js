import authRoutes from './routes/authRoutes.js';
import { verifyToken, requireRole, requireSuperAdmin, requireAdmin } from './middleware/authMiddleware.js';
import Admin from './models/Admin.js';

export {
    authRoutes as routes,
    verifyToken,
    requireRole,
    requireSuperAdmin,
    requireAdmin,
    Admin
};
