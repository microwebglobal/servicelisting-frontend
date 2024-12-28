import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { serviceAPI } from '../../api/services';

export const CategoryForm = ({ mode, data, onClose }) => {
    const [formData, setFormData] = useState({
        name: data?.name || '',
        slug: data?.slug || '',
        icon_url: data?.icon_url || '',
        display_order: data?.display_order || 0
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (mode === 'edit' && data?.category_id) {
                await serviceAPI.updateCategory(data.category_id, formData);
            } else {
                await serviceAPI.createCategory(formData);
            }
            onClose();
        } catch (error) {
            console.error('Error submitting category:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                    id="name"
                    placeholder="Category Name"
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
                <Label htmlFor="icon_url">Icon URL</Label>
                <Input
                    id="icon_url"
                    placeholder="Icon URL"
                    value={formData.icon_url}
                    onChange={(e) => setFormData({ ...formData, icon_url: e.target.value })}
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
                    {mode === 'edit' ? 'Update' : 'Create'} Category
                </Button>
                <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                    Cancel
                </Button>
            </div>
        </form>
    );
};