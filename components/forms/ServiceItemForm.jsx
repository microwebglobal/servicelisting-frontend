import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { serviceAPI } from '../../api/services';

export const ServiceItemForm = ({ mode, data, selectedData, onClose }) => {
    const [cities, setCities] = useState([]);
    const [formData, setFormData] = useState({
        name: data?.name || '',
        description: data?.description || '',
        base_price: data?.base_price || '',
        service_id: selectedData?.serviceId || data?.service_id,
        cityPricing: data?.CitySpecificPricings?.map(pricing => ({
            city_id: pricing.city_id,
            price: pricing.price,
        })) || []
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                base_price: parseFloat(formData.base_price),
                cityPricing: formData.cityPricing.map(pricing => ({
                    ...pricing,
                    price: parseFloat(pricing.price)
                })).filter(pricing => pricing.city_id && pricing.price)
            };

            if (mode === 'edit' && data?.item_id) {
                await serviceAPI.updateServiceItem(data.item_id, payload);
            } else {
                await serviceAPI.createServiceItem(payload);
            }
            onClose();
        } catch (error) {
            console.error('Error submitting service item:', error);
        }
    };

    // Helper function to check if a city is already selected
    const isCitySelected = (cityId) => {
        return formData.cityPricing.some(pricing => pricing.city_id === cityId);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
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
                    placeholder="Item Description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="base_price">Base Price</Label>
                <Input
                    id="base_price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Base Price"
                    value={formData.base_price}
                    onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
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

            <div className="flex space-x-4">
                <Button type="submit" className="flex-1">
                    {mode === 'edit' ? 'Update' : 'Create'} Service Item
                </Button>
                <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                    Cancel
                </Button>
            </div>
        </form>
    );
};