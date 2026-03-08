import type { ShoppingItem, Supplier } from "../../types/db";
import { sendOrderToWhatsApp } from "../../utils/whatsapp";

type Props = {
  items: ShoppingItem[];
  suppliers: Supplier[];
  onMarkBought: (id: string) => Promise<void>;
  onMarkPending: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onChangeSupplier: (id: string, supplierId: string | null) => Promise<void>;
};

export function ShoppingList({
  items,
  suppliers,
  onMarkBought,
  onMarkPending,
  onDelete,
  onChangeSupplier,
}: Props) {
  function handleWhatsApp(item: ShoppingItem) {
    if (!item.supplier?.phone) {
      alert("Este item no tiene proveedor con teléfono asignado");
      return;
    }

    sendOrderToWhatsApp(
      [
        {
          productName: item.product?.name ?? "Producto",
          quantity: Number(item.suggested_qty ?? 1),
        },
      ],
      {
        nombre: item.supplier.name,
        telefono: item.supplier.phone,
      }
    );
  }

  return (
    <div className="rounded-xl bg-white shadow-sm">
      <ul className="divide-y">
        {items.map((item) => (
          <li key={item.id} className="grid gap-3 px-4 py-3">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="font-medium">{item.product?.name ?? "Producto"}</div>
                <div className="text-sm text-gray-600">
                  Estado: {item.status} · Fuente: {item.source}
                  {item.due_date ? ` · Fecha: ${item.due_date}` : ""}
                </div>
                {item.notes && (
                  <div className="text-sm text-gray-600">Notas: {item.notes}</div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {item.status === "pending" ? (
                  <button
                    onClick={() => onMarkBought(item.id)}
                    className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white"
                  >
                    Marcar comprado
                  </button>
                ) : (
                  <button
                    onClick={() => onMarkPending(item.id)}
                    className="rounded-lg border px-3 py-2 text-sm font-medium"
                  >
                    Volver a pendiente
                  </button>
                )}

                <button
                  onClick={() => onDelete(item.id)}
                  className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-700"
                >
                  Borrar
                </button>

                <button
                  onClick={() => handleWhatsApp(item)}
                  className="rounded-lg border px-3 py-2 text-sm"
                >
                  WhatsApp
                </button>
              </div>
            </div>

            <div className="max-w-sm">
              <label className="mb-1 block text-sm text-gray-600">Proveedor</label>
              <select
                className="w-full rounded-lg border px-3 py-2"
                value={item.supplier_id ?? ""}
                onChange={(e) =>
                  onChangeSupplier(item.id, e.target.value || null)
                }
              >
                <option value="">Sin proveedor</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}