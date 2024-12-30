// ServiceForm.jsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { serviceAPI } from "../../api/services";

export const ServiceForm = ({ mode, data, selectedData, onClose }) => {
  console.log(selectedData);
  const [formData, setFormData] = useState({
    name: data?.name || "",
    description: data?.description || "",
    display_order: data?.display_order || 0,
    type_id: selectedData?.typeId || data?.type_id,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        display_order: parseInt(formData.display_order) || 0,
      };

      if (mode === "edit" && data?.service_id) {
        await serviceAPI.updateService(data.service_id, payload);
      } else {
        await serviceAPI.createService(payload);
      }
      onClose();
    } catch (error) {
      console.error("Error submitting service:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Service Name</Label>
        <Input
          id="name"
          placeholder="Service Name"
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
          rows={3}
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
            setFormData({ ...formData, display_order: e.target.value })
          }
          required
        />
      </div>

      <div className="flex space-x-4">
        <Button type="submit" className="flex-1">
          {mode === "edit" ? "Update" : "Create"} Service
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
