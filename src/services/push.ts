import { supabase } from "../lib/supabase";

let enablingPush = false;

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

export async function enablePushNotifications(vapidPublicKey: string) {
  if (enablingPush) {
    console.log("Ya se está activando push, se ignora llamada duplicada");
    return;
  }

  enablingPush = true;

  try {
    if (!("serviceWorker" in navigator)) {
      throw new Error("Este navegador no soporta service workers");
    }

    if (!("PushManager" in window)) {
      throw new Error("Este navegador no soporta push notifications");
    }

    if (!("Notification" in window)) {
      throw new Error("Este navegador no soporta notificaciones");
    }

    if (!vapidPublicKey) {
      throw new Error("Falta VITE_VAPID_PUBLIC_KEY");
    }

    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      throw new Error(`Permiso de notificaciones: ${permission}`);
    }

    const registration = await navigator.serviceWorker.register("/sw.js");
    await navigator.serviceWorker.ready;

    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });
    }

    const json = subscription.toJSON();

    if (!json.endpoint) {
      throw new Error("La suscripción push no tiene endpoint");
    }

    if (!json.keys?.p256dh) {
      throw new Error("La suscripción push no tiene p256dh");
    }

    if (!json.keys?.auth) {
      throw new Error("La suscripción push no tiene auth");
    }

    localStorage.setItem("current_push_endpoint", json.endpoint);
    
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError) throw authError;

    const user = authData.user;
    if (!user) throw new Error("No autenticado");

    const payload = {
      user_id: user.id,
      endpoint: json.endpoint,
      p256dh: json.keys.p256dh,
      auth: json.keys.auth,
      user_agent: navigator.userAgent,
    };

    console.log("Guardando subscription:", payload);

    const { error } = await supabase
      .from("push_subscriptions")
      .upsert(payload, { onConflict: "user_id,endpoint" });

    if (error) throw error;

    return payload;
  } finally {
    enablingPush = false;
  }
}