import type { Supplier } from "../../types/db";

type Props = {
  suppliers: Supplier[];
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplier: Supplier) => Promise<void>;
};

export function SupplierTable({ suppliers, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-4 py-3">Proveedor</th>
            <th className="px-4 py-3">Contacto</th>
            <th className="px-4 py-3">Teléfono</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr key={supplier.id} className="border-t">
              <td className="px-4 py-3 font-medium">{supplier.name}</td>
              <td className="px-4 py-3">{supplier.contact_name ?? "-"}</td>
              <td className="px-4 py-3">{supplier.phone ?? "-"}</td>
              <td className="px-4 py-3">{supplier.email ?? "-"}</td>
              <td className="px-4 py-3">
                {supplier.is_active ? "Activo" : "Inactivo"}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button
                    className="rounded-lg border px-3 py-1"
                    onClick={() => onEdit(supplier)}
                  >
                    Editar
                  </button>
                  <button
                    className="rounded-lg border border-red-300 px-3 py-1 text-red-700"
                    onClick={() => onDelete(supplier)}
                  >
                    Borrar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}