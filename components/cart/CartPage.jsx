import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { serviceAPI } from '@/api/services';

const TIP_PERCENTAGES = [5, 10, 15, 20];

export function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tipPercentage, setTipPercentage] = useState(0);
  const [customTip, setCustomTip] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await serviceAPI.getCart();
      setCart(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load cart details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTipChange = async (percentage) => {
    try {
      setTipPercentage(percentage);
      setCustomTip('');
      const tipAmount = (cart.BookingPayment.subtotal * (percentage / 100));
      await updateTip(tipAmount);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update tip.",
        variant: "destructive",
      });
    }
  };

  const handleCustomTipChange = async (value) => {
    setCustomTip(value);
    setTipPercentage(0);
    if (value && !isNaN(value)) {
      await updateTip(parseFloat(value));
    }
  };

  const updateTip = async (tipAmount) => {
    try {
      const response = await serviceAPI.updateTip(tipAmount);
      setCart(prevCart => ({
        ...prevCart,
        BookingPayment: response.data.payment
      }));
    } catch (error) {
      console.error('Error updating tip:', error);
    }
  };

  const handleProceedToPayment = async () => {
    try {
      await serviceAPI.proceedToPayment();
      router.push('/checkout');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to proceed to payment.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading cart...</div>;
  }

  if (!cart) {
    return <div className="text-center py-8">Your cart is empty</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent>
              {cart.BookingItems.map((item) => (
                <div key={item.id} className="flex justify-between py-2">
                  <span>{item.name}</span>
                  <span>₹{item.total_price.toFixed(2)}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add a Tip</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  {TIP_PERCENTAGES.map((percent) => (
                    <Button
                      key={percent}
                      variant={tipPercentage === percent ? "default" : "outline"}
                      onClick={() => handleTipChange(percent)}
                    >
                      {percent}%
                    </Button>
                  ))}
                </div>
                <div>
                  <Input
                    type="number"
                    placeholder="Custom tip amount"
                    value={customTip}
                    onChange={(e) => handleCustomTipChange(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{cart.BookingPayment.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (18%)</span>
                  <span>₹{cart.BookingPayment.tax_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tip</span>
                  <span>₹{cart.BookingPayment.tip_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>₹{cart.BookingPayment.total_amount.toFixed(2)}</span>
                </div>
              </div>

              <Button
                className="w-full mt-6"
                onClick={handleProceedToPayment}
              >
                Proceed to Payment
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default CartPage;