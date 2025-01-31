import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { profileAPI } from "@/api/profile";
import { toast } from "@/hooks/use-toast";
import { MapPin, Plus, Edit2, Trash2, Star } from "lucide-react";

const AddressManager = () => {
  const [addresses, setAddresses] = useState([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    type: 'home',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await profileAPI.getAddresses();
      setAddresses(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load addresses. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedAddress) {
        await profileAPI.updateAddress(selectedAddress.id, addressForm);
      } else {
        await profileAPI.createAddress(addressForm);
      }
      setIsAddressModalOpen(false);
      fetchAddresses();
      toast({
        title: "Success",
        description: selectedAddress 
          ? "Address updated successfully" 
          : "Address added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save address. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (addressId) => {
    try {
      await profileAPI.deleteAddress(addressId);
      fetchAddresses();
      toast({
        title: "Success",
        description: "Address deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete address. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSetPrimary = async (addressId) => {
    try {
      await profileAPI.setPrimaryAddress(addressId);
      fetchAddresses();
      toast({
        title: "Success",
        description: "Primary address updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update primary address. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openAddressModal = (address = null) => {
    if (address) {
      setSelectedAddress(address);
      setAddressForm(address);
    } else {
      setSelectedAddress(null);
      setAddressForm({
        type: 'home',
        line1: '',
        line2: '',
        city: '',
        state: '',
        postal_code: '',
      });
    }
    setIsAddressModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Saved Addresses</h3>
        <Button
          size="sm"
          onClick={() => openAddressModal()}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Address
        </Button>
      </div>

      <div className="space-y-3">
        {addresses.map((address) => (
          <Card key={address.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium capitalize">{address.type}</span>
                    {address.is_primary && (
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {address.line1}
                    {address.line2 && `, ${address.line2}`}
                  </p>
                  <p className="text-sm text-gray-600">
                    {address.city}, {address.state} {address.postal_code}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => openAddressModal(address)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDelete(address.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                {!address.is_primary && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSetPrimary(address.id)}
                  >
                    Set as Primary
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}

        {addresses.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <MapPin className="h-8 w-8 mx-auto mb-2" />
            <p>No addresses saved yet</p>
          </div>
        )}
      </div>

      <Dialog open={isAddressModalOpen} onOpenChange={setIsAddressModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedAddress ? 'Edit Address' : 'Add New Address'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddressSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Address Type</label>
              <Select
                value={addressForm.type}
                onValueChange={(value) =>
                  setAddressForm({ ...addressForm, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home">Home</SelectItem>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Street Address</label>
              <Input
                value={addressForm.line1}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, line1: e.target.value })
                }
                placeholder="Street address"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Apartment, suite, etc.</label>
              <Input
                value={addressForm.line2}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, line2: e.target.value })
                }
                placeholder="Apartment, suite, etc. (optional)"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">City</label>
                <Input
                  value={addressForm.city}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, city: e.target.value })
                  }
                  placeholder="City"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">State</label>
                <Input
                  value={addressForm.state}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, state: e.target.value })
                  }
                  placeholder="State"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Postal Code</label>
              <Input
                value={addressForm.postal_code}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, postal_code: e.target.value })
                }
                placeholder="Postal code"
                required
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddressModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {selectedAddress ? 'Update' : 'Save'} Address
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddressManager;