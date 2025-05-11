"use client";
import React, { useEffect, useState } from "react";
import { providerAPI } from "@api/provider";
import { Button } from "@/components/ui/button";
import { toast } from "@hooks/use-toast";
import { Edit, Save } from "lucide-react";

const page = () => {
  const [provider, setProvider] = useState();
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
    setProvider(user);
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

  const handleUpdate = async () => {
    try {
      await providerAPI.updateProviderAvailability(
        provider?.providerId,
        availabilityHours
      );
      toast({
        title: "Success!",
        description: "Sucessfully Updated Availble hours",
        variant: "default",
      });
    } catch (error) {
      console.error("Error updating avilability", error);
      toast({
        title: "Error",
        description: "Error updating avilability",
        variant: "destructive",
      });
    }
  };

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
      <h1 className="text-2xl ml-10 font-bold ">Availability Hours</h1>

      <div className=" m-10 bg-white p-6 rounded-md border">
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

                  <Button
                    size="sm"
                    variant="secondary"
                    type="button"
                    className={`${
                      isOpen
                        ? "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                        : "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                    }`}
                    onClick={() =>
                      handleEditAvailability(day, "isOpen", !isOpen)
                    }
                  >
                    {isOpen ? (
                      <>
                        <Edit /> Mark as Closed
                      </>
                    ) : (
                      <>
                        <Edit /> Mark as Open
                      </>
                    )}
                  </Button>
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

        <Button
          className="bg-[#5f60b9] mt-5 hover:bg-[#5f60b9]/80"
          onClick={handleUpdate}
        >
          <Save />
          Update Avilability
        </Button>
      </div>
    </div>
  );
};

export default page;
