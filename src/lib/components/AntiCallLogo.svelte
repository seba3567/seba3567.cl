<script lang="ts">
	/**
	 * AntiCallLogo — escudo de la app con fallback al PhoneX de Phosphor.
	 *
	 * Usa el pipeline de `optimize:images` (scripts/optimize-images.mjs)
	 * que genera `logo.avif` + `logo@2x.avif` + `logo.webp` + `logo@2x.webp`
	 * + `logo.jpg` desde `static/apps/anticall/logo.png`.
	 *
	 * Si el logo todavía no fue guardado (404), mostramos el ícono
	 * PhoneX de Phosphor en un cuadrado mint como fallback — la página
	 * nunca queda con alt text roto.
	 */
	import { onMount } from 'svelte';
	import { PhoneX } from 'phosphor-svelte';

	type Props = {
		size?: number;
		class?: string;
	};
	let { size = 64, class: className = '' }: Props = $props();

	// Probamos a cargar el JPG; si devuelve 404 usamos el fallback.
	// Hacemos esto client-side (es estático, no bloquea SSR).
	let imageAvailable = $state(false);
	let imageChecked = $state(false);

	$effect(() => {
		if (typeof window === 'undefined') return;
		const img = new Image();
		img.onload = () => {
			imageAvailable = true;
			imageChecked = true;
		};
		img.onerror = () => {
			imageAvailable = false;
			imageChecked = true;
		};
		img.src = '/apps/anticall/logo.jpg';
	});
</script>

{#if !imageChecked}
	<!-- Skeleton mientras verificamos — el JPG debería existir siempre
	     (lo genera el pipeline de optimize:images), pero si no, en
	     ~ms ya sabemos y mostramos el fallback. -->
	<div
		class="flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] {className}"
		style="width: {size}px; height: {size}px;"
		aria-hidden="true"
	></div>
{:else if imageAvailable}
	<img
		src="/apps/anticall/logo.avif"
		onerror={(e) => {
			// Fallback a WebP si AVIF no está disponible en el browser
			const img = e.currentTarget as HTMLImageElement;
			if (!img.dataset.triedWebp) {
				img.dataset.triedWebp = '1';
				img.src = '/apps/anticall/logo.webp';
			} else if (!img.dataset.triedJpg) {
				img.dataset.triedJpg = '1';
				img.src = '/apps/anticall/logo.jpg';
			}
		}}
		alt="AntiCallCL"
		class="shrink-0 {className}"
		width={size}
		height={size}
		loading="lazy"
	/>
{:else}
	<!-- Fallback cuando el logo no existe en /static: PhoneX de Phosphor
	     en cuadrado mint — se ve consistente con el resto de la UI. -->
	<div
		class="flex shrink-0 items-center justify-center rounded-2xl bg-mint-500 ring-1 ring-mint-400/30 {className}"
		style="width: {size}px; height: {size}px;"
		role="img"
		aria-label="AntiCallCL"
	>
		<PhoneX size={Math.round(size * 0.5)} weight="duotone" class="text-neutral-950" />
	</div>
{/if}
