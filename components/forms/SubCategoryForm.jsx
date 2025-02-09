import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { serviceAPI } from "../../api/services";
import { toast } from "@hooks/use-toast";

export const SubCategoryForm = ({
  mode = "create",
  data,
  onClose,
  selectedData,
}) => {
  const [formData, setFormData] = useState({
    name: data?.name || "",
    slug: data?.slug || "",
    display_order: data?.display_order || 0,
    category_id: selectedData?.categoryId || "",
  });
  const [image, setImage] = useState();

  // Validation check moved after Hooks
  if (!selectedData?.categoryId) {
    return (
      <div className="p-4 text-red-500">
        Error: Category ID is required to create/edit a subcategory.
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("slug", formData.slug);
    formDataToSend.append("display_order", formData.display_order);
    formDataToSend.append("category_id", formData.category_id);

    if (image) {
      formDataToSend.append("image", image);
    }

    try {
      if (mode === "edit" && data?.sub_category_id) {
        await serviceAPI.updateSubCategory(data.sub_category_id, formDataToSend);
        toast({
          title: "Success!",
          description: "SubCategory updated successfully!",
          variant: "default",
        });
      } else {
        await serviceAPI.createSubCategory(formDataToSend);
        toast({
          title: "Success!",
          description: "SubCategory created successfully!",
          variant: "default",
        });
      }
      onClose();
    } catch (error) {
      console.error("Error submitting subcategory:", error);
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to save subcategory!",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      if (data?.sub_category_id) {
        await serviceAPI.deleteSubCategory(data.sub_category_id);
        toast({
          title: "Success!",
          description: "Sub-Category deleted successfully!",
          variant: "default",
        });
        onClose();
      } else {
        toast({
          title: "Error",
          description: "No sub-category selected for deletion!",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting sub-category:", error);
      toast({
        title: "Error",
        description: "Failed to delete sub-category!",
        variant: "destructive",
      });
    }
  };

  if (mode === "delete") {
    return (
      <div className="space-y-4">
        <p>Are you sure you want to delete this sub-category?</p>
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
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
      encType="multipart/form-data"
    >
      <div className="space-y-2">
        <Label htmlFor="name">SubCategory Name</Label>
        <Input
          id="name"
          placeholder="SubCategory Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          placeholder="Slug"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
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

      <div className="space-y-2">
        <Label htmlFor="image">Sub Category Icon</Label>
        {data?.icon_url && (
          <div className="mb-2 relative w-16 h-16">
            <Image
              src={data.icon_url}
              alt="Current icon"
              fill
              className="object-contain"
              sizes="(max-width: 64px) 100vw, 64px"
            />
          </div>
        )}
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
      </div>

      <div className="flex space-x-4">
        <Button type="submit" className="flex-1">
          {mode === "edit" ? "Update" : "Create"} SubCategory
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