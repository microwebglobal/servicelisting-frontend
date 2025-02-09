'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cartService } from '@/api/cartService';
import { Loader2, Minus, Plus, Trash2 } from 'lucide-react';

const formatCurrency = (value) => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(num) ? '0.00' : num.toFixed(2);
};

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const cartData = await cartService.getCart();
      setCart(cartData);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      setUpdating(true);
      await cartService.updateCartItem({ itemId, quantity });
      await fetchCart();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setUpdating(false);
    }
  };

  const proceedToPayment = async () => {
    try {
      setUpdating(true);
      const response = await cartService.proceedToCheckout();
      if (response?.booking?.booking_id) {
        router.push(`/payment/${response.booking.booking_id}`);
      } else {
        throw new Error('No booking ID received');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!cart?.BookingItems?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Your cart is empty</p>
        <Button onClick={() => router.push('/services')}>
          Browse Services
        </Button>
      </div>
    );
  }

  const payment = cart.BookingPayment || {};

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Shopping Cart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cart.BookingItems.map((item) => (
              <div key={item.item_id} className="flex items-center justify-between p-4 border rounded">
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-500">₹{formatCurrency(item.unit_price)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.item_id, Math.max(0, item.quantity - 1))}
                    disabled={updating}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span>{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.item_id, item.quantity + 1)}
                    disabled={updating}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateQuantity(item.item_id, 0)}
                    disabled={updating}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{formatCurrency(payment.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (18%)</span>
                <span>₹{formatCurrency(payment.tax_amount)}</span>
              </div>
              {payment.tip_amount > 0 && (
                <div className="flex justify-between">
                  <span>Tip</span>
                  <span>₹{formatCurrency(payment.tip_amount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-2">
                <span>Total</span>
                <span>₹{formatCurrency(payment.total_amount)}</span>
              </div>
            </div>

            <div className="pt-4">
              <Button
                className="w-full"
                onClick={proceedToPayment}
                disabled={updating}
              >
                {updating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Proceed to Payment'
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}