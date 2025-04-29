import React, { useMemo } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CartPreview({ cart = [], removeFromCart, onCheckout }) {
  const cartTotal = useMemo(() => {
    if (!Array.isArray(cart) || cart.length === 0) return 0;

    return cart.reduce((sum, item) => {
      const price = Number(item.finalPrice || item.base_price || 0);
      return sum + price * (item.quantity || 1);
    }, 0);
  }, [cart]);

  const renderEmptyCart = () => (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg z-50">
      <div className="flex items-center gap-2">
        <ShoppingCart className="h-5 w-5" />
        <span className="font-bold">Cart (Empty)</span>
      </div>
    </div>
  );

  if (!Array.isArray(cart) || cart.length === 0) {
    return renderEmptyCart();
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
              {item.quantity > 1 && (
                <p className="text-xs text-gray-600">
                  Quantity: {item.quantity}
                </p>
              )}
              {item.type === "package" && item.sections && (
                <div className="text-xs text-gray-600 mt-1">
                  {item.sections.map((section, index) => (
                    <div key={index}>{section.item.name}</div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="font-bold">
                ₹{(item.finalPrice || item.base_price || 0).toFixed(2)}
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeFromCart?.(item.item_id, item.type)}
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
          <span className="text-xl font-bold">₹{cartTotal.toFixed(2)}</span>
        </div>

        <Button
          className="w-full"
          onClick={onCheckout}
          disabled={cart.length === 0}
        >
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
}

export default CartPreview;
