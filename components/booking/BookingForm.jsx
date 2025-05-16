import React, { useState, useEffect, useCallback } from "react";
import CreatableSelect from "react-select/creatable";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock, MapPin, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { profileAPI } from "@/api/profile";
import { cartService } from "@/api/cartService";
import { debounce } from "lodash";

const BookingForm = ({ onBookingSubmit, city, selectedItems }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedAddresses, setSavedAddress] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    bookingDate: null,
    startTime: "",
    serviceAddress: "",
    coordinates: {
      type: "Point",
      coordinates: [0, 0],
    },
    customerNotes: "",
  });
  const [validationError, setValidationError] = useState("");

  const fetchAvailableTimeSlots = useCallback(
    async (date) => {
      if (
        !date ||
        !selectedItems?.length ||
        !selectedItems.every(
          (item) =>
            item.id && ["service_item", "package_item"].includes(item.type)
        )
      ) {
        console.log("Invalid input:", { date, selectedItems });
        setAvailableTimeSlots([]);
        setBookingDetails((prev) => ({ ...prev, startTime: "" }));
        return;
      }

      setIsLoadingSlots(true);
      try {
        const dateStr = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

        const data = {
          items: selectedItems.map((item) => ({
            item_id: item.id,
            type: item.type,
          })),
          date: dateStr,
        };

        console.log("Sending request to /api/booking/availability:", data);
        const response = await cartService.getAvailableTimeSlotes(data);
        console.log("Raw response:", response);

        const responseData = response.data?.data || response.data || response;

        if (Array.isArray(responseData)) {
          const availableSlots = responseData
            .filter((slot) => slot.status === "available")
            .map((slot) => slot.time);
          console.log("Available slots:", availableSlots);
          setAvailableTimeSlots(availableSlots);

          if (!availableSlots.includes(bookingDetails.startTime)) {
            setBookingDetails((prev) => ({ ...prev, startTime: "" }));
          }
        } else if (responseData && Array.isArray(responseData.slots)) {
          const availableSlots = responseData.slots
            .filter((slot) => slot.status === "available")
            .map((slot) => slot.time);
          console.log("Available slots:", availableSlots);
          setAvailableTimeSlots(availableSlots);

          if (!availableSlots.includes(bookingDetails.startTime)) {
            setBookingDetails((prev) => ({ ...prev, startTime: "" }));
          }
        } else {
          throw new Error(
            responseData.message ||
              responseData.error ||
              "Invalid response format - expected array of slots"
          );
        }
      } catch (error) {
        console.error("Error fetching time slots:", error);
        toast({
          title: "Error",
          description:
            error.message ||
            "Failed to fetch available time slots. Please try again.",
          variant: "destructive",
        });
        setAvailableTimeSlots([]);
        setBookingDetails((prev) => ({ ...prev, startTime: "" }));
      } finally {
        setIsLoadingSlots(false);
      }
    },
    [selectedItems, bookingDetails.startTime, toast]
  );

  const debouncedFetch = useCallback(debounce(fetchAvailableTimeSlots, 300), [
    fetchAvailableTimeSlots,
  ]);

  const handleInputChange = (field, value) => {
    setBookingDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
    setValidationError("");

    if (field === "bookingDate" && value) {
      debouncedFetch(value);
    }
  };

  useEffect(() => {
    const fetchUserAddresses = async () => {
      try {
        const response = await profileAPI.getAddressBelongsToCity(city);
        setSavedAddress(response.data);
        console.log("Addresses:", response.data);
      } catch (error) {
        console.error("Error fetching user addresses:", error);
      }
    };

    fetchUserAddresses();
  }, [city]);

  const addressOptions = savedAddresses.map((addr) => ({
    label: (
      <div>
        <span className="font-semibold capitalize">{addr.type}</span>
        <br />
        <span className="text-gray-500">
          {addr.line1},{addr.line2},{addr.city}, {addr.state} {addr.postal_code}
        </span>
      </div>
    ),
    value: `${addr.line1}, ${addr.line2 ? addr.line2 + ", " : ""}${
      addr.city
    }, ${addr.state} ${addr.postal_code}`,
  }));

  const handleAddressChange = async (selectedOption) => {
    try {
      const address = selectedOption ? selectedOption.value : "";
      handleInputChange("serviceAddress", address);

      const dummyCoordinates = {
        type: "Point",
        coordinates: [0, 0],
      };
      handleInputChange("coordinates", dummyCoordinates);
    } catch (error) {
      console.error("Geocoding error:", error);
      toast({
        title: "Location Error",
        description: "Failed to get location coordinates. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bookingDetails.startTime) {
      setValidationError("Please select a time slot");
      return;
    }
    if (!bookingDetails.serviceAddress.trim()) {
      setValidationError("Please enter service address");
      return;
    }

    try {
      setIsSubmitting(true);
      await onBookingSubmit({
        ...bookingDetails,
        serviceLocation: bookingDetails.coordinates,
      });
    } catch (error) {
      console.error("Booking error:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to process your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Schedule Your Service
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 px-6 pb-6">
          <div className="space-y-4">
            <div className="rounded-md bg-muted/50 border flex justify-center p-2">
              <Calendar
                mode="single"
                selected={bookingDetails.bookingDate}
                onSelect={(date) => handleInputChange("bookingDate", date)}
                disabled={(date) => date < new Date()}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Select Time Slot</label>
              <Select
                onValueChange={(value) => handleInputChange("startTime", value)}
                value={bookingDetails.startTime}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a time" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingSlots ? (
                    <SelectItem value="loading" disabled>
                      Loading...
                    </SelectItem>
                  ) : availableTimeSlots.length > 0 ? (
                    availableTimeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No available slots
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Service Address
              </label>

              <CreatableSelect
                options={addressOptions}
                onChange={handleAddressChange}
                placeholder="Select or enter an address"
                isClearable
                formatCreateLabel={(inputValue) => `Use "${inputValue}"`}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Special Instructions
              </label>

              <Textarea
                placeholder="Any special instructions for the service provider..."
                value={bookingDetails.customerNotes}
                onChange={(e) =>
                  handleInputChange("customerNotes", e.target.value)
                }
                rows={3}
              />
            </div>
          </div>

          {validationError && (
            <Alert variant="destructive">
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Confirm Booking"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};

export default BookingForm;
