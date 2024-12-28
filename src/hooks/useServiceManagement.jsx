import { useState, useEffect } from 'react';
import { serviceAPI } from '../../api/services';

export const useServiceManagement = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [services, setServices] = useState([]);
  const [packages, setPackages] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [serviceItems, setServiceItems] = useState([]);
  const [packageSections, setPackageSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [sectionItems, setSectionItems] = useState([]);

  const fetchFunctions = {
    categories: async () => {
      const response = await serviceAPI.getCategories();
      setCategories(response.data);
    },
    subCategories: async (categoryId) => {
      const response = await serviceAPI.getSubCategories(categoryId);
      setSubCategories(response.data);
    },
    serviceTypes: async (subCategoryId) => {
      const response = await serviceAPI.getServiceTypes(subCategoryId);
      setServiceTypes(response.data);
    },
    services: async (typeId) => {
      const response = await serviceAPI.getServices(typeId);
      setServices(response.data);
    },
    packages: async (typeId) => {
      const response = await serviceAPI.getPackagesByType(typeId);
      setPackages(response.data);
    },
    serviceItems: async (serviceId) => {
      const response = await serviceAPI.getServiceItems(serviceId);
      setServiceItems(response.data);
    },
    packageSections: async (packageId) => {
      const response = await serviceAPI.getPackageSections(packageId);
      setPackageSections(response.data);
    },
    sectionItems: async (sectionId) => {
      const response = await serviceAPI.getSectionItems(sectionId);
      setSectionItems(response.data);
    }
  };

  const handleSelect = {
    category: async (category) => {
      setSelectedCategory(category);
      setSelectedSubCategory(null);
      setSelectedType(null);
      setServices([]);
      setPackages([]);
      if (category) {
        await fetchFunctions.subCategories(category.category_id);
      }
    },
    subCategory: async (subCategory) => {
      setSelectedSubCategory(subCategory);
      setSelectedType(null);
      setServices([]);
      setPackages([]);
      if (subCategory) {
        await fetchFunctions.serviceTypes(subCategory.sub_category_id);
      }
    },
    type: async (type) => {
      setSelectedType(type);
      setServices([]);
      setPackages([]);
      if (type) {
        await Promise.all([
          fetchFunctions.services(type.type_id),
          fetchFunctions.packages(type.type_id)
        ]);
      }
    },

    service: async (service) => {
      setSelectedService(service);
      setServiceItems([]);
      if (service) {
        await fetchFunctions.serviceItems(service.service_id);
      }
    },
    package: async (pkg) => {
      setSelectedPackage(pkg);
      setSelectedSection(null);
      setPackageSections([]);
      setSectionItems([]);
      if (pkg) {
        await fetchFunctions.packageSections(pkg.package_id);
      }
    },
    section: async (section) => {
      setSelectedSection(section);
      setSectionItems([]);
      if (section) {
        await fetchFunctions.sectionItems(section.section_id);
      }
    }
  };

  useEffect(() => {
    fetchFunctions.categories();
  }, []);

  return {
    data: {
      categories,
      subCategories,
      serviceTypes,
      services,
      packages,
      selectedCategory,
      selectedSubCategory,
      selectedType
    },
    handlers: handleSelect,
    fetchFunctions
  };
};
