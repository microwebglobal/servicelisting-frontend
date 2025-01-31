import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { profileAPI } from "@/api/profile";
import { toast } from "@/hooks/use-toast";
import { CheckCircle, AlertCircle } from "lucide-react";

const ProfileForm = ({ userData, isEditing, setIsEditing, onUpdate }) => {
  const [formData, setFormData] = React.useState(userData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await profileAPI.updateProfile(formData, userData.u_id);
      onUpdate();
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!isEditing) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">Email</p>
            <div className="flex items-center">
              <p className="text-sm text-gray-500">{userData.email}</p>
              {userData.email_verified ? (
                <CheckCircle className="ml-2 h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="ml-2 h-4 w-4 text-amber-500" />
              )}
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Mobile</p>
          <p className="text-sm text-gray-500">{userData.mobile}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Gender</p>
          <p className="text-sm text-gray-500">{userData.gender || "Not set"}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Date of Birth</p>
          <p className="text-sm text-gray-500">{userData.dob || "Not set"}</p>
        </div>
        <Button onClick={() => setIsEditing(true)} className="w-full">
          Edit Profile
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Name</label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Your name"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Your email"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Gender</label>
        <Select
          value={formData.gender}
          onValueChange={(value) => setFormData({ ...formData, gender: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Date of Birth</label>
        <Input
          type="date"
          value={formData.dob}
          onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="flex-1">Save</Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => setIsEditing(false)}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;