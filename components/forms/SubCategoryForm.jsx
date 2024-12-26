import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const SubCategoryForm = ({ onSubmit, categoryId }) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    display_order: 0,
    category_id: categoryId
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      sub_category_id: `subcat_${Date.now()}`
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="SubCategory Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <Input
        placeholder="Slug"
        value={formData.slug}
        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
      />
      <Input
        type="number"
        placeholder="Display Order"
        value={formData.display_order}
        onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value)})}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
};