import { supabase } from "../lib/supabase";
import type { ShoppingItem } from "../types/db";

export async function getShoppingItems() {
  const { data, error } = await supabase
    .from("shopping_items")
    .select(`
      *,
      product:products(*),
      supplier:suppliers(*)
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

export async function markShoppingItemPending(id: string) {
  const { data, error } = await supabase
    .from("shopping_items")
    .update({ status: "pending" })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteShoppingItem(id: string) {
  const { error } = await supabase
    .from("shopping_items")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function updateShoppingItemSupplier(
  id: string,
  supplier_id: string | null
) {
  const { data, error } = await supabase
    .from("shopping_items")
    .update({ supplier_id })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}