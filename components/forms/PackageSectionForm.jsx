import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { serviceAPI } from '../../api/services';

export const PackageSectionForm = ({ mode = 'add', data = null, selectedData = {}, onClose }) => {
    const [formData, setFormData] = useState({
        name: data?.name || '',
        description: data?.description || '',
        display_order: data?.display_order || 0,
        package_id: data?.package_id || selectedData?.packageId || ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedData?.packageId) {
            console.error('Package ID is required');
            return;
        }

        try {
            const submissionData = {
                ...formData,
                display_order: parseInt(formData.display_order) || 0,
                package_id: selectedData.packageId
            };

            if (mode === 'add') {
                await serviceAPI.createPackageSection(submissionData);
            } else {
                await serviceAPI.updatePackageSection(data.section_id, submissionData);
            }
            onClose();
        } catch (error) {
            console.error('Error submitting package section:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Section Name</Label>
                <Input
                    id="name"
                    placeholder="Enter section name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    placeholder="Enter section description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                    id="display_order"
                    type="number"
                    min="0"
                    placeholder="Enter display order"
                    value={formData.display_order}
                    onChange={(e) => setFormData({
                        ...formData,
                        display_order: parseInt(e.target.value) || 0
                    })}
                />
            </div>

            <div className="flex gap-2 justify-end pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                >
                    Cancel
                </Button>
                <Button type="submit">
                    {mode === 'add' ? 'Create Section' : 'Update Section'}
                </Button>
            </div>
        </form>
    );
};