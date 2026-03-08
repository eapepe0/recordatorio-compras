import { useEffect, useState } from "react";
import { enablePushNotifications } from "../services/push";
import {
  getActiveReminderRules,
  getLowStockProducts,
  getPendingShoppingItemsToday,
  getRecentShoppingItems,
} from "../services/dashboard";
import { StatCard } from "../components/dashboard/StatCard";
import { DashboardSection } from "../components/dashboard/DashboardSection";
import type { Product, ShoppingItem } from "../types/db";
import type { ReminderRuleWithProduct } from "../services/dashboard";
import { sendTestPush } from "../services/testPush";

const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY as string;

export function DashboardPage() {
  const [pushLoading, setPushLoading] = useState(false);
  const [pushMessage, setPushMessage] = useState<string | null>(null);

  const [pendingToday, setPendingToday] = useState<ShoppingItem[]>([]);
  const [lowStock, setLowStock] = useState<Product[]>([]);
  const [activeRules, setActiveRules] = useState<ReminderRuleWithProduct[]>([]);
  const [recentItems, setRecentItems] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);

      const [pendingData, lowStockData, activeRulesData, recentItemsData] =
        await Promise.all([
          getPendingShoppingItemsToday(),
          getLowStockProducts(),
          getActiveReminderRules(),
          getRecentShoppingItems(),
        ]);

      setPendingToday(pendingData);
      setLowStock(lowStockData);
      setActiveRules(activeRulesData);
      setRecentItems(recentItemsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-3">
        <button
          className="rounded-lg bg-gray-900 px-4 py-2 text-white disabled:opacity-60"
          disabled={pushLoading}
          onClick={async () => {
            try {
              setPushLoading(true);
              setPushMessage(null);
              await enablePushNotifications(vapidPublicKey);
              setPushMessage("Notificaciones activadas");
            } catch (e) {
              console.error(e);
              setPushMessage(
                e instanceof Error
                  ? e.message
                  : "Error activando notificaciones",
              );
            } finally {
              setPushLoading(false);
            }
          }}
        >
          {pushLoading ? "Activando..." : "Activar notificaciones"}
        </button>

        <button className="rounded-lg border px-4 py-2" onClick={load}>
          Actualizar dashboard
        </button>
        <button
          className="rounded-lg border px-4 py-2"
          onClick={async () => {
            try {
              const result = await sendTestPush();
              alert(`Push enviado. Suscripciones alcanzadas: ${result.sent}`);
            } catch (e) {
              alert(e instanceof Error ? e.message : "Error enviando push");
            }
          }}
        >
          Probar push
        </button>
      </div>

      {pushMessage && (
        <div className="rounded-lg bg-white p-3 text-sm shadow-sm">
          {pushMessage}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-gray-600">
          Resumen general de compras, stock y reglas
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-red-700">{error}</div>
      )}

      {loading ? (
        <div className="rounded-lg bg-white p-4 shadow-sm">Cargando...</div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard
              title="Pendientes de hoy"
              value={pendingToday.length}
              subtitle="Items con vencimiento para hoy"
            />
            <StatCard
              title="Stock bajo"
              value={lowStock.length}
              subtitle="Productos por debajo o igual al mínimo"
            />
            <StatCard
              title="Reglas activas"
              value={activeRules.length}
              subtitle="Recordatorios habilitados"
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <DashboardSection title="Pendientes de hoy">
              {pendingToday.length === 0 ? (
                <p className="text-sm text-gray-600">
                  No hay pendientes para hoy.
                </p>
              ) : (
                <ul className="space-y-2">
                  {pendingToday.map((item) => (
                    <li key={item.id} className="rounded-lg border p-3">
                      <div className="font-medium">
                        {item.product?.name ?? "Producto"}
                      </div>
                      <div className="text-sm text-gray-600">
                        Fuente: {item.source}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </DashboardSection>

            <DashboardSection title="Productos con stock bajo">
              {lowStock.length === 0 ? (
                <p className="text-sm text-gray-600">
                  No hay productos con stock bajo.
                </p>
              ) : (
                <ul className="space-y-2">
                  {lowStock.map((product) => (
                    <li key={product.id} className="rounded-lg border p-3">
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-600">
                        Stock actual: {product.stock_current} · Mínimo:{" "}
                        {product.stock_min}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </DashboardSection>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <DashboardSection title="Reglas activas">
              {activeRules.length === 0 ? (
                <p className="text-sm text-gray-600">No hay reglas activas.</p>
              ) : (
                <ul className="space-y-2">
                  {activeRules.slice(0, 5).map((rule) => (
                    <li key={rule.id} className="rounded-lg border p-3">
                      <div className="font-medium">
                        {rule.product?.name ?? "Producto sin nombre"}
                      </div>
                      <div className="text-sm text-gray-600">
                        Tipo: {rule.type} · Hora: {rule.notify_time ?? "-"}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </DashboardSection>

            <DashboardSection title="Últimos movimientos de compras">
              {recentItems.length === 0 ? (
                <p className="text-sm text-gray-600">
                  Todavía no hay movimientos.
                </p>
              ) : (
                <ul className="space-y-2">
                  {recentItems.map((item) => (
                    <li key={item.id} className="rounded-lg border p-3">
                      <div className="font-medium">
                        {item.product?.name ?? "Producto"}
                      </div>
                      <div className="text-sm text-gray-600">
                        Estado: {item.status} · Fuente: {item.source}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </DashboardSection>
          </div>
        </>
      )}
    </div>
  );
}
