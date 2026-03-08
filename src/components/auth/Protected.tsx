import { useAuth } from "../../context/AuthContext";
import { AuthForm } from "./AuthForm";

export function Protected({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-6">Cargando...</div>;
  }

  if (!user) {
    return <AuthForm />;
  }

  return <>{children}</>;
}