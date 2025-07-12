import { db } from "./db";
import { menuItems } from "@shared/schema";

const sampleItems = [
  {
    name: "Espresso",
    price: "2.50",
    category: "coffee",
    description: "Rich, bold espresso shot with a perfect crema",
    image: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"
  },
  {
    name: "Cappuccino",
    price: "4.25",
    category: "coffee",
    description: "Espresso with steamed milk and rich foam",
    image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"
  },
  {
    name: "Latte",
    price: "4.75",
    category: "coffee",
    description: "Smooth espresso with steamed milk and light foam",
    image: "https://images.unsplash.com/photo-1561882468-9110e03e0f78?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"
  },
  {
    name: "Americano",
    price: "3.50",
    category: "coffee",
    description: "Espresso with hot water for a clean, bold taste",
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"
  },
  {
    name: "Mocha",
    price: "5.25",
    category: "coffee",
    description: "Espresso with chocolate and steamed milk",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"
  },
  {
    name: "Green Tea",
    price: "2.75",
    category: "tea",
    description: "Fresh green tea with antioxidants",
    image: "https://images.unsplash.com/photo-1556881286-04b2e18ac751?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"
  },
  {
    name: "Earl Grey",
    price: "3.00",
    category: "tea",
    description: "Classic black tea with bergamot oil",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"
  },
  {
    name: "Croissant",
    price: "3.25",
    category: "pastries",
    description: "Buttery, flaky French pastry",
    image: "https://images.unsplash.com/photo-1555507036-ab794f0ec0c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"
  },
  {
    name: "Blueberry Muffin",
    price: "2.95",
    category: "pastries",
    description: "Fresh baked muffin with blueberries",
    image: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"
  }
];

async function seedDatabase() {
  try {
    console.log("Seeding database with menu items...");
    
    // Check if items already exist
    const existingItems = await db.select().from(menuItems);
    if (existingItems.length > 0) {
      console.log("Menu items already exist, skipping seed");
      return;
    }
    
    // Insert sample items
    await db.insert(menuItems).values(sampleItems);
    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seedDatabase();