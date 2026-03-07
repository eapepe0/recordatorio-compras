import { useState } from "react";
import type { Product } from "../../types/db";
import type { ReminderRuleInput } from "../../services/reminders";

type Props = {
  products: Product[];
  onSubmit: (values: ReminderRuleInput) => Promise<void>;
};

export function ReminderRuleForm({ products, onSubmit }: Props) {
  const [form, setForm] = useState<ReminderRuleInput>({
    product_id: "",
    type: "weekly",
    interval_days: null,
    week_days: [1],
    month_day: null,
    trigger_stock: null,
    notify_time: "09:00",
    is_active: true,
  });

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 rounded-xl bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold">Nueva regla</h2>

      <select
        className="rounded-lg border px-3 py-2"
        value={form.product_id}
        onChange={(e) => setForm({ ...form, product_id: e.target.value })}
        required
      >
        <option value="">Seleccionar producto</option>
        {products.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <select
        className="rounded-lg border px-3 py-2"
        value={form.type}
        onChange={(e) =>
          setForm({
            ...form,
            type: e.target.value as ReminderRuleInput["type"],
            interval_days: null,
            month_day: null,
            trigger_stock: null,
          })
        }
      >
        <option value="weekly">Semanal</option>
        <option value="monthly">Mensual</option>
        <option value="interval">Cada X días</option>
        <option value="stock">Por stock</option>
      </select>

      {form.type === "interval" && (
        <input
          className="rounded-lg border px-3 py-2"
          type="number"
          placeholder="Cada cuántos días"
          onChange={(e) => setForm({ ...form, interval_days: Number(e.target.value) })}
        />
      )}

      {form.type === "monthly" && (
        <input
          className="rounded-lg border px-3 py-2"
          type="number"
          placeholder="Día del mes"
          onChange={(e) => setForm({ ...form, month_day: Number(e.target.value) })}
        />
      )}

      {form.type === "stock" && (
        <input
          className="rounded-lg border px-3 py-2"
          type="number"
          placeholder="Avisar cuando stock sea menor o igual a"
          onChange={(e) => setForm({ ...form, trigger_stock: Number(e.target.value) })}
        />
      )}

      <input
        className="rounded-lg border px-3 py-2"
        type="time"
        value={form.notify_time ?? "09:00"}
        onChange={(e) => setForm({ ...form, notify_time: e.target.value })}
      />

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-gray-900 px-4 py-2 font-medium text-white"
      >
        {loading ? "Guardando..." : "Guardar regla"}
      </button>
    </form>
  );
}