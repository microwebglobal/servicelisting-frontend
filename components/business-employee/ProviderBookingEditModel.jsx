"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { serviceAPI } from "@/api/services";
import { providerAPI } from "@/api/provider";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { motion, AnimatePresence } from "framer-motion";
import { Label } from "../ui/label";
import { io } from "socket.io-client";

const ProviderBookingEditModel = ({ booking, onConfirm, onClose }) => {
  const [category, setCategory] = useState(null);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [preCheckedItems, setPreCheckedItems] = useState(new Set());
  const [step, setStep] = useState("edit");
  const [otp, setOtp] = useState("");
  const [showCustomItemForm, setShowCustomItemForm] = useState(false);
  const [customItemName, setCustomItemName] = useState("");
  const [customItemPrice, setCustomItemPrice] = useState("");
  const [customItems, setCustomItems] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        if (booking?.itemHierarchicalRel?.length > 0) {
          const categoryId = booking.itemHierarchicalRel[0].categoryId;
          const cityId = booking?.city_id;
          if (categoryId) {
            const response = await serviceAPI.getCategoryById(
              categoryId,
              cityId
            );
            setCategory(response.data);

            if (booking?.BookingItems?.length > 0) {
              setPreCheckedItems(
                new Set(booking.BookingItems.map((item) => item.item_id))
              );
            }
          }
        }
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    };
    fetchCategory();
  }, [booking]);

  const handleItemToggle = (item) => {
    setSelectedItems((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(item)) {
        newSelected.delete(item);
      } else if (!preCheckedItems.has(item.item_id)) {
        newSelected.add(item);
      }
      return newSelected;
    });
  };

  useEffect(() => {
    // Initialize Socket.IO connection when component mounts
    const newSocket = io(
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
      {
        path: "/socket.io/",
        withCredentials: true,
        transports: ["websocket", "polling"],
      }
    );

    setSocket(newSocket);

    // Clean up on unmount
    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, []);

  const handleAddCustomItem = () => {
    if (customItemName && customItemPrice) {
      const newItem = {
        item_id: `custom-${Date.now()}`,
        name: customItemName,
        base_price: parseFloat(customItemPrice),
        isCustom: true,
      };

      setCustomItems([...customItems, newItem]);
      setSelectedItems(new Set([...selectedItems, newItem]));
      setCustomItemName("");
      setCustomItemPrice("");
      setShowCustomItemForm(false);
    }
  };

  const handleConfirmEdit = async () => {
    try {
      await providerAPI.sendBookingEditOtp({
        mobile: booking?.customer?.mobile,
        bookingId: booking?.booking_id,
        userId: booking?.user_id,
        addOns: Array.from(selectedItems).map((item) => ({
          item_id: item.item_id,
          name: item.name,
          base_price:
            item.CitySpecificPr || item.SpecialPricing || item.base_price,
        })),
      });
      setStep("otp");

      // Join the booking room
      if (socket) {
        socket.emit("join-booking", booking.user_id);
      }
    } catch (error) {
      console.error("Error sending OTP", error);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await providerAPI.bookingEditVerify({
        bookingId: booking?.booking_id,
        addOns: Array.from(selectedItems).map((item) => ({
          item_id: item.item_id,
          name: item.name,
          base_price:
            item.base_price || item.SpecialPricing || item.CitySpecificPr,
        })),
        otp,
      });
      setStep("success");
    } catch (error) {
      console.error("Error verifying OTP", error);
    }
  };

  return (
    <DialogContent className="max-w-6xl p-12 bg-white rounded-2xl shadow-2xl border border-gray-200">
      <DialogHeader>
        <DialogTitle className="text-4xl font-bold text-gray-900">
          Add New Service Items
        </DialogTitle>
      </DialogHeader>

      <AnimatePresence mode="wait">
        {step === "edit" && (
          <motion.div
            key="edit"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
            className="space-y-10"
          >
            <div className="flex justify-between items-center">
              {category ? (
                <div className="p-6 bg-white rounded-lg shadow-md border border-gray-300 hover:shadow-lg transition-shadow">
                  <h2 className="text-xl font-semibold text-gray-700">
                    Category
                  </h2>
                  <p className="text-md text-gray-600">
                    {category.category_id}: {category.name}
                  </p>
                </div>
              ) : (
                <p className="text-gray-600">Loading category...</p>
              )}

              <Button
                onClick={() => setShowCustomItemForm(!showCustomItemForm)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {showCustomItemForm ? "Cancel" : "Add Custom Item"}
              </Button>
            </div>

            {showCustomItemForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="customItemName">Item Name</Label>
                    <Input
                      id="customItemName"
                      value={customItemName}
                      onChange={(e) => setCustomItemName(e.target.value)}
                      placeholder="Enter custom item name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customItemPrice">Price</Label>
                    <Input
                      id="customItemPrice"
                      type="number"
                      value={customItemPrice}
                      onChange={(e) => setCustomItemPrice(e.target.value)}
                      placeholder="Enter price"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleAddCustomItem}
                  disabled={!customItemName || !customItemPrice}
                  className="w-full"
                >
                  Add Item
                </Button>
              </motion.div>
            )}

            {/* Display custom items */}
            {customItems.length > 0 && (
              <div className="p-4 bg-white rounded-lg shadow-md border border-gray-300">
                <h3 className="text-lg font-semibold mb-2">Custom Items</h3>
                {customItems.map((item) => (
                  <label
                    key={item.item_id}
                    className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 p-2 rounded-md transition"
                  >
                    <Checkbox
                      checked={selectedItems.has(item)}
                      onCheckedChange={() => handleItemToggle(item)}
                      className="cursor-pointer"
                    />
                    <span className="text-gray-700">{item.name}</span>
                    <span className="text-lg font-semibold">
                      ₹{item.base_price}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {category?.SubCategories?.map((sub) => (
              <div
                key={sub.sub_category_id}
                className="p-4 bg-gray-100 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <p className="text-lg font-semibold text-gray-800">
                  {sub.name}
                </p>
                {sub.ServiceTypes?.map((type) => (
                  <div
                    key={type.type_id}
                    className="p-4 bg-white rounded-lg shadow-md border border-gray-300 hover:shadow-lg transition-shadow mt-2"
                  >
                    <p className="text-md font-medium text-gray-700">
                      {type.name}
                    </p>
                    {type.Services?.map((service) => (
                      <div key={service.service_id} className="ml-4 mt-5">
                        <p className="text-sm font-medium text-white p-1 pl-2 rounded-md bg-black">
                          {service.name}
                        </p>
                        {service.ServiceItems?.map((item) => (
                          <label
                            key={item.item_id}
                            className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 p-2 rounded-md transition"
                          >
                            <Checkbox
                              checked={selectedItems.has(item)}
                              onCheckedChange={() => handleItemToggle(item)}
                              disabled={preCheckedItems.has(item.item_id)}
                              className="cursor-pointer"
                            />
                            <span className="text-gray-700">{item.name}</span>
                            {item.SpecialPricing && item.CitySpecificPr ? (
                              <>
                                <span className="text-lg font-semibold">
                                  ₹{item.SpecialPricing}
                                </span>
                                <span className="text-sm text-gray-500 line-through">
                                  {item.CitySpecificPr}
                                </span>
                              </>
                            ) : (
                              <span className="text-lg font-semibold">
                                ₹{item.base_price}
                              </span>
                            )}
                          </label>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
            <Button
              className="w-full py-3 rounded-lg hover:bg-gray-700 hover:shadow-lg transition"
              onClick={handleConfirmEdit}
            >
              Confirm
            </Button>
          </motion.div>
        )}

        {step === "otp" && (
          <motion.div
            key="otp"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
            className="p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <p className="text-lg font-semibold text-gray-700">Enter OTP</p>
            <Input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="mt-2"
            />
            <Button
              className="w-full bg-green-600 text-white mt-4 py-3 rounded-lg hover:bg-green-700 hover:shadow-lg transition"
              onClick={handleVerifyOtp}
            >
              Verify OTP
            </Button>
          </motion.div>
        )}

        {step === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="p-6 bg-green-100 text-green-700 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <p className="text-lg font-semibold">
              Successfully added {selectedItems.size} items to your booking!
            </p>
            <Button
              className="w-full mt-4 py-3 text-white rounded-lg transition"
              onClick={onClose}
            >
              Close
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </DialogContent>
  );
};

export default ProviderBookingEditModel;
