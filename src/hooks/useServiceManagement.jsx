import { useState, useEffect } from "react";
import { serviceAPI } from "../../api/services";

export const useServiceManagement = (cityId) => {
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
  const [isLoading, setIsLoading] = useState(false);

  const fetchFunctions = {
    categories: async () => {
      setIsLoading(true);
      try {
        const response = await serviceAPI.getAllCategories();
        setCategories(response.data);
      } finally {
        setIsLoading(false);
      }
    },
    subCategories: async (categoryId) => {
      setIsLoading(true);
      try {
        const response = await serviceAPI.getSubCategories(categoryId);
        setSubCategories(response.data);
      } finally {
        setIsLoading(false);
      }
    },
    serviceTypes: async (subCategoryId) => {
      setIsLoading(true);
      try {
        const response = await serviceAPI.getServiceTypes(subCategoryId);
        setServiceTypes(response.data);
      } finally {
        setIsLoading(false);
      }
    },
    services: async (typeId) => {
      setIsLoading(true);
      try {
        const response = await serviceAPI.getServices(typeId);
        setServices(response.data);
      } finally {
        setIsLoading(false);
      }
    },
    packages: async (typeId) => {
      setIsLoading(true);
      try {
        const response = await serviceAPI.getPackagesByType(typeId);
        setPackages(response.data);
      } finally {
        setIsLoading(false);
      }
    },
    serviceItems: async (serviceId) => {
      setIsLoading(true);
      try {
        const response = await serviceAPI.getServiceItems(serviceId);
        setServiceItems(response.data);
      } finally {
        setIsLoading(false);
      }
    },
    packageSections: async (packageId) => {
      setIsLoading(true);
      try {
        const response = await serviceAPI.getSectionsByPackage(packageId);
        setPackageSections(response.data);
      } finally {
        setIsLoading(false);
      }
    },
    sectionItems: async (sectionId) => {
      setIsLoading(true);
      try {
        const response = await serviceAPI.getItemsbySection(sectionId);
        setSectionItems(response.data);
      } finally {
        setIsLoading(false);
      }
    },
  };

  const handleSelect = {
    category: async (category) => {
      setSelectedCategory(category);
      setSelectedSubCategory(null);
      setSelectedType(null);
      setSelectedService(null);
      setSelectedPackage(null);
      setServices([]);
      setPackages([]);
      setServiceItems([]);
      setPackageSections([]);
      setSectionItems([]);
      if (category) {
        await fetchFunctions.subCategories(category.category_id);
        setServiceTypes([]); // Reset service types when selecting a new category
      }
    },
    // Rest of the handlers remain the same
    subCategory: async (subCategory) => {
      setSelectedSubCategory(subCategory);
      setSelectedType(null);
      setSelectedService(null);
      setSelectedPackage(null);
      setServices([]);
      setPackages([]);
      setServiceItems([]);
      setPackageSections([]);
      setSectionItems([]);
      if (subCategory) {
        await fetchFunctions.serviceTypes(subCategory.sub_category_id);
      }
    },
    type: async (type) => {
      setSelectedType(type);
      setSelectedService(null);
      setSelectedPackage(null);
      setServices([]);
      setPackages([]);
      setServiceItems([]);
      setPackageSections([]);
      setSectionItems([]);
      if (type) {
        await Promise.all([
          fetchFunctions.services(type.type_id),
          fetchFunctions.packages(type.type_id),
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
    },
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
      serviceItems,
      packageSections,
      sectionItems,
      selectedCategory,
      selectedSubCategory,
      selectedType,
      selectedService,
      selectedPackage,
      selectedSection,
    },
    handlers: handleSelect,
    fetchFunctions,
    isLoading,
  };
};
