// Static copy and structure for the home page. Lives in
// src/lib/data/ so each panel component can import the slice
// it needs and the parent `+page.svelte` stays thin.

import { Code, Database, Kanban } from 'phosphor-svelte';
import type { Component } from 'svelte';

export const profile = {
	name: 'Sebastián Muñoz',
	handle: '@seba3567',
	location: 'Chile',
	tagline: 'Ingeniero de Software y Datos.',
	intro:
		'Backend, datos, mobile, QA. Combino análisis de datos, arquitectura backend y calidad de software para convertir requerimientos en soluciones mantenibles y medibles.',
};

export const stack = [
	{ label: 'En uso', items: 'TypeScript · Django · SQL · Python' },
	{
		label: 'En progreso',
		items: 'Kotlin · Dart · Go · Ruby',
	},
	{ label: 'Base', items: 'JavaScript · Lua · REST · Docker' },
] as const;

type PhosphorIcon = Component<{
	size?: number;
	weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';
	class?: string;
}>;

export const specialties: ReadonlyArray<{
	icon: PhosphorIcon;
	title: string;
	items: ReadonlyArray<string>;
}> = [
	{
		icon: Database,
		title: 'Ciencia de Datos',
		items: [
			'Inteligencia de Negocios',
			'Modelado y análisis de datos',
			'Visualización y storytelling con datos',
			'Análisis estadístico aplicado',
		],
	},
	{
		icon: Code,
		title: 'Desarrollo de Software',
		items: [
			'Diseño de arquitectura backend',
			'APIs robustas y mantenibles',
			'Aseguramiento de calidad y testing',
			'Versionado y colaboración técnica',
		],
	},
	{
		icon: Kanban,
		title: 'Gestión Técnica',
		items: [
			'Trabajo ágil (Scrum/Kanban)',
			'Levantamiento y refinamiento de requerimientos',
			'Documentación técnica clara',
			'Enfoque en mejora continua',
		],
	},
] as const;

// Visible in the Contacto panel. Email uses `href: ''` so the
// template renders a <button> instead of an <a> — the form
// opens the protected ContactDialog. The real address lives
// only in the backend (CONTACT_TO) and never ships to the
// client bundle.
export const contact = [
	{ label: 'GitHub', handle: '@seba3567', href: 'https://github.com/seba3567' },
	{ label: 'Email', handle: 'Formulario seguro', href: '' },
] as const;
