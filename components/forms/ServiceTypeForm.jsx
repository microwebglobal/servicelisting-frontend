import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const ServiceTypeForm = ({ onSubmit, subCategoryId }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    display_order: 0,
    sub_category_id: subCategoryId,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    onSubmit({
      ...formData,
      type_id: `type_${Date.now()}`,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Service Type Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <Textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
      />
      <Input
        type="number"
        placeholder="Display Order"
        value={formData.display_order}
        onChange={(e) =>
          setFormData({ ...formData, display_order: parseInt(e.target.value) })
        }
      />
      <Button type="submit">Submit</Button>
    </form>
  );
};
