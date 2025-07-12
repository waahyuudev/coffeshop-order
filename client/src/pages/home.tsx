import { useState } from "react";
import Header from "@/components/header";
import Hero from "@/components/hero";
import Menu from "@/components/menu";
import CartSidebar from "@/components/cart-sidebar";
import ItemModal from "@/components/item-modal";
import CheckoutModal from "@/components/checkout-modal";
import ConfirmationModal from "@/components/confirmation-modal";
import { useCart } from "@/contexts/cart-context";
import type { MenuItem } from "@shared/schema";

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [orderTotal, setOrderTotal] = useState<number>(0);

  const { cart } = useCart();

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
  };

  const handleCheckoutSuccess = (orderNum: string, total: number) => {
    setOrderNumber(orderNum);
    setOrderTotal(total);
    setIsCheckoutOpen(false);
    setIsConfirmationOpen(true);
  };

  const scrollToMenu = () => {
    const menuElement = document.getElementById("menu");
    if (menuElement) {
      menuElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-coffee-beige">
      <Header 
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
      />
      
      <Hero onOrderClick={scrollToMenu} />
      
      <Menu onItemClick={handleItemClick} />
      
      <CartSidebar 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />
      
      <ItemModal 
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
      
      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={handleCheckoutSuccess}
      />
      
      <ConfirmationModal 
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        orderNumber={orderNumber}
        orderTotal={orderTotal}
      />
    </div>
  );
}
