// PackageForm.jsx
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export const PackageForm = ({ onSubmit, initialData, typeId }) => {
  const [formData, setFormData] = useState({
    type_id: typeId,
    name: initialData?.name || '',
    description: initialData?.description || '',
    base_price: initialData?.base_price || '',
    display_order: initialData?.display_order || ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.base_price || Number(formData.base_price) < 0) {
      newErrors.base_price = 'Base price must be a positive number';
    }
    if (!formData.display_order || Number(formData.display_order) < 0) {
      newErrors.display_order = 'Display order must be a positive number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="type_id" value={typeId} />
      
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter package name"
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter package description"
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="base_price">Base Price</Label>
        <Input
          id="base_price"
          name="base_price"
          type="number"
          step="0.01"
          value={formData.base_price}
          onChange={handleChange}
          placeholder="Enter base price"
        />
        {errors.base_price && (
          <p className="text-sm text-red-500">{errors.base_price}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="display_order">Display Order</Label>
        <Input
          id="display_order"
          name="display_order"
          type="number"
          value={formData.display_order}
          onChange={handleChange}
          placeholder="Enter display order"
        />
        {errors.display_order && (
          <p className="text-sm text-red-500">{errors.display_order}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="submit">
          {initialData ? 'Update Package' : 'Create Package'}
        </Button>
      </div>
    </form>
  );
};

export default PackageForm;