import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Label } from "../ui/label";
import Modal from "react-modal";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Cart({ selectedItems, onRemove, onCheckout }) {
  const [isModelOpen, setIsModelOpen] = useState(false);

  const renderCartContent = () => (
    <>
      {selectedItems.length === 0 ? (
        <p className="text-gray-500 text-center pt-4 pb-8">No items selected</p>
      ) : (
        <div className="space-y-4">
          {selectedItems.map((item) => (
            <div
              key={`${item.id}-${item.type}`}
              className="flex justify-between items-start gap-3"
            >
              <div className="w-full">
                <div className="flex justify-between">
                  <p className="font-medium text-base">{item.name}</p>

                  <span>₹{item.price}</span>
                </div>

                <p className="text-sm text-gray-500">
                  Quantity: {item.quantity || 1}
                </p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="-mt-1.5 p-0 hover:text-destructive hover:bg-transparent"
                onClick={() => onRemove(item)}
              >
                ✕
              </Button>
            </div>
          ))}

          <div className="border-t py-4 space-y-4">
            <div className="flex justify-between items-center">
              <Label className="font-semibold text-lg text-[#5f60b9]">
                Total Price
              </Label>

              <span className="font-semibold text-lg">
                ₹
                {selectedItems
                  .map((item) => item.price * (item.quantity || 1))
                  .reduce((a, b) => a + b, 0)
                  .toFixed(2)}
              </span>
            </div>

            <Button className="w-full" onClick={onCheckout}>
              Proceed to Booking
            </Button>
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* On Large Screens */}
      <Card className="sticky top-28 hidden sm:block">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart />
            Cart
            <p
              className={cn(
                "text-gray-500 text-[0rem] transition-all duration-200 ease-in-out font-normal ml-auto",
                {
                  "text-sm": selectedItems.length > 0,
                }
              )}
            >
              {selectedItems.length} item(s)
            </p>
          </CardTitle>
        </CardHeader>

        <CardContent className="px-7">{renderCartContent()}</CardContent>
      </Card>

      {/* On Small Screens */}
      <Button
        variant="icon"
        className="sm:hidden fixed bottom-5 right-5 bg-[#5f60b9] size-16 text-white text-lg shadow-2xl hover:bg-[#5f60b9]/90 rounded-full border border-border/50"
        onClick={() => setIsModelOpen(true)}
      >
        <ShoppingCart className="scale-150" />
        <div
          className={cn(
            "bg-red-600 text-white absolute -top-1 right-0 flex size-0 rounded-full items-center justify-center text-sm font-semibold transition-all duration-200 ease-in-out invisible",
            { "size-6 ml-1 visible": selectedItems.length > 0 }
          )}
        >
          {selectedItems.length}
        </div>
      </Button>

      <Modal
        isOpen={isModelOpen}
        onRequestClose={() => setIsModelOpen(false)}
        ariaHideApp={false}
        contentLabel="Cart"
        className="w-full max-w-sm space-y-4 bg-white p-6 rounded-md shadow-xl transform transition-all duration-300 ease-in-out overflow-y-auto max-h-[80vh]"
        overlayClassName="fixed inset-0 flex justify-center items-center bg-opacity-50 bg-black backdrop-blur-xs"
      >
        <div className="flex items-center gap-2">
          <ShoppingCart className="size-6" />
          <span className="text-2xl font-semibold">Cart</span>

          <p
            className={cn(
              "text-gray-500 text-[0rem] transition-all duration-200 ease-in-out ml-auto",
              {
                "text-sm": selectedItems.length > 0,
              }
            )}
          >
            {selectedItems.length} item(s)
          </p>
        </div>

        <div>{renderCartContent()}</div>
      </Modal>
    </>
  );
}
