import { useEffect, useState } from "react";
import { ReminderRuleForm } from "../components/reminders/ReminderRuleForm";
import { ReminderRuleList } from "../components/reminders/ReminderRuleList";
import {
  createReminderRule,
  deleteReminderRule,
  getReminderRules,
  updateReminderRule,
  type ReminderRuleInput,
} from "../services/reminders";
import { getProducts } from "../services/products";
import type { Product, ReminderRule } from "../types/db";

export function ReminderRulesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [rules, setRules] = useState<ReminderRule[]>([]);
  const [editing, setEditing] = useState<ReminderRule | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setError(null);
      const [productsData, rulesData] = await Promise.all([
        getProducts(),
        getReminderRules(),
      ]);
      setProducts(productsData);
      setRules(rulesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando reglas");
    }
  }

  async function handleSubmit(values: ReminderRuleInput) {
    if (editing) {
      await updateReminderRule(editing.id, values);
      setEditing(null);
    } else {
      await createReminderRule(values);
    }

    await load();
  }

  async function handleDelete(rule: ReminderRule) {
    const ok = window.confirm("¿Borrar esta regla?");
    if (!ok) return;

    await deleteReminderRule(rule.id);

    if (editing?.id === rule.id) {
      setEditing(null);
    }

    await load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-[360px_1fr]">
      <ReminderRuleForm
        products={products}
        onSubmit={handleSubmit}
        initialValues={editing}
        submitLabel={editing ? "Actualizar regla" : "Guardar regla"}
      />

      <div className="grid gap-3">
        <div>
          <h1 className="text-2xl font-bold">Reglas de recordatorio</h1>
          <p className="text-sm text-gray-600">
            Frecuencias, edición y borrado de reglas
          </p>
        </div>

        {editing && (
          <button
            className="w-fit rounded-lg border px-3 py-2"
            onClick={() => setEditing(null)}
          >
            Cancelar edición
          </button>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-red-700">{error}</div>
        )}

        <ReminderRuleList
          rules={rules}
          products={products}
          onEdit={setEditing}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}