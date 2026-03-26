"use server";

import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import type { Order, CartItem, Product, OrderItem } from "@/lib/types";
import { clearCart } from "./cart-actions";
import { getProduct, getProducts } from "./product-actions";

const ordersFilePath = path.join(process.cwd(), "data/orders.json");
const productsFilePath = path.join(process.cwd(), "data/products.json");

async function readOrders(): Promise<Order[]> {
  try {
    const data = await fs.readFile(ordersFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    console.error("Error reading orders file:", error);
    return [];
  }
}

async function writeOrders(orders: Order[]) {
  await fs.writeFile(ordersFilePath, JSON.stringify(orders, null, 2));
}

async function updateProductStock(items: OrderItem[]) {
  const productsData = await fs.readFile(productsFilePath, "utf8");
  const products: Product[] = JSON.parse(productsData);

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (product) {
      product.stock -= item.quantity;
    }
  }

  await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
}

export async function createOrder(
  userId: string,
  userName: string,
  userEmail: string,
  cartItems: CartItem[],
) {
  if (!userId) throw new Error("User not logged in");
  if (cartItems.length === 0) throw new Error("Cart is empty");

  const orders = await readOrders();
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const orderItems: OrderItem[] = cartItems.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
    price: item.price,
  }));

  const newOrder: Order = {
    id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    userId,
    userName,
    userEmail,
    items: orderItems,
    total,
    date: new Date().toISOString(),
    status: "Pending",
  };

  await updateProductStock(orderItems);
  orders.unshift(newOrder);
  await writeOrders(orders);
  await clearCart(userId);

  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/dashboard/orders");
  revalidatePath("/orders");
  revalidatePath("/cart");
  return newOrder;
}

export async function getOrders(): Promise<Order[]> {
  return await readOrders();
}

export async function getOrdersByUser(userId: string): Promise<Order[]> {
  const orders = await readOrders();
  return orders.filter((order) => order.userId === userId);
}

export async function getOrder(orderId: string): Promise<Order | undefined> {
  const orders = await readOrders();
  return orders.find((order) => order.id === orderId);
}

// --- Dashboard Data Functions ---

export async function getTotalRevenue() {
  const orders = await readOrders();
  return orders.reduce((sum, order) => sum + order.total, 0);
}

export async function getSalesPerformanceData() {
  const orders = await readOrders();
  const monthlySales: Record<string, { sales: number; units: number }> = {};

  orders.forEach((order) => {
    const month = new Date(order.date).toLocaleString("default", {
      month: "short",
    });
    if (!monthlySales[month]) {
      monthlySales[month] = { sales: 0, units: 0 };
    }
    monthlySales[month].sales += order.total;
    monthlySales[month].units += order.items.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );
  });

  // Convert to array format expected by the chart
  const performanceData = Object.entries(monthlySales)
    .map(([month, data]) => ({
      month,
      ...data,
    }))
    .reverse(); // Assuming recent months are more relevant

  return performanceData;
}

export async function getCategorySalesData() {
  const orders = await readOrders();
  const products = await getProducts();
  const categorySales: Record<string, number> = {};

  orders.forEach((order) => {
    order.items.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        if (!categorySales[product.category]) {
          categorySales[product.category] = 0;
        }
        categorySales[product.category] += item.price * item.quantity;
      }
    });
  });

  const categoryColors = {
    Electronics: "hsl(var(--chart-1))",
    Apparel: "hsl(var(--chart-2))",
    "Home Goods": "hsl(var(--chart-3))",
    Other: "hsl(var(--chart-4))",
  };

  return Object.entries(categorySales).map(([name, value], index) => ({
    name,
    value,
    fill:
      categoryColors[name as keyof typeof categoryColors] ||
      `hsl(var(--chart-${(index % 5) + 1}))`,
  }));
}
