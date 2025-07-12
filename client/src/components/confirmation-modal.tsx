import { CheckCircle, X } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { formatIDRSimple } from "@/lib/currency";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
}

export default function ConfirmationModal({ isOpen, onClose, orderNumber }: ConfirmationModalProps) {
  const { cart } = useCart();

  if (!isOpen) return null;

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full">
          <div className="p-6 text-center">
            <div className="text-green-500 text-5xl mb-4">
              <CheckCircle className="h-16 w-16 mx-auto" />
            </div>
            
            <h3 className="text-2xl font-bold text-dark-coffee mb-4">Order Confirmed!</h3>
            
            <p className="text-gray-600 mb-6">
              Thank you for your order. We'll have your coffee ready soon!
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-semibold">Order #:</span>
                  <span>{orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Status:</span>
                  <span className="text-coffee-brown">Processing</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Total:</span>
                  <span className="text-coffee-brown font-bold">
                    {formatIDRSimple(total)}
                  </span>
                </div>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="w-full bg-coffee-brown text-white py-3 rounded-lg font-semibold hover:bg-chocolate-orange transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
