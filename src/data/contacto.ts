/**
 * Fuente única de verdad para los datos de contacto de Grupo Crear.
 *
 * Antes estaban repetidos a mano en 8 sitios (Layout, Footer, ChatWidget,
 * index, servicios y [slug]), lo que provocó que un número de marcador de
 * posición llegara al build de producción. Todo consumo debe importarse
 * desde aquí — nunca escribir un número o correo literal en un componente.
 *
 * Estos mismos valores alimentarán el JSON-LD de LocalBusiness, así que
 * cualquier inconsistencia se propaga al SEO local y a los motores
 * generativos. Un NAP (Name-Address-Phone) coherente en todo el sitio es
 * requisito, no detalle.
 */

export interface Contacto {
  /** Número en formato E.164 sin '+' ni espacios, como lo exige wa.me */
  whatsapp: string;
  /** Teléfono fijo en formato E.164, para href="tel:" */
  telefono: string;
  /** Etiqueta legible del teléfono, para mostrar en pantalla */
  telefonoDisplay: string;
  email: string;
  ciudad: string;
  pais: string;
  /** Código ISO 3166-1 alfa-2, usado en el JSON-LD */
  paisCodigo: string;
}

// ⚠️ PENDIENTE: los tres primeros valores son marcadores de posición.
// Reemplazar por los datos reales antes de publicar.
export const contacto: Contacto = {
  whatsapp: '573000000000',
  telefono: '+576010000000',
  telefonoDisplay: '(601) 000 0000',
  email: 'info@grupocrear.com',
  ciudad: 'Bogotá',
  pais: 'Colombia',
  paisCodigo: 'CO',
};

/**
 * URL base de WhatsApp, sin mensaje.
 * Úsala cuando el texto YA está codificado (p. ej. `servicios.whatsappText`,
 * que se genera con encodeURIComponent): `${waBase}?text=${s.whatsappText}`.
 * Pasarlo por waLink() lo codificaría dos veces.
 */
export const waBase = `https://wa.me/${contacto.whatsapp}`;

/** URL de WhatsApp con mensaje en texto plano; se encarga de codificarlo. */
export function waLink(texto?: string): string {
  return texto ? `${waBase}?text=${encodeURIComponent(texto)}` : waBase;
}

/** href="tel:" a partir del teléfono canónico. */
export const telLink = `tel:${contacto.telefono}`;

/** href="mailto:" a partir del correo canónico. */
export const mailtoLink = `mailto:${contacto.email}`;
