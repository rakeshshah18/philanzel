import axios from 'axios';

// Create axios instance with base configuration
const API = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:8000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Enable cookies for refresh tokens
});

// Add auth token to requests
API.interceptors.request.use(
    (config) => {
        console.log('🚀 API Request Details:');
        console.log('  - Method:', config.method?.toUpperCase());
        console.log('  - URL:', config.url);
        console.log('  - Base URL:', config.baseURL);
        console.log('  - Full URL:', `${config.baseURL}${config.url}`);
        console.log('  - Data type:', config.data?.constructor?.name);

        // Handle FormData - remove Content-Type to let browser set it with boundary
        if (config.data instanceof FormData) {
            console.log('  - 📋 FormData detected, removing Content-Type header');
            delete config.headers['Content-Type'];
        }

        console.log('  - Headers:', config.headers);

        // Add auth token to requests
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('  - Token present:', token.substring(0, 20) + '...');
        } else {
            console.log('  - ⚠️ No token found in localStorage');
        }

        return config;
    },
    (error) => {
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Handle token refresh
API.interceptors.response.use(
    (response) => {
        console.log('✅ API Response Success:');
        console.log('  - Status:', response.status);
        console.log('  - URL:', response.config.url);
        console.log('  - Data:', response.data);
        return response;
    },
    async (error) => {
        console.error('❌ API Response Error Details:');
        console.error('  - Error type:', error.constructor.name);
        console.error('  - Error message:', error.message);
        console.error('  - Error code:', error.code);
        console.error('  - Request URL:', error.config?.url);
        console.error('  - Response status:', error.response?.status);
        console.error('  - Response data:', error.response?.data);
        console.error('  - Network error?', !error.response);
        console.error('  - Full error object:', error);

        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh token
                const response = await API.post('/admin/auth/refresh-token');
                const { accessToken } = response.data.data;

                // Update stored token
                localStorage.setItem('adminToken', accessToken);

                // Retry original request
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return API(originalRequest);
            } catch (refreshError) {
                // Refresh failed, redirect to login
                localStorage.removeItem('adminToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// API endpoints
export const inquiryAPI = {
    // Submit new user inquiry
    submit: (data) => API.post('/inquiry', data),

    // Get all inquiries (admin)
    getAll: () => API.get('/inquiry'),

    // Get inquiry by ID
    getById: (id) => API.get(`/inquiry/${id}`),

    // Update inquiry status
    updateStatus: (id, status) => API.put(`/inquiry/${id}/status`, { status }),

    // Delete inquiry
    delete: (id) => API.delete(`/inquiry/${id}`)
};

export const careerAPI = {
    // Submit career application
    submit: (formData) => API.post('/user/career-inquiry', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),

    // Get all career applications (admin)
    getAll: () => API.get('/user/applications'),

    // Get application by ID
    getById: (id) => API.get(`/user/career/${id}`),

    // Update application status
    updateStatus: (id, status) => API.put(`/user/career/${id}/status`, { status }),

    // Delete application
    delete: (id) => API.delete(`/user/career/${id}`)
};

export const homePageAPI = {
    // Create homepage content
    create: (data) => API.post('/admin/homepage', data),

    // Create homepage content with file upload
    createWithFile: (formData) => API.post('/admin/homepage', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),

    // Get all homepage content
    getAll: () => API.get('/admin/homepage'),

    // Get homepage content by ID
    getById: (id) => API.get(`/admin/homepage/${id}`),

    // Update homepage content
    update: (id, data) => API.put(`/admin/homepage/${id}`, data),

    // Update homepage content with file upload
    updateWithFile: (id, formData) => API.put(`/admin/homepage/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),

    // Delete homepage content
    delete: (id) => API.delete(`/admin/homepage/${id}`)
};

export const aboutUsAPI = {
    // Create about us content
    create: (formData) => API.post('/admin/about-us', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),

    // Get all about us content
    getAll: (params = {}) => API.get('/admin/about-us', { params }),

    // Get about us content by ID
    getById: (id) => API.get(`/admin/about-us/${id}`),

    // Update about us content
    update: (id, formData) => API.put(`/admin/about-us/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),

    // Delete about us content
    delete: (id) => API.delete(`/admin/about-us/${id}`)
};

export const ourJourneyAPI = {
    // Create our journey content
    create: (data) => API.post('/admin/our-journey', data),

    // Get all our journey content
    getAll: (params = {}) => API.get('/admin/our-journey', { params }),

    // Get our journey content by ID
    getById: (id) => API.get(`/admin/our-journey/${id}`),

    // Update our journey content
    update: (id, data) => API.put(`/admin/our-journey/${id}`, data),

    // Delete our journey content
    delete: (id) => API.delete(`/admin/our-journey/${id}`),

    // Add card to our journey
    addCard: (id, cardData) => API.post(`/admin/our-journey/${id}/cards`, cardData),

    // Remove card from our journey
    removeCard: (id, cardIndex) => API.delete(`/admin/our-journey/${id}/cards/${cardIndex}`)
};

export const ourFounderAPI = {
    // Create our founder content
    create: (formData) => API.post('/admin/about/our-founder', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),

    // Get all our founder content (public route)
    getAll: (params = {}) => API.get('/about/our-founder', { params }),

    // Get our founder content by ID (public route)
    getById: (id) => API.get(`/about/our-founder/${id}`),

    // Update our founder content
    update: (id, formData) => API.put(`/admin/about/our-founder/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),

    // Delete our founder content
    delete: (id) => API.delete(`/admin/about/our-founder/${id}`)
};

export const aboutWhyChooseUsAPI = {
    // Temporarily use home WhyChooseUs data for About Us page
    // Create why choose us content  
    create: (formData) => API.post('/admin/why-choose-us', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),

    // Get all why choose us content
    getAll: (params = {}) => API.get('/admin/why-choose-us', { params }),

    // Get why choose us content by ID
    getById: (id) => API.get(`/admin/why-choose-us/${id}`),

    // Update why choose us content
    update: (id, formData) => API.put(`/admin/why-choose-us/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),

    // Delete why choose us content
    delete: (id) => API.delete(`/admin/why-choose-us/${id}`),

    // Add point to why choose us
    addPoint: (id, pointData) => API.post(`/admin/why-choose-us/${id}/points`, pointData),

    // Remove point from why choose us
    removePoint: (id, pointId) => API.delete(`/admin/why-choose-us/${id}/points/${pointId}`)
};

export const newsAPI = {
    // Create news article
    create: (data) => API.post('/admin/news', data),

    // Create news article with file upload
    createWithFile: (formData) => API.post('/admin/news', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),

    // Get all news articles
    getAll: (params = {}) => API.get('/admin/news', { params }),

    // Get news article by ID
    getById: (id) => API.get(`/admin/news/${id}`),

    // Update news article
    update: (id, data) => API.put(`/admin/news/${id}`, data),

    // Update news article with file upload
    updateWithFile: (id, formData) => API.put(`/admin/news/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),

    // Delete news article
    delete: (id) => API.delete(`/admin/news/${id}`),

    // Get categories
    getCategories: () => API.get('/admin/news/categories')
};

// Admin Authentication API
export const adminAuthAPI = {
    // Register new admin
    register: (data) => API.post('/admin/auth/register', data),

    // Login admin
    login: (data) => API.post('/admin/auth/login', data),

    // Logout admin
    logout: () => API.post('/admin/auth/logout'),

    // Refresh access token
    refreshToken: () => API.post('/admin/auth/refresh-token'),

    // Get current admin profile
    getProfile: () => API.get('/admin/auth/profile'),

    // Update admin profile
    updateProfile: (data) => API.put('/admin/auth/profile', data),

    // Change password
    changePassword: (data) => API.put('/admin/auth/change-password', data),

    // Get all admins (super admin only)
    getAllAdmins: (params = {}) => API.get('/admin/auth/all', { params })
};

// OurTrack API
export const ourTrackAPI = {
    // Get track record
    get: () => API.get('/admin/our-track'),

    // Create new track record
    create: (data) => API.post('/admin/our-track', data),

    // Update track record
    update: (data) => API.put('/admin/our-track', data),

    // Delete track record
    delete: () => API.delete('/admin/our-track')
};

// Services API
export const servicesAPI = {
    // Get all services
    getAll: () => API.get('/admin/services'),

    // Create new service
    create: (data) => API.post('/admin/services', data),

    // Update service
    update: (id, data) => API.put(`/admin/services/${id}`, data),

    // Update service with form data (for file uploads)
    updateWithFile: (id, formData) => {
        return API.put(`/admin/services/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    // Create service with form data (for file uploads)
    createWithFile: (formData) => {
        return API.post('/admin/services', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    // Delete service
    delete: (id) => API.delete(`/admin/services/${id}`)
};

// Tabbing Services Settings API
export const tabbingServicesSettingsAPI = {
    // Get tabbing services settings
    getSettings: () => API.get('/admin/tabbing-services/settings'),

    // Update common background image
    updateCommonBackgroundImage: (formData) => {
        return API.put('/admin/tabbing-services/settings/common-background', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    // Reset common background image to default
    resetCommonBackgroundImage: () => API.put('/admin/tabbing-services/settings/reset-common-background'),

    // Update common section settings (description and button)
    updateCommonSettings: (data) => API.put('/admin/tabbing-services/settings/common-section', data)
};

// Helped Industries API
export const helpedIndustriesAPI = {
    // Get all helped industries
    getAll: () => API.get('/admin/helped-industries'),

    // Get single helped industries by ID
    getById: (id) => API.get(`/admin/helped-industries/${id}`),

    // Create new helped industries
    create: (data) => API.post('/admin/helped-industries', data),

    // Update helped industries
    update: (id, data) => API.put(`/admin/helped-industries/${id}`, data),

    // Delete helped industries
    delete: (id) => API.delete(`/admin/helped-industries/${id}`)
};

// Why Choose Us API endpoints
export const whyChooseUsAPI = {
    // Get all why choose us entries
    getAll: () => API.get('/admin/why-choose-us'),

    // Get single why choose us entry by ID
    getById: (id) => API.get(`/admin/why-choose-us/${id}`),

    // Create new why choose us entry
    create: (formData) => {
        return API.post('/admin/why-choose-us', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    // Update why choose us entry
    update: (id, formData) => {
        return API.put(`/admin/why-choose-us/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    // Delete why choose us entry
    delete: (id) => API.delete(`/admin/why-choose-us/${id}`)
};

// Our Association API endpoints
export const ourAssociationAPI = {
    // Get all our association entries
    getAll: () => API.get('/admin/our-association'),

    // Get single our association entry by ID
    getById: (id) => API.get(`/admin/our-association/${id}`),

    // Create new our association entry
    create: (formData) => {
        return API.post('/admin/our-association', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    // Update our association entry
    update: (id, formData) => {
        return API.put(`/admin/our-association/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    // Delete our association entry
    delete: (id) => API.delete(`/admin/our-association/${id}`)
};

// Home FAQs API endpoints
export const homeFAQsAPI = {
    // Get all FAQs
    getAll: () => API.get('/admin/home-faqs'),

    // Get FAQs with pagination
    getPaginated: (page = 1, limit = 10) => API.get(`/admin/home-faqs/paginated?page=${page}&limit=${limit}`),

    // Search FAQs
    search: (query) => API.get(`/admin/home-faqs/search?query=${encodeURIComponent(query)}`),

    // Get single FAQ by ID
    getById: (id) => API.get(`/admin/home-faqs/${id}`),

    // Create new FAQ
    create: (data) => API.post('/admin/home-faqs', data),

    // Update FAQ
    update: (id, data) => API.put(`/admin/home-faqs/${id}`, data),

    // Delete FAQ
    delete: (id) => API.delete(`/admin/home-faqs/${id}`)
};

// Review Sections API endpoints
export const reviewSectionsAPI = {
    // Get all review sections
    getAll: () => API.get('/admin/review-sections'),

    // Get active review sections (public)
    getActive: () => API.get('/admin/review-sections/active'),

    // Get single review section by ID
    getById: (id) => API.get(`/admin/review-sections/${id}`),

    // Create new review section
    create: (data) => API.post('/admin/review-sections', data),

    // Update review section
    update: (id, data) => API.put(`/admin/review-sections/${id}`, data),

    // Add review to existing section
    addReview: (id, reviewData) => API.post(`/admin/review-sections/${id}/reviews`, reviewData),

    // Recalculate all ratings
    recalculateRatings: () => API.post('/admin/review-sections/recalculate/ratings'),

    // Delete review section
    delete: (id) => API.delete(`/admin/review-sections/${id}`)
};

// Ads Sections API endpoints
export const adsSectionsAPI = {
    // Get all ads sections
    getAll: () => API.get('/admin/ads-sections'),

    // Get ads sections with pagination
    getPaginated: (page = 1, limit = 10) => API.get(`/admin/ads-sections/paginated?page=${page}&limit=${limit}`),

    // Search ads sections
    search: (query) => API.get(`/admin/ads-sections/search?query=${encodeURIComponent(query)}`),

    // Get single ads section by ID
    getById: (id) => API.get(`/admin/ads-sections/${id}`),

    // Create new ads section
    create: (data) => API.post('/admin/ads-sections', data),

    // Create new ads section with file upload
    createWithFile: (formData) => API.post('/admin/ads-sections', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),

    // Update ads section
    update: (id, data) => API.put(`/admin/ads-sections/${id}`, data),

    // Update ads section with file upload
    updateWithFile: (id, formData) => API.put(`/admin/ads-sections/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),

    // Delete ads section
    delete: (id) => API.delete(`/admin/ads-sections/${id}`)
};

// Footer API endpoints
export const footerAPI = {
    // Get public footer data (no auth required)
    getPublic: () => API.get('/footer/public'),

    // Admin operations
    admin: {
        // Get footer data for admin
        get: () => API.get('/admin/footer'),

        // Update footer data
        update: (data) => API.put('/admin/footer', data),

        // Quick links operations
        addQuickLink: (data) => API.post('/admin/footer/quick-links', data),
        updateQuickLink: (id, data) => API.put(`/admin/footer/quick-links/${id}`, data),
        deleteQuickLink: (id) => API.delete(`/admin/footer/quick-links/${id}`),

        // Services operations
        addService: (data) => API.post('/admin/footer/services', data),
        updateService: (id, data) => API.put(`/admin/footer/services/${id}`, data),
        deleteService: (id) => API.delete(`/admin/footer/services/${id}`),

        // Calculators operations
        addCalculator: (data) => API.post('/admin/footer/calculators', data),
        updateCalculator: (id, data) => API.put(`/admin/footer/calculators/${id}`, data),
        deleteCalculator: (id) => API.delete(`/admin/footer/calculators/${id}`),

        // Social links operations
        addSocialLink: (data) => API.post('/admin/footer/social-links', data),

        // Optimize strategy operations (can also use optimizeStrategyAPI)
        optimizeStrategy: {
            getAll: () => API.get('/admin/footer/optimize-strategies'),
            getPaginated: (page = 1, limit = 10) => API.get(`/admin/footer/optimize-strategies/paginated?page=${page}&limit=${limit}`),
            search: (query) => API.get(`/admin/footer/optimize-strategies/search?query=${encodeURIComponent(query)}`),
            getActive: () => API.get('/admin/footer/optimize-strategies/active'),
            getById: (id) => API.get(`/admin/footer/optimize-strategies/${id}`),
            create: (data) => API.post('/admin/footer/optimize-strategies', data),
            update: (id, data) => API.put(`/admin/footer/optimize-strategies/${id}`, data),
            delete: (id) => API.delete(`/admin/footer/optimize-strategies/${id}`)
        }
    }
};

export const contactInfoAPI = {
    // Get all contact info
    getAll: () => API.get('/contact-us/info'),

    // Get contact info by ID
    getById: (id) => API.get(`/contact-us/info/${id}`),

    // Create new contact info
    create: (data) => API.post('/contact-us/info', data),

    // Update contact info
    update: (id, data) => API.put(`/contact-us/info/${id}`, data),

    // Delete contact info
    delete: (id) => API.delete(`/contact-us/info/${id}`)
};

export default API;
