import express from 'express';
import {
    // General footer operations
    getFooter,
    updateFooter,
    getPublicFooter,

    // Optimize strategy operations
    getAllOptimizeStrategies,
    getPaginatedOptimizeStrategies,
    searchOptimizeStrategies,
    getOptimizeStrategyById,
    createOptimizeStrategy,
    updateOptimizeStrategy,
    deleteOptimizeStrategy,
    getActiveOptimizeStrategy,

    // Quick links operations
    addQuickLink,
    updateQuickLink,
    deleteQuickLink,

    // Services operations
    addService,
    updateService,
    deleteService,

    // Calculators operations
    addCalculator,
    updateCalculator,
    deleteCalculator,

    // Social links operations
    addSocialLink
} from '../controllers/footerController.js';

const router = express.Router();

// ===== PUBLIC FOOTER ROUTE (No authentication required) =====
router.get('/public', getPublicFooter);            // GET /footer/public

// ===== GENERAL FOOTER ROUTES =====
router.get('/', getFooter);                    // GET /admin/footer
router.put('/', updateFooter);                 // PUT /admin/footer

// ===== OPTIMIZE STRATEGY ROUTES =====
// These routes work for both /admin/footer/optimize-strategies AND /admin/optimize-strategy (backward compatibility)
router.get('/optimize-strategies', getAllOptimizeStrategies);           // GET /admin/footer/optimize-strategies
router.get('/optimize-strategies/paginated', getPaginatedOptimizeStrategies); // GET /admin/footer/optimize-strategies/paginated
router.get('/optimize-strategies/search', searchOptimizeStrategies);    // GET /admin/footer/optimize-strategies/search
router.get('/optimize-strategies/active', getActiveOptimizeStrategy);   // GET /admin/footer/optimize-strategies/active
router.get('/optimize-strategies/:id', getOptimizeStrategyById);        // GET /admin/footer/optimize-strategies/:id
router.post('/optimize-strategies', createOptimizeStrategy);            // POST /admin/footer/optimize-strategies
router.put('/optimize-strategies/:id', updateOptimizeStrategy);         // PUT /admin/footer/optimize-strategies/:id
router.delete('/optimize-strategies/:id', deleteOptimizeStrategy);      // DELETE /admin/footer/optimize-strategies/:id

// Backward compatibility routes for /admin/optimize-strategy (redirect to same functions)
router.get('/', getAllOptimizeStrategies);           // GET /admin/optimize-strategy
router.get('/paginated', getPaginatedOptimizeStrategies); // GET /admin/optimize-strategy/paginated
router.get('/search', searchOptimizeStrategies);     // GET /admin/optimize-strategy/search
router.get('/active', getActiveOptimizeStrategy);    // GET /admin/optimize-strategy/active
router.get('/:id', getOptimizeStrategyById);         // GET /admin/optimize-strategy/:id
router.post('/', createOptimizeStrategy);            // POST /admin/optimize-strategy
router.put('/:id', updateOptimizeStrategy);          // PUT /admin/optimize-strategy/:id
router.delete('/:id', deleteOptimizeStrategy);       // DELETE /admin/optimize-strategy/:id

// ===== QUICK LINKS ROUTES =====
router.post('/quick-links', addQuickLink);                              // POST /admin/footer/quick-links
router.put('/quick-links/:id', updateQuickLink);                        // PUT /admin/footer/quick-links/:id
router.delete('/quick-links/:id', deleteQuickLink);                     // DELETE /admin/footer/quick-links/:id

// ===== SERVICES ROUTES =====
router.post('/services', addService);                                   // POST /admin/footer/services
router.put('/services/:id', updateService);                             // PUT /admin/footer/services/:id
router.delete('/services/:id', deleteService);                          // DELETE /admin/footer/services/:id

// ===== CALCULATORS ROUTES =====
router.post('/calculators', addCalculator);                             // POST /admin/footer/calculators
router.put('/calculators/:id', updateCalculator);                       // PUT /admin/footer/calculators/:id
router.delete('/calculators/:id', deleteCalculator);                    // DELETE /admin/footer/calculators/:id

// ===== SOCIAL LINKS ROUTES =====
router.post('/social-links', addSocialLink);                            // POST /admin/footer/social-links

export default router;
