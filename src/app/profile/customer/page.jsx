"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Modal from "react-modal";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import AddNewAdres from "@components/AddNewAdres";

export default function ProfilePage() {
  const [userData, setUserData] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [addAddres, setAddAddres] = useState(false);
  const [allAdress, setAllAdress] = useState([]);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyCJtNNLCh343h9T1vBlno_a-6wrfSm_DMc",
  });

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const uId = localStorage.getItem("uId");

      const response = await axios.get(
        `http://localhost:8080/api/users/${uId}`
      );
      setUserData(response.data);
      console.log(response.data);
    };
    fetchUserData();
  }, []);

  const fetchUserAddress = async () => {
    const uId = localStorage.getItem("uId");
    try {
      const response = await axios.get(
        `http://localhost:8080/api/adress//user/${uId}`
      );
      setAllAdress(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const displayAddres = () => {
    openModal();
    fetchUserAddress();
  };

  if (loadError) {
    return <div>Error loading Google Maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  const handleAddNewAddres = () => {
    setAddAddres(true);
    console.log(addAddres);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-full md:w-1/4 bg-white p-4 border-r">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4">
            <Image
              src="/assets/images/def_pro.webp"
              alt="John Doe"
              width={100}
              height={100}
              className="rounded-full"
            />
          </div>
          <h2 className="text-xl font-bold">{userData.name}</h2>
          <p className="text-black bg-yellow-400 p-1 rounded-2xl w-40 text-sm mx-auto">
            Premium Plus User
          </p>
        </div>
        <hr className="mt-5" />
        <div className="mt-5">
          <h3 className="text-lg bg-slate-300 rounded-lg px-4 py-1 font-semibold mb-2">
            Your Information
          </h3>
          <ul className="space-y-4 ml-5">
            <li className="flex flex-col">
              <span className="font-bold">Name</span>
              <span>{userData.name}</span>
            </li>
            <li className="flex flex-col">
              <span className="font-bold">Email</span>
              <span>{userData.email}</span>
            </li>
            <li className="flex flex-col">
              <span className="font-bold">Contact Number</span>
              <span>{userData.mobile}</span>
            </li>
            <li className="flex justify-between" onClick={displayAddres}>
              <span className="font-bold">Locations</span>
              <span>&gt;</span>
            </li>
          </ul>

          <div className="mt-8">
            <h3 className="text-lg bg-slate-300 rounded-lg px-4 py-1 font-semibold mb-2">
              General
            </h3>
            <ul className="space-y-4 ml-5">
              <li className="justify-between flex">
                <span>App Language</span>
                <span>&gt;</span>
              </li>
              <li className="justify-between flex">
                <span>Notifications</span>
                <span>&gt;</span>
              </li>
              <li className="justify-between flex">
                <span>Support</span>
                <span>&gt;</span>
              </li>
              <li className="justify-between flex">
                <span>Rate Us</span>
                <span>&gt;</span>
              </li>
            </ul>
          </div>

          <div className="mt-8">
            <h3 className="text-lg bg-slate-300 rounded-lg px-4 py-1 font-semibold mb-2">
              About App
            </h3>
            <ul className="space-y-4 ml-5">
              <li>Privacy Policy</li>
              <li>Terms & Conditions</li>
              <li>About</li>
            </ul>
          </div>

          <button className="w-full bg-red-500 text-white py-2 mt-6 rounded-md">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <h1 className="text-2xl font-bold mb-6 bg-white p-5">
          <span>&lt;</span> Your Profile
        </h1>

        <div className="flex flex-col gap-6 p-6">
          {/* Promo Cards */}
          <div className="bg-purple-100 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">
              Get 100% Cashback On Your First Month Of [App Name] Premium!
            </h3>
            <button className="bg-purple-500 text-white px-4 py-2 rounded-md">
              Check It Out
            </button>
          </div>

          <div className="bg-blue-100 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">
              Level Up Your [App Name] Experience With Premium!
            </h3>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
              See Prices
            </button>
          </div>

          <div className="bg-green-100 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">
              Get 100% Cashback On Your First Month Of [App Name] Premium!
            </h3>
            <button className="bg-green-500 text-white px-4 py-2 rounded-md">
              Check It Out
            </button>
          </div>

          <div className="bg-orange-100 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">
              Level Up Your [App Name] Experience With Premium!
            </h3>
            <button className="bg-orange-500 text-white px-4 py-2 rounded-md">
              See Prices
            </button>
          </div>
        </div>

        <Modal
          isOpen={isOpen}
          onRequestClose={closeModal}
          contentLabel="Example Modal"
          className="m-10 bg-white p-8 rounded-xl shadow-xl transform transition-all duration-300 ease-in-out w-2/4"
          overlayClassName="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50"
        >
          {!addAddres ? (
            <div
              className="w-full"
              style={{
                maxHeight: "80vh",
                overflowY: "auto",
              }}
            >
              <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
                Your Locations
              </h2>
              {allAdress
                .sort((a) => (a.address_type === "primary" ? -1 : 1))
                .map((addr, index) => (
                  <div key={index}>
                    <h3 className="text-lg bg-slate-200 text-gray-700 rounded-lg px-6 py-2 font-semibold mb-4 mt-10">
                      {addr.address_type} Address
                    </h3>
                    <div className="flex justify-between">
                      <ul className="space-y-6 ml-5 flex-1">
                        <li className="flex flex-col space-y-2">
                          <span className="font-semibold text-gray-600">
                            Street
                          </span>
                          <span className="text-gray-800">{addr.street}</span>
                        </li>
                        <li className="flex flex-col space-y-2">
                          <span className="font-semibold text-gray-600">
                            City
                          </span>
                          <span className="text-gray-800">{addr.city}</span>
                        </li>
                        <li className="flex flex-col space-y-2">
                          <span className="font-semibold text-gray-600">
                            Country
                          </span>
                          <span className="text-gray-800">{addr.country}</span>
                        </li>
                        <li className="flex flex-col space-y-2">
                          <span className="font-semibold text-gray-600">
                            State
                          </span>
                          <span className="text-gray-800">{addr.state}</span>
                        </li>
                        <li className="flex flex-col space-y-2">
                          <span className="font-semibold text-gray-600">
                            Postal Code
                          </span>
                          <span className="text-gray-800">
                            {addr.postal_code}
                          </span>
                        </li>
                      </ul>
                      <div className="w-full rounded-lg overflow-hidden flex-1 ml-5">
                        <GoogleMap
                          mapContainerStyle={{
                            width: "100%",
                            height: "100%",
                            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                          }}
                          center={{
                            lat: parseFloat(addr.lat),
                            lng: parseFloat(addr.long),
                          }}
                          zoom={14}
                        >
                          <Marker
                            position={{
                              lat: parseFloat(addr.lat),
                              lng: parseFloat(addr.long),
                            }}
                          />
                        </GoogleMap>
                      </div>
                    </div>
                  </div>
                ))}

              <div className="flex justify-center mt-6">
                <button
                  onClick={closeModal}
                  className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 ease-in-out mx-5"
                >
                  Close
                </button>
                <button
                  onClick={handleAddNewAddres}
                  className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 ease-in-out"
                >
                  Add New Address
                </button>
              </div>
            </div>
          ) : (
            <AddNewAdres />
          )}
        </Modal>
      </main>
    </div>
  );
}
