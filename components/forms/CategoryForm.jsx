import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const CategoryForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    slug: '',
    icon_url: '',
    display_order: 0
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Category Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <Input
        placeholder="Slug"
        value={formData.slug}
        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
      />
      <Input
        placeholder="Icon URL"
        value={formData.icon_url}
        onChange={(e) => setFormData({ ...formData, icon_url: e.target.value })}
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
