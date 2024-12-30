import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { serviceAPI } from "../../api/services";

export const ServiceTypeForm = ({
  mode = "create",
  data,
  onClose,
  selectedData,
}) => {
  // Extract subCategoryId from selectedData and validate it
  const subCategoryId = selectedData?.subCategoryId;

  if (!subCategoryId) {
    console.error("SubCategory ID is required for Service Type");
    return (
      <div className="p-4 text-red-500">
        Error: SubCategory ID is required to create/edit a service type.
      </div>
    );
  }

  const [formData, setFormData] = useState({
    name: data?.name || "",
    description: data?.description || "",
    display_order: data?.display_order || 0,
    sub_category_id: subCategoryId,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Additional validation before submission
    if (!formData.sub_category_id) {
      console.error("SubCategory ID is required");
      return;
    }

    try {
      if (mode === "edit" && data?.service_type_id) {
        await serviceAPI.updateServiceType(data.service_type_id, formData);
      } else {
        await serviceAPI.createServiceType(formData);
      }
      onClose();
    } catch (error) {
      console.error("Error submitting service type:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Service Type Name</Label>
        <Input
          id="name"
          placeholder="Service Type Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="display_order">Display Order</Label>
        <Input
          id="display_order"
          type="number"
          placeholder="Display Order"
          value={formData.display_order}
          onChange={(e) =>
            setFormData({
              ...formData,
              display_order: parseInt(e.target.value) || 0,
            })
          }
          required
        />
      </div>

      <div className="flex space-x-4">
        <Button type="submit" className="flex-1">
          {mode === "edit" ? "Update" : "Create"} Service Type
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ServiceTypeForm;
