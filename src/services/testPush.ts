import { supabase } from "../lib/supabase";

export async function sendTestPush() {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) throw sessionError;
  if (!session?.access_token) throw new Error("No hay sesión activa");

  if (!("serviceWorker" in navigator)) {
    throw new Error("Este navegador no soporta service workers");
  }

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    throw new Error("Este dispositivo no tiene una suscripción push activa");
  }

  const json = subscription.toJSON();

  if (!json.endpoint) {
    throw new Error("La suscripción push activa no tiene endpoint");
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
      body: JSON.stringify({ endpoint: json.endpoint }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "Error enviando push de prueba");
  }

  return data;
}