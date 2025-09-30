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
 * @param {Array} allowedCategories
 * @param {string} pageKey
 * @param {string} userProfilePhoto
 * @returns {boolean}
 */
export const hasPageAccess = (allowedCategories, pageKey, userRole = 'admin') => {
    if (userRole === 'super_admin') {
        return true;
    }
    if (allowedCategories.includes(pageKey)) {
        return true;
    }
    for (const [categoryKey, category] of Object.entries(SIDEBAR_CATEGORIES)) {
        if (allowedCategories.includes(categoryKey) && category.subPages.includes(pageKey)) {
            return true;
        }
    }
    return false;
};
/**
 * @param {string} pageKey
 * @returns {string|null}
 */
export const getParentCategory = (pageKey) => {
    if (SIDEBAR_CATEGORIES[pageKey]) {
        return pageKey;
    }
    for (const [categoryKey, category] of Object.entries(SIDEBAR_CATEGORIES)) {
        if (category.subPages.includes(pageKey)) {
            return categoryKey;
        }
    }
    return null;
};

/**
 * @param {Array} allowedCategories
 * @returns {Array}
 */
export const getAccessiblePages = (allowedCategories) => {
    const accessiblePages = new Set();
    allowedCategories.forEach(categoryKey => {
        const category = SIDEBAR_CATEGORIES[categoryKey];
        if (category) {
            if (category.type === 'single') {
                accessiblePages.add(categoryKey);
            }
            category.subPages.forEach(subPage => {
                accessiblePages.add(subPage);
            });
        }
    });
    return Array.from(accessiblePages);
};

/**
 * @param {string} key
 * @returns {string}
 */
export const getDisplayName = (key) => {
    if (SIDEBAR_CATEGORIES[key]) {
        return SIDEBAR_CATEGORIES[key].name;
    }
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