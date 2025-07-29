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
        console.log('API Request:', config.method?.toUpperCase(), config.url);

        // Add auth token to requests
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle token refresh
API.interceptors.response.use(
    (response) => {
        console.log('API Response:', response.status, response.config.url);
        return response;
    },
    async (error) => {
        console.error('API Error:', error.response?.status, error.response?.data);

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

    // Delete service
    delete: (id) => API.delete(`/admin/services/${id}`)
};

export default API;
