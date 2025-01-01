import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { serviceAPI } from '../../api/services';
import Select from 'react-select';

export const CategoryForm = ({ mode, data, onClose }) => {
    const [formData, setFormData] = useState({
        name: data?.name || '',
        slug: data?.slug || '',
        display_order: data?.display_order || 0
    });

    const [selectedCities, setSelectedCities] = useState(data?.cities || []);
    const [image, setImage] = useState(); 
    const [cities, setCities] = useState([]);
    
    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await serviceAPI.getCities();
                const cityOptions = response.data.map((city) => ({
                    value: city.city_id,
                    label: city.name,
                }));
                setCities(cityOptions);
            } catch (error) {
                console.error('Error fetching cities:', error);
            }
        };

        fetchCities();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

       
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('slug', formData.slug);
        formDataToSend.append('display_order', formData.display_order);
        
        
        if (image) {
            console.log(image)
            formDataToSend.append('image', image); 
        }

    

        try {
            let categoryId;
            if (mode === 'edit' && data?.category_id) {
                await serviceAPI.updateCategory(data.category_id, formDataToSend); 
                categoryId = data.category_id;
            } else {
                const response = await serviceAPI.createCategory(formDataToSend); 
                categoryId = response.data.category_id;
            }

            if (selectedCities.length > 0) {
                const categoryCityData = selectedCities.map((city) => ({
                    category_id: categoryId,
                    city_id: city.value
                }));

                const requestBody = {
                    mappings: categoryCityData
                };

                await serviceAPI.createCategoryCities(requestBody);
            }

            onClose();
        } catch (error) {
            console.error('Error submitting category:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
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
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                    id="display_order"
                    type="number"
                    placeholder="Display Order"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="cities">Select Cities</Label>
                <Select
                    id="cities"
                    options={cities}
                    isMulti
                    value={selectedCities}
                    onChange={setSelectedCities}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="image">Category Icon</Label>
                <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
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
