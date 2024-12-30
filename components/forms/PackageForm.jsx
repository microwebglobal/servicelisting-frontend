import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { serviceAPI } from "../../api/services";

export const PackageForm = ({ mode, data, selectedData, onClose }) => {
  const [formData, setFormData] = useState({
    name: data?.name || "",
    description: data?.description || "",
    type_id: selectedData.typeId,
    duration_hours: data?.duration_hours || 0,
    duration_minutes: data?.duration_minutes || 0,
    sections: data?.PackageSections || [],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      if (mode === "edit" && data?.service_id) {
        await serviceAPI.updatePackage(data.service_id, formData);
      } else {
        await serviceAPI.createPackage(formData);
      }
      onClose();
    } catch (error) {
      console.error("Error submitting service:", error);
    }
  };

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
