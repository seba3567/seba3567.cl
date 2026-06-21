<script lang="ts">
	/**
	 * AntiCallLogo — escudo de la app con fallback al PhoneX de Phosphor.
	 *
	 * Pipeline: scripts/optimize-images.mjs genera logo.avif + logo@2x.avif
	 * + logo.webp + logo@2x.webp (NUNCA JPG) desde static/apps/anticall/logo.png.
	 *
	 * Comportamiento:
	 * 1. Renderiza un <img> con src=logo.avif
	 * 2. Si AVIF no carga (404 o browser sin soporte) → onerror cambia
	 *    a logo.webp
	 * 3. Si WebP tampoco carga → onerror cambia el flag a fallback
	 * 4. Cuando flag=fallback, el template muestra el PhoneX en mint
	 *    (consistente con el resto de la UI) y el <img> se desmonta,
	 *    así no hay más requests 404.
	 */
	import { PhoneX } from 'phosphor-svelte';

	type Props = {
		size?: number;
		class?: string;
	};
	let { size = 64, class: className = '' }: Props = $props();

	let fallback = $state(false);
</script>

{#if fallback}
	<div
		class="flex shrink-0 items-center justify-center rounded-2xl bg-mint-500 ring-1 ring-mint-400/30 {className}"
		style="width: {size}px; height: {size}px;"
		role="img"
		aria-label="AntiCallCL"
	>
		<PhoneX size={Math.round(size * 0.5)} weight="duotone" class="text-neutral-950" />
	</div>
{:else}
	<img
		src="/apps/anticall/logo.avif"
		alt="AntiCallCL"
		class="shrink-0 {className}"
		width={size}
		height={size}
		loading="lazy"
		onerror={(e) => {
			const img = e.currentTarget as HTMLImageElement;
			if (!img.dataset.triedWebp) {
				img.dataset.triedWebp = '1';
				img.src = '/apps/anticall/logo.webp';
			} else {
				// AVIF y WebP ambos 404 → fallback
				fallback = true;
			}
		}}
	/>
{/if}
