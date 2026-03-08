import { useEffect, useMemo, useState } from "react";
import { ShoppingList } from "../components/shopping/ShoppingList";
import { getSuppliers } from "../services/suppliers";
import {
  deleteShoppingItem,
  getShoppingItems,
  markShoppingItemBought,
  markShoppingItemPending,
  updateShoppingItemSupplier,
} from "../services/shopping";
import type { ShoppingItem, Supplier } from "../types/db";

type FilterStatus = "all" | "pending" | "bought";

export function ShoppingListPage() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setError(null);
      const [itemsData, suppliersData] = await Promise.all([
        getShoppingItems(),
        getSuppliers(),
      ]);
      setItems(itemsData);
      setSuppliers(suppliersData.filter((s) => s.is_active));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando compras");
    }
  }

  async function handleMarkBought(id: string) {
    await markShoppingItemBought(id);
    await load();
  }

  async function handleMarkPending(id: string) {
    await markShoppingItemPending(id);
    await load();
  }

  async function handleDelete(id: string) {
    const ok = window.confirm("¿Borrar este item?");
    if (!ok) return;
    await deleteShoppingItem(id);
    await load();
  }

  async function handleChangeSupplier(id: string, supplierId: string | null) {
    await updateShoppingItemSupplier(id, supplierId);
    await load();
  }

  useEffect(() => {
    load();
  }, []);

  const filteredItems = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((item) => item.status === filter);
  }, [items, filter]);

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Lista de compras</h1>
          <p className="text-sm text-gray-600">
            Pendientes, comprados, proveedor y envío por WhatsApp
          </p>
        </div>

        <div className="flex gap-2">
          <button
            className={`rounded-lg border px-3 py-2 text-sm ${filter === "all" ? "bg-gray-900 text-white" : ""}`}
            onClick={() => setFilter("all")}
          >
            Todos
          </button>
          <button
            className={`rounded-lg border px-3 py-2 text-sm ${filter === "pending" ? "bg-gray-900 text-white" : ""}`}
            onClick={() => setFilter("pending")}
          >
            Pendientes
          </button>
          <button
            className={`rounded-lg border px-3 py-2 text-sm ${filter === "bought" ? "bg-gray-900 text-white" : ""}`}
            onClick={() => setFilter("bought")}
          >
            Comprados
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-red-700">{error}</div>
      )}

      <ShoppingList
        items={filteredItems}
        suppliers={suppliers}
        onMarkBought={handleMarkBought}
        onMarkPending={handleMarkPending}
        onDelete={handleDelete}
        onChangeSupplier={handleChangeSupplier}
      />
    </div>
  );
}