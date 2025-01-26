import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { serviceAPI } from "../../api/services";
import { toast } from "@hooks/use-toast";

export const PackageForm = ({ mode, data, selectedData, onClose }) => {
  const [formData, setFormData] = useState({
    name: data?.name || "",
    description: data?.description || "",
    type_id: selectedData.typeId,
    duration_hours: data?.duration_hours || 0,
    duration_minutes: data?.duration_minutes || 0,
    sections: data?.PackageSections || [],
  });

  console.log(data, mode);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      if (mode === "edit" && data?.package_id) {
        await serviceAPI.updatePackage(data.package_id, formData);
      } else {
        await serviceAPI.createPackage(formData);
      }
      onClose();
    } catch (error) {
      console.error("Error submitting package:", error);
    }
  };

  const handleDelete = async () => {
    try {
      if (data?.package_id) {
        await serviceAPI.deletePackage(data.package_id);

        toast({
          title: "Success!",
          description: "Package deleted successfully!",
          variant: "default",
        });
        onClose();
      } else {
        toast({
          title: "Error",
          description: "No package selected for deletion!",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting package:", error);

      toast({
        title: "Error",
        description: "Failed to delete package:!",
        variant: "destructive",
      });
    }
  };

  if (mode === "delete") {
    return (
      <div className="space-y-4">
        <p>Are you sure you want to delete this package:?</p>
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
      <Input
        placeholder="Package Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <Textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
      />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Hours</label>
          <Input
            type="number"
            min="0"
            value={formData.duration_hours}
            onChange={(e) =>
              setFormData({
                ...formData,
                duration_hours: parseInt(e.target.value) || 0,
              })
            }
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Minutes</label>
          <Input
            type="number"
            min="0"
            max="59"
            value={formData.duration_minutes}
            onChange={(e) =>
              setFormData({
                ...formData,
                duration_minutes: parseInt(e.target.value) || 0,
              })
            }
            required
          />
        </div>
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );
};
