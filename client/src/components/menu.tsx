import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "@/contexts/cart-context";
import { useToast } from "@/hooks/use-toast";
import { formatIDRSimple } from "@/lib/currency";
// import type { MenuItem } from "@shared/schema";

// Define types for the MenuItem
interface MenuItem {
  id: number;
  name: string;
  description: string | null;
  category: "food" | "coffee" | "non-coffee"; // You can expand the types if needed
  price: number;
  image: string;
}

interface MenuProps {
  onItemClick: (item: MenuItem) => void;
}

// Categories that can be filtered
const categories = [
  { id: "all", name: "All" },
  { id: "coffee", name: "Coffee" },
  { id: "food", name: "Food" },
  { id: "non-coffee", name: "Non-Coffee" },
];

export default function Menu({ onItemClick }: MenuProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { addToCart } = useCart();
  const { toast } = useToast();

  // Fetch data from API
  const { data: menuItems = [], isLoading, error } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu"],
    queryFn: async (): Promise<MenuItem[]> => {
      const response = await fetch("http://192.168.100.32:8000/api/customer/menu-list");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      return data.data.map((item: any): MenuItem => ({
        id: item.id,
        name: item.name,
        description: item.description || "No description available", // Default description if null
        category: item.category as "food" | "coffee" | "non-coffee", // Explicit type casting
        price: parseFloat(item.price), // Convert price to number
        image: `http://192.168.100.32:8000/storage/${item.image_path}`, // Build the full image URL
      }));
    },
  });

  // Filter items based on the selected category
  const filteredItems = selectedCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  // Handle quick add to cart
  const handleQuickAdd = (item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: item.id.toString(),
      name: item.name,
      price: item.price,
      quantity: 1,
      notes: "",
      image: item.image,
    });
    toast({
      title: "Added to cart!",
      description: `${item.name} has been added to your cart.`,
    });
  };

  // Loading state
  if (isLoading) {
    return (
        <section id="menu" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-dark-coffee mb-4">Our Menu</h2>
              <p className="text-lg text-gray-600">Freshly brewed coffee and delicious treats</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
                    <div className="w-full h-48 bg-gray-200"></div>
                    <div className="p-6">
                      <div className="h-6 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-4"></div>
                      <div className="flex justify-between items-center">
                        <div className="h-6 bg-gray-200 rounded w-20"></div>
                        <div className="h-10 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </section>
    );
  }

  // Error handling
  if (error instanceof Error) {
    return (
        <section id="menu" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-dark-coffee mb-4">Our Menu</h2>
              <p className="text-lg text-gray-600">Failed to load menu items. Please try again later.</p>
            </div>
          </div>
        </section>
    );
  }

  return (
      <section id="menu" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-dark-coffee mb-4">Our Menu</h2>
            <p className="text-lg text-gray-600">Freshly brewed coffee and delicious treats</p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center mb-8 gap-4">
            {categories.map((category) => (
                <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-6 py-2 rounded-full transition-colors ${
                        selectedCategory === category.id
                            ? "bg-coffee-brown text-white"
                            : "bg-gray-200 text-dark-coffee hover:bg-coffee-brown hover:text-white"
                    }`}
                >
                  {category.name}
                </button>
            ))}
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
                <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                    onClick={() => onItemClick(item)}
                >
                  <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-dark-coffee mb-2">{item.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                    <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-coffee-brown">
                    {formatIDRSimple(item.price)}
                  </span>
                      <button
                          onClick={(e) => handleQuickAdd(item, e)}
                          className="bg-coffee-brown text-white px-4 py-2 rounded-lg hover:bg-chocolate-orange transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </section>
  );
}
