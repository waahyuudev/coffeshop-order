import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema, insertOrderItemSchema } from "@shared/schema";
import { z } from "zod";

const createOrderRequestSchema = z.object({
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(1),
  deliveryAddress: z.string().optional(),
  orderType: z.enum(["pickup", "delivery"]),
  items: z.array(z.object({
    menuItemId: z.number(),
    quantity: z.number().min(1),
    notes: z.string().optional()
  }))
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all menu items
  app.get("/api/menu", async (req, res) => {
    try {
      const items = await storage.getMenuItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu items" });
    }
  });

  // Get menu item by ID
  app.get("/api/menu/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const item = await storage.getMenuItemById(id);
      if (!item) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu item" });
    }
  });

  // Create new order
  app.post("/api/orders", async (req, res) => {
    try {
      const data = createOrderRequestSchema.parse(req.body);
      console.log('Order request data:', data);
      
      // Calculate total
      let total = 0;
      for (const item of data.items) {
        const menuItem = await storage.getMenuItemById(item.menuItemId);
        if (!menuItem) {
          return res.status(400).json({ message: `Menu item ${item.menuItemId} not found` });
        }
        console.log(`Menu item ${item.menuItemId}: price=${menuItem.price}, quantity=${item.quantity}`);
        total += parseFloat(menuItem.price) * item.quantity;
      }
      console.log('Calculated total:', total);

      // Generate order number
      const orderNumber = `ORD-${Date.now()}`;

      // Create order
      const order = await storage.createOrder({
        orderNumber,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        deliveryAddress: data.deliveryAddress || "",
        orderType: data.orderType,
        total: Math.round(total).toString(),
        status: "pending"
      });

      // Create order items
      for (const item of data.items) {
        const menuItem = await storage.getMenuItemById(item.menuItemId);
        if (menuItem) {
          await storage.createOrderItem({
            orderId: order.id,
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            notes: item.notes || "",
            price: menuItem.price
          });
        }
      }

      res.status(201).json({ 
        message: "Order created successfully",
        order,
        orderNumber: order.orderNumber
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // Get order by order number
  app.get("/api/orders/:orderNumber", async (req, res) => {
    try {
      const orderNumber = req.params.orderNumber;
      const order = await storage.getOrderByNumber(orderNumber);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      const orderItems = await storage.getOrderItemsByOrderId(order.id);
      
      res.json({ order, items: orderItems });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
