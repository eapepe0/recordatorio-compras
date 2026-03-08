import { supabase } from "../lib/supabase";

export async function sendTestPush() {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) throw sessionError;
  if (!session?.access_token) throw new Error("No hay sesión activa");

  const endpoint = localStorage.getItem("current_push_endpoint");

  if (!endpoint) {
    throw new Error("No hay endpoint push guardado en este dispositivo");
  }

  const response = await fetch(
    "https://qbiltrszhurgihdtvemj.supabase.co/functions/v1/send-test-push",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string,
      },
      body: JSON.stringify({ endpoint }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "Error enviando push de prueba");
  }

  return data;
}