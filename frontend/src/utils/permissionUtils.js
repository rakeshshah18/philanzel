// Sidebar categories structure (matches database)
export const SIDEBAR_CATEGORIES = {
    'dashboard': {
        name: 'Dashboard',
        type: 'single',
        subPages: []
    },
    'pages': {
        name: 'Pages',
        type: 'dropdown',
        subPages: ['home', 'about-us', 'career', 'partner', 'contact']
    },
    'services': {
        name: 'Services',
        type: 'dropdown',
        subPages: ['services-sections']
    },
    'calculators': {
        name: 'All Calculators',
        type: 'dropdown',
        subPages: ['calculators']
    },
    'sections': {
        name: 'Sections',
        type: 'dropdown',
        subPages: ['reviews', 'ads', 'footer', 'events']
    }
};

/**
 * Check if a user has access to a specific page based on their allowed categories
 * @param {Array} allowedCategories - Array of category keys the user has access to
 * @param {string} pageKey - The page key to check access for
 * @param {string} userRole - User's role (super_admin gets full access)
 * @returns {boolean} - Whether user has access to the page
 */
export const hasPageAccess = (allowedCategories, pageKey, userRole = 'admin') => {
    // Super admin has access to everything
    if (userRole === 'super_admin') {
        return true;
    }

    // Check if user has direct access to the page (for single pages like dashboard)
    if (allowedCategories.includes(pageKey)) {
        return true;
    }

    // Check if user has access to a category that contains this page
    for (const [categoryKey, category] of Object.entries(SIDEBAR_CATEGORIES)) {
        if (allowedCategories.includes(categoryKey) && category.subPages.includes(pageKey)) {
            return true;
        }
    }

    return false;
};

/**
 * Get the parent category for a given page
 * @param {string} pageKey - The page key to find parent for
 * @returns {string|null} - The parent category key or null if not found
 */
export const getParentCategory = (pageKey) => {
    // Check if it's a top-level category
    if (SIDEBAR_CATEGORIES[pageKey]) {
        return pageKey;
    }

    // Find which category contains this page
    for (const [categoryKey, category] of Object.entries(SIDEBAR_CATEGORIES)) {
        if (category.subPages.includes(pageKey)) {
            return categoryKey;
        }
    }

    return null;
};

/**
 * Get all accessible pages for a user based on their allowed categories
 * @param {Array} allowedCategories - Array of category keys the user has access to
 * @returns {Array} - Array of all accessible page keys
 */
export const getAccessiblePages = (allowedCategories) => {
    const accessiblePages = new Set();

    allowedCategories.forEach(categoryKey => {
        const category = SIDEBAR_CATEGORIES[categoryKey];
        if (category) {
            // Add the category itself if it's a single page (like dashboard)
            if (category.type === 'single') {
                accessiblePages.add(categoryKey);
            }
            // Add all sub-pages for dropdown categories
            category.subPages.forEach(subPage => {
                accessiblePages.add(subPage);
            });
        }
    });

    return Array.from(accessiblePages);
};

/**
 * Get display name for a category or page
 * @param {string} key - Category or page key
 * @returns {string} - Display name
 */
export const getDisplayName = (key) => {
    // Check if it's a category
    if (SIDEBAR_CATEGORIES[key]) {
        return SIDEBAR_CATEGORIES[key].name;
    }

    // Check if it's a sub-page and get a nice display name
    const pageDisplayNames = {
        'home': 'Home',
        'about-us': 'About Us',
        'career': 'Career',
        'partner': 'Partner',
        'contact': 'Contact Us',
        'services-sections': 'Services Sections',
        'calculators': 'Calculators',
        'reviews': 'Reviews',
        'ads': 'Ads',
        'footer': 'Footer',
        'events': 'Events'
    };

    return pageDisplayNames[key] || key.charAt(0).toUpperCase() + key.slice(1);
};