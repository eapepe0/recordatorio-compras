export type Product = {
  id: string;
  user_id: string;
  name: string;
  category: string | null;
  supplier: string | null;
  unit: string | null;
  stock_current: number;
  stock_min: number;
  is_active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type ReminderRuleType = "interval" | "weekly" | "monthly" | "stock";

export type ReminderRule = {
  id: string;
  user_id: string;
  product_id: string;
  type: ReminderRuleType;
  interval_days: number | null;
  week_days: number[] | null;
  month_day: number | null;
  trigger_stock: number | null;
  notify_time: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ShoppingItemStatus = "pending" | "bought";

export type ShoppingItem = {
  id: string;
  user_id: string;
  product_id: string;
  supplier_id?: string | null;
  suggested_qty: number | null;
  status: ShoppingItemStatus;
  source: "reminder" | "stock" | "manual";
  due_date: string | null;
  due_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  product?: Product;
  supplier?: Supplier | null;
};

export type PushSubscriptionRow = {
  id: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  user_agent: string | null;
  created_at: string;
  updated_at: string;
};

export type Supplier = {
  id: string;
  user_id: string;
  name: string;
  contact_name: string | null;
  phone: string | null;
  email: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};