import { Link, NavLink } from "react-router-dom";
import type { PropsWithChildren } from "react";
import { signOut } from "../../services/auth";

const navClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium text-center transition ${
    isActive
      ? "bg-gray-900 text-white"
      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
  }`;

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <Link to="/" className="text-lg font-bold text-gray-900">
              Compras
            </Link>

            <button
              className="hidden rounded-lg border px-3 py-2 text-sm md:inline-flex"
              onClick={() => signOut()}
            >
              Salir
            </button>
          </div>

          <nav className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:flex md:flex-wrap md:gap-2">
            <NavLink to="/" end className={navClass}>
              Dashboard
            </NavLink>
            <NavLink to="/productos" className={navClass}>
              Productos
            </NavLink>
            <NavLink to="/reglas" className={navClass}>
              Reglas
            </NavLink>
            <NavLink to="/compras" className={navClass}>
              Compras
            </NavLink>
            <NavLink to="/proveedores" className={navClass}>
              Proveedores
            </NavLink>
          </nav>

          <div className="mt-3 md:hidden">
            <button
              className="w-full rounded-lg border px-3 py-2 text-sm"
              onClick={() => signOut()}
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}