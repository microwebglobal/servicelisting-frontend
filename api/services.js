import { api } from "../utils/api";

export const serviceAPI = {
  // Categories
  getCategories: () => api.get("/categories"),
  createCategory: (data) => api.post("/categories", data),
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`),

  // SubCategories
  getSubCategories: (categoryId) =>
    api.get(`/categories/${categoryId}/subcategories`),
  createSubCategory: (data) => api.post("/subcategories", data),
  updateSubCategory: (id, data) => api.put(`/subcategories/${id}`, data),
  deleteSubCategory: (id) => api.delete(`/subcategories/${id}`),

  // Service Types
  getServiceTypes: (subCategoryId) =>api.get(`/subcategories/${subCategoryId}/types`),
  createServiceType: (data) => api.post("/types", data),
  updateServiceType: (id, data) => api.put(`/types/${id}`, data),
  deleteServiceType: (id) => api.delete(`/types/${id}`),

  // Services
  getServices: (typeId) => api.get(`/services/items/${typeId}`),
  createService: (data) => api.post("/services", data),
  updateService: (id, data) => api.put(`/services/${id}`, data),
  deleteService: (id) => api.delete(`/services/${id}`),

  // Service Items
  createServiceItem: (data) => api.post("/items", data),
  updateServiceItem: (id, data) => api.put(`/items/${id}`, data),
  deleteServiceItem: (id) => api.delete(`/items/${id}`),
  getServiceItems: (serviceId) => api.get(`/items/serv/${serviceId}`),
  updateServiceItem: (itemId, data) => api.put(`/items/${itemId}`, data),

  //cities
  getCities: () => api.get("/cities"),
  getCity: (id) => api.get(`/cities/${id}`),
  createCity: (data) => api.post("/cities", data),
  updateCity: (id, data) => api.put(`/cities/${id}`, data),
  deleteCity: (id) => api.delete(`/cities/${id}`),

  //packages
  createPackage: (data) => api.post("/packages", data),
  updatePackage: (id, data) => api.put(`/packages/${id}`, data),
  deletePackage: (id) => api.delete(`/packages/${id}`),
  getPackages: (itemId) => api.get(`/packages/item/${itemId}`),
  getPackagesByType: (typeId) => api.get(`/packages/types/${typeId}`),

  //paclage items
  createPackageItem: (data) => api.post("/package-items", data),
  updatePackageItem: (id, data) => api.put(`/package-items/${id}`, data),
  deletePackageItem: (id) => api.delete(`/package-items/${id}`),
  getPackageItems: (packageId) => api.get(`/package-items/package/${packageId}`),

  getSectionsByPackage: (packageId) => api.get(`/sections/package/${packageId}`),

  //city pricing
  createCityPricing: (data) => api.post("/city-pricing", data),
  updateCityPricing: (id, data) => api.put(`/city-pricing/item/${id}/city/${data.city_id}`, data), deleteCityPricing: (id) => api.delete(`/city-pricing/${id}`),
  getCityPricing: (itemId) => api.get(`/city-pricing/item/${itemId}`),
  getCityPricingByCity: (cityId) => api.get(`/city-pricing/item/${id}/city/${cityId}`),
};
