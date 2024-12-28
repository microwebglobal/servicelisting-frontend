import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export const PackageForm = ({ onSubmit, typeId, initialData }) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        description: initialData?.description || '',
        type_id: typeId,
        duration_hours: initialData?.duration_hours || 0,
        duration_minutes: initialData?.duration_minutes || 0,
        sections: initialData?.PackageSections || []
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            type_id: typeId
        });
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
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Hours</label>
                    <Input
                        type="number"
                        min="0"
                        value={formData.duration_hours}
                        onChange={(e) => setFormData({ 
                            ...formData, 
                            duration_hours: parseInt(e.target.value) || 0 
                        })}
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
                        onChange={(e) => setFormData({ 
                            ...formData, 
                            duration_minutes: parseInt(e.target.value) || 0 
                        })}
                        required
                    />
                </div>
            </div>
            <Button type="submit">Submit</Button>
        </form>
    );
};