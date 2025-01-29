"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cartService } from "@/api/cartService";
import { AlertCircle, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tipAmount, setTipAmount] = useState(0);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const cartData = await cartService.getCart();
      console.log(cartData);
      setCart(cartData);
      setTipAmount(cartData.BookingPayment?.tip_amount || 0);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId, quantity) => {
    try {
      await cartService.updateCartItem({ itemId, quantity });
      await fetchCart();
      toast({
        title: "Success",
        description: "Cart updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateTip = async () => {
    try {
      await cartService.updateTip(
        tipAmount,
        cart?.BookingPayment?.subtotal,
        cart?.BookingPayment?.tax_amount
      );
      await fetchCart();
      toast({
        title: "Success",
        description: "Tip amount updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCheckout = async () => {
    try {
      await cartService.proceedToCheckout();
      router.push("/payment");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading cart...</div>;
  }

  if (!cart || !cart.BookingItems?.length) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Your cart is empty</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Cart Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.BookingItems.map((item) => (
                <div
                  key={item.item_id}
                  className="flex justify-between items-center p-4 border rounded-lg"
                >
                  <div>
                    <h3 className="font-medium">
                      {item.serviceItem?.name || item.packageItem?.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Unit Price: ₹{item.unit_price}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleUpdateQuantity(
                            item.item_id,
                            Math.max(0, item.quantity - 1)
                          )
                        }
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleUpdateQuantity(item.item_id, item.quantity + 1)
                        }
                      >
                        +
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUpdateQuantity(item.item_id, 0)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{cart?.BookingPayment?.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (18%)</span>
                  <span>₹{cart.BookingPayment?.tax_amount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={tipAmount}
                    onChange={(e) => setTipAmount(e.target.value)}
                    placeholder="Add tip amount"
                  />
                  <Button onClick={handleUpdateTip} variant="outline" size="sm">
                    Update
                  </Button>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>₹{cart.BookingPayment?.total_amount}</span>
                  </div>
                </div>
              </div>

              <Button className="w-full" onClick={handleCheckout}>
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
