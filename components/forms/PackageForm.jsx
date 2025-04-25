"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { serviceAPI } from "../../api/services";
import { toast } from "@hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const PackageForm = ({ mode, data, selectedData, onClose }) => {
  const [formData, setFormData] = useState({
    name: data?.name || "",
    description: data?.description || "",
    type_id: selectedData.typeId,
    duration_hours: data?.duration_hours || 0,
    duration_minutes: data?.duration_minutes || 0,
    grace_period: data?.grace_period || 0,
    penalty_percentage: data?.penalty_percentage || 0,
    advance_percentage: data?.advance_percentage || 0,
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
    sections: data?.PackageSections || [],
  });
  const [image, setImage] = useState();
  const [cities, setCities] = useState([]);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await serviceAPI.getCities();
      setCities(response.data || []);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
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

    const formDataToSend = new FormData();

    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("type_id", formData.type_id);
    formDataToSend.append("duration_hours", formData.duration_hours);
    formDataToSend.append("duration_minutes", formData.duration_minutes);
    formDataToSend.append("grace_period", formData.grace_period);
    formDataToSend.append("penalty_percentage", formData.penalty_percentage);
    formDataToSend.append("advance_percentage", formData.advance_percentage);
    formDataToSend.append("sections", formData.sections);
    if (formData.bufferTime) {
      const processedBufferTime = formData.bufferTime.map((time) => ({
        ...time,
        buffer_hours: parseFloat(time.buffer_hours),
        buffer_minutes: parseFloat(time.buffer_minutes),
      }));
      formDataToSend.append("bufferTime", JSON.stringify(processedBufferTime));
    }

    if (formData.commitionRate) {
      const processedCommitionRate = formData.commitionRate.map(
        (commition) => ({
          ...commition,
          rate: parseFloat(commition.rate),
        })
      );
      formDataToSend.append(
        "commitionRate",
        JSON.stringify(processedCommitionRate)
      );
    }

    if (image) {
      console.log(image);
      formDataToSend.append("image", image);
    }
    console.log(formData);
    try {
      if (mode === "edit" && data?.package_id) {
        await serviceAPI.updatePackage(data.package_id, formDataToSend);
      } else {
        await serviceAPI.createPackage(formDataToSend);
      }
      onClose();
    } catch (error) {
      console.error("Error submitting package:", error);
    }
  };

  const handleDelete = async () => {
    try {
      if (data?.package_id) {
        await serviceAPI.deletePackage(data.package_id);

        toast({
          title: "Success!",
          description: "Package deleted successfully!",
          variant: "default",
        });
        onClose();
      } else {
        toast({
          title: "Error",
          description: "No package selected for deletion!",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting package:", error);

      toast({
        title: "Error",
        description: "Failed to delete package:!",
        variant: "destructive",
      });
    }
  };

  const isCitySelectedBuf = (cityId) => {
    return formData.bufferTime.some((time) => time.city_id === cityId);
  };

  const isCitySelectedComition = (cityId) => {
    return formData.commitionRate.some((time) => time.city_id === cityId);
  };

  if (mode === "delete") {
    return (
      <div className="space-y-4">
        <p>Are you sure you want to delete this package:?</p>
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
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
      />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Hours</label>
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
          <label className="block text-sm font-medium mb-1">Minutes</label>
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
        <div>
          <label className="block text-sm font-medium mb-1">
            Penalty Percentage
          </label>
          <Input
            placeholder="Penalty Percentage"
            value={formData.penalty_percentage}
            onChange={(e) =>
              setFormData({ ...formData, penalty_percentage: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Advance Percentage
          </label>
          <Input
            placeholder="Advance Percentage"
            value={formData.advance_percentage}
            onChange={(e) =>
              setFormData({ ...formData, advance_percentage: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Package Grace Period
          </label>
          <Input
            placeholder="Grace Period"
            value={formData.grace_period}
            onChange={(e) =>
              setFormData({ ...formData, grace_period: e.target.value })
            }
            required
          />
        </div>
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
      <div>
        <label className="block text-sm font-medium mb-1">Package Icon</label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );
};
