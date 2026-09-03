/**
 * Construye un enlace `mailto:` con el asunto y el cuerpo ya redactados.
 *
 * Mismo principio que `buildWhatsAppLink`: un `mailto:` NO envía nada, abre
 * el programa de correo predeterminado con el mensaje preparado y es la
 * persona quien pulsa «Enviar». No hay acuse de recibo, así que ninguna
 * parte de la interfaz puede afirmar que el correo se entregó.
 */
export function buildMailtoLink(email: string, subject: string, body: string): string | null {
  const address = email.trim();

  // Sin esta guardia, un correo vacío o mal configurado produciría
  // `mailto:?subject=...`, un enlace que abre el programa de correo sin
  // destinatario.
  if (!address || !/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(address)) return null;

  // `URLSearchParams` codifica el espacio como `+` (application/x-www-form-
  // urlencoded); un URI `mailto:` exige `%20` (RFC 6068), así que se codifica
  // cada parte a mano en vez de delegar en ese helper.
  return `mailto:${address}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
