import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useCart } from "@/contexts/cart-context";
import { useToast } from "@/hooks/use-toast";
import { formatIDRSimple } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// === Types ===

const checkoutSchema = z.object({
  tableNumber: z.coerce.number().min(1, "Table number is required"),
  customerName: z.string().min(1, "Name is required"),
  customerPhone: z.string().min(1, "Phone number is required"),
  channelPayment: z.enum(["cash", "qris", "debit"]),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (orderNumber: string, total: number) => void;
}

interface OrderItem {
  product_id: number;
  quantity: number;
  note?: string;
}

interface OrderPayload {
  table_number: number;
  customer_name: string;
  channel_payment: "cash" | "qris" | "debit";
  status: string;
  order_items: OrderItem[];
}

interface OrderResponse {
  status: string;
  message: string;
  data: string; // This is the order number like "23MD"
}

export default function CheckoutModal({
                                        isOpen,
                                        onClose,
                                        onSuccess,
                                      }: CheckoutModalProps) {
  const { cart, clearCart } = useCart();
  const { toast } = useToast();

  const form = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      tableNumber: 1,
      customerName: "",
      customerPhone: "",
      channelPayment: "cash",
    },
  });

  const createOrderMutation = useMutation<OrderResponse, Error, CheckoutForm>({
    mutationFn: async (data: CheckoutForm): Promise<OrderResponse> => {
      const orderPayload: OrderPayload = {
        table_number: data.tableNumber,
        customer_name: data.customerName,
        channel_payment: data.channelPayment,
        status: "request",
        order_items: cart.map(item => ({
          product_id: parseInt(item.id),
          quantity: item.quantity,
          note: item.notes || "",
        })),
      };

      const res = await fetch("http://127.0.0.1:8000/api/customer/submit-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) throw new Error("Failed to place order");
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Order placed!",
        description: `Your order #${data.data} has been received.`,
      });
      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      clearCart();
      onSuccess(data.data, total);
    },
    onError: () => {
      toast({
        title: "Order failed",
        description: "Could not place the order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CheckoutForm) => {
    createOrderMutation.mutate(data);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
      <>
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-dark-coffee">Checkout</h3>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-4">
                <FormField
                    control={form.control}
                    name="tableNumber"
                    render={({ field }) => (
                        <FormItem>
                          <FormLabel>Table Number *</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="customerPhone"
                    render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input type="tel" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="channelPayment"
                    render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Method</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select payment method" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="cash">Cash</SelectItem>
                              <SelectItem value="qris">QRIS</SelectItem>
                              <SelectItem value="debit">Debit</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="border-t pt-4">
                  <h4 className="font-semibold text-dark-coffee mb-2">Order Summary</h4>
                  <div className="space-y-2 text-sm">
                    {cart.map((item) => (
                        <div key={item.id} className="flex justify-between">
                          <span>{item.name} x {item.quantity}</span>
                          <span>{formatIDRSimple(item.price * item.quantity)}</span>
                        </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t">
                    <span className="font-semibold">Total:</span>
                    <span className="text-lg font-bold text-coffee-brown">
                    {formatIDRSimple(total)}
                  </span>
                  </div>
                </div>

                <Button
                    type="submit"
                    disabled={createOrderMutation.isPending}
                    className="w-full bg-coffee-brown text-white hover:bg-chocolate-orange"
                >
                  {createOrderMutation.isPending ? "Placing Order..." : "Place Order"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </>
  );
}
