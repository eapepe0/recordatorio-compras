import { supabase } from "../lib/supabase";
import type { ShoppingItem } from "../types/db";

export async function getShoppingItems() {
  const { data, error } = await supabase
    .from("shopping_items")
    .select(`
      *,
      product:products(*)
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as ShoppingItem[];
}

export async function markShoppingItemBought(id: string) {
  const { data, error } = await supabase
    .from("shopping_items")
    .update({ status: "bought" })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}