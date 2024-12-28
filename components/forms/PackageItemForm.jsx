import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export const PackageItemForm = ({ onSubmit, packageId, sectionId, initialData }) => {
  console.log('sectionID', sectionId);
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        description: initialData?.description || '',
        price: initialData?.price || '',
        is_default: initialData?.is_default || false,
        display_order: initialData?.display_order || 0,
        package_id: packageId,
        section_id: initialData?.section_id || sectionId // Initialize with either existing or provided sectionId
    });

    // Update form data when sectionId prop changes
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            section_id: sectionId
        }));
    }, [sectionId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Ensure all required fields are present and properly formatted
        const submissionData = {
            ...formData,
            package_id: packageId,
            section_id: sectionId, // Explicitly include the current sectionId
            price: parseFloat(formData.price) || 0,
            display_order: parseInt(formData.display_order) || 0
        };

        // For edit mode, include the item_id
        if (initialData?.item_id) {
            submissionData.item_id = initialData.item_id;
        }

        // Validate that section_id is present
        if (!submissionData.section_id) {
            console.error('Section ID is required');
            return;
        }

        onSubmit(submissionData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                    id="name"
                    placeholder="Item Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                />
            </div>

            <div className="flex items-center space-x-2">
                <Checkbox
                    id="is_default"
                    checked={formData.is_default}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_default: checked })}
                />
                <Label htmlFor="is_default">Default Selection</Label>
            </div>

            <div className="space-y-2">
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                    id="display_order"
                    type="number"
                    placeholder="Display Order"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                />
            </div>

            <Button type="submit" className="w-full">Submit</Button>
        </form>
    );
};

export default PackageItemForm;