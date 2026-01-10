import axios from 'axios';
export const careerAPI = {
    submit: (formData) => API.post('/user/career-inquiry', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
    getAll: () => API.get('/user/applications'),
    getById: (id) => API.get(`/user/career/${id}`),
    updateStatus: (id, status) => API.put(`/user/career/${id}/status`, { status }),
    delete: (id) => API.delete(`/user/career/${id}`)
};
export const homePageAPI = {
    create: (data) => API.post('/admin/homepage', data),
    createWithFile: (formData) => API.post('/admin/homepage', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
    getAll: () => API.get('homepage'),
    getById: (id) => API.get(`/admin/homepage/${id}`),
    update: (id, data) => API.put(`/admin/homepage/${id}`, data),
    updateWithFile: (id, formData) => API.put(`/admin/homepage/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
    delete: (id) => API.delete(`/admin/homepage/${id}`)
};
const API = axios.create({
    baseURL: process.env.NODE_ENV === 'production'
        ? 'https://philanzel-backend.onrender.com/api'
        : 'https://philanzel-backend.onrender.com/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});
let isRefreshing = false;
let failedQueue = [];
let globalRefreshRetryCount = 0;
const MAX_GLOBAL_REFRESH_RETRIES = 2;

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }
        return config;
    },
    (error) => Promise.reject(error)
);
API.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            if (globalRefreshRetryCount >= MAX_GLOBAL_REFRESH_RETRIES) {
                if (originalRequest && originalRequest.url && /\/admin\//.test(originalRequest.url)) {
                    if (window.location.pathname !== '/login') {
                        window.location.href = '/login';
                    }
                }
                return Promise.reject(error);
            }
            globalRefreshRetryCount++;
            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    const { data } = await API.post('/admin/auth/refresh-token');
                    API.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
                    localStorage.setItem('adminToken', data.accessToken);
                    processQueue(null, data.accessToken);
                    return API(originalRequest);
                } catch (err) {
                    processQueue(err, null);
                    if (originalRequest && originalRequest.url && /\/admin\//.test(originalRequest.url)) {
                        if (window.location.pathname !== '/login') {
                            window.location.href = '/login';
                        }
                    }
                    return Promise.reject(err);
                } finally {
                    isRefreshing = false;
                }
            }
            return new Promise(function (resolve, reject) {
                failedQueue.push({ resolve, reject });
            })
                .then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return API(originalRequest);
                })
                .catch(err => {
                    if (window.location.pathname !== '/login') {
                        window.location.href = '/login';
                    }
                    console.error('Auth failure after refresh attempt:', err);
                    return Promise.reject(err);
                });
        }
        return Promise.reject(error);
    }
);
export default API;
export const aboutUsAPI = {
    create: (formData) => API.post('/admin/about-us', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
    getAll: (params = {}) => API.get('about-us', { params }),
    getById: (id) => API.get(`about-us/${id}`),
    update: (id, formData) => API.put(`/admin/about-us/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
    delete: (id) => API.delete(`/admin/about-us/${id}`)
};
export const ourJourneyAPI = {
    create: (data) => API.post('admin/our-journey', data),
    getAll: (params = {}) => API.get('our-journey', { params }),
    getById: (id) => API.get(`our-journey/${id}`),
    update: (id, data) => API.put(`admin/our-journey/${id}`, data),
    delete: (id) => API.delete(`admin/our-journey/${id}`),
    addCard: (id, cardData) => API.post(`admin/our-journey/${id}/cards`, cardData),
    removeCard: (id, cardIndex) => API.delete(`admin/our-journey/${id}/cards/${cardIndex}`)
};
export const ourFounderAPI = {
    create: (formData) => API.post('/admin/about/our-founder', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
    getAll: (params = {}) => API.get('/about/our-founder', { params }),
    getById: (id) => API.get(`/about/our-founder/${id}`),
    update: (id, formData) => API.put(`/admin/about/our-founder/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
    delete: (id) => API.delete(`/admin/about/our-founder/${id}`)
};

export const aboutWhyChooseUsAPI = {
    create: (formData) => API.post('/admin/why-choose-us', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
    getAll: (params = {}) => API.get('/admin/why-choose-us', { params }),
    getById: (id) => API.get(`/admin/why-choose-us/${id}`),
    update: (id, formData) => API.put(`/admin/why-choose-us/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
    delete: (id) => API.delete(`/admin/why-choose-us/${id}`),
    addPoint: (id, pointData) => API.post(`/admin/why-choose-us/${id}/points`, pointData),
    removePoint: (id, pointId) => API.delete(`/admin/why-choose-us/${id}/points/${pointId}`)
};

export const newsAPI = {
    create: (data) => API.post('/admin/news', data),
    createWithFile: (formData) => API.post('/admin/news', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
    getAll: (params = {}) => API.get('/admin/news', { params }),
    getById: (id) => API.get(`/admin/news/${id}`),
    update: (id, data) => API.put(`/admin/news/${id}`, data),
    updateWithFile: (id, formData) => API.put(`/admin/news/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
    delete: (id) => API.delete(`/admin/news/${id}`),
    getCategories: () => API.get('/admin/news/categories')
};

export const adminAuthAPI = {
    register: (data) => API.post('/admin/auth/register', data),
    login: (data) => API.post('/admin/auth/login', data),
    logout: () => API.post('/admin/auth/logout'),
    refreshToken: () => API.post('/admin/auth/refresh-token'),
    getProfile: () => API.get('/admin/auth/profile'),
    updateProfile: (data) => API.put('/admin/auth/profile', data),
    changePassword: (data) => API.put('/admin/auth/change-password', data),
    getAllAdmins: (params = {}) => API.get('/admin/auth/all', { params }),
    deleteAdmin: (id) => API.delete(`/admin/auth/${id}`),
    assignTabs: (adminId, allowedTabs) => API.put(`/admin/auth/${adminId}/assign-tabs`, { allowedTabs }),
    getAssignedTabs: (adminId) => API.get(`/admin/auth/${adminId}/assigned-tabs`),
    getAllAssignedTabs: () => API.get('/admin/auth/all-assigned-tabs'),
};

export const ourTrackAPI = {
    get: () => API.get('/our-track'),
    create: (data) => API.post('/admin/our-track', data),
    update: (data) => API.put('/admin/our-track', data),
    delete: () => API.delete('/admin/our-track')
};

export const servicesAPI = {
    getAll: () => API.get('/admin/services'),
    getAll: () => API.get('/services'),
    create: (data) => API.post('/admin/services', data),
    update: (id, data) => API.put(`/admin/services/${id}`, data),
    updateWithFile: (id, formData) => {
        return API.put(`/admin/services/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    createWithFile: (formData) => {
        return API.post('/admin/services', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    delete: (id) => API.delete(`/admin/services/${id}`)
};
export const tabbingServicesSettingsAPI = {
    getSettings: () => API.get('/admin/tabbing-services/settings'),
    getSettings: () => API.get('/tabbing-services/settings'),
    updateCommonBackgroundImage: (formData) => {
        return API.put('/admin/tabbing-services/settings/common-background', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    resetCommonBackgroundImage: () => API.put('/admin/tabbing-services/settings/reset-common-background'),
    updateCommonSettings: (data) => API.put('/admin/tabbing-services/settings/common-section', data)
};
export const helpedIndustriesAPI = {
    getAll: () => API.get('/admin/helped-industries'),
    getById: (id) => API.get(`/admin/helped-industries/${id}`),
    create: (data) => API.post('/admin/helped-industries', data),
    update: (id, data) => API.put(`/admin/helped-industries/${id}`, data),
    delete: (id) => API.delete(`/admin/helped-industries/${id}`)
};

export const whyChooseUsAPI = {
    getAll: () => API.get('/admin/why-choose-us'),
    getAll: () => API.get('/why-choose-us'),
    getById: (id) => API.get(`/admin/why-choose-us/${id}`),
    create: (formData) => {
        return API.post('/admin/why-choose-us', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    update: (id, formData) => {
        return API.put(`/admin/why-choose-us/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    delete: (id) => API.delete(`/admin/why-choose-us/${id}`)
};
export const ourAssociationAPI = {
    getAll: () => API.get('/admin/our-association'),
    getById: (id) => API.get(`/admin/our-association/${id}`),
    create: (formData) => {
        return API.post('/admin/our-association', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    update: (id, formData) => {
        return API.put(`/admin/our-association/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    delete: (id) => API.delete(`/admin/our-association/${id}`)
};
export const homeFAQsAPI = {
    getAll: () => API.get('/admin/home-faqs'),
    getPaginated: (page = 1, limit = 10) => API.get(`/admin/home-faqs/paginated?page=${page}&limit=${limit}`),
    search: (query) => API.get(`/admin/home-faqs/search?query=${encodeURIComponent(query)}`),
    getById: (id) => API.get(`/admin/home-faqs/${id}`),
    create: (data) => API.post('/admin/home-faqs', data),
    update: (id, data) => API.put(`/admin/home-faqs/${id}`, data),
    delete: (id) => API.delete(`/admin/home-faqs/${id}`)
};
export const reviewSectionsAPI = {
    getAll: () => API.get('/review-sections/active'),
    getActive: () => API.get('/review-sections/active'),
    getById: (id) => API.get(`/admin/review-sections/${id}`),
    create: (data) => API.post('/admin/review-sections', data),
    update: (id, data) => API.put(`/admin/review-sections/${id}`, data),
    addReview: (id, reviewData) => API.post(`/admin/review-sections/${id}/reviews`, reviewData),
    recalculateRatings: () => API.post('/admin/review-sections/recalculate/ratings'),
    delete: (id) => API.delete(`/admin/review-sections/${id}`)
};
export const adsSectionsAPI = {
    getAll: () => API.get('/ads-sections/active'),
    getAllAdmin: () => API.get('/admin/ads-sections'),
    getPaginated: (page = 1, limit = 10) => API.get(`/admin/ads-sections/paginated?page=${page}&limit=${limit}`),
    search: (query) => API.get(`/admin/ads-sections/search?query=${encodeURIComponent(query)}`),
    getById: (id) => API.get(`/admin/ads-sections/${id}`),
    create: (data) => API.post('/admin/ads-sections', data),
    createWithFile: (formData) => API.post('/admin/ads-sections', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
    update: (id, data) => API.put(`/admin/ads-sections/${id}`, data),
    updateWithFile: (id, formData) => API.put(`/admin/ads-sections/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
    delete: (id) => API.delete(`/admin/ads-sections/${id}`)
};
export const footerAPI = {
    getPublic: () => API.get('/footer/public'),
    admin: {
        get: () => API.get('/admin/footer'),
        update: (data) => API.put('/admin/footer', data),
        addQuickLink: (data) => API.post('/admin/footer/quick-links', data),
        updateQuickLink: (id, data) => API.put(`/admin/footer/quick-links/${id}`, data),
        deleteQuickLink: (id) => API.delete(`/admin/footer/quick-links/${id}`),
        addService: (data) => API.post('/admin/footer/services', data),
        updateService: (id, data) => API.put(`/admin/footer/services/${id}`, data),
        deleteService: (id) => API.delete(`/admin/footer/services/${id}`),
        addCalculator: (data) => API.post('/admin/footer/calculators', data),
        updateCalculator: (id, data) => API.put(`/admin/footer/calculators/${id}`, data),
        deleteCalculator: (id) => API.delete(`/admin/footer/calculators/${id}`),
        addSocialLink: (data) => API.post('/admin/footer/social-links', data),
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
    getAll: () => API.get('/contact-us/info'),
    getById: (id) => API.get(`/contact-us/info/${id}`),
    create: (data) => API.post('/contact-us/info', data),
    update: (id, data) => API.put(`/contact-us/info/${id}`, data),
    delete: (id) => API.delete(`/contact-us/info/${id}`)
};

export const calculatorPagesAPI = {
    getAll: () => API.get('/calculators/pages'),
    getById: (id) => API.get(`/calculators/pages/${id}`),
    create: (data) => API.post('/calculators/pages', data),
    update: (id, data) => API.put(`/calculators/pages/${id}`, data),
    delete: (id) => API.delete(`/calculators/pages/${id}`),
    addSectionToPage: (id, sectionId) => API.post(`/calculators/pages/${id}/add-section`, { sectionId }),
    getBySlug: (slug) => API.get(`/calculators/pages/slug/${slug}`),
    editSectionInPage: (pageId, sectionId, data) => API.put(`/calculators/pages/${pageId}/sections/${sectionId}`, data),
    deleteSectionFromPage: (pageId, sectionId) => API.delete(`/calculators/pages/${pageId}/sections/${sectionId}`)
};

export const calculatorSectionsAPI = {
    getAll: () => API.get('/calculators/sections'),
    getById: (id) => API.get(`/calculators/sections/${id}`),
    create: (data) => API.post('/calculators/sections', data),
    update: (id, data) => API.put(`/calculators/sections/${id}`, data),
    delete: (id) => API.delete(`/calculators/sections/${id}`)
};

export const sidebarAPI = {
    getAll: () => API.get('/sidebar'),
    getById: (id) => API.get(`/sidebar/${id}`),
    create: (data) => API.post('/sidebar', data),
    update: (id, data) => API.put(`/sidebar/${id}`, data),
    delete: (id) => API.delete(`/sidebar/${id}`),
    reorder: (items) => API.put('/sidebar/reorder', { items })
};
