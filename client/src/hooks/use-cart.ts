import { useState, useCallback } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  notes: string;
  image: string;
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = useCallback((item: CartItem) => {
    console.log('useCart: Adding item to cart:', item);
    setCart(prevCart => {
      console.log('useCart: Current cart:', prevCart);
      const existingItem = prevCart.find(cartItem => 
        cartItem.id === item.id && cartItem.notes === item.notes
      );

      if (existingItem) {
        console.log('useCart: Found existing item, updating quantity');
        const newCart = prevCart.map(cartItem =>
          cartItem.id === item.id && cartItem.notes === item.notes
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
        console.log('useCart: New cart after update:', newCart);
        return newCart;
      }

      console.log('useCart: Adding new item to cart');
      const newCart = [...prevCart, item];
      console.log('useCart: New cart after add:', newCart);
      return newCart;
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  return {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    updateQuantity,
  };
}
