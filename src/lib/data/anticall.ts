// Static copy and structure for the AntiCallCL showcase page
// (/apps/anticall). Lives in src/lib/data/ so each panel
// component can import the slice it needs and the parent
// +page.svelte stays thin.

export const PLAY_STORE =
	'https://play.google.com/store/apps/details?id=com.seba3567.anticall_chile&hl=en-US';
export const BETA_PROGRAM =
	'https://play.google.com/apps/testing/com.seba3567.anticall_chile';
export const PRIVACY_URL = 'https://seba3567.github.io/anticall_pages/';

// The 6 phone screenshots in /static/apps/anticall/{N}.{jpg,webp,avif}.
// 1 is featured in the hero phone mockup; 1..6 show in the gallery
// panel and the lightbox.
export const SCREENSHOTS = [1, 2, 3, 4, 5, 6] as const;
export const FEATURED_SCREENSHOT = 1;

export const galleryItems = SCREENSHOTS.map((n) => ({
	src: `/apps/anticall/${n}`,
	alt: `AntiCallCL · pantalla ${n}`,
	caption: `Pantalla ${n} de ${SCREENSHOTS.length}`,
}));

export const aboutParagraphs = [
	'Anticall nació como respuesta al problema creciente de las llamadas no deseadas: empresas y servicios que llaman de forma repetida — a veces varias veces en pocas horas —, sumadas a nuevas formas de estafa y spam telefónico que afectan a miles de personas en Chile cada día.',
	'La aplicación permite filtrar y gestionar llamadas por prefijo, ayudando a identificar rangos de números usados para campañas de marketing o intentos sospechosos. Esto le da al usuario el control sobre su tiempo y su privacidad, reduciendo interrupciones y riesgos.',
	'Anticall no bloquea llamadas automáticamente ni accede a información personal: ofrece herramientas claras y útiles para que cada persona decida cómo manejar las llamadas entrantes.',
] as const;

import { Database, Eye, Lock, ShieldCheck } from 'phosphor-svelte';

export const features = [
	{
		icon: ShieldCheck,
		title: 'Filtrar por prefijo',
		body: 'Rangos de números identificables para marketing, telemarketing o intentos de estafa.',
	},
	{
		icon: Eye,
		title: 'Tú decides',
		body: 'No bloquea en automático. Te entrega la información y la decisión queda en tu lado.',
	},
	{
		icon: Database,
		title: 'Base curada CL',
		body: 'Lista de prefijos chilenos verificables, editables y exportables desde la app.',
	},
	{
		icon: Lock,
		title: '100% local',
		body: 'Sin cuentas, sin servidores, sin nube. Todo se procesa y guarda en tu teléfono.',
	},
] as const;

export const stackLayers = [
	{
		layer: 'UI',
		tech: 'Flutter',
		detail:
			'Interfaz cross-platform, theming, navegación, formularios y estados.',
	},
	{
		layer: 'Nativo Android',
		tech: 'Kotlin',
		detail:
			'CallScreeningService, contactos, permisos sensibles y persistencia local.',
	},
] as const;

export const privacyPoints = [
	'Tus listas y métricas viven solo en tu dispositivo',
	'La app opera sin registro, sin cuentas, sin nube',
	'Puedes borrar todo desde los ajustes en cualquier momento',
	'Al desinstalar se eliminan automáticamente todos los datos',
] as const;

export const betaPerks = [
	'Acceso anticipado antes del release público',
	'Canal directo con el equipo de desarrollo',
	'Ayuda a moldear el roadmap con tu feedback',
	'Prefijos actualizados con cada build',
] as const;
