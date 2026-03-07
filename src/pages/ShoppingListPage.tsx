import { useEffect, useState } from "react";
import { ShoppingList } from "../components/shopping/ShoppingList";
import { getShoppingItems, markShoppingItemBought } from "../services/shopping";
import type { ShoppingItem } from "../types/db";

export function ShoppingListPage() {
  const [items, setItems] = useState<ShoppingItem[]>([]);

  async function load() {
    const data = await getShoppingItems();
    setItems(data);
  }

  async function handleMarkBought(id: string) {
    await markShoppingItemBought(id);
    await load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-2xl font-bold">Lista de compras</h1>
        <p className="text-sm text-gray-600">Pendientes y comprados</p>
      </div>
      <ShoppingList items={items} onMarkBought={handleMarkBought} />
    </div>
  );
}