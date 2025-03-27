import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { serviceAPI } from "../../api/services";
import TextEditor from "@components/ui/textEditor";
import { toast } from "@hooks/use-toast";

export const ServiceItemForm = ({ mode, data, selectedData, onClose }) => {
  const [cities, setCities] = useState([]);
  const [formData, setFormData] = useState({
    name: data?.name || "",
    description: data?.description || "",
    overview: data?.overview || "",
    base_price: data?.base_price || "",
    grace_period: data?.grace_period || null,
    penalty_percentage: data?.penalty_percentage || null,
    duration_hours: data?.duration_hours || "",
    duration_minutes: data?.duration_minutes || "",
    service_id: selectedData?.serviceId || data?.service_id,
    cityPricing:
      data?.CitySpecificPricings?.map((pricing) => ({
        city_id: pricing.city_id,
        price: pricing.price,
      })) || [],
    specialPricing:
      data?.SpecialPricings?.map((pricing) => ({
        city_id: pricing.city_id,
        special_price: pricing.special_price,
        start_date: pricing.start_date,
        end_date: pricing.end_date,
      })) || [],
    bufferTime:
      data?.CitySpecificBuffertimes?.map((time) => ({
        city_id: time.city_id,
        buffer_hours: time.buffer_hours,
        buffer_minutes: time.buffer_minutes,
      })) || [],
    commitionRate:
      data?.ServiceCommissions?.map((commition) => ({
        city_id: commition.city_id,
        rate: commition.commission_rate,
      })) || [],
    advance_percentage: data?.advance_percentage || 0,
    is_home_visit: data?.is_home_visit || false,
  });

  useEffect(() => {
    fetchCities();
  }, []);

  console.log(data);

  const fetchCities = async () => {
    try {
      const response = await serviceAPI.getCities();
      setCities(response.data || []);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const addCityPricing = () => {
    setFormData((prev) => ({
      ...prev,
      cityPricing: [...prev.cityPricing, { city_id: "", price: "" }],
    }));
  };

  const addSpecialPricing = () => {
    setFormData((prev) => ({
      ...prev,
      specialPricing: [
        ...prev.specialPricing,
        {
          city_id: "",
          special_price: "",
          start_date: "",
          end_date: "",
        },
      ],
    }));
  };

  const updateSpecialPricing = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      specialPricing: prev.specialPricing.map((pricing, i) =>
        i === index ? { ...pricing, [field]: value } : pricing
      ),
    }));
  };

  const removeSpecialPricing = (index) => {
    setFormData((prev) => ({
      ...prev,
      specialPricing: prev.specialPricing.filter((_, i) => i !== index),
    }));
  };

  const removeCityPricing = (index) => {
    setFormData((prev) => ({
      ...prev,
      cityPricing: prev.cityPricing.filter((_, i) => i !== index),
    }));
  };

  const updateCityPricing = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      cityPricing: prev.cityPricing.map((pricing, i) =>
        i === index ? { ...pricing, [field]: value } : pricing
      ),
    }));
  };

  const addCommitionRate = () => {
    setFormData((prev) => ({
      ...prev,
      commitionRate: [...prev.commitionRate, { city_id: "", rate: "" }],
    }));
  };

  const removeCommitionRate = (index) => {
    setFormData((prev) => ({
      ...prev,
      commitionRate: prev.commitionRate.filter((_, i) => i !== index),
    }));
  };

  const updateCommitionRate = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      commitionRate: prev.commitionRate.map((rate, i) =>
        i === index ? { ...rate, [field]: value } : rate
      ),
    }));
  };

  const addBufferTime = () => {
    setFormData((prev) => ({
      ...prev,
      bufferTime: [
        ...prev.bufferTime,
        {
          city_id: "",
          buffer_hours: "",
          buffer_minutes: "",
        },
      ],
    }));
  };

  const updateBufferTime = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      bufferTime: prev.bufferTime.map((time, i) =>
        i === index ? { ...time, [field]: value } : time
      ),
    }));
  };

  const removeBufferTime = (index) => {
    setFormData((prev) => ({
      ...prev,
      bufferTime: prev.bufferTime.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        base_price: parseFloat(formData.base_price),
        cityPricing: formData.cityPricing
          .map((pricing) => ({
            ...pricing,
            price: parseFloat(pricing.price),
          }))
          .filter((pricing) => pricing.city_id && pricing.price),
        specialPricing: formData.specialPricing.map((pricing) => ({
          ...pricing,
          special_price: parseFloat(pricing.special_price),
        })),
        bufferTime: formData.bufferTime.map((time) => ({
          ...time,
          buffer_hours: parseFloat(time.buffer_hours),
          buffer_minutes: parseFloat(time.buffer_minutes),
        })),
        commitionRate: formData.commitionRate.map((commition) => ({
          ...commition,
          rate: parseFloat(commition.rate),
        })),
      };

      if (mode === "edit" && data?.item_id) {
        await serviceAPI.updateServiceItem(data.item_id, payload);
        toast({
          title: "Success!",
          description: "Service Item updated successfully!",
          variant: "default",
        });
      } else {
        console.log(payload);
        await serviceAPI.createServiceItem(payload);
        toast({
          title: "Success!",
          description: "New Service Item Created successfully!",
          variant: "default",
        });
      }
      onClose();
    } catch (error) {
      console.error("Error submitting service item:", error);
    }
  };

  // Helper function to check if a city is already selected
  const isCitySelected = (cityId) => {
    return formData.cityPricing.some((pricing) => pricing.city_id === cityId);
  };

  const isCitySelectedSp = (cityId) => {
    return formData.specialPricing.some(
      (pricing) => pricing.city_id === cityId
    );
  };

  const isCitySelectedBuf = (cityId) => {
    return formData.bufferTime.some((time) => time.city_id === cityId);
  };

  const isCitySelectedComition = (cityId) => {
    return formData.commitionRate.some((time) => time.city_id === cityId);
  };

  const handleDelete = async () => {
    try {
      if (data?.item_id) {
        await serviceAPI.deleteServiceItem(data.item_id);

        toast({
          title: "Success!",
          description: "Service Item deleted successfully!",
          variant: "default",
        });
        onClose();
      } else {
        toast({
          title: "Error",
          description: "No service item selected for deletion!",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting service item:", error);

      toast({
        title: "Error",
        description: "Failed to delete service item!",
        variant: "destructive",
      });
    }
  };

  if (mode === "delete") {
    return (
      <div className="space-y-4">
        <p>Are you sure you want to delete this service item?</p>
        <div className="flex space-x-4">
          <Button className="flex-1" onClick={handleDelete}>
            Confirm
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
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
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
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
          onChange={(e) =>
            setFormData({ ...formData, base_price: parseFloat(e.target.value) })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="base_price">Advance Percentage</Label>
        <Input
          id="advance_percentage"
          type="number"
          step="0.01"
          min="0"
          max="100"
          placeholder="Advance Percentage"
          value={formData.advance_percentage}
          onChange={(e) =>
            setFormData({
              ...formData,
              advance_percentage: parseFloat(e.target.value),
            })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="base_price">Grace Period Percentage</Label>
        <Input
          id="grace_period"
          type="number"
          step="0.01"
          min="0"
          max="100"
          placeholder="Advance Percentage"
          value={formData.grace_period}
          onChange={(e) =>
            setFormData({
              ...formData,
              grace_period: parseFloat(e.target.value),
            })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="base_price">Penalty Percentage</Label>
        <Input
          id="penalty_percentage"
          type="number"
          step="0.01"
          min="0"
          max="100"
          placeholder="Penalty Percentage"
          value={formData.penalty_percentage}
          onChange={(e) =>
            setFormData({
              ...formData,
              penalty_percentage: parseFloat(e.target.value),
            })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="base_price">Is Home Visit</Label>
        <Select
          value={formData.is_home_visit}
          onValueChange={(value) =>
            setFormData({
              ...formData,
              is_home_visit: value,
            })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Home Visit Or Not" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key={true} value={true}>
              True
            </SelectItem>
            <SelectItem key={false} value={false}>
              False
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-between">
        <div>
          <Label htmlFor="base_price">Duration Hours</Label>
          <Input
            type="number"
            min="0"
            value={formData.duration_hours}
            onChange={(e) =>
              setFormData({
                ...formData,
                duration_hours: parseInt(e.target.value) || 0,
              })
            }
            required
          />
        </div>

        <div>
          <Label htmlFor="base_price">Duration Minutes</Label>
          <Input
            type="number"
            min="0"
            max="59"
            value={formData.duration_minutes}
            onChange={(e) =>
              setFormData({
                ...formData,
                duration_minutes: parseInt(e.target.value) || 0,
              })
            }
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Service Overview</Label>
        <TextEditor
          value={formData.overview}
          onChange={(value) => setFormData({ ...formData, overview: value })}
          className="my-custom-class"
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
                onValueChange={(value) =>
                  updateCityPricing(index, "city_id", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) =>
                    !isCitySelected(city.city_id) ||
                    pricing.city_id === city.city_id ? (
                      <SelectItem key={city.city_id} value={city.city_id}>
                        {city.name}
                      </SelectItem>
                    ) : null
                  )}
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
                onChange={(e) =>
                  updateCityPricing(index, "price", e.target.value)
                }
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

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Special Pricing</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addSpecialPricing}
          >
            <Plus size={16} className="mr-2" />
            Add Special Pricing
          </Button>
        </div>

        {formData.specialPricing.map((pricing, index) => (
          <div key={index} className="flex gap-4 items-start">
            <div className="flex-1 w-64 mt-5">
              <Select
                value={pricing.city_id}
                onValueChange={(value) =>
                  updateSpecialPricing(index, "city_id", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) =>
                    !isCitySelectedSp(city.city_id) ||
                    pricing.city_id === city.city_id ? (
                      <SelectItem key={city.city_id} value={city.city_id}>
                        {city.name}
                      </SelectItem>
                    ) : null
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 mt-5">
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="Price"
                value={pricing.special_price}
                onChange={(e) =>
                  updateSpecialPricing(index, "special_price", e.target.value)
                }
              />
            </div>
            <div className="flex-1">
              <label className="block ml-2 text-sm font-medium text-gray-700">
                Start Date
              </label>
              <Input
                type="date"
                placeholder="Start Date"
                value={pricing.start_date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) =>
                  updateSpecialPricing(index, "start_date", e.target.value)
                }
              />
            </div>
            <div className="flex-1">
              <label className="block ml-2 text-sm font-medium text-gray-700">
                End Date
              </label>
              <Input
                type="date"
                placeholder="End Date"
                value={pricing.end_date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) =>
                  updateSpecialPricing(index, "end_date", e.target.value)
                }
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="mt-5"
              onClick={() => removeSpecialPricing(index)}
            >
              <Trash2 size={16} className="text-gray-500 hover:text-red-500" />
            </Button>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex gap-5 items-center">
          <Label>Buffer Time</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addBufferTime}
          >
            <Plus size={16} className="mr-2" />
            Add Buffer Time
          </Button>
        </div>

        {formData.bufferTime.map((time, index) => (
          <div key={index} className="flex gap-4 items-start">
            <div className="flex-1 w-64 mt-5">
              <Select
                value={time.city_id}
                onValueChange={(value) =>
                  updateBufferTime(index, "city_id", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) =>
                    !isCitySelectedBuf(city.city_id) ||
                    time.city_id === city.city_id ? (
                      <SelectItem key={city.city_id} value={city.city_id}>
                        {city.name}
                      </SelectItem>
                    ) : null
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="block ml-2 text-sm font-medium text-gray-700">
                Buffer Hours
              </label>
              <Input
                type="number"
                step="1"
                min="0"
                placeholder="Buffer Hours"
                value={time.buffer_hours}
                onChange={(e) =>
                  updateBufferTime(index, "buffer_hours", e.target.value)
                }
              />
            </div>
            <div className="flex-1">
              <label className="block ml-2 text-sm font-medium text-gray-700">
                Buffer Minutes
              </label>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="Buffer Minutes"
                value={time.buffer_minutes}
                onChange={(e) =>
                  updateBufferTime(index, "buffer_minutes", e.target.value)
                }
              />
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="mt-5"
              onClick={() => removeBufferTime(index)}
            >
              <Trash2 size={16} className="text-gray-500 hover:text-red-500" />
            </Button>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Commition Rates</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addCommitionRate}
          >
            <Plus size={16} className="mr-2" />
            Add Commition Rate
          </Button>
        </div>

        {formData.commitionRate.map((commition, index) => (
          <div key={index} className="flex gap-4 items-start">
            <div className="flex-1">
              <Select
                value={commition.city_id}
                onValueChange={(value) =>
                  updateCommitionRate(index, "city_id", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) =>
                    !isCitySelectedComition(city.city_id) ||
                    commition.city_id === city.city_id ? (
                      <SelectItem key={city.city_id} value={city.city_id}>
                        {city.name}
                      </SelectItem>
                    ) : null
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="Rate"
                value={commition.rate}
                onChange={(e) =>
                  updateCommitionRate(index, "rate", e.target.value)
                }
              />
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeCommitionRate(index)}
            >
              <Trash2 size={16} className="text-gray-500 hover:text-red-500" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex space-x-4">
        <Button type="submit" className="flex-1">
          {mode === "edit" ? "Update" : "Create"} Service Item
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};
