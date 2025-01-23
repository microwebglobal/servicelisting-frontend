"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { profileAPI } from "@/api/profile";
import Modal from "react-modal";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { toast } from "@hooks/use-toast";
import withAuth from "@components/isAuth";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "@src/context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function CustomerProfile() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    mobile: "",
    gender: "",
    dob: "",
    photo: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    type: "home",
    street: "",
    city: "",
    state: "",
    country: "",
    postal_code: "",
    lat: "",
    long: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const { logout } = useAuth();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
  });

  useEffect(() => {
    fetchUserProfile();
    fetchAddresses();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await profileAPI.getProfileByUserId(user.uId);
      console.log(response);
      setUserData(response.data);
      setIsDialogOpen(!response.data.email_verified && response.data.email);
      setIsLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load profile!",
        variant: "destructive",
      });

      if (error.response?.status === 401) {
        router.push("/login/user");
      }
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await profileAPI.getAddresses();
      setAddresses(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load addresses!",
        variant: "destructive",
      });
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await profileAPI.updateProfile(userData, user.uId);
      setIsEditing(false);
      toast({
        title: "Success!",
        description: "Profile updated successfully!",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile!",
        variant: "destructive",
      });
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    try {
      await profileAPI.uploadProfilePhoto(file);
      fetchUserProfile();

      toast({
        title: "Success!",
        description: "Photo uploaded successfully!",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload photo!",
        variant: "destructive",
      });
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await profileAPI.addAddress(newAddress);
      setIsAddressModalOpen(false);
      fetchAddresses();
      toast({
        title: "Success!",
        description: "Address added successfully!",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add address!",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  const handleEmailValidate = async () => {
    try {
      await profileAPI.sendEmailValidation(user.uId);
      setIsDialogOpen(false);
      setIsEmailSent(true);
      toast({
        title: "Success!",
        description: "Verification email sent successfully!",
        variant: "default",
      });
    } catch (error) {
      console.error;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-full md:w-1/4 bg-white p-4 border-r">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <Image
              src={userData.photo || "/assets/images/def_pro.webp"}
              alt={userData.name}
              width={100}
              height={100}
              className="rounded-full"
            />
            <label className="absolute bottom-0 right-0 bg-blue-500 p-1 rounded-full cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handlePhotoUpload}
              />
              <span className="text-white text-xs">Edit</span>
            </label>
          </div>
          <h2 className="text-xl font-bold">{userData.name}</h2>
        </div>

        {/* Profile Information */}
        <div className="mt-8">
          {isEditing ? (
            <form onSubmit={handleProfileUpdate}>
              <div className="space-y-4">
                <input
                  type="text"
                  value={userData.name}
                  onChange={(e) =>
                    setUserData({ ...userData, name: e.target.value })
                  }
                  placeholder="Name"
                  className="w-full p-2 border rounded"
                />
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                  placeholder="Email"
                  className="w-full p-2 border rounded"
                />
                <select
                  value={userData.gender}
                  onChange={(e) =>
                    setUserData({ ...userData, gender: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <input
                  type="date"
                  value={userData.dob}
                  onChange={(e) =>
                    setUserData({ ...userData, dob: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <span className="font-bold">Name:</span> {userData.name}
              </div>
              <div className="flex gap">
                <span className="font-bold">Email:</span> {userData.email}
                <span
                  className={`ml-2 ${
                    userData.email_verified ? "text-green-500" : "text-red-500"
                  }`}
                  title={
                    userData.email_verified
                      ? "Email verified"
                      : "Email not verified"
                  }
                >
                  {userData.email_verified ? (
                    <CheckCircle className="w-4 h-4 mr-2 mt-1.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 mr-3 mt-1.5" />
                  )}
                </span>
              </div>

              <div>
                <span className="font-bold">Mobile:</span> {userData.mobile}
              </div>
              <div>
                <span className="font-bold">Gender:</span>{" "}
                {userData.gender || "Not set"}
              </div>
              <div>
                <span className="font-bold">Date of Birth:</span>{" "}
                {userData.dob || "Not set"}
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded w-full"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>

        {/* Addresses Section */}
        <div className="mt-8">
          <h3 className="font-bold mb-4">Your Addresses</h3>
          <div className="space-y-4">
            {addresses.map((address) => (
              <div key={address.id} className="border p-2 rounded">
                <div className="font-bold">{address.type}</div>
                <div>{address.street}</div>
                <div>
                  {address.city}, {address.state}
                </div>
                <div>{address.postal_code}</div>
              </div>
            ))}
            <button
              onClick={() => setIsAddressModalOpen(true)}
              className="bg-green-500 text-white px-4 py-2 rounded w-full"
            >
              Add New Address
            </button>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-2 mt-8 rounded"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
        {/* Add your main content here */}
        <div>
          {!(userData.email || userData.gender || userData.dob) && (
            <div className="text-yellow-800 bg-yellow-100 border border-yellow-300 p-4 rounded-md text-sm font-semibold mt-20">
              Set required data to complete your profile
            </div>
          )}
        </div>
      </main>

      {/* Address Modal */}
      <Modal
        isOpen={isAddressModalOpen}
        onRequestClose={() => setIsAddressModalOpen(false)}
        className="m-10 bg-white p-8 rounded-xl shadow-xl w-2/4"
        overlayClassName="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50"
      >
        <h2 className="text-2xl font-bold mb-4">Add New Address</h2>
        <form onSubmit={handleAddAddress} className="space-y-4">
          <select
            value={newAddress.type}
            onChange={(e) =>
              setNewAddress({ ...newAddress, type: e.target.value })
            }
            className="w-full p-2 border rounded"
          >
            <option value="home">Home</option>
            <option value="work">Work</option>
            <option value="other">Other</option>
          </select>
          <input
            type="text"
            value={newAddress.street}
            onChange={(e) =>
              setNewAddress({ ...newAddress, street: e.target.value })
            }
            placeholder="Street Address"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            value={newAddress.city}
            onChange={(e) =>
              setNewAddress({ ...newAddress, city: e.target.value })
            }
            placeholder="City"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            value={newAddress.state}
            onChange={(e) =>
              setNewAddress({ ...newAddress, state: e.target.value })
            }
            placeholder="State"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            value={newAddress.postal_code}
            onChange={(e) =>
              setNewAddress({ ...newAddress, postal_code: e.target.value })
            }
            placeholder="Postal Code"
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save Address
          </button>
        </form>
      </Modal>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your Email Not Verified!</DialogTitle>
          </DialogHeader>
          <div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Please verify your email to complete your profile
              </label>
            </div>
            <div className="flex justify-end space-x-2 mt-5">
              <Button variant="destructive" onClick={handleEmailValidate}>
                Verify Email
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isEmailSent} onOpenChange={setIsEmailSent}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verification Email Sent to Your Email!</DialogTitle>
          </DialogHeader>
          <div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Please check inbox and click verify
              </label>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default withAuth(CustomerProfile, ["customer"]);
