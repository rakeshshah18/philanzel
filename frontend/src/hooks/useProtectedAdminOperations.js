import { useAuth } from '../contexts/AuthContext';
import { homePageAPI, newsAPI } from '../services/api';
export const useProtectedAdminOperations = () => {
    const { protectedOperation, isAuthenticated, hasRole } = useAuth();
    const homepageOperations = {
        create: async (data) => {
            return protectedOperation(
                () => homePageAPI.create(data),
                ['admin', 'super_admin']
            );
        },
        createWithFile: async (formData) => {
            return protectedOperation(
                () => homePageAPI.createWithFile(formData),
                ['admin', 'super_admin']
            );
        },
        update: async (id, data) => {
            return protectedOperation(
                () => homePageAPI.update(id, data),
                ['admin', 'super_admin']
            );
        },
        updateWithFile: async (id, formData) => {
            return protectedOperation(
                () => homePageAPI.updateWithFile(id, formData),
                ['admin', 'super_admin']
            );
        },
        delete: async (id) => {
            return protectedOperation(
                () => homePageAPI.delete(id),
                ['admin', 'super_admin']
            );
        }
    };
    const newsOperations = {
        create: async (data) => {
            return protectedOperation(
                () => newsAPI.create(data),
                ['admin', 'super_admin']
            );
        },
        createWithFile: async (formData) => {
            return protectedOperation(
                () => newsAPI.createWithFile(formData),
                ['admin', 'super_admin']
            );
        },
        update: async (id, data) => {
            return protectedOperation(
                () => newsAPI.update(id, data),
                ['admin', 'super_admin']
            );
        },
        updateWithFile: async (id, formData) => {
            return protectedOperation(
                () => newsAPI.updateWithFile(id, formData),
                ['admin', 'super_admin']
            );
        },
        delete: async (id) => {
            return protectedOperation(
                () => newsAPI.delete(id),
                ['admin', 'super_admin']
            );
        }
    };
    const canPerformOperation = (requiredRoles = ['admin', 'super_admin']) => {
        return isAuthenticated && hasRole(requiredRoles);
    };
    const getPermissionMessage = (requiredRoles = ['admin', 'super_admin']) => {
        if (!isAuthenticated) {
            return 'Please login to perform this operation.';
        }
        if (!hasRole(requiredRoles)) {
            return `This operation requires: ${Array.isArray(requiredRoles) ? requiredRoles.join(' or ') : requiredRoles}`;
        }
        return null;
    };
    return {
        homepageOperations,
        newsOperations,
        canPerformOperation,
        getPermissionMessage,
        isAuthenticated,
        hasRole
    };
};
export default useProtectedAdminOperations;