import { useEffect, useState } from "react";
import { ProductForm } from "../components/products/ProductForm";
import { ProductTable } from "../components/products/ProductTable";
import { createProduct, getProducts, type ProductInput } from "../services/products";
import type { Product } from "../types/db";

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setError(null);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando productos");
    }
  }

  async function handleCreate(values: ProductInput) {
    await createProduct(values);
    await load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-[360px_1fr]">
      <ProductForm onSubmit={handleCreate} />

      <div className="grid gap-3">
        <div>
          <h1 className="text-2xl font-bold">Productos</h1>
          <p className="text-sm text-gray-600">Alta y consulta de productos</p>
        </div>

        {error && <div className="rounded-lg bg-red-50 p-3 text-red-700">{error}</div>}

        <ProductTable products={products} />
      </div>
    </div>
  );
}