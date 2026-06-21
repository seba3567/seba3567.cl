<script lang="ts">
	import { t } from 'svelte-i18n';
	import { MagnifyingGlassPlus } from 'phosphor-svelte';
	import OptimizedPicture from '$lib/components/OptimizedPicture.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { SCREENSHOTS } from '$lib/data/anticall';

	type Props = {
		onOpenLightbox: (index: number) => void;
	};

	let { onOpenLightbox }: Props = $props();
</script>

<section
	id="gallery"
	class="panel relative flex h-full w-screen flex-col justify-center overflow-y-auto px-6 py-20 sm:px-12 sm:py-24 lg:px-20"
>
	<div class="mx-auto flex w-full max-w-6xl flex-col gap-6">
		<!--
		  Header: badge + title + subtitle on the left, format
		  marker on the right. Same pattern as the AOSP stats
		  row — one thin line, two regions.
		-->
		<div class="flex items-end justify-between gap-6" data-panel-anim>
			<div>
				<Badge
					variant="outline"
					class="border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-400"
				>
					{$t('anticall.gallery.badge')}
				</Badge>
				<h2
					class="mt-3 text-balance text-3xl font-semibold tracking-[-0.03em] text-neutral-50 sm:text-4xl lg:text-5xl"
				>
					{$t('anticall.gallery.title')}
				</h2>
				<p class="mt-2 text-sm text-neutral-500">
					{$t('anticall.gallery.subtitle')}
				</p>
			</div>
			<p
				class="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500 sm:block"
			>
				{$t('anticall.gallery.format')}
			</p>
		</div>

		<!--
		  3 cols × 2 rows on desktop, 2 cols on tablet, 1 col on mobile.
		  Each phone has a fixed aspect ratio (9:16) so all 6 are
		  the same size and the grid doesn't overflow. The
		  container has a min-height so the phones are visible
		  even when the panel is short.

		  The whole tile is a button (big touch target on mobile).
		  On hover, the image scales slightly + the zoom icon
		  fades in.
		-->
		<div
			class="mx-auto grid w-full gap-3 sm:gap-4"
			style="grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr));"
		>
			{#each SCREENSHOTS as n, i (n)}
				<button
					type="button"
					onclick={() => onOpenLightbox(i)}
					data-panel-anim
					aria-label={$t('anticall.screenshot.ariaOpen', { values: { n } })}
					class="group/shot relative block w-full overflow-hidden rounded-2xl border border-white/5 bg-white/[0.015] transition-all duration-500 hover:-translate-y-1 hover:border-mint-400/30 hover:bg-white/[0.04]"
					style="aspect-ratio: 9 / 16;"
				>
					<OptimizedPicture
						src="/apps/anticall/{n}"
						alt={$t('anticall.screenshot.thumbAlt', { values: { n } })}
						class="size-full object-cover transition-transform duration-500 group-hover/shot:scale-[1.04]"
						width={540}
						height={1200}
					/>
					<!-- Bottom gradient so the index pill reads -->
					<div
						class="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-neutral-950/70 to-transparent"
					></div>
					<!-- Zoom icon (fades in on hover) -->
					<div
						class="pointer-events-none absolute right-2 top-2 rounded-full border border-white/10 bg-neutral-950/80 p-1.5 opacity-0 backdrop-blur transition-opacity duration-300 group-hover/shot:opacity-100"
					>
						<MagnifyingGlassPlus size={12} weight="bold" class="text-neutral-200" />
					</div>
					<!-- Index pill (bottom-left, like a Polaroid) -->
					<span
						class="absolute bottom-2 left-2 rounded-md border border-white/10 bg-neutral-950/80 px-2 py-0.5 font-mono text-[10px] text-neutral-200 backdrop-blur"
					>
						{n}/{SCREENSHOTS.length}
					</span>
				</button>
			{/each}
		</div>
	</div>
</section>
