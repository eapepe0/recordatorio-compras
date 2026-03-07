import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { DashboardPage } from "./pages/DashboardPage";
import { ProductsPage } from "./pages/ProductsPage";
import { ReminderRulesPage } from "./pages/ReminderRulesPage";
import { ShoppingListPage } from "./pages/ShoppingListPage";

export default function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/productos" element={<ProductsPage />} />
          <Route path="/reglas" element={<ReminderRulesPage />} />
          <Route path="/compras" element={<ShoppingListPage />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}