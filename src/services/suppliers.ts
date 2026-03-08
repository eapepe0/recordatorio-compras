import { supabase } from "../lib/supabase";
import type { Supplier } from "../types/db";

export type SupplierInput = Omit<
  Supplier,
  "id" | "created_at" | "updated_at" | "user_id"
>;

export async function getSuppliers() {
  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return data as Supplier[];
}

export async function createSupplier(input: SupplierInput) {
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError) throw authError;

  const user = authData.user;
  if (!user) throw new Error("No autenticado");

  const { data, error } = await supabase
    .from("suppliers")
    .insert({
      ...input,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Supplier;
}

export async function updateSupplier(
  id: string,
  input: Partial<SupplierInput>
) {
  const { data, error } = await supabase
    .from("suppliers")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Supplier;
}

export async function deleteSupplier(id: string) {
  const { error } = await supabase
    .from("suppliers")
    .delete()
    .eq("id", id);

  if (error) throw error;
}