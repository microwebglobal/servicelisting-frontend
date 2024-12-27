"use client";
import React, { useState, useEffect } from "react";
import { serviceAPI } from "../../api/services";
import { Plus, Edit, Trash2, ChevronRight, List } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryForm } from "@/components/forms/CategoryForm";
import { SubCategoryForm } from "@/components/forms/SubCategoryForm";
import { ServiceTypeForm } from "@/components/forms/ServiceTypeForm";
import { ServiceForm } from "@/components/forms/ServiceForm";
import { ServiceItemForm } from "@/components/forms/ServiceItemForm";

const ServiceCard = ({
  title,
  items,
  loading,
  selectedItem,
  onSelect,
  onDelete,
  onAdd,
  onEdit,
  FormComponent,
  formProps = {},
  showItemsButton = false,
  onManageItems,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [pendingEdit, setPendingEdit] = useState(null);

  useEffect(() => {
    if (pendingEdit) {
      setEditingItem(pendingEdit);
      setIsDialogOpen(true);
      setPendingEdit(null);
    }
  }, [pendingEdit]);

  const handleAdd = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (item, e) => {
    e.stopPropagation();
    setPendingEdit(item);
  };

  const handleSubmit = async (formData) => {
    await onAdd(formData, editingItem);
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const renderItem = (item, index) => (
    <div
      key={item.id || `${title}-${index}`}
      className={`
        flex items-center justify-between p-3 rounded-lg transition-all cursor-pointer
        ${
          selectedItem?.id === item.id
            ? "bg-primary/10 border-l-4 border-primary"
            : "hover:bg-secondary/50"
        }
      `}
      onClick={() => onSelect(item)}
    >
      <div className="flex items-center gap-2">
        <span className={selectedItem?.id === item.id ? "font-semibold" : ""}>
          {item.name}
        </span>
        {item.description && (
          <span className="w-2/4 text-sm text-muted-foreground">
            - {item.description}
          </span>
        )}
      </div>
      <div className="w-1/5 flex-col gap-2">
        {showItemsButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onManageItems(item);
            }}
          >
            <List className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => handleEdit(item, e)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={`skeleton-${title}-${index}`} className="h-12 w-full" />
      ));
    }

    if (!items?.length) {
      return (
        <div className="text-center text-muted-foreground py-4">
          No {title.toLowerCase()} found
        </div>
      );
    }

    return items.map((item, index) => renderItem(item, index));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <Button variant="outline" size="icon" onClick={handleAdd}>
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">{renderContent()}</CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingItem
                ? `Edit ${title.slice(0, -1)}`
                : `Add New ${title.slice(0, -1)}`}
            </DialogTitle>
          </DialogHeader>
          <FormComponent
            onSubmit={handleSubmit}
            initialData={editingItem}
            {...formProps}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

