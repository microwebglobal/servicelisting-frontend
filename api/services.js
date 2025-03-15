import { get } from "react-hook-form";
import { api } from "../utils/api";

export const serviceAPI = {
  // Categories
  getCategories: (cityId) => api.get(`/categories?city_id=${cityId}`),
  getAllCategories: () => api.get("/categories/all"),
  getCategoryById: (catId, cityId) =>
    api.get(`/categories/${catId}?cityId=${cityId}`),
  getCategoryBySlug: (slug, cityName) =>
    api.get(`/categories/slugs/${slug}?city=${cityName}`),
  createCategory: (data) =>
    api.post("/categories", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  updateCategory: (id, data) =>
    api.put(`/categories/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  deleteCategory: (id) => api.delete(`/categories/${id}`),

  // SubCategories
  getSubCategories: (categoryId) =>
    api.get(`/categories/${categoryId}/subcategories`),
  createSubCategory: (data) =>
    api.post("/subcategories", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  updateSubCategory: (id, data) =>
    api.put(`/subcategories/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  deleteSubCategory: (id) => api.delete(`/subcategories/${id}`),
  getSubCategoryBySlug: (slug) => api.get(`/subcategories/slugs/${slug}`),

  // Service Types
  getServiceTypes: (subCategoryId) =>
    api.get(`/subcategories/${subCategoryId}/types`),
  createServiceType: (data) =>
    api.post("/types", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  updateServiceType: (id, data) => api.put(`/types/${id}`, data),
  deleteServiceType: (id) => api.delete(`/types/${id}`),

  // Services
  getServices: (typeId) => api.get(`/services/items/${typeId}`),
  createService: (data) =>
    api.post("/services", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  updateService: (id, data) => api.put(`/services/${id}`, data),
  deleteService: (id) => api.delete(`/services/${id}`),

  // Service Items
  createServiceItem: (data) => api.post("/items", data),
  updateServiceItem: (id, data) => api.put(`/items/${id}`, data),
  deleteServiceItem: (id) => api.delete(`/items/${id}`),
  getServiceItems: (serviceId, cityId) =>
    api.get(`/items/serv/${serviceId}?cityId=${cityId}`),
  updateServiceItem: (itemId, data) => api.put(`/items/${itemId}`, data),

  //cities
  getCities: () => api.get("/cities"),
  getCity: (id) => api.get(`/cities/${id}`),
  createCity: (data) => api.post("/cities", data),
  updateCity: (id, data) => api.put(`/cities/${id}`, data),
  deleteCity: (id) => api.delete(`/cities/${id}`),

  //packages
  createPackage: (data) =>
    api.post("/packages", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  updatePackage: (id, data) => api.put(`/packages/${id}`, data),
  deletePackage: (id) => api.delete(`/packages/${id}`),
  getPackages: (itemId) => api.get(`/packages/item/${itemId}`),
  getPackagesByType: (typeId) => api.get(`/packages/types/${typeId}`),

  //paclage items
  createPackageItem: (data) =>
    api.post("/package-items", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  updatePackageItem: (id, data) => api.put(`/package-items/${id}`, data),
  deletePackageItem: (id) => api.delete(`/package-items/${id}`),
  getPackageItems: (packageId) =>
    api.get(`/package-items/package/${packageId}`),

  getSectionsByPackage: (packageId) =>
    api.get(`/sections/package/${packageId}`),
  getItemsbySection: (sectionId) =>
    api.get(`/package-items/section/${sectionId}`),
  createPackageSection: (data) =>
    api.post("/sections", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  updatePackageSection: (id, data) => api.put(`/sections/${id}`, data),
  deletePackageSection: (id) => api.delete(`/sections/${id}`),

  //city pricing
  createCityPricing: (data) => api.post("/city-pricing", data),
  updateCityPricing: (id, data) =>
    api.put(`/city-pricing/item/${id}/city/${data.city_id}`, data),
  deleteCityPricing: (id) => api.delete(`/city-pricing/${id}`),
  getCityPricing: (itemId) => api.get(`/city-pricing/item/${itemId}`),
  getCityPricingByCity: (cityId) =>
    api.get(`/city-pricing/item/${id}/city/${cityId}`),

  //special pricing
  getActiveSpecialPricing: (data) => api.get(`/special-pricing/active`, data),

  //service category city
  createCategoryCities: (data) => api.post(`/category-cities/bulk`, data),
};
