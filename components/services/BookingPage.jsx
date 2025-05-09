import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft } from "lucide-react";
import BookingForm from "../booking/BookingForm";
import { CartPreview } from "../services/CartPreview";
import { cartService } from "@/api/cartService";

export function BookingPage({
  cityName,
  categorySlug,
  subCategorySlug,
  selectedItems = [],
  cityId,
  onBack,
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const formatPrice = (price) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return isNaN(numPrice) ? "0.00" : numPrice.toFixed(2);
  };

  const handleBookingSubmit = async (bookingDetails) => {
    try {
      if (!selectedItems.length) {
        toast({
          title: "Error",
          description: "Please select at least one service",
          variant: "destructive",
        });
        return;
      }

      if (!cityId) {
        toast({
          title: "Error",
          description: "City ID is required",
          variant: "destructive",
        });
        return;
      }

      setLoading(true);

      const cartData = {
        cityId: cityId,
        items: selectedItems.map((item) => ({
          id: item.id,
          duration_hours: item.duration_hours,
          duration_minutes: item.duration_minutes,
          type: item.type,
          quantity: item.quantity || 1,
        })),
        bookingDate: format(bookingDetails.bookingDate, "yyyy-MM-dd"),
        startTime: bookingDetails.startTime,
        serviceAddress: bookingDetails.serviceAddress,
        serviceLocation: bookingDetails.serviceLocation,
        customerNotes: bookingDetails.customerNotes || "",
      };

      await cartService.addToCart(cartData);
      router.push("/cart");
    } catch (error) {
      console.error("Booking error:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = selectedItems.reduce((sum, item) => {
    const price =
      typeof item.price === "string" ? parseFloat(item.price) : item.price;
    const quantity = item.quantity || 1;
    return sum + price * quantity;
  }, 0);

  return (
    <div className="min-h-screen p-5 sm:p-8">
      <div className="max-w-lg w-full mx-auto">
        <Button
          variant="ghost"
          className="mb-4 p-0 hover:bg-transparent hover:text-[#5f60b9]"
          onClick={onBack}
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Services
        </Button>

        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8"> */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Selected Services</CardTitle>
            </CardHeader>

            <CardContent className="px-6">
              <div className="space-y-4">
                {selectedItems.map((item) => (
                  <div
                    key={`${item.id}-${item.type}`}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <span className="font-medium">{item.name}</span>
                      {item.quantity > 1 && (
                        <span className="text-sm text-gray-500 ml-2">
                          x{item.quantity}
                        </span>
                      )}
                    </div>
                    <span className="font-semibold">
                      ₹{formatPrice(item.price)}
                    </span>
                  </div>
                ))}

                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span className="text-[#5f60b9]">Total Amount</span>
                    <span>₹{formatPrice(totalAmount)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8">
            <BookingForm
              onBookingSubmit={handleBookingSubmit}
              city={cityName}
              selectedItems={selectedItems}
              loading={loading}
            />
          </div>
        </div>

        {/* <div>
            <CartPreview
              items={selectedItems}
              loading={loading}
              totalAmount={totalAmount}
            />
          </div> */}
      </div>
      {/* </div> */}
    </div>
  );
}

export default BookingPage;