const ServiceItemsDialog = ({ service, onClose }) => {
  const { toast } = useToast();
  const [items, setItems] = useState([{ name: "sahan" }]);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    console.log(service.service_id);
    try {
      const { data } = await serviceAPI.getServiceItems(service?.service_id);
      console.log(data);
      setItems(data);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to fetch service items",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (service?.service_id) {
      fetchItems();
    }
  }, [service?.service_id]);

  const handleSubmit = async (formData) => {
    try {
      if (editingItem) {
        await serviceAPI.updateServiceItem(editingItem.id, formData);
      } else {
        await serviceAPI.createServiceItem({
          ...formData,
          serviceId: service.id,
        });
      }
      await fetchItems();
      setIsFormOpen(false);
      setEditingItem(null);
      toast({
        title: "Success",
        description: `Service item ${
          editingItem ? "updated" : "created"
        } successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${
          editingItem ? "update" : "create"
        } service item`,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (item) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      await serviceAPI.deleteServiceItem(item.id);
      await fetchItems();
      toast({
        title: "Success",
        description: "Service item deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete service item",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Service Items - {service.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Button
            onClick={() => {
              setEditingItem(null);
              setIsFormOpen(true);
            }}
          >
            Add New Item
          </Button>

          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                key={`item-skeleton-${index}`}
                className="h-12 w-full"
              />
            ))
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                      {item.base_price && (
                        <p className="text-sm font-medium">
                          Price: ${item.base_price}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingItem(item);
                          setIsFormOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(item)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Service Item" : "Add New Service Item"}
              </DialogTitle>
            </DialogHeader>
            <ServiceItemForm
              onSubmit={handleSubmit}
              initialData={editingItem}
              serviceId={service.service_id}
            />
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};

const ServiceManager = () => {
  const { toast } = useToast();
  const [state, setState] = useState({
    loading: {
      categories: false,
      subCategories: false,
      serviceTypes: false,
      services: false,
    },
    data: {
      categories: [],
      subCategories: [],
      serviceTypes: [],
      services: [],
    },
    selected: {
      category: null,
      subCategory: null,
      serviceType: null,
      service: null,
    },
  });
  const [showServiceItems, setShowServiceItems] = useState(false);

  // Initial load
  useEffect(() => {
    fetchData("categories");
  }, []);

  // Fetch sub-items when parent is selected
  useEffect(() => {
    if (state.selected.category) {
      fetchData("subCategories", state.selected.category.category_id);
    }
  }, [state.selected.category]);

  useEffect(() => {
    if (state.selected.subCategory) {
      fetchData("serviceTypes", state.selected.subCategory.sub_category_id);
    }
  }, [state.selected.subCategory]);

  useEffect(() => {
    console.log(state.selected.serviceType);
    if (state.selected.serviceType) {
      fetchData("services", state.selected.serviceType.type_id);
    }
  }, [state.selected.serviceType]);

  const fetchData = async (type, parentId = null) => {
    setState((prev) => ({
      ...prev,
      loading: { ...prev.loading, [type]: true },
    }));

    try {
      const apiMethods = {
        categories: () => serviceAPI.getCategories(),
        subCategories: () => serviceAPI.getSubCategories(parentId),
        serviceTypes: () => serviceAPI.getServiceTypes(parentId),
        services: () => serviceAPI.getServices(parentId),
      };

      const { data } = await apiMethods[type]();
      setState((prev) => ({
        ...prev,
        data: { ...prev.data, [type]: data },
        loading: { ...prev.loading, [type]: false },
      }));
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to fetch ${type}`,
        variant: "destructive",
      });
      setState((prev) => ({
        ...prev,
        loading: { ...prev.loading, [type]: false },
      }));
    }
  };

  const handleSelect = (type, item) => {
    setState((prev) => {
      const newState = { ...prev };
      const types = ["category", "subCategory", "serviceType", "service"];
      const index = types.indexOf(type);

      // Clear subsequent selections
      types.forEach((t, i) => {
        if (i >= index) {
          newState.selected[t] = i === index ? item : null;
          if (i > index) {
            newState.data[t + "s"] = [];
          }
        }
      });

      return newState;
    });
  };

  const handleDelete = async (type, item) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    console.log(item);
    try {
      const apiMethods = {
        category: () => serviceAPI.deleteCategory(item.category_id),
        subCategory: () => serviceAPI.deleteSubCategory(item.sub_category_id),
        serviceType: () => serviceAPI.deleteServiceType(item.type_id),
        service: () => serviceAPI.deleteService(item.service_id),
      };

      await apiMethods[type]();

      // Refresh the appropriate data
      const parentMapping = {
        category: () => fetchData("categories"),
        subCategory: () =>
          fetchData("subCategories", state.selected.category?.category_id),
        serviceType: () =>
          fetchData(
            "serviceTypes",
            state.selected.subCategory?.sub_category_id
          ),
        service: () =>
          fetchData("services", state.selected.serviceType?.type_id),
      };

      await parentMapping[type]();
      toast({
        title: "Success",
        description: `${type} deleted successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to delete ${type}`,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (type, formData, editItem = null) => {
    try {
      if (editItem) {
        await serviceAPI[
          `update${type.charAt(0).toUpperCase() + type.slice(1)}`
        ](editItem.id, formData);
      } else {
        const parentIds = {
          subCategory: { categoryId: state.selected.category?.category_id },
          serviceType: {
            subCategoryId: state.selected.subCategory?.sub_category_id,
          },
          service: { typeId: state.selected.serviceType?.type_id },
        };
        await serviceAPI[
          `create${type.charAt(0).toUpperCase() + type.slice(1)}`
        ]({
          ...formData,
          ...parentIds[type],
        });

        console.log({
          ...formData,
          ...parentIds[type],
        });
      }

      // Refresh data
      const refreshMapping = {
        category: () => fetchData("categories"),
        subCategory: () =>
          fetchData("subCategories", state.selected.category?.category_id),
        serviceType: () =>
          fetchData(
            "serviceTypes",
            state.selected.subCategory?.sub_category_id
          ),
        service: () =>
          fetchData("services", state.selected.serviceType?.type_id),
      };

      await refreshMapping[type]();
      toast({
        title: "Success",
        description: `${type} ${editItem ? "updated" : "created"} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editItem ? "update" : "create"} ${type}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ServiceCard
          title="Categories"
          items={state.data.categories}
          loading={state.loading.categories}
          selectedItem={state.selected.category}
          onSelect={(item) => handleSelect("category", item)}
          onDelete={(item) => handleDelete("category", item)}
          onAdd={(formData, editItem) =>
            handleSubmit("category", formData, editItem)
          }
          onEdit={(item) => handleSelect("category", item)}
          FormComponent={CategoryForm}
        />

        {state.selected.category && (
          <ServiceCard
            title="Sub Categories"
            items={state.data.subCategories}
            loading={state.loading.subCategories}
            selectedItem={state.selected.subCategory}
            onSelect={(item) => handleSelect("subCategory", item)}
            onDelete={(item) => handleDelete("subCategory", item)}
            onAdd={(formData, editItem) =>
              handleSubmit("subCategory", formData, editItem)
            }
            onEdit={(item) => handleSelect("subCategory", item)}
            FormComponent={SubCategoryForm}
            formProps={{
              categoryId: state.selected.category?.category_id,
            }}
          />
        )}

        {state.selected.subCategory && (
          <ServiceCard
            title="Service Types"
            items={state.data.serviceTypes}
            loading={state.loading.serviceTypes}
            selectedItem={state.selected.serviceType}
            onSelect={(item) => handleSelect("serviceType", item)}
            onDelete={(item) => handleDelete("serviceType", item)}
            onAdd={(formData, editItem) =>
              handleSubmit("serviceType", formData, editItem)
            }
            onEdit={(item) => handleSelect("serviceType", item)}
            FormComponent={ServiceTypeForm}
            formProps={{
              subCategoryId: state.selected.subCategory?.sub_category_id,
            }}
          />
        )}

        {state.selected.serviceType && (
          <ServiceCard
            title="Services"
            items={state.data.services}
            loading={state.loading.services}
            selectedItem={state.selected.service}
            onSelect={(item) => handleSelect("service", item)}
            onDelete={(item) => handleDelete("service", item)}
            onAdd={(formData, editItem) =>
              handleSubmit("service", formData, editItem)
            }
            onEdit={(item) => handleSelect("service", item)}
            FormComponent={ServiceForm}
            formProps={{
              typeId: state.selected.serviceType?.type_id,
            }}
            showItemsButton={true}
            onManageItems={(service) => {
              setState((prev) => ({
                ...prev,
                selected: { ...prev.selected, service },
              }));
              setShowServiceItems(true);
            }}
          />
        )}
      </div>

      {showServiceItems && state.selected.service && (
        <ServiceItemsDialog
          service={state.selected.service}
          onClose={() => {
            setShowServiceItems(false);
            setState((prev) => ({
              ...prev,
              selected: { ...prev.selected, service: null },
            }));
          }}
        />
      )}
    </div>
  );
};

export default ServiceManager;
