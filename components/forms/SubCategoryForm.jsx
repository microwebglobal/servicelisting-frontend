import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { serviceAPI } from '../../api/services';

export const SubCategoryForm = ({ mode = 'create', data, onClose, selectedData }) => {
  // Extract categoryId from selectedData and validate it
  const categoryId = selectedData?.categoryId;
  
  if (!categoryId) {
    console.error('Category ID is required for SubCategory');
    return (
      <div className="p-4 text-red-500">
        Error: Category ID is required to create/edit a subcategory.
      </div>
    );
  }

  const [formData, setFormData] = useState({
    name: data?.name || '',
    slug: data?.slug || '',
    display_order: data?.display_order || 0,
    category_id: categoryId // Use the validated categoryId
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Additional validation before submission
    if (!formData.category_id) {
      console.error('Category ID is required');
      return;
    }

    try {
      if (mode === 'edit' && data?.subcategory_id) {
        await serviceAPI.updateSubCategory(data.subcategory_id, formData);
      } else {
        await serviceAPI.createSubCategory(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error submitting subcategory:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0})}
          required
        />
      </div>

      <div className="flex space-x-4">
        <Button type="submit" className="flex-1">
          {mode === 'edit' ? 'Update' : 'Create'} SubCategory
        </Button>
        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default SubCategoryForm;