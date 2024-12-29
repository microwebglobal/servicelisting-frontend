import React, { useMemo } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CartPreview({ cart, removeFromCart }) {
  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + Number(item.finalPrice || item.base_price), 0);
  }, [cart]);

  if (cart.length === 0) {
    return (
      <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg z-50">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          <span className="font-bold">Cart (Empty)</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg z-50 w-80">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingCart className="h-5 w-5" />
        <span className="font-bold">Cart ({cart.length} items)</span>
      </div>
      
      <div className="max-h-60 overflow-y-auto space-y-3">
        {cart.map((item) => (
          <div 
            key={`${item.item_id}-${item.type}`}
            className="flex justify-between items-center gap-2 border-b pb-2"
          >
            <div className="flex-1">
              <p className="font-medium text-sm">{item.name}</p>
              {item.type === 'package' && item.sections && (
                <div className="text-xs text-gray-600 mt-1">
                  {item.sections.map((section, index) => (
                    <div key={index}>
                      {section.item.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="font-bold">
                ₹{item.finalPrice || item.base_price}
              </span>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => removeFromCart(item.item_id)}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t">
        <div className="flex justify-between items-center mb-3">
          <span className="font-bold">Total:</span>
          <span className="text-xl font-bold">₹{cartTotal}</span>
        </div>
        <Button className="w-full">
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
}