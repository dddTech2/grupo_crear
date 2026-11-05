export interface Entregable {
  svg: string;
  nombre: string;
  desc: string;
}

export interface Foto {
  src: string; // ruta desde /public, ej. /servicios/impresion-gran-formato/archivo.webp
  alt: string; // descripción accesible de la pieza física
}

export interface Paso {
  num: string;
  titulo: string;
  desc: string;
}

export interface Servicio {
  slug: string;
  numero: string;
  nombre: string;
  nombreCorto: string;
  descripcionCorta: string;
  descripcionLarga: string;
  chips: string[];
  entregables: Entregable[];
  fotos: Foto[];          // se llenan al subir las fotos clasificadas por servicio
  fotoPrincipal: string;  // fondo de la bento card (usa gradiente si está vacío)
  videoPrincipal?: string; // si existe, reemplaza a la foto en el hero del servicio
  reto: string;           // tensión del capítulo «Reto»; <em> marca el remate
  whatsappText: string;   // texto URL-encoded para pre-llenar WhatsApp
  gradiente: string;      // fallback CSS gradient cuando no hay foto
  pasos: Paso[];          // metodología personalizada por servicio
}

export const servicios: Servicio[] = [
  {
    slug: 'impresion-gran-formato',
    numero: '01',
    nombre: 'Impresión Gran Formato',
    nombreCorto: 'Gran Formato',
    reto: 'En la calle nadie se detiene a leer. Si tu pieza no se ve de lejos y con el color exacto de tu marca, <em>es como si no existiera.</em>',
    descripcionCorta: 'Vallas, pendones, lonas y backlight con calidad fotográfica y color fiel a tu marca.',
    descripcionLarga:
      'Producción e impresión de gran escala para cualquier superficie. Trabajamos con los mejores materiales del mercado y tecnología de punta para garantizar colores exactos a tu manual de marca, sin importar el tamaño o el soporte.',
    chips: ['Vallas', 'Pendones', 'Backlight'],
    entregables: [
      { svg: 'M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22v-7', nombre: 'Vallas publicitarias', desc: 'Hasta 10×4 m, exterior e interior, con estructura.' },
      { svg: 'M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 0 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 0-2-2V9m0 0h18', nombre: 'Pendones y lonas', desc: 'Lona blackout, mesh y vinilo con bolsillo.' },
      { svg: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z', nombre: 'Avisos, cajas de luz, avisos bronce', desc: 'Cajas de luz con iluminación LED integrada.' },
      { svg: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', nombre: 'Stands de exhibición', desc: 'Estructura, armatoste y gráfica integrados.' },
      { svg: 'M7 21a4 4 0 0 1-4-4V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v12a4 4 0 0 1-4 4zm0 0h12a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-1a2 2 0 0 1 2-2h1z', nombre: 'Adhesivos y vinilos', desc: 'Corte, troquel y aplicación a la medida.' },
      { svg: 'M4 16l4.586-4.586a2 2 0 0 1 2.828 0L16 16m-2-2l1.586-1.586a2 2 0 0 1 2.828 0L20 14m-6-6h.01M6 20h12a2 2 0 0 1 2-2V6a2 2 0 0 1-2-2H6a2 2 0 0 1-2 2v12a2 2 0 0 1 2 2z', nombre: 'Canvas y lienzos', desc: 'Arte fino y decoración corporativa de alto impacto.' },
    ],
    fotos: [
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/fachada-carniceria-la-riviera.jpeg',          alt: 'Fachada e instalación comercial carnicería La Riviera con aviso luminoso' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/aviso-luminoso-la-riviera-noche.jpeg',        alt: 'Aviso luminoso La Riviera con iluminación nocturna' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/escenario-sena-cide-soacha-frontal.jpeg',    alt: 'Escenario impreso en gran formato SENA CIDE Soacha' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/letras-3d-sena-cide-soacha-panoramica.jpeg', alt: 'Letras 3D panorámica SENA CIDE Soacha' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/letras-3d-sena-cide-soacha-detalle-1.jpeg',   alt: 'Detalle de acabado e instalación de letras 3D SENA CIDE Soacha' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/letras-3d-sena-cide-soacha-detalle-2.jpeg',   alt: 'Detalle lateral de letras volumétricas 3D SENA CIDE Soacha' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/aviso-circular-grupo-crear.jpeg',             alt: 'Aviso circular decorativo e institucional Grupo Crear' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/aviso-vertical-grupo-crear.jpeg',             alt: 'Aviso vertical con iluminación Grupo Crear' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/recepcion-oficina-grupo-crear.jpeg',             alt: 'Recepción corporativa con avisos de marca Grupo Crear' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/taller-impresion-grupo-crear.jpeg',           alt: 'Taller de producción e impresión de gran formato Grupo Crear' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/aviso-cafeteria-sena-ambiente-formacion.jpeg',alt: 'Aviso señalética cafetería SENA ambiente de formación' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/aviso-direccion-fachada-sena.png',            alt: 'Aviso exterior institucional dirección fachada SENA' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/instalacion-aviso-la-riviera-andamio.jpeg',   alt: 'Montaje e instalación técnica de aviso con equipo de andamios' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/mostrador-carnes-la-riviera-aviso-circular.jpeg', alt: 'Mostrador comercial con aviso circular La Riviera' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/showroom-exhibicion-grupo-crear.jpeg',        alt: 'Showroom con sistemas de exhibición y stands' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/sistemas-de-exhibicion-sena.png',             alt: 'Estructuras y sistemas de exhibición institucional SENA' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/banderas-tipo-pluma-grupo-crear.jpeg',         alt: 'Banderas tipo pluma publicitarias para exterior' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/tablero-rompetrafico-grupo-crear.jpeg',        alt: 'Tablero rompetráfico publicitario para punto de venta' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/actividad-piso-linea-del-tiempo.webp',       alt: 'Gráfica de piso con línea de tiempo impresa y materiales de taller' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/banca-patron-geometrico-azul.webp',          alt: 'Banca de madera intervenida con patrón geométrico azul' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/banca-patron-indigena-ocre.webp',            alt: 'Banca de madera ocre con grecas e iconografía indígena' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/carpa-entrada-museo-memoria.webp',            alt: 'Carpa de acceso e itinerancia Museo de la Memoria' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/modulo-fuerza-de-lo-colectivo-detalle.webp', alt: 'Detalle de módulo expositivo interactivo la fuerza de lo colectivo' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/modulo-fuerza-de-lo-colectivo-general.webp', alt: 'Vista general de módulo expositivo la fuerza de lo colectivo' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/modulo-museo-en-casa-frontal.webp',          alt: 'Vista frontal de módulo Museo en Casa con mapas y textos' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/modulo-museo-en-casa-vitrales.webp',         alt: 'Módulo Museo en Casa integrado con entorno arquitectónico' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/modulo-territorios-vista-frontal.webp',      alt: 'Vista frontal de caja expositiva en madera territorios' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/modulo-territorios-vista-lateral.webp',      alt: 'Vista lateral de estructura de madera para exhibición' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/modulos-endulzar-la-palabra.webp',            alt: 'Sistema de módulos expositivos endulzar la palabra' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/modulos-pueblo-awa.webp',                     alt: 'Paneles de memoria y cultura del Pueblo Awá' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/modulos-pueblo-bari-y-kamentsa.webp',        alt: 'Módulos de exhibición gráfica Pueblos Barí y Kamëntšá' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/modulos-pueblo-wiwa-vista-general.webp',     alt: 'Vista general de módulos impresos Pueblo Wiwa' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/modulos-sanacion-colectiva-museo-casa.webp', alt: 'Exhibición itinerante de sanación colectiva' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/panel-afectaciones-al-territorio-wiwa.webp', alt: 'Panel infográfico sobre afectaciones al territorio Wiwa' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/panel-bienvenida-memorias-vivas.webp',        alt: 'Panel institucional de bienvenida a Memorias Vivas' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/panel-bienvenida-pueblo-pasto.webp',         alt: 'Panel expositivo de bienvenida Pueblo Pasto' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/panel-conservacion-territorio-katsa-su.webp', alt: 'Panel sobre conservación del territorio Katsa Su' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/panel-el-hilo-de-las-mujeres.webp',         alt: 'Panel temático impreso el hilo de las mujeres' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/panel-mapa-pueblos-indigenas.webp',         alt: 'Mapa en gran formato de pueblos indígenas' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/panel-resistencias-historicas-vitrales.webp', alt: 'Panel de resistencias históricas frente a arquitectura colonial' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/panel-ruama-ithuhkuna-wiwa.webp',         alt: 'Panel gráfico explicativo Ruama Ithuhkuna Wiwa' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/panel-sanacion-colectiva-catatumbo-edificio.webp', alt: 'Panel en exterior sobre sanación colectiva en Catatumbo' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/panel-sanacion-colectiva-catatumbo-frontal.webp', alt: 'Vista frontal de panel sanación colectiva Catatumbo' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/panel-sanacion-colectiva-catatumbo-nasa.webp', alt: 'Panel narrativo sanación colectiva e historia Nasa' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/panel-sanacion-colectiva-kamentsa.webp', alt: 'Panel cultural de sanación colectiva Kamëntšá' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/panel-sanacion-colectiva-vitrales.webp', alt: 'Panel impreso en gran formato de sanación colectiva' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/panel-ubicacion-pueblo-wiwa.webp',         alt: 'Panel geográfico e historia de ubicación Pueblo Wiwa' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/panel-wet-wet-fxinzenxi-nasa.webp',         alt: 'Panel temático Wet Wet Fxinzenxi del Pueblo Nasa' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/paneles-pueblo-bari-cuanto-tiempo-sanar.webp', alt: 'Sistema de paneles del Pueblo Barí' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/panoramica-exhibicion-museo-memoria.webp', alt: 'Panorámica general de la exhibición Museo de la Memoria' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/totem-pueblo-pasto.webp',                  alt: 'Tótem vertical de cuatro caras Pueblo Pasto' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/totem-pueblo-uitoto-minika.webp',          alt: 'Tótem expositivo de gran escala Pueblo Uitoto Minika' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/totem-pueblo-wiwa.webp',                   alt: 'Tótem gráfico de historia y memoria Pueblo Wiwa' },
    ],
    fotoPrincipal: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/fachada-carniceria-la-riviera.jpeg',
    whatsappText: encodeURIComponent('Hola, me interesa cotizar Impresión Gran Formato para mi empresa.'),
    gradiente: 'linear-gradient(135deg,#0a2d6b 0%,#001433 100%)',
    pasos: [
      { num: '01', titulo: 'Asesoría y Archivos', desc: 'Validamos tus archivos en resolución, color CMYK y sangrado, y te guiamos en la selección de materiales.' },
      { num: '02', titulo: 'Prueba de Color', desc: 'Hacemos muestras reales de impresión para asegurar la fidelidad cromática y los acabados solicitados.' },
      { num: '03', titulo: 'Impresión y Acabados', desc: 'Procesamiento en plotters industriales con tintas resistentes a la intemperie, sellado y colocación de ojetes.' },
      { num: '04', titulo: 'Montaje Final', desc: 'Instalación y tensado profesional en sitio para garantizar el máximo impacto y durabilidad de la pieza.' },
    ]
  },
  {
    slug: 'material-pop',
    numero: '02',
    nombre: 'Material P.O.P',
    nombreCorto: 'Material POP',
    reto: 'La decisión de compra se toma frente a la góndola. Si ahí tu marca no llama la atención, <em>la venta se la lleva la de al lado.</em>',
    descripcionCorta: 'Exhibidores, displays y activaciones de punto de venta diseñados para impulsar la decisión de compra.',
    descripcionLarga:
      'Material POP estratégico que convierte browsers en compradores. Diseñamos y producimos toda la familia de materiales de punto de venta: desde el stopper de góndola hasta el exhibidor de isla, todos alineados al visual merchandising de tu marca.',
    chips: ['Exhibidores', 'Displays', 'Stoppers'],
    entregables: [
      { svg: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', nombre: 'Exhibidores de góndola', desc: 'Stoppers, dangler y cuelgaprecio.' },
      { svg: 'M19 11H5m14 0a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2m14 0V9a2 2 0 0 0-2-2M5 11V9a2 2 0 0 1 2-2m0 0V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M7 7h10', nombre: 'Displays de mostrador', desc: 'Porta-folletos, porta-tarjetas y bases de producto.' },
      { svg: 'M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 0 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 0-2-2V9m0 0h18', nombre: 'Islas y degustación', desc: 'Estructura y gráfica para activaciones en piso.' },
      { svg: 'M7 20l4-16m2 16l4-16M6 9h14M4 15h14', nombre: 'Cenefas de góndola', desc: 'Branding lineal en punto de venta.' },
      { svg: 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2', nombre: 'Folletos y catálogos', desc: 'Diseño editorial e impresión de alta calidad.' },
      { svg: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5z', nombre: 'Empaques y cajas', desc: 'Packaging con diseño y troquel personalizados.' },
    ],
    fotos: [
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/cuadernos-agendas-ibague-limpia.jpeg',    alt: 'Cuadernos y agendas personalizadas Ibagué Limpia' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/exhibicion-kit-congreso-agua.png',          alt: 'Exhibición de kit promocional Congreso del Agua' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/kit-congreso-agua.png',                    alt: 'Kit de marca y material POP Congreso del Agua' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/kit-cuaderno-y-esfero-ibague-limpia.png',   alt: 'Kit de libreta corporativa y esfero Ibagué Limpia' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/kit-tula-y-botilito-bomberos-ibague.jpeg',  alt: 'Kit tula deportiva y botilito Bomberos Ibagué' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/kit-verde-tula-esfero-ibague.png',         alt: 'Kit ecológico tula verde y esfero Ibagué' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/botilitos-ambiente-ibague.png',             alt: 'Botilitos promocionales Ambiente Ibagué' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/botilitos-metalicos-cortolima.jpeg',        alt: 'Botilitos metálicos grabados Cortolima' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/carnet-visitante-y-cinta-policia-nacional.png', alt: 'Carnets de visitante con cinta estampada Policía Nacional' },
      { src: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/modelo-congreso-ibague.png',                alt: 'Modelo promocional con productos de marca Congreso Ibagué' },
    ],
    fotoPrincipal: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto/cuadernos-agendas-ibague-limpia.jpeg',
    whatsappText: encodeURIComponent('Hola, me interesa cotizar Material POP para activar mi punto de venta.'),
    gradiente: 'linear-gradient(135deg,#3a1306 0%,#04102a 100%)',
    pasos: [
      { num: '01', titulo: 'Visual Merchandising', desc: 'Analizamos el comportamiento en el punto de compra para diseñar exhibidores alineados a la interacción del cliente.' },
      { num: '02', titulo: 'Prototipo y Estabilidad', desc: 'Desarrollamos mockups en modelado 3D y muestras físicas para evaluar resistencia, estabilidad de carga y ensamble.' },
      { num: '03', titulo: 'Producción Directa', desc: 'Troquelado e impresión en alta definición directa sobre rígidos como cartón corrugado, acrílico, madera y poliestireno.' },
      { num: '04', titulo: 'Despliegue y Logística', desc: 'Planificamos el empaque (colapsable plano) y la distribución para que el armado en canal retail sea rápido y sencillo.' },
    ]
  },
  {
    slug: 'branding-identidad',
    numero: '03',
    nombre: 'Branding & Identidad',
    nombreCorto: 'Branding',
    reto: 'Antes de leer tu propuesta, el cliente ya juzgó tu logo, tus colores y tu papelería. Si no inspiran confianza, <em>la conversación se acaba ahí.</em>',
    descripcionCorta: 'Construcción y rediseño de marca: logo, manual, sistema visual y aplicaciones que generan confianza B2B.',
    descripcionLarga:
      'Una marca que no se ve profesional no se contrata. Construimos identidades visuales completas desde la estrategia hasta las aplicaciones: logo, tipografía corporativa, paleta de color, manual de identidad y todos los puntos de contacto visual de tu empresa.',
    chips: ['Logo', 'Manual de marca', 'Sistema Visual'],
    entregables: [
      { svg: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', nombre: 'Diseño de logotipo', desc: 'Versiones horizontal, vertical, ícono y variantes.' },
      { svg: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', nombre: 'Manual de identidad', desc: 'Reglas de uso, márgenes, tipografías y paleta.' },
      { svg: 'M7 21a4 4 0 0 1-4-4V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v12a4 4 0 0 1-4 4zm0 0h12a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-1a2 2 0 0 1 2-2h1z', nombre: 'Papelería corporativa', desc: 'Tarjetas, sobres, hojas membretadas, carpetas.' },
      { svg: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z', nombre: 'Uniformes y dotación', desc: 'Aplicaciones de marca en textil.' },
      { svg: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z', nombre: 'Señalización y ambiente', desc: 'Branding espacial para oficinas y locales.' },
      { svg: 'M3 15a4 4 0 0 0 4 4h9a5 5 0 1 0-.1-9.999 5.002 5.002 0 0 0-9.78 2.096A4.001 4.001 0 0 0 3 15z', nombre: 'Templates digitales', desc: 'Plantillas para redes sociales y presentaciones.' },
    ],
    fotos: [],
    fotoPrincipal: '/media/alternativa-naranja-3d-1000.webp',
    whatsappText: encodeURIComponent('Hola, estoy interesado en el servicio de Branding e Identidad de Marca.'),
    gradiente: 'linear-gradient(135deg,#1a3b78 0%,#001433 100%)',
    pasos: [
      { num: '01', titulo: 'Inmersión y Estrategia', desc: 'Investigamos los valores del negocio, tu mercado y competencia para definir un posicionamiento diferencial sólido.' },
      { num: '02', titulo: 'Universo Visual', desc: 'Diseñamos conceptos gráficos que abarcan logotipo, isotipo, tipografías corporativas y paletas cromáticas sobre mockups reales.' },
      { num: '03', titulo: 'Manual y Lineamientos', desc: 'Creamos las directrices técnicas del comportamiento de la marca (retículas, márgenes de seguridad, usos permitidos y prohibidos).' },
      { num: '04', titulo: 'Despliegue de Assets', desc: 'Suministramos la biblioteca completa de recursos gráficos en formatos vectoriales editables y listos para producción física o digital.' },
    ]
  },
  {
    slug: 'fotografia-publicitaria',
    numero: '04',
    nombre: 'Fotografía Publicitaria',
    nombreCorto: 'Fotografía',
    reto: 'Una foto improvisada le dice a tu cliente que tu empresa también improvisa. Una buena imagen <em>vende antes de que hables.</em>',
    descripcionCorta: 'Producto, corporativa y editorial. Imágenes que refuerzan tu profesionalismo y atraen clientes de valor.',
    descripcionLarga:
      'Las imágenes son el primer juicio que hacen tus clientes sobre tu empresa. Producimos fotografía publicitaria de alto estándar: sesiones de producto, fotografía corporativa y editorial para que tu marca luzca exactamente como merece.',
    chips: ['Producto', 'Corporativa', 'Editorial'],
    entregables: [
      { svg: 'M3 7h3l1.5-2h9L18 7h3a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z M12 13.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z', nombre: 'Fotografía de producto', desc: 'Packshot, lifestyle y ambientada.' },
      { svg: 'M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm6 3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0z', nombre: 'Fotografía corporativa', desc: 'Equipo, instalaciones y cultura empresarial.' },
      { svg: 'M4 16l4.586-4.586a2 2 0 0 1 2.828 0L16 16m-2-2l1.586-1.586a2 2 0 0 1 2.828 0L20 14m-6-6h.01M6 20h12a2 2 0 0 1 2-2V6a2 2 0 0 1-2-2H6a2 2 0 0 1-2 2v12a2 2 0 0 1 2 2z', nombre: 'Editorial y catálogos', desc: 'Fotografía para publicaciones impresas y digitales.' },
      { svg: 'M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V5.618a1 1 0 0 1 1.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0 0 21 18.382V7.618a1 1 0 0 0-.553-.894L15 4m0 13V4m0 0L9 7', nombre: 'Recorridos 360°', desc: 'Tour virtual para locales y showrooms.' },
      { svg: 'M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14M5 18h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z', nombre: 'Video corporativo', desc: 'Cápsulas de marca y testimoniales.' },
      { svg: 'M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.414-9.414a2 2 0 1 1 2.828 2.828L11.828 15H9v-2.828l8.586-8.586z', nombre: 'Retoque y post-producción', desc: 'Edición profesional y color grading.' },
    ],
    fotos: [],
    fotoPrincipal: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto,w_1200,c_limit/modelo-congreso-ibague.png',
    whatsappText: encodeURIComponent('Hola, quiero cotizar una sesión de Fotografía Publicitaria para mi empresa.'),
    gradiente: 'linear-gradient(135deg,#0a2550 0%,#04102a 100%)',
    pasos: [
      { num: '01', titulo: 'Dirección de Arte', desc: 'Planificamos la utilería, escenografías, esquemas conceptuales y paleta cromática ideal para el tipo de shoot.' },
      { num: '02', titulo: 'Sesión Fotográfica', desc: 'Jornada de captura en estudio o locación real equipada con ópticas y sistemas de iluminación de calidad cinematográfica.' },
      { num: '03', titulo: 'Revelado Digital', desc: 'Curamos las tomas del portafolio y realizamos el procesado digital básico para corregir exposición, rango dinámico y encuadre.' },
      { num: '04', titulo: 'Edición y Retoque', desc: 'Limpieza fina de imperfecciones, silueteados técnicos y colorización avanzada para optimizar cada imagen según su destino.' },
    ]
  },
  {
    slug: 'diseno-web',
    numero: '05',
    nombre: 'Diseño & Desarrollo Web',
    nombreCorto: 'Diseño Web',
    reto: 'Tu sitio atiende clientes mientras duermes, o los manda donde la competencia. Si carga lento o no dice qué haces, <em>ya los perdiste.</em>',
    descripcionCorta: 'Sitios orientados a conversión con SEO técnico y local para que Google te encuentre antes que a la competencia.',
    descripcionLarga:
      'Un sitio web que no convierte es una tarjeta de presentación cara. Diseñamos y desarrollamos sitios web orientados a resultados: rápidos, bien posicionados en Google y construidos para convertir visitantes en clientes de manera sistemática.',
    chips: ['Conversión', 'SEO Local', 'Responsive'],
    entregables: [
      { svg: 'M4 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5zM4 13a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6zM16 13a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-6z', nombre: 'Diseño UI/UX', desc: 'Wireframes, prototipos y diseño visual final.' },
      { svg: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4', nombre: 'Desarrollo frontend', desc: 'HTML, CSS, JS o frameworks modernos.' },
      { svg: 'M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z', nombre: 'SEO On-Page', desc: 'Optimización técnica, velocidad y estructura.' },
      { svg: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z', nombre: 'SEO Local', desc: 'Google My Business y posicionamiento por ciudad.' },
      { svg: 'M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z', nombre: 'CMS y administración', desc: 'Panel de edición fácil para tu equipo.' },
      { svg: 'M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z', nombre: 'Analytics y reportes', desc: 'Seguimiento de conversiones y tráfico mensual.' },
    ],
    fotos: [],
    fotoPrincipal: '/posters/diseno-web.webp',
    videoPrincipal: '/VistaMacCinematica_3.mp4',
    whatsappText: encodeURIComponent('Hola, quiero cotizar un sitio web para mi empresa con SEO incluido.'),
    gradiente: 'linear-gradient(135deg,#0a2d6b 0%,#001433 100%)',
    pasos: [
      { num: '01', titulo: 'Estructura y UX', desc: 'Elaboramos el mapa del sitio web, arquitectura de la información y wireframes estructurados para guiar al usuario a la conversión.' },
      { num: '02', titulo: 'Diseño de Interfaz', desc: 'Creamos el layout visual del sitio en Figma, incorporando micro-interacciones, transiciones de marca y flujos adaptables.' },
      { num: '03', titulo: 'Desarrollo y SEO', desc: 'Maquetamos la web utilizando metodologías que aseguran máxima velocidad de carga (Core Web Vitals) y SEO semántico para indexación.' },
      { num: '04', titulo: 'Despliegue y Hosting', desc: 'Configuramos certificados SSL, dominios, scripts de analíticas web (GA4) y realizamos el lanzamiento final sin caídas de servicio.' },
    ]
  },
  {
    slug: 'campanas-integrales',
    numero: '06',
    nombre: 'Campañas Integrales',
    nombreCorto: 'Campañas',
    reto: 'Cuando cada pieza dice algo distinto, el cliente no recuerda nada. Una campaña funciona <em>cuando todo habla al mismo tiempo.</em>',
    descripcionCorta: 'Del concepto a la producción: lanzamientos, temporadas y activaciones de marca con una sola dirección creativa.',
    descripcionLarga:
      'Una campaña integral es cuando todo habla al mismo tiempo. Dirigimos el concepto creativo y coordinamos todos los materiales: piezas impresas, gráficas digitales, fotografía y activaciones de punto de venta, todo con coherencia visual de principio a fin.',
    chips: ['Lanzamientos', 'Activaciones', 'Temporadas'],
    entregables: [
      { svg: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z', nombre: 'Concepto creativo', desc: 'Big idea, key visual y mensajes clave.' },
      { svg: 'M9 17V7m0 10a2 2 0 0 1-2 2H5a2 2 0 0 0-2 2v-2a2 2 0 0 0 2-2h2a2 2 0 0 1 2 2zm0-10a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V7zm6 10a2 2 0 0 1-2 2h-2a2 2 0 0 0-2 2v-2a2 2 0 0 0 2-2h2a2 2 0 0 1 2 2zm0-10a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V7z', nombre: 'Adaptaciones multi-formato', desc: 'Piezas adaptadas a todos los medios.' },
      { svg: 'M3 11l16-7-4 16-4-6-8-3z M11 14l3 3', nombre: 'Piezas digitales', desc: 'Stories, feed, banners y email marketing.' },
      { svg: 'M6 5h12M6 5l4 9m-4-9L2 9m16-4l4 4m-4-4l-4 4m4 4l4 4m-4-4l-4 4M2 13l4 4m-4-4l4-4', nombre: 'Materiales impresos', desc: 'Volantes, afiches, plegables y catálogos.' },
      { svg: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 0 1-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', nombre: 'Activaciones BTL', desc: 'Experiencias de marca en punto de contacto.' },
      { svg: 'M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z', nombre: 'Dirección creativa unificada', desc: 'Un solo equipo, una sola voz de marca.' },
    ],
    fotos: [],
    fotoPrincipal: 'https://res.cloudinary.com/nvptziio/image/upload/f_auto,q_auto,w_1200,c_limit/panoramica-exhibicion-museo-memoria.webp',
    whatsappText: encodeURIComponent('Hola, me interesa cotizar una Campaña Integral para mi empresa.'),
    gradiente: 'linear-gradient(135deg,#b53c12 0%,#3a1306 100%)',
    pasos: [
      { num: '01', titulo: 'Gancho Creativo', desc: 'Desarrollamos el concepto maestro y el Key Visual (Idea Creativa) que servirá de pilar para todo el ecosistema de la campaña.' },
      { num: '02', titulo: 'Plan de Formatos', desc: 'Determinamos el mix ideal de formatos digitales (redes, pauta) y físicos (BTL, impresos, POP) según tu presupuesto.' },
      { num: '03', titulo: 'Producción Unificada', desc: 'Creamos y coordinamos la realización simultánea de piezas (fotografías, copys, adaptaciones impresas y banners de campaña).' },
      { num: '04', titulo: 'Monitoreo y Reporte', desc: 'Lanzamos el despliegue sincronizado en canales y medimos los alcances, retornos y niveles de engagement del público.' },
    ]
  },
];
