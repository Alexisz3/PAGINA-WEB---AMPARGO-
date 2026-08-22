import { notFound } from "next/navigation";

/**
 * Detalle de servicio: la ruta existe en el registro para que el sistema de
 * i18n sea completo, pero NO se publica ninguna página todavía.
 *
 * Motivo: el contenido real de cada servicio (alcance, entregables, plazos)
 * no ha sido confirmado por el cliente, y la regla del proyecto prohíbe
 * publicar cajas "PENDIENTE" como relleno visible para el visitante.
 * Devuelve 404 hasta que exista contenido verificado.
 */
export default function ServiceDetail() {
  notFound();
}
