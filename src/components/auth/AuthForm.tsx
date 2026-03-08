import { useState } from "react";
import { signIn, signUp } from "../../services/auth";

export function AuthForm() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (mode === "login") {
        await signIn(email, password);
      } else {
        await signUp(email, password);
        setMessage("Cuenta creada. Revisá el mail si tenés confirmación activada.");
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Error de autenticación");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-xl bg-white p-6 shadow-sm">
      <h1 className="mb-4 text-2xl font-bold">
        {mode === "login" ? "Ingresar" : "Crear cuenta"}
      </h1>

      <form onSubmit={handleSubmit} className="grid gap-3">
        <input
          className="rounded-lg border px-3 py-2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="rounded-lg border px-3 py-2"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          className="rounded-lg bg-gray-900 px-4 py-2 font-medium text-white"
          type="submit"
          disabled={loading}
        >
          {loading ? "Procesando..." : mode === "login" ? "Ingresar" : "Registrarme"}
        </button>
      </form>

      {message && <p className="mt-3 text-sm text-gray-700">{message}</p>}

      <button
        className="mt-4 text-sm text-blue-600"
        onClick={() => setMode(mode === "login" ? "signup" : "login")}
        type="button"
      >
        {mode === "login" ? "No tengo cuenta" : "Ya tengo cuenta"}
      </button>
    </div>
  );
}