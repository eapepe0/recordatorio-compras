export function DashboardPage() {
  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <div className="text-sm text-gray-500">Pendientes hoy</div>
          <div className="mt-2 text-3xl font-bold">0</div>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm">
          <div className="text-sm text-gray-500">Stock bajo</div>
          <div className="mt-2 text-3xl font-bold">0</div>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm">
          <div className="text-sm text-gray-500">Próximos recordatorios</div>
          <div className="mt-2 text-3xl font-bold">0</div>
        </div>
      </div>
    </div>
  );
}