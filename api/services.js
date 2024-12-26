
import { api } from '../utils/api';

export const serviceAPI = {
    // Categories
    getCategories: () => api.get('/categories'),
    createCategory: (data) => api.post('/categories', data),
    updateCategory: (id, data) => api.put(`/categories/${id}`, data),
    deleteCategory: (id) => api.delete(`/categories/${id}`),
  
    // SubCategories
    getSubCategories: (categoryId) => api.get(`/categories/${categoryId}/subcategories`),
    createSubCategory: (data) => api.post('/subcategories', data),
    updateSubCategory: (id, data) => api.put(`/subcategories/${id}`, data),
    deleteSubCategory: (id) => api.delete(`/subcategories/${id}`),
  
    // Service Types
    getServiceTypes: (subCategoryId) => api.get(`/subcategories/${subCategoryId}/types`),
    createServiceType: (data) => api.post('/types', data),
    updateServiceType: (id, data) => api.put(`/types/${id}`, data),
    deleteServiceType: (id) => api.delete(`/types/${id}`),
  
    // Services
    getServices: () => api.get('/services'),
    createService: (data) => api.post('/services', data),
    updateService: (id, data) => api.put(`/services/${id}`, data),
    deleteService: (id) => api.delete(`/services/${id}`),
  
    // Service Items
    createServiceItem: (data) => api.post('/items', data),
    updateServiceItem: (id, data) => api.put(`/items/${id}`, data),
    deleteServiceItem: (id) => api.delete(`/items/${id}`),
    getServiceItems: (serviceId) => axios.get(`/api/services/${serviceId}/items`),
    createServiceItem: (data) => axios.post('/api/services/items', data),
    updateServiceItem: (itemId, data) => axios.put(`/api/services/items/${itemId}`, data),
  };