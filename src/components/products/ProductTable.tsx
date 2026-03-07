import type { Product } from "../../types/db";

type Props = {
  products: Product[];
};

export function ProductTable({ products }: Props) {
  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-4 py-3">Producto</th>
            <th className="px-4 py-3">Categoría</th>
            <th className="px-4 py-3">Proveedor</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3">Mínimo</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-t">
              <td className="px-4 py-3 font-medium">{product.name}</td>
              <td className="px-4 py-3">{product.category ?? "-"}</td>
              <td className="px-4 py-3">{product.supplier ?? "-"}</td>
              <td className="px-4 py-3">{product.stock_current}</td>
              <td className="px-4 py-3">{product.stock_min}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}