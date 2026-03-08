import { useEffect, useState } from "react";
import { ProductForm } from "../components/products/ProductForm";
import { ProductTable } from "../components/products/ProductTable";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
  type ProductInput,
} from "../services/products";
import { getSuppliers } from "../services/suppliers";
import type { Product, Supplier } from "../types/db";

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setError(null);
      const [productsData, suppliersData] = await Promise.all([
        getProducts(),
        getSuppliers(),
      ]);
      setProducts(productsData);
      setSuppliers(suppliersData.filter((s) => s.is_active));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando productos");
    }
  }

  async function handleSubmit(values: ProductInput) {
    if (editing) {
      await updateProduct(editing.id, values);
      setEditing(null);
    } else {
      await createProduct(values);
    }
    await load();
  }

  async function handleDelete(product: Product) {
    const ok = window.confirm(`¿Borrar "${product.name}"?`);
    if (!ok) return;
    await deleteProduct(product.id);
    if (editing?.id === product.id) setEditing(null);
    await load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-[360px_1fr]">
      <ProductForm
        onSubmit={handleSubmit}
        initialValues={editing}
        suppliers={suppliers}
        submitLabel={editing ? "Actualizar producto" : "Guardar producto"}
      />

      <div className="grid gap-3">
        <div>
          <h1 className="text-2xl font-bold">Productos</h1>
          <p className="text-sm text-gray-600">Alta, edición y borrado</p>
        </div>

        {editing && (
          <button
            className="w-fit rounded-lg border px-3 py-2"
            onClick={() => setEditing(null)}
          >
            Cancelar edición
          </button>
        )}

        {error && <div className="rounded-lg bg-red-50 p-3 text-red-700">{error}</div>}

        <ProductTable
          products={products}
          onEdit={setEditing}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}