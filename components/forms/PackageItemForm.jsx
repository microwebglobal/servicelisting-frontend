import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { serviceAPI } from '../../api/services';

export const PackageItemForm = ({ mode, data, selectedData, onClose }) => {
    const [cities, setCities] = useState([]);
    const [formData, setFormData] = useState({
        name: data?.name || '',
        description: data?.description || '',
        price: data?.price || '',
        is_default: data?.is_default || false,
        display_order: data?.display_order || 0,
        package_id: data?.package_id || selectedData.packageId,
        section_id: data?.section_id || selectedData.sectionId,
        cityPricing: data?.city_prices ? 
            Object.entries(data.city_prices).map(([city_id, price]) => ({
                city_id,
                price,
            })) : []
    });

    useEffect(() => {
        fetchCities();
    }, []);

    const fetchCities = async () => {
        try {
            const response = await serviceAPI.getCities();
            setCities(response.data || []);
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };

    const addCityPricing = () => {
        setFormData(prev => ({
            ...prev,
            cityPricing: [
                ...prev.cityPricing,
                { city_id: '', price: '' }
            ]
        }));
    };

    const removeCityPricing = (index) => {
        setFormData(prev => ({
            ...prev,
            cityPricing: prev.cityPricing.filter((_, i) => i !== index)
        }));
    };

    const updateCityPricing = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            cityPricing: prev.cityPricing.map((pricing, i) => 
                i === index 
                    ? { ...pricing, [field]: value }
                    : pricing
            )
        }));
    };

    const isCitySelected = (cityId) => {
        return formData.cityPricing.some(pricing => pricing.city_id === cityId);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const city_prices = formData.cityPricing
                .filter(pricing => pricing.city_id && pricing.price)
                .reduce((acc, { city_id, price }) => ({
                    ...acc,
                    [city_id]: parseFloat(price)
                }), {});

            const submissionData = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price) || 0,
                is_default: formData.is_default,
                display_order: parseInt(formData.display_order) || 0,
                section_id: selectedData.sectionId,
                city_prices
            };

            if (!submissionData.section_id) {
                console.error('Section ID is required');
                return;
            }

            if (mode === 'add') {
                await serviceAPI.createPackageItem(submissionData);
            } else {
                await serviceAPI.updatePackageItem(data.item_id, submissionData);
            }
            onClose();
        } catch (error) {
            console.error('Error submitting package item:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
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
                <Label htmlFor="price">Base Price *</Label>
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

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <Label>City-Specific Pricing</Label>
                    <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={addCityPricing}
                    >
                        <Plus size={16} className="mr-2" />
                        Add City Pricing
                    </Button>
                </div>

                {formData.cityPricing.map((pricing, index) => (
                    <div key={index} className="flex gap-4 items-start">
                        <div className="flex-1">
                            <Select
                                value={pricing.city_id}
                                onValueChange={(value) => updateCityPricing(index, 'city_id', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select City" />
                                </SelectTrigger>
                                <SelectContent>
                                    {cities.map((city) => (
                                        !isCitySelected(city.city_id) || pricing.city_id === city.city_id ? (
                                            <SelectItem 
                                                key={city.city_id} 
                                                value={city.city_id}
                                            >
                                                {city.name}
                                            </SelectItem>
                                        ) : null
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex-1">
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="Price"
                                value={pricing.price}
                                onChange={(e) => updateCityPricing(index, 'price', e.target.value)}
                            />
                        </div>
                        <Button 
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeCityPricing(index)}
                        >
                            <Trash2 size={16} className="text-gray-500 hover:text-red-500" />
                        </Button>
                    </div>
                ))}
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

            <div className="flex gap-2 justify-end pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                >
                    Cancel
                </Button>
                <Button type="submit">
                    {mode === 'add' ? 'Create Item' : 'Update Item'}
                </Button>
            </div>
        </form>
    );
};

export default PackageItemForm;