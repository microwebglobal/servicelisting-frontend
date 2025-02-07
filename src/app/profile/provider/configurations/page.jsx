"use client";
import React, { useEffect, useState } from "react";
import { providerAPI } from "@api/provider";

const page = () => {
  const [availabilityHours, setAvailabilityHours] = useState({
    monday: {
      start: "09:00",
      end: "18:00",
      isOpen: false,
    },
    tuesday: {
      start: "09:00",
      end: "18:00",
      isOpen: false,
    },
    wednesday: {
      start: "09:00",
      end: "18:00",
      isOpen: false,
    },
    thursday: {
      start: "09:00",
      end: "18:00",
      isOpen: false,
    },
    friday: {
      start: "09:00",
      end: "18:00",
      isOpen: false,
    },
    saturday: {
      start: "09:00",
      end: "18:00",
      isOpen: false,
    },
    sunday: {
      start: "09:00",
      end: "18:00",
      isOpen: false,
    },
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const fetchProviderData = async () => {
      try {
        const response = await providerAPI.getProviderByUserId(user.uId);
        setAvailabilityHours(response?.data?.availability_hours);
        console.log(response.data);
      } catch (error) {
        console.error("An error occurred while fetching data:", error);
      }
    };

    fetchProviderData();
  }, []);

  const handleEditAvailability = (day, field, value) => {
    setAvailabilityHours((prev) => {
      const updatedDay = {
        ...prev[day],
        [field]: value,
      };

      if (field === "isOpen" && value === false) {
        updatedDay.start = "00:00";
        updatedDay.end = "00:00";
      }

      return {
        ...prev,
        [day]: updatedDay,
      };
    });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl ml-10 font-bold ">Availability Hours</h1>

      <div className=" m-10 bg-gray-100 p-6 rounded-md shadow-md">
        <ul className="space-y-6">
          {Object.entries(availabilityHours).map(
            ([day, { start, end, isOpen }]) => (
              <li key={day} className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <strong className="text-lg text-gray-800">
                      {day.charAt(0).toUpperCase() + day.slice(1)}:{" "}
                      <span
                        className={isOpen ? "text-green-600" : "text-red-600"}
                      >
                        {isOpen
                          ? `${start || "00:00"} - ${end || "00:00"}`
                          : "Closed"}
                      </span>
                    </strong>
                  </div>
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-md font-semibold text-sm ${
                      isOpen
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                    onClick={() =>
                      handleEditAvailability(day, "isOpen", !isOpen)
                    }
                  >
                    {isOpen ? "Mark as Closed" : "Mark as Open"}
                  </button>
                </div>
                {isOpen && (
                  <div className="flex items-center gap-6">
                    <label className="flex flex-col text-sm font-medium text-gray-600">
                      Start Time:
                      <input
                        type="time"
                        value={start}
                        onChange={(e) =>
                          handleEditAvailability(day, "start", e.target.value)
                        }
                        className="mt-1 px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </label>
                    <label className="flex flex-col text-sm font-medium text-gray-600">
                      End Time:
                      <input
                        type="time"
                        value={end}
                        onChange={(e) =>
                          handleEditAvailability(day, "end", e.target.value)
                        }
                        className="mt-1 px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </label>
                  </div>
                )}
                <hr className="border-t border-gray-300" />
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
};

export default page;
