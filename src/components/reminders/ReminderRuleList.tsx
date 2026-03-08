import type { ReminderRule, Product } from "../../types/db";

type Props = {
  rules: ReminderRule[];
  products: Product[];
  onEdit: (rule: ReminderRule) => void;
  onDelete: (rule: ReminderRule) => Promise<void>;
};

const dayNames: Record<number, string> = {
  0: "Domingo",
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábado",
};

export function ReminderRuleList({ rules, products, onEdit, onDelete }: Props) {
  function productName(productId: string) {
    return products.find((p) => p.id === productId)?.name ?? productId;
  }

  function formatRule(rule: ReminderRule) {
    if (rule.type === "weekly") {
      const days = (rule.week_days ?? []).map((d) => dayNames[d]).join(", ");
      return `Semanal: ${days || "-"}`;
    }

    if (rule.type === "monthly") {
      return `Mensual: día ${rule.month_day ?? "-"}`;
    }

    if (rule.type === "interval") {
      return `Cada ${rule.interval_days ?? "-"} días`;
    }

    if (rule.type === "stock") {
      return `Por stock: avisar cuando sea <= ${rule.trigger_stock ?? "-"}`;
    }

    return rule.type;
  }

  return (
    <div className="rounded-xl bg-white shadow-sm">
      <ul className="divide-y">
        {rules.map((rule) => (
          <li key={rule.id} className="px-4 py-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-medium">{productName(rule.product_id)}</div>
                <div className="text-sm text-gray-600">
                  {formatRule(rule)} · Hora: {rule.notify_time ?? "-"} ·{" "}
                  {rule.is_active ? "Activa" : "Inactiva"}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  className="rounded-lg border px-3 py-1 text-sm"
                  onClick={() => onEdit(rule)}
                >
                  Editar
                </button>
                <button
                  className="rounded-lg border border-red-300 px-3 py-1 text-sm text-red-700"
                  onClick={() => onDelete(rule)}
                >
                  Borrar
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}