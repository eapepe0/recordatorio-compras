import { supabase } from "../lib/supabase";
import type { Product, ReminderRule, ShoppingItem } from "../types/db";

export type ReminderRuleWithProduct = ReminderRule & {
  product?: Product | null;
};


export async function getPendingShoppingItemsToday() {
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("shopping_items")
    .select(`
      *,
      product:products(*),
      supplier:suppliers(*)
    `)
    .eq("status", "pending")
    .eq("due_date", today)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as ShoppingItem[];
}

export async function getLowStockProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;

  return (data as Product[]).filter(
    (product) => Number(product.stock_current) <= Number(product.stock_min)
  );
}

export async function getActiveReminderRules() {
  const { data, error } = await supabase
    .from("reminder_rules")
    .select(`
      *,
      product:products(*)
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as ReminderRuleWithProduct[];
}
export async function getRecentShoppingItems(limit = 5) {
  const { data, error } = await supabase
    .from("shopping_items")
    .select(`
      *,
      product:products(*),
      supplier:suppliers(*)
    `)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as ShoppingItem[];
}