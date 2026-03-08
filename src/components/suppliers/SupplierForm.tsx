import { useEffect, useState } from "react";
import type { Supplier } from "../../types/db";
import type { SupplierInput } from "../../services/suppliers";

type Props = {
  onSubmit: (values: SupplierInput) => Promise<void>;
  initialValues?: Supplier | null;
  submitLabel?: string;
};

const emptyForm: SupplierInput = {
  name: "",
  contact_name: "",
  phone: "",
  email: "",
  notes: "",
  is_active: true,
};

export function SupplierForm({
  onSubmit,
  initialValues,
  submitLabel,
}: Props) {
  const [form, setForm] = useState<SupplierInput>(emptyForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialValues) {
      setForm({
        name: initialValues.name,
        contact_name: initialValues.contact_name ?? "",
        phone: initialValues.phone ?? "",
        email: initialValues.email ?? "",
        notes: initialValues.notes ?? "",
        is_active: initialValues.is_active,
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
      if (!initialValues) {
        setForm(emptyForm);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 rounded-xl bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold">
        {initialValues ? "Editar proveedor" : "Nuevo proveedor"}
      </h2>

      <input
        className="rounded-lg border px-3 py-2"
        placeholder="Nombre / Empresa"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />

      <input
        className="rounded-lg border px-3 py-2"
        placeholder="Nombre de contacto"
        value={form.contact_name ?? ""}
        onChange={(e) => setForm({ ...form, contact_name: e.target.value })}
      />

      <input
        className="rounded-lg border px-3 py-2"
        placeholder="Teléfono"
        value={form.phone ?? ""}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />

      <input
        className="rounded-lg border px-3 py-2"
        placeholder="Email"
        type="email"
        value={form.email ?? ""}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <textarea
        className="rounded-lg border px-3 py-2"
        placeholder="Notas"
        value={form.notes ?? ""}
        onChange={(e) => setForm({ ...form, notes: e.target.value })}
      />

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.is_active}
          onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
        />
        Proveedor activo
      </label>

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-gray-900 px-4 py-2 font-medium text-white"
      >
        {loading ? "Guardando..." : submitLabel ?? "Guardar proveedor"}
      </button>
    </form>
  );
}