export type Order = {
  id: string;
  customer_id: string;
  status: "pending" | "paid" | "dispatched" | "delivered" | "cancelled";
  total_minor: number;
  currency: string;
  created_at: string;
};

export type OrderPage = {
  items: Order[];
  next_cursor: string | null;
};