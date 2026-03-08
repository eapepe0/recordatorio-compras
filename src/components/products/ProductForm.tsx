import { useEffect, useState } from "react";
import type { Product, Supplier } from "../../types/db";
import type { ProductInput } from "../../services/products";

type Props = {
  onSubmit: (values: ProductInput) => Promise<void>;
  initialValues?: Product | null;
  suppliers: Supplier[];
  submitLabel?: string;
};

const emptyForm: ProductInput = {
  name: "",
  category: "",
  supplier: "",
  supplier_id: null,
  unit: "unidad",
  stock_current: 0,
  stock_min: 0,
  is_active: true,
  notes: "",
};

export function ProductForm({
  onSubmit,
  initialValues,
  suppliers,
  submitLabel,
}: Props) {
  const [form, setForm] = useState<ProductInput>(emptyForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialValues) {
      setForm({
        name: initialValues.name,
        category: initialValues.category ?? "",
        supplier: initialValues.supplier ?? "",
        supplier_id: initialValues.supplier_id ?? null,
        unit: initialValues.unit ?? "unidad",
        stock_current: initialValues.stock_current,
        stock_min: initialValues.stock_min,
        is_active: initialValues.is_active,
        notes: initialValues.notes ?? "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialValues]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(form);
      if (!initialValues) setForm(emptyForm);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 rounded-xl bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold">
        {initialValues ? "Editar producto" : "Nuevo producto"}
      </h2>

      <input
        className="rounded-lg border px-3 py-2"
        placeholder="Nombre"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />

      <input
        className="rounded-lg border px-3 py-2"
        placeholder="Categoría"
        value={form.category ?? ""}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      />

      <select
        className="rounded-lg border px-3 py-2"
        value={form.supplier_id ?? ""}
        onChange={(e) =>
          setForm({
            ...form,
            supplier_id: e.target.value || null,
          })
        }
      >
        <option value="">Sin proveedor</option>
        {suppliers.map((supplier) => (
          <option key={supplier.id} value={supplier.id}>
            {supplier.name}
          </option>
        ))}
      </select>

      <div className="grid grid-cols-2 gap-3">
        <input
          className="rounded-lg border px-3 py-2"
          placeholder="Stock actual"
          type="number"
          value={form.stock_current}
          onChange={(e) => setForm({ ...form, stock_current: Number(e.target.value) })}
        />
        <input
          className="rounded-lg border px-3 py-2"
          placeholder="Stock mínimo"
          type="number"
          value={form.stock_min}
          onChange={(e) => setForm({ ...form, stock_min: Number(e.target.value) })}
        />
      </div>

      <textarea
        className="rounded-lg border px-3 py-2"
        placeholder="Notas"
        value={form.notes ?? ""}
        onChange={(e) => setForm({ ...form, notes: e.target.value })}
      />

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-gray-900 px-4 py-2 font-medium text-white"
      >
        {loading ? "Guardando..." : submitLabel ?? "Guardar"}
      </button>
    </form>
  );
}