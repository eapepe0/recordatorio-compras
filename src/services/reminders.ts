import { supabase } from "../lib/supabase";
import type { ReminderRule } from "../types/db";

export type ReminderRuleInput = Omit<ReminderRule, "id" | "created_at" | "updated_at">;

export async function getReminderRules() {
  const { data, error } = await supabase
    .from("reminder_rules")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as ReminderRule[];
}

export async function createReminderRule(input: ReminderRuleInput) {
  const { data, error } = await supabase
    .from("reminder_rules")
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data as ReminderRule;
}