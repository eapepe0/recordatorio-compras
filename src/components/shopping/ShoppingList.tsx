import type { ShoppingItem } from "../../types/db";

type Props = {
  items: ShoppingItem[];
  onMarkBought: (id: string) => Promise<void>;
};

export function ShoppingList({ items, onMarkBought }: Props) {
  return (
    <div className="rounded-xl bg-white shadow-sm">
      <ul className="divide-y">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-4 px-4 py-3">
            <div>
              <div className="font-medium">{item.product?.name ?? "Producto"}</div>
              <div className="text-sm text-gray-600">
                Estado: {item.status} · Fuente: {item.source}
              </div>
            </div>

            {item.status === "pending" && (
              <button
                onClick={() => onMarkBought(item.id)}
                className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white"
              >
                Marcar comprado
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}