"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {profileAPI} from "@/api/profile";
import Modal from "react-modal";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { toast } from "react-hot-toast";

export default function CustomerProfile() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    mobile: "",
    gender: "",
    dob: "",
    photo: null
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
    long: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY
  });

  useEffect(() => {
    fetchUserProfile();
    fetchAddresses();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await profileAPI.getUserProfile();
      setUserData(response.data);
      setIsLoading(false);
    } catch (error) {
      toast.error("Failed to load profile");
      if (error.response?.status === 401) {
        router.push('/login/user');
      }
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await profileAPI.getAddresses();
      setAddresses(response.data);
    } catch (error) {
      toast.error("Failed to load addresses");
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await profileAPI.updateUserProfile(userData);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    try {
      await profileAPI.uploadProfilePhoto(file);
      fetchUserProfile();
      toast.success("Photo uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload photo");
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await profileAPI.addAddress(newAddress);
      setIsAddressModalOpen(false);
      fetchAddresses();
      toast.success("Address added successfully");
    } catch (error) {
      toast.error("Failed to add address");
    }
  };

  const handleLogout = () => {
    // Clear auth token and redirect to login
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    router.push('/login/user');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
                  onChange={(e) => setUserData({...userData, name: e.target.value})}
                  placeholder="Name"
                  className="w-full p-2 border rounded"
                />
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({...userData, email: e.target.value})}
                  placeholder="Email"
                  className="w-full p-2 border rounded"
                />
                <select
                  value={userData.gender}
                  onChange={(e) => setUserData({...userData, gender: e.target.value})}
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
                  onChange={(e) => setUserData({...userData, dob: e.target.value})}
                  className="w-full p-2 border rounded"
                />
                <div className="flex gap-2">
                  <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
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
              <div>
                <span className="font-bold">Email:</span> {userData.email}
              </div>
              <div>
                <span className="font-bold">Mobile:</span> {userData.mobile}
              </div>
              <div>
                <span className="font-bold">Gender:</span> {userData.gender || 'Not set'}
              </div>
              <div>
                <span className="font-bold">Date of Birth:</span> {userData.dob || 'Not set'}
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
                <div>{address.city}, {address.state}</div>
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
            onChange={(e) => setNewAddress({...newAddress, type: e.target.value})}
            className="w-full p-2 border rounded"
          >
            <option value="home">Home</option>
            <option value="work">Work</option>
            <option value="other">Other</option>
          </select>
          <input
            type="text"
            value={newAddress.street}
            onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
            placeholder="Street Address"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            value={newAddress.city}
            onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
            placeholder="City"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            value={newAddress.state}
            onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
            placeholder="State"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            value={newAddress.postal_code}
            onChange={(e) => setNewAddress({...newAddress, postal_code: e.target.value})}
            placeholder="Postal Code"
            className="w-full p-2 border rounded"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Save Address
          </button>
        </form>
      </Modal>
    </div>
  );
}