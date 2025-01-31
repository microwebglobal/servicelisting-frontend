import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { serviceAPI } from "../../api/services";
import { toast } from "@hooks/use-toast";

export const PackageSectionForm = ({
  mode = "add",
  data = null,
  selectedData = {},
  onClose,
}) => {
  const [formData, setFormData] = useState({
    name: data?.name || "",
    description: data?.description || "",
    display_order: data?.display_order || 0,
    package_id: data?.package_id || selectedData?.packageId || "",
  });
  const [image, setImage] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append(
      "display_order",
      parseInt(formData.display_order) || 0
    );
    formDataToSend.append("package_id", formData.package_id);

    if (image) {
      console.log(image);
      formDataToSend.append("image", image);
    }

    if (!selectedData?.packageId) {
      console.error("Package ID is required");
      return;
    }

    try {
      if (mode === "add") {
        await serviceAPI.createPackageSection(formDataToSend);
      } else {
        await serviceAPI.updatePackageSection(data.section_id, formDataToSend);
      }
      onClose();
    } catch (error) {
      console.error("Error submitting package section:", error);
    }
  };

  const handleDelete = async () => {
    try {
      if (data?.section_id) {
        await serviceAPI.deletePackageSection(data.section_id);

        toast({
          title: "Success!",
          description: "Package section deleted successfully!",
          variant: "default",
        });
        onClose();
      } else {
        toast({
          title: "Error",
          description: "No package section selected for deletion!",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting package section:", error);

      toast({
        title: "Error",
        description: "Failed to delete package section!",
        variant: "destructive",
      });
    }
  };

  if (mode === "delete") {
    return (
      <div className="space-y-4">
        <p>Are you sure you want to delete this package section?</p>
        <div className="flex space-x-4">
          <Button className="flex-1" onClick={handleDelete}>
            Confirm
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
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Section Name</Label>
        <Input
          id="name"
          placeholder="Enter section name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter section description"
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
          min="0"
          placeholder="Enter display order"
          value={formData.display_order}
          onChange={(e) =>
            setFormData({
              ...formData,
              display_order: parseInt(e.target.value) || 0,
            })
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Package Section Icon</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
      </div>

      <div className="flex gap-2 justify-end pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {mode === "add" ? "Create Section" : "Update Section"}
        </Button>
      </div>
    </form>
  );
};
