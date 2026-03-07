import type { ReminderRule, Product } from "../../types/db";

type Props = {
  rules: ReminderRule[];
  products: Product[];
};

export function ReminderRuleList({ rules, products }: Props) {
  function productName(productId: string) {
    return products.find((p) => p.id === productId)?.name ?? productId;
  }

  return (
    <div className="rounded-xl bg-white shadow-sm">
      <ul className="divide-y">
        {rules.map((rule) => (
          <li key={rule.id} className="px-4 py-3">
            <div className="font-medium">{productName(rule.product_id)}</div>
            <div className="text-sm text-gray-600">
              Tipo: {rule.type} · Hora: {rule.notify_time ?? "-"}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}