import { useState } from "react";
import { X, Plus, Minus } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { useToast } from "@/hooks/use-toast";
import { formatIDRSimple } from "@/lib/currency";
import type { MenuItem } from "@shared/schema";

interface ItemModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export default function ItemModal({ item, onClose }: ItemModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const { addToCart } = useCart();
  const { toast } = useToast();

  if (!item) return null;

  const handleAddToCart = () => {
    addToCart({
      id: `${item.id}-${Date.now()}`,
      name: item.name,
      price: parseFloat(item.price),
      quantity,
      notes,
      image: item.image,
    });
    
    toast({
      title: "Added to cart!",
      description: `${item.name} has been added to your cart.`,
    });
    
    // Reset form
    setQuantity(1);
    setNotes("");
    onClose();
  };

  const total = parseFloat(item.price) * quantity;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-dark-coffee">{item.name}</h3>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-4 rounded-lg overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
            </div>

            <p className="text-gray-600 mb-4">{item.description}</p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-dark-coffee mb-2">
                Special Instructions
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-brown focus:border-coffee-brown"
                placeholder="Add any special instructions..."
              />
            </div>

            <div className="flex items-center justify-between mb-6">
              <span className="text-lg font-semibold text-dark-coffee">Quantity:</span>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-lg font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-xl font-bold text-coffee-brown">
                {formatIDRSimple(total)}
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-coffee-brown text-white py-3 rounded-lg font-semibold hover:bg-chocolate-orange transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
