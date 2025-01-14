import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft } from 'lucide-react';
import BookingForm from '../booking/BookingForm';
import {CartPreview} from '../services/CartPreview';
import { serviceAPI } from '@/api/services';

export function BookingPage({
  cityName,
  categorySlug,
  subCategorySlug,
  selectedItems = [],
  cityId,
  onBack
}) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Function to safely convert price to number and format it
  const formatPrice = (price) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  };

  const handleBookingSubmit = async (bookingDetails) => {
    try {
      setLoading(true);
      const response = await serviceAPI.addToCart({
        cityId: cityId,
        items: selectedItems.map(item => ({
          itemId: item.id,
          itemType: item.type,
          quantity: item.quantity || 1
        })),
        bookingDate: bookingDetails.bookingDate,
        startTime: bookingDetails.startTime,
        serviceAddress: '', // This should be collected from user
        serviceLocation: '', // This should be collected from user
        customerNotes: ''
      });

      setCart(response.data);
      router.push(`/cart`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate total amount
  const totalAmount = selectedItems.reduce((sum, item) => {
    const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
    const quantity = item.quantity || 1;
    return sum + (price * quantity);
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <Button variant="ghost" className="mb-4" onClick={onBack}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Services
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Selected Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedItems.map((item) => (
                    <div key={`${item.id}-${item.type}`} className="flex justify-between items-center">
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
                    <div className="flex justify-between items-center font-bold">
                      <span>Total Amount</span>
                      <span>₹{formatPrice(totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-8">
              <BookingForm onBookingSubmit={handleBookingSubmit} />
            </div>
          </div>

          <div>
            <CartPreview 
              items={selectedItems}
              loading={loading}
              totalAmount={totalAmount}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;