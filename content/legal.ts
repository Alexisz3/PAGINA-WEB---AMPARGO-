import type { AppLocale } from "@/i18n/routing";

/**
 * Textos legales: política de privacidad y términos del servicio.
 *
 * VACÍOS A PROPÓSITO, y las rutas devuelven 404 mientras lo estén.
 *
 * Antes existían como páginas publicadas cuyo único contenido era un aviso
 * que decía "no debe publicarse sin aprobación" — sobre una página que sí
 * estaba publicada y accesible. Además el aviso estaba escrito en español
 * dentro del código, así que aparecía en español también en la versión
 * inglesa. No estaban enlazadas ni en el sitemap, pero cualquiera con la URL
 * llegaba a ellas.
 *
 * Un texto legal a medias es peor que ninguno: si un cliente lo lee y luego
 * hay una disputa, ese borrador es lo que se le opondrá a la empresa. Por eso
 * la página no existe hasta que exista el texto revisado.
 *
 * Estos textos los tiene que redactar o revisar un abogado en Texas. No se
 * generan aquí ni se copian de una plantilla: una política de privacidad
 * describe lo que la empresa hace REALMENTE con los datos, y eso solo lo sabe
 * la empresa.
 */
export interface LegalDocument {
  title: Record<AppLocale, string>;
  /** Cuerpo en párrafos, ya revisado legalmente. */
  body: Record<AppLocale, string[]>;
  /** Fecha de última revisión, en ISO. Se muestra al pie del documento. */
  updated: string;
}

export const PRIVACY_POLICY: LegalDocument | null = null;
export const TERMS_OF_SERVICE: LegalDocument | null = null;
