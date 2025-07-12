import { menuItems, orders, orderItems, type MenuItem, type Order, type OrderItem, type InsertMenuItem, type InsertOrder, type InsertOrderItem } from "@shared/schema";

export interface IStorage {
  // Menu items
  getMenuItems(): Promise<MenuItem[]>;
  getMenuItemById(id: number): Promise<MenuItem | undefined>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  
  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  getOrderById(id: number): Promise<Order | undefined>;
  getOrderByNumber(orderNumber: string): Promise<Order | undefined>;
  
  // Order items
  createOrderItem(item: InsertOrderItem): Promise<OrderItem>;
  getOrderItemsByOrderId(orderId: number): Promise<OrderItem[]>;
}

export class MemStorage implements IStorage {
  private menuItems: Map<number, MenuItem>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private currentMenuId: number;
  private currentOrderId: number;
  private currentOrderItemId: number;

  constructor() {
    this.menuItems = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.currentMenuId = 1;
    this.currentOrderId = 1;
    this.currentOrderItemId = 1;
    
    // Initialize with sample menu items
    this.initializeMenuItems();
  }

  private initializeMenuItems() {
    const sampleItems: InsertMenuItem[] = [
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

    sampleItems.forEach(item => {
      this.createMenuItem(item);
    });
  }

  async getMenuItems(): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values());
  }

  async getMenuItemById(id: number): Promise<MenuItem | undefined> {
    return this.menuItems.get(id);
  }

  async createMenuItem(insertItem: InsertMenuItem): Promise<MenuItem> {
    const id = this.currentMenuId++;
    const item: MenuItem = { ...insertItem, id };
    this.menuItems.set(id, item);
    return item;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = { 
      ...insertOrder, 
      id, 
      createdAt: new Date(),
      status: insertOrder.status || "pending",
      deliveryAddress: insertOrder.deliveryAddress || null
    };
    this.orders.set(id, order);
    return order;
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrderByNumber(orderNumber: string): Promise<Order | undefined> {
    return Array.from(this.orders.values()).find(order => order.orderNumber === orderNumber);
  }

  async createOrderItem(insertItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.currentOrderItemId++;
    const item: OrderItem = { 
      ...insertItem, 
      id,
      menuItemId: insertItem.menuItemId || null,
      orderId: insertItem.orderId || null,
      notes: insertItem.notes || null
    };
    this.orderItems.set(id, item);
    return item;
  }

  async getOrderItemsByOrderId(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(item => item.orderId === orderId);
  }
}

export const storage = new MemStorage();
