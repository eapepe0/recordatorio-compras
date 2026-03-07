import { Link, NavLink } from "react-router-dom";
import type { PropsWithChildren } from "react";

const navClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium ${
    isActive ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-200"
  }`;

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-lg font-bold text-gray-900">
            Compras
          </Link>

          <nav className="flex gap-2">
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
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}