export type WhatsAppSupplier = {
  nombre: string;
  telefono: string;
};

export type WhatsAppItem = {
  productName: string;
  quantity: number;
};

export interface WhatsAppMessageData {
  items: WhatsAppItem[];
  supplier: WhatsAppSupplier;
}

function getRandomIcon() {
  const icons = [
    "\u{25B6}\u{FE0F}",
    "\u{27A1}\u{FE0F}",
    "\u{1F539}",
    "\u{2795}",
    "\u{1F31F}",
    "\u{26A1}\u{FE0F}",
    "\u{2600}\u{FE0F}",
    "\u{1F449}",
    "\u{1F366}",
  ];

  const i = Math.floor(Math.random() * icons.length);
  return icons[i];
}

function isMobileDevice(): boolean {
  if ((navigator as Navigator & { userAgentData?: { mobile?: boolean } }).userAgentData?.mobile !== undefined) {
    return !!(navigator as Navigator & { userAgentData?: { mobile?: boolean } }).userAgentData?.mobile;
  }

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

export function generateWhatsAppMessage({
  items,
  supplier,
}: WhatsAppMessageData): string {
  const iconoElegido = getRandomIcon();

  const productList = items
    .map(
      (item) =>
        `${iconoElegido} ${item.productName} , *cantidad* : ${item.quantity}`
    )
    .join("\n");

  const templates = [
    `¡Hola *${supplier.nombre}*!\nTe escribo para hacerte un pedido:\n\n${productList}\n\nSi hay algo en falta, por favor avisame.\n¡Muchas gracias! 🙏`,

    `Buenas *${supplier.nombre}*!\nNecesito lo siguiente para esta semana:\n\n${productList}\n\nCualquier producto que no tengas, decime así lo ajustamos.\nGracias!`,

    `Hola *${supplier.nombre}*, ¿qué tal?\nQuiero pedirte:\n\n${productList}\n\nAvisame si hay algún faltante.\nSaludos!`,

    `¡Hola *${supplier.nombre}*!\nTe paso el pedido de hoy:\n\n${productList}\n\nGracias por tu atención 🙌`,
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}

export function openWhatsApp(phoneNumber: string, message: string): void {
  const cleanPhone = phoneNumber.replace(/[^\d+]/g, "");
  const params = new URLSearchParams({ text: message });

  const whatsappUrl = isMobileDevice()
    ? `whatsapp://send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`
    : `https://web.whatsapp.com/send?phone=${cleanPhone}&${params.toString()}`;

  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
}

export function sendOrderToWhatsApp(
  items: WhatsAppItem[],
  supplier: WhatsAppSupplier
): void {
  if (!supplier.telefono) {
    throw new Error("El proveedor no tiene teléfono cargado");
  }

  if (items.length === 0) {
    throw new Error("No hay items para enviar");
  }

  const message = generateWhatsAppMessage({ items, supplier });
  openWhatsApp(supplier.telefono, message);
}