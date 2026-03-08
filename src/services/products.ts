import { supabase } from "../lib/supabase";
import type { Product } from "../types/db";

export type ProductInput = Omit<
  Product,
  "id" | "created_at" | "updated_at" | "user_id"
>;

export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return data as Product[];
}

export async function createProduct(input: ProductInput) {
  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;
  if (!user) throw new Error("No autenticado");

  const { data, error } = await supabase
    .from("products")
    .insert({
      ...input,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Product;
}

export async function updateProduct(id: string, input: Partial<ProductInput>) {
  const { data, error } = await supabase
    .from("products")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Product;
}

export async function deleteProduct(id: string) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}