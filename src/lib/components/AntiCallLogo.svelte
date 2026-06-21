<script lang="ts">
	/**
	 * AntiCallLogo — escudo de la app (sin fondo, AVIF + WebP fallback).
	 *
	 * Usa el pipeline de `optimize:images` (scripts/optimize-images.mjs)
	 * que genera `logo.avif` + `logo@2x.avif` + `logo.webp` + `logo@2x.webp`
	 * + `logo.jpg` desde `static/apps/anticall/logo.png`.
	 *
	 * El fondo es transparente (la imagen se sirve como PNG con alpha).
	 * No usamos contenedor con background mint — el logo brilla por sí
	 * solo sobre el dark theme.
	 */
	import OptimizedPicture from './OptimizedPicture.svelte';

	type Props = {
		size?: number;
		class?: string;
	};
	let { size = 64, class: className = '' }: Props = $props();
</script>

<OptimizedPicture
	src="/apps/anticall/logo"
	alt="AntiCallCL"
	class="shrink-0 {className}"
	width={size}
	height={size}
	loading="lazy"
/>
