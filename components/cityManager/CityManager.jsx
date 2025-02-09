'use client';
import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast"
import { Pencil, Trash2, Plus } from 'lucide-react';
import { serviceAPI } from '../../api/services';

const CityManager = () => {
    const [cities, setCities] = useState([]);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedCity, setSelectedCity] = useState(null);
    const { toast } = useToast();

    const addForm = useForm({
        defaultValues: {
            name: '',
            state: '',
            latitude: '',
            longitude: '',
            status: 'active'
        }
    });

    const editForm = useForm({
        defaultValues: {
            name: '',
            state: '',
            latitude: '',
            longitude: '',
            status: 'active'
        }
    });

    useEffect(() => {
        loadCities();
    }, []);

    useEffect(() => {
        if (selectedCity) {
            editForm.reset({
                name: selectedCity.name,
                state: selectedCity.state,
                latitude: selectedCity.latitude,
                longitude: selectedCity.longitude,
                status: selectedCity.status
            });
        }
    }, [selectedCity, editForm]);

    const loadCities = async () => {
        try {
            const response = await serviceAPI.getCities();
            setCities(response.data);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load cities",
                variant: "destructive"
            });
        }
    };

    const handleAdd = async (data) => {
        try {
            await serviceAPI.createCity(data);
            toast({
                title: "Success",
                description: "City added successfully"
            });
            setIsAddDialogOpen(false);
            loadCities();
            addForm.reset();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add city",
                variant: "destructive"
            });
        }
    };

    const handleEdit = async (data) => {
        try {
            await serviceAPI.updateCity(selectedCity.city_id, data);
            toast({
                title: "Success",
                description: "City updated successfully"
            });
            setIsEditDialogOpen(false);
            loadCities();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update city",
                variant: "destructive"
            });
        }
    };

    const handleDelete = async (cityId) => {
        if (window.confirm('Are you sure you want to delete this city?')) {
            try {
                await serviceAPI.deleteCity(cityId);
                toast({
                    title: "Success",
                    description: "City deleted successfully"
                });
                loadCities();
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to delete city",
                    variant: "destructive"
                });
            }
        }
    };

    const openEditDialog = (city) => {
        setSelectedCity(city);
        setIsEditDialogOpen(true);
    };

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Cities Management</CardTitle>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                            <Plus size={16} /> Add City
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New City</DialogTitle>
                        </DialogHeader>
                        <Form {...addForm}>
                            <form onSubmit={addForm.handleSubmit(handleAdd)} className="space-y-4">
                                <FormField
                                    control={addForm.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>City Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} required />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={addForm.control}
                                    name="state"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>State</FormLabel>
                                            <FormControl>
                                                <Input {...field} required />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={addForm.control}
                                    name="latitude"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Latitude</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="number" step="any" required />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={addForm.control}
                                    name="longitude"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Longitude</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="number" step="any" required />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full">Add City</Button>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </CardHeader>

            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>City Name</TableHead>
                            <TableHead>State</TableHead>
                            <TableHead>Latitude</TableHead>
                            <TableHead>Longitude</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {cities.map((city) => (
                            <TableRow key={city.city_id}>
                                <TableCell>{city.name}</TableCell>
                                <TableCell>{city.state}</TableCell>
                                <TableCell>{city.latitude}</TableCell>
                                <TableCell>{city.longitude}</TableCell>
                                <TableCell>{city.status}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => openEditDialog(city)}
                                        >
                                            <Pencil size={16} />
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => handleDelete(city.city_id)}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit City</DialogTitle>
                        </DialogHeader>
                        <Form {...editForm}>
                            <form onSubmit={editForm.handleSubmit(handleEdit)} className="space-y-4">
                                <FormField
                                    control={editForm.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>City Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} required />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={editForm.control}
                                    name="state"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>State</FormLabel>
                                            <FormControl>
                                                <Input {...field} required />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={editForm.control}
                                    name="latitude"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Latitude</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="number" step="any" required />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={editForm.control}
                                    name="longitude"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Longitude</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="number" step="any" required />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full">Update City</Button>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
};

export default CityManager;