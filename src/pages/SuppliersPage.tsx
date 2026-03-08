import { useEffect, useState } from "react";
import { SupplierForm } from "../components/suppliers/SupplierForm";
import { SupplierTable } from "../components/suppliers/SupplierTable";
import {
  createSupplier,
  deleteSupplier,
  getSuppliers,
  updateSupplier,
  type SupplierInput,
} from "../services/suppliers";
import type { Supplier } from "../types/db";

export function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setError(null);
      const data = await getSuppliers();
      setSuppliers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando proveedores");
    }
  }

  async function handleSubmit(values: SupplierInput) {
    if (editing) {
      await updateSupplier(editing.id, values);
      setEditing(null);
    } else {
      await createSupplier(values);
    }

    await load();
  }

  async function handleDelete(supplier: Supplier) {
    const ok = window.confirm(`¿Borrar proveedor "${supplier.name}"?`);
    if (!ok) return;

    await deleteSupplier(supplier.id);

    if (editing?.id === supplier.id) {
      setEditing(null);
    }

    await load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-[360px_1fr]">
      <SupplierForm
        onSubmit={handleSubmit}
        initialValues={editing}
        submitLabel={editing ? "Actualizar proveedor" : "Guardar proveedor"}
      />

      <div className="grid gap-3">
        <div>
          <h1 className="text-2xl font-bold">Proveedores</h1>
          <p className="text-sm text-gray-600">
            Alta, edición y borrado de proveedores
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

        <SupplierTable
          suppliers={suppliers}
          onEdit={setEditing}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}