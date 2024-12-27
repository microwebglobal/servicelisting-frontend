'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, X, ChevronRight, ChevronDown } from 'lucide-react';
import { serviceAPI } from '../../api/services';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CategoryForm } from '@/components/forms/CategoryForm';
import { SubCategoryForm } from '@/components/forms/SubCategoryForm';
import { ServiceTypeForm } from '@/components/forms/ServiceTypeForm';
import { ServiceForm } from '@/components/forms/ServiceForm';
import { ServiceItemForm } from '@/components/forms/ServiceItemForm';
import { PackageForm } from '@/components/forms/PackageForm';
import { PackageItemForm } from '@/components/forms/PackageItemForm';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';



const ServiceManagement = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [subCategories, setSubCategories] = useState([]);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);
    const [serviceTypes, setServiceTypes] = useState([]);
    const [selectedType, setSelectedType] = useState(null);
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [serviceItems, setServiceItems] = useState([]);
    const [expandedServices, setExpandedServices] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('services');

    // Package-related state

    const [packages, setPackages] = useState([]);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [packageItems, setPackageItems] = useState({});
    const [expandedPackages, setExpandedPackages] = useState({});

    // Dialog states
    const [dialogType, setDialogType] = useState(null);
    const [dialogMode, setDialogMode] = useState(null);
    const [editingItem, setEditingItem] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    // Fetch functions
    const fetchCategories = async () => {
        try {
            const response = await serviceAPI.getCategories();
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchSubCategories = async (categoryId) => {
        try {
            const response = await serviceAPI.getSubCategories(categoryId);
            setSubCategories(response.data);
        } catch (error) {
            console.error('Error fetching subcategories:', error);
        }
    };

    const fetchServiceTypes = async (subCategoryId) => {
        try {
            const response = await serviceAPI.getServiceTypes(subCategoryId);
            setServiceTypes(response.data);
        } catch (error) {
            console.error('Error fetching service types:', error);
        }
    };

    const fetchServices = async (typeId) => {
        try {
            const response = await serviceAPI.getServices(typeId);
            setServices(response.data);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    const fetchServiceItems = async (serviceId) => {
        try {
            const response = await serviceAPI.getServiceItems(serviceId);
            setServiceItems((prevItems) => ({
                ...prevItems,
                [serviceId]: response.data,
            }));
        } catch (error) {
            console.error('Error fetching service items:', error);
        }
    };

    const fetchPackages = async (typeId) => {
        try {
            const response = await serviceAPI.getPackagesByType(typeId);
            setPackages(response.data);
        } catch (error) {
            console.error('Error fetching packages:', error);
        }
    };

    const fetchPackageItems = async (packageId) => {
        try {
            const response = await serviceAPI.getPackageItems(packageId);
            setPackageItems((prevItems) => ({
                ...prevItems,
                [packageId]: response.data,
            }));
        } catch (error) {
            console.error('Error fetching package items:', error);
        }
    };

    // Selection handlers
    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setSelectedSubCategory(null);
        setSelectedType(null);
        setServices([]);
        fetchSubCategories(category.category_id);
    };

    const handleSubCategorySelect = (subCategory) => {
        setSelectedSubCategory(subCategory);
        setSelectedType(null);
        setServices([]);
        fetchServiceTypes(subCategory.sub_category_id);
    };

    const handleTypeSelect = async (type) => {
        setSelectedType(type);
        await fetchServices(type.type_id);
        await fetchPackages(type.type_id);
    };

    const handlePackageExpand = async (pkg) => {
        setSelectedPackage(pkg);
        if (!expandedPackages[pkg.package_id]) {
            await fetchPackageItems(pkg.package_id);
        }
        setExpandedPackages(prev => ({
            ...prev,
            [pkg.package_id]: !prev[pkg.package_id]
        }));
    };

    const handleServiceExpand = async (service) => {
        setSelectedService(service);
        if (!expandedServices[service.service_id]) {
            await fetchServiceItems(service.service_id);
        }
        setExpandedServices(prev => ({
            ...prev,
            [service.service_id]: !prev[service.service_id]
        }));
    };

    // Dialog handlers
    const openDialog = (type, mode, item = null) => {
        setDialogType(type);
        setDialogMode(mode);
        setEditingItem(item);
    };

    const closeDialog = () => {
        setDialogType(null);
        setDialogMode(null);
        setEditingItem(null);
    };

    // CRUD operations
    const handleAdd = async (type, data) => {
        try {
            setIsLoading(true);
            let response;
            switch (type) {
                case 'category':
                    response = await serviceAPI.createCategory(data);
                    await fetchCategories();
                    break;
                case 'subcategory':
                    response = await serviceAPI.createSubCategory(data);
                    await fetchSubCategories(selectedCategory.category_id);
                    break;
                case 'type':
                    response = await serviceAPI.createServiceType(data);
                    await fetchServiceTypes(selectedSubCategory.sub_category_id);
                    break;
                case 'service':
                    response = await serviceAPI.createService(data);
                    await fetchServices(selectedType.type_id);
                    break;
                case 'serviceItem':
                    response = await serviceAPI.createServiceItem(data);
                    await fetchServiceItems(selectedService.service_id);
                    break;
                case 'package':
                    response = await serviceAPI.createPackage(data);
                    await fetchPackages(selectedType.type_id);
                    break;
                case 'packageItem':
                    response = await serviceAPI.createPackageItem(data);
                    await fetchPackageItems(selectedPackage.package_id);
                    break;
            }
            closeDialog();
        } catch (error) {
            console.error(`Error creating ${type}:`, error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = async (type, data) => {
        console.log('Editing:', data);
        try {
            setIsLoading(true);
            let response;
            switch (type) {
                case 'category':
                    response = await serviceAPI.updateCategory(data.category_id, data);
                    await fetchCategories();
                    break;
                case 'subcategory':
                    response = await serviceAPI.updateSubCategory(data.sub_category_id, data);
                    await fetchSubCategories(selectedCategory.category_id);
                    break;
                case 'type':
                    response = await serviceAPI.updateServiceType(data.type_id, data);
                    await fetchServiceTypes(selectedSubCategory.sub_category_id);
                    break;
                case 'service':
                    response = await serviceAPI.updateService(data.service_id, data);
                    await fetchServices(selectedType.type_id);
                    break;
                case 'serviceItem':
                    response = await serviceAPI.updateServiceItem(data.item_id, data);
                    await fetchServiceItems(selectedService.service_id);
                    break;
                case 'package':
                    response = await serviceAPI.updatePackage(data.package_id, data);
                    await fetchPackages(selectedType.type_id);
                    break;
                case 'packageItem':
                    response = await serviceAPI.updatePackageItem(data.item_id, data);
                    await fetchPackageItems(selectedPackage.package_id);
                    break;
            }
            closeDialog();
        } catch (error) {
            console.error(`Error updating ${type}:`, error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (type, id) => {
        if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;

        try {
            setIsLoading(true);
            switch (type) {
                case 'category':
                    await serviceAPI.deleteCategory(id);
                    await fetchCategories();
                    break;
                case 'subcategory':
                    await serviceAPI.deleteSubCategory(id);
                    await fetchSubCategories(selectedCategory.category_id);
                    break;
                case 'type':
                    await serviceAPI.deleteServiceType(id);
                    await fetchServiceTypes(selectedSubCategory.sub_category_id);
                    break;
                case 'service':
                    await serviceAPI.deleteService(id);
                    await fetchServices(selectedType.type_id);
                    break;
                case 'serviceItem':
                    await serviceAPI.deleteServiceItem(id);
                    await fetchServiceItems(selectedService.service_id);
                    break;
                case 'package':
                    await serviceAPI.deletePackage(id);
                    await fetchPackages(selectedType.type_id);
                    break;
                case 'packageItem':
                    await serviceAPI.deletePackageItem(id);
                    await fetchPackageItems(selectedPackage.package_id);
                    break;
            }
        } catch (error) {
            console.error(`Error deleting ${type}:`, error);
        } finally {
            setIsLoading(false);
        }
    };

    const renderForm = () => {
        if (!dialogType) return null;

        const props = {
            onSubmit: (data) => (dialogMode === 'add' ? handleAdd(dialogType, data) : handleEdit(dialogType, data)),
            initialData: editingItem,
        };

        switch (dialogType) {
            case 'category':
                return <CategoryForm {...props} />;
            case 'subcategory':
                return <SubCategoryForm {...props} categoryId={selectedCategory?.category_id} />;
            case 'type':
                return <ServiceTypeForm {...props} subCategoryId={selectedSubCategory?.sub_category_id} />;
            case 'service':
                return <ServiceForm {...props} typeId={selectedType?.type_id} />;
            case 'serviceItem':
                return <ServiceItemForm {...props} serviceId={selectedService?.service_id} />;
            case 'package':
                return <PackageForm {...props} typeId={selectedType?.type_id} />;
            case 'packageItem':
                return <PackageItemForm {...props} packageId={selectedPackage?.package_id} />;
            default:
                return null;

        }
    };

    return (
        <div className="p-4">
            <div className="flex space-x-4">
                {/* Categories Panel */}
                <div className="w-1/4 border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Categories</h2>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDialog('category', 'add')}
                        >
                            <Plus size={20} />
                        </Button>
                    </div>
                    <div className="space-y-2">
                        {categories.map(category => (
                            <div
                                key={category.category_id}
                                className={`p-2 rounded cursor-pointer flex justify-between items-center ${
                                    selectedCategory?.category_id === category.category_id ? 'bg-blue-100' : 'hover:bg-gray-100'
                                }`}
                                onClick={() => handleCategorySelect(category)}
                            >
                                <span>{category.name}</span>
                                <div className="flex space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openDialog('category', 'edit', category);
                                        }}
                                    >
                                        <Edit size={16} className="text-gray-500 hover:text-blue-500" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete('category', category.category_id);
                                        }}
                                    >
                                        <Trash2 size={16} className="text-gray-500 hover:text-red-500" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
    
                {/* SubCategories Panel */}
                <div className="w-1/4 border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">SubCategories</h2>
                        {selectedCategory && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openDialog('subcategory', 'add')}
                            >
                                <Plus size={20} />
                            </Button>
                        )}
                    </div>
                    <div className="space-y-2">
                        {subCategories.map(subCategory => (
                            <div
                                key={subCategory.sub_category_id}
                                className={`p-2 rounded cursor-pointer flex justify-between items-center ${
                                    selectedSubCategory?.sub_category_id === subCategory.sub_category_id ? 'bg-blue-100' : 'hover:bg-gray-100'
                                }`}
                                onClick={() => handleSubCategorySelect(subCategory)}
                            >
                                <span>{subCategory.name}</span>
                                <div className="flex space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openDialog('subcategory', 'edit', subCategory);
                                        }}
                                    >
                                        <Edit size={16} className="text-gray-500 hover:text-blue-500" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete('subcategory', subCategory.sub_category_id);
                                        }}
                                    >
                                        <Trash2 size={16} className="text-gray-500 hover:text-red-500" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
    
                {/* Service Types Panel */}
                <div className="w-1/4 border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Service Types</h2>
                        {selectedSubCategory && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openDialog('type', 'add')}
                            >
                                <Plus size={20} />
                            </Button>
                        )}
                    </div>
                    <div className="space-y-2">
                        {serviceTypes.map(type => (
                            <div
                                key={type.type_id}
                                className={`p-2 rounded cursor-pointer flex justify-between items-center ${
                                    selectedType?.type_id === type.type_id ? 'bg-blue-100' : 'hover:bg-gray-100'
                                }`}
                                onClick={() => handleTypeSelect(type)}
                            >
                                <span>{type.name}</span>
                                <div className="flex space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openDialog('type', 'edit', type);
                                        }}
                                    >
                                        <Edit size={16} className="text-gray-500 hover:text-blue-500" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete('type', type.type_id);
                                        }}
                                    >
                                        <Trash2 size={16} className="text-gray-500 hover:text-red-500" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
    
                {/* Services/Packages Panel */}
                <div className="w-1/4 border rounded-lg p-4">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="w-full mb-4">
                            <TabsTrigger value="services" className="flex-1">Services</TabsTrigger>
                            <TabsTrigger value="packages" className="flex-1">Packages</TabsTrigger>
                        </TabsList>
    
                        <TabsContent value="services">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold">Services</h2>
                                {selectedType && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => openDialog('service', 'add')}
                                    >
                                        <Plus size={20} />
                                    </Button>
                                )}
                            </div>
                            <div className="space-y-2">
                                {services.map(service => (
                                    <Collapsible
                                        key={service.service_id}
                                        open={expandedServices[service.service_id]}
                                        onOpenChange={() => handleServiceExpand(service)}
                                    >
                                        <div className="p-2 rounded hover:bg-gray-100">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center space-x-2">
                                                    <CollapsibleTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            {expandedServices[service.service_id] ? (
                                                                <ChevronDown size={16} />
                                                            ) : (
                                                                <ChevronRight size={16} />
                                                            )}
                                                        </Button>
                                                    </CollapsibleTrigger>
                                                    <span>{service.name}</span>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => openDialog('service', 'edit', service)}
                                                    >
                                                        <Edit size={16} className="text-gray-500 hover:text-blue-500" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete('service', service.service_id)}
                                                    >
                                                        <Trash2 size={16} className="text-gray-500 hover:text-red-500" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <CollapsibleContent className="mt-2">
                                                <div className="pl-8 space-y-2">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-sm font-medium">Service Items</span>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedService(service);
                                                                openDialog('serviceItem', 'add');
                                                            }}
                                                        >
                                                            <Plus size={16} className="mr-2" />
                                                            Add Item
                                                        </Button>
                                                    </div>
                                                    {serviceItems[service.service_id]?.map((item) => (
                                                        <div
                                                            key={item.item_id}
                                                            className="flex justify-between items-center p-2 bg-gray-50 rounded"
                                                        >
                                                            <div>
                                                                <div className="font-medium">{item.name}</div>
                                                                <div className="text-sm text-gray-500">
                                                                    Price: ${item.price} x {item.quantity}
                                                                </div>
                                                                {item.description && (
                                                                    <div className="text-sm text-gray-500 mt-1">
                                                                        {item.description}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex space-x-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => openDialog('serviceItem', 'edit', item)}
                                                                >
                                                                    <Edit size={16} className="text-gray-500 hover:text-blue-500" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => handleDelete('serviceItem', item.item_id)}
                                                                >
                                                                    <Trash2 size={16} className="text-gray-500 hover:text-red-500" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CollapsibleContent>
                                        </div>
                                    </Collapsible>
                                ))}
                            </div>
                        </TabsContent>
    
                        <TabsContent value="packages">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold">Packages</h2>
                                {selectedType && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => openDialog('package', 'add')}
                                    >
                                        <Plus size={20} />
                                    </Button>
                                )}
                            </div>
                            <div className="space-y-2">
                                {packages.map(pkg => (
                                    <Collapsible
                                        key={pkg.package_id}
                                        open={expandedPackages[pkg.package_id]}
                                        onOpenChange={() => handlePackageExpand(pkg)}
                                    >
                                        <div className="p-2 rounded hover:bg-gray-100">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center space-x-2">
                                                    <CollapsibleTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            {expandedPackages[pkg.package_id] ? (
                                                                <ChevronDown size={16} />
                                                            ) : (
                                                                <ChevronRight size={16} />
                                                            )}
                                                        </Button>
                                                    </CollapsibleTrigger>
                                                    <span>{pkg.name}</span>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => openDialog('package', 'edit', pkg)}
                                                    >
                                                        <Edit size={16} className="text-gray-500 hover:text-blue-500" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete('package', pkg.package_id)}
                                                    >
<Trash2 size={16} className="text-gray-500 hover:text-red-500" />
                                                </Button>
                                            </div>
                                        </div>
                                        <CollapsibleContent className="mt-2">
                                            <div className="pl-8 space-y-2">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-sm font-medium">Package Items</span>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedPackage(pkg);
                                                            openDialog('packageItem', 'add');
                                                        }}
                                                    >
                                                        <Plus size={16} className="mr-2" />
                                                        Add Item
                                                    </Button>
                                                </div>
                                                {packageItems[pkg.package_id]?.map((item) => (
                                                    <div
                                                        key={item.item_id}
                                                        className="flex justify-between items-center p-2 bg-gray-50 rounded"
                                                    >
                                                        <div>
                                                            <div className="font-medium">{item.name}</div>
                                                            <div className="text-sm text-gray-500">
                                                                Price: ${item.price} x {item.quantity}
                                                            </div>
                                                            {item.description && (
                                                                <div className="text-sm text-gray-500 mt-1">
                                                                    {item.description}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex space-x-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => openDialog('packageItem', 'edit', item)}
                                                            >
                                                                <Edit size={16} className="text-gray-500 hover:text-blue-500" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleDelete('packageItem', item.item_id)}
                                                            >
                                                                <Trash2 size={16} className="text-gray-500 hover:text-red-500" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CollapsibleContent>
                                    </div>
                                </Collapsible>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>

        {/* Dialog for Add/Edit forms */}
        <Dialog open={!!dialogType} onOpenChange={() => closeDialog()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {dialogMode === 'add' ? 'Add' : 'Edit'} {dialogType?.charAt(0).toUpperCase() + dialogType?.slice(1)}
                    </DialogTitle>
                </DialogHeader>
                {renderForm()}
            </DialogContent>
        </Dialog>
    </div>
);
}
export default ServiceManagement;