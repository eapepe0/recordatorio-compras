import { useEffect, useState } from "react";
import { ReminderRuleForm } from "../components/reminders/ReminderRuleForm";
import { ReminderRuleList } from "../components/reminders/ReminderRuleList";
import { createReminderRule, getReminderRules, type ReminderRuleInput } from "../services/reminders";
import { getProducts } from "../services/products";
import type { Product, ReminderRule } from "../types/db";

export function ReminderRulesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [rules, setRules] = useState<ReminderRule[]>([]);

  async function load() {
    const [productsData, rulesData] = await Promise.all([
      getProducts(),
      getReminderRules(),
    ]);
    setProducts(productsData);
    setRules(rulesData);
  }

  async function handleCreate(values: ReminderRuleInput) {
    await createReminderRule(values);
    await load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-[360px_1fr]">
      <ReminderRuleForm products={products} onSubmit={handleCreate} />
      <div className="grid gap-3">
        <div>
          <h1 className="text-2xl font-bold">Reglas de recordatorio</h1>
          <p className="text-sm text-gray-600">Frecuencias y alertas por producto</p>
        </div>
        <ReminderRuleList rules={rules} products={products} />
      </div>
    </div>
  );
}