import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { DashboardPage } from "./pages/DashboardPage";
import { ProductsPage } from "./pages/ProductsPage";
import { ReminderRulesPage } from "./pages/ReminderRulesPage";
import { ShoppingListPage } from "./pages/ShoppingListPage";
import { Protected } from "./components/auth/Protected";
import { SuppliersPage } from "./pages/SuppliersPage";

export default function App() {
  return (
    <BrowserRouter>
      <Protected>
        <AppShell>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/productos" element={<ProductsPage />} />
            <Route path="/reglas" element={<ReminderRulesPage />} />
            <Route path="/compras" element={<ShoppingListPage />} />
            <Route path="/proveedores" element={<SuppliersPage />} />
          </Routes>
        </AppShell>
      </Protected>
    </BrowserRouter>
  );
}