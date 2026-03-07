import { useState } from "react";
import type { Product } from "../../types/db";
import type { ReminderRuleInput } from "../../services/reminders";

type Props = {
  products: Product[];
  onSubmit: (values: ReminderRuleInput) => Promise<void>;
};

const weekDaysOptions = [
  { label: "Domingo", value: 0 },
  { label: "Lunes", value: 1 },
  { label: "Martes", value: 2 },
  { label: "Miércoles", value: 3 },
  { label: "Jueves", value: 4 },
  { label: "Viernes", value: 5 },
  { label: "Sábado", value: 6 },
];

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

  function toggleWeekDay(day: number) {
    const currentDays = form.week_days ?? [];
    const exists = currentDays.includes(day);

    const nextDays = exists
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day].sort((a, b) => a - b);

    setForm({ ...form, week_days: nextDays });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (
      form.type === "weekly" &&
      (!form.week_days || form.week_days.length === 0)
    ) {
      alert("Seleccioná al menos un día para el recordatorio semanal");
      setLoading(false);
      return;
    }
    try {
      await onSubmit({
        ...form,
        week_days: form.type === "weekly" ? form.week_days : null,
        interval_days: form.type === "interval" ? form.interval_days : null,
        month_day: form.type === "monthly" ? form.month_day : null,
        trigger_stock: form.type === "stock" ? form.trigger_stock : null,
      });

      setForm({
        product_id: "",
        type: "weekly",
        interval_days: null,
        week_days: [1],
        month_day: null,
        trigger_stock: null,
        notify_time: "09:00",
        is_active: true,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-3 rounded-xl bg-white p-4 shadow-sm"
    >
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
            week_days: e.target.value === "weekly" ? [1] : null,
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

      {form.type === "weekly" && (
        <div className="rounded-lg border p-3">
          <div className="mb-2 text-sm font-medium text-gray-700">
            Días de aviso
          </div>
          <div className="grid grid-cols-2 gap-2">
            {weekDaysOptions.map((day) => (
              <label
                key={day.value}
                className="flex items-center gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={(form.week_days ?? []).includes(day.value)}
                  onChange={() => toggleWeekDay(day.value)}
                />
                {day.label}
              </label>
            ))}
          </div>
        </div>
      )}

      {form.type === "interval" && (
        <input
          className="rounded-lg border px-3 py-2"
          type="number"
          placeholder="Cada cuántos días"
          value={form.interval_days ?? ""}
          onChange={(e) =>
            setForm({
              ...form,
              interval_days: e.target.value ? Number(e.target.value) : null,
            })
          }
        />
      )}

      {form.type === "monthly" && (
        <input
          className="rounded-lg border px-3 py-2"
          type="number"
          placeholder="Día del mes"
          value={form.month_day ?? ""}
          onChange={(e) =>
            setForm({
              ...form,
              month_day: e.target.value ? Number(e.target.value) : null,
            })
          }
        />
      )}

      {form.type === "stock" && (
        <input
          className="rounded-lg border px-3 py-2"
          type="number"
          placeholder="Avisar cuando stock sea menor o igual a"
          value={form.trigger_stock ?? ""}
          onChange={(e) =>
            setForm({
              ...form,
              trigger_stock: e.target.value ? Number(e.target.value) : null,
            })
          }
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
