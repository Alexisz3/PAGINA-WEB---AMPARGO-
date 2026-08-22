/**
 * Construye un enlace `wa.me` con el mensaje ya redactado.
 *
 * Un enlace `wa.me` NO envía nada: abre WhatsApp con el texto preparado y es
 * el usuario quien decide pulsar «Enviar». No existe acuse de recibo, así que
 * ninguna parte de la interfaz puede afirmar que el mensaje se entregó.
 */
export function buildWhatsAppLink(phone: string, message: string): string | null {
  const digits = phone.replace(/\D/g, "");

  // Sin esta guardia, un teléfono vacío producía `https://wa.me/?text=…`,
  // un enlace roto que abre WhatsApp sin destinatario.
  // Los números de EE. UU. en E.164 tienen 11 dígitos (1 + 10).
  if (digits.length < 10 || digits.length > 15) return null;

  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
