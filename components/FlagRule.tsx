/**
 * Filete de bandera — el guiño estadounidense de la identidad.
 *
 * Es la bandera reducida a lo mínimo que sigue siendo reconocible: la
 * proporción del cantón (2/5 del ancho) en azul marino y el resto en rojo.
 * Nada más.
 *
 * Deliberadamente SIN estrellas ni franjas dibujadas. En Estados Unidos, un
 * emblema con estrellas y barras en la papelería de un contratista se lee como
 * acreditación oficial, y esta empresa no tiene licencia ni seguro confirmados
 * por escrito: insinuar un respaldo institucional inexistente es un problema
 * real, no una cuestión de gusto.
 *
 * Tres píxeles de alto y sin texto: aparece una vez por página, en el borde
 * superior, donde el ojo lo registra sin que llegue a competir con nada.
 */
export default function FlagRule({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex h-[3px] w-full ${className}`}
      // Es ornamento puro: no aporta información y no debe anunciarse.
      aria-hidden="true"
    >
      {/* Cantón: 2/5 del ancho, la proporción real de la bandera. */}
      <span className="h-full w-[38%] bg-[#1B2A4A]" />
      <span className="h-full flex-1 bg-accent" />
    </div>
  );
}
