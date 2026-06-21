<script lang="ts">
	import { t } from 'svelte-i18n';
	import { MagnifyingGlassPlus } from 'phosphor-svelte';
	import OptimizedPicture from '$lib/components/OptimizedPicture.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { FEATURED_SCREENSHOT } from '$lib/data/anticall';

	type Props = {
		onOpenLightbox: (index: number) => void;
	};

	let { onOpenLightbox }: Props = $props();
</script>

<section
	id="screenshot"
	class="panel relative flex h-full w-screen flex-col justify-center overflow-y-auto px-6 py-20 sm:px-12 sm:py-24 lg:px-20"
>
	<div class="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 sm:gap-10">
		<!--
		  Header. Title sized to match the rest of the panels
		  (text-3xl sm:text-4xl lg:text-5xl) instead of the old
		  text-4xl sm:text-5xl that pushed the phone too far
		  down on small viewports.
		-->
		<div
			class="flex w-full flex-col items-center gap-3 text-center sm:flex-row sm:items-end sm:justify-between sm:gap-6 sm:text-left"
			data-panel-anim
		>
			<div>
				<Badge
					variant="outline"
					class="border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-400"
				>
					{$t('anticall.screenshot.badge')}
				</Badge>
				<h2
					class="mt-3 text-balance text-3xl font-semibold tracking-[-0.03em] text-neutral-50 sm:text-4xl lg:text-5xl"
				>
					{$t('anticall.screenshot.title')}
				</h2>
			</div>
			<p
				class="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500 sm:block"
			>
				{$t('anticall.screenshot.hint')}
			</p>
		</div>

		<!--
		  Featured phone. Container caps the height at 65vh so
		  it never overflows the panel; the aspect-ratio on the
		  inner box keeps the 9:16 shape. The button is the
		  full phone (big touch target on mobile) and the
		  zoom-in hint pill is absolute on the bottom-right.
		-->
		<button
			type="button"
			onclick={() => onOpenLightbox(FEATURED_SCREENSHOT - 1)}
			data-panel-anim
			aria-label={$t('anticall.screenshot.ariaOpen', { values: { n: FEATURED_SCREENSHOT } })}
			class="group/shot relative mx-auto block cursor-zoom-in"
			style="max-height: 65vh;"
		>
			<div
				aria-hidden="true"
				class="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-br from-mint-500/15 to-transparent opacity-60 blur-2xl transition-opacity duration-500 group-hover/shot:opacity-100"
			></div>
			<div
				class="relative h-full w-auto overflow-hidden rounded-[2rem] border border-white/10 bg-neutral-950 shadow-2xl shadow-black/60 transition-transform duration-500 group-hover/shot:scale-[1.02]"
				style="aspect-ratio: 9 / 16; max-width: 90vw;"
			>
				<OptimizedPicture
					src="/apps/anticall/{FEATURED_SCREENSHOT}"
					alt={$t('anticall.screenshot.mainAlt')}
					class="size-full object-cover"
					width={540}
					height={1200}
					loading="eager"
				/>
				<div
					aria-hidden="true"
					class="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-950/40 via-transparent to-transparent"
				></div>
			</div>
			<span
				class="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full border border-white/10 bg-neutral-950/80 px-2.5 py-1 font-mono text-[10px] text-neutral-300 backdrop-blur transition-colors group-hover/shot:bg-white/10"
			>
				<MagnifyingGlassPlus size={10} weight="bold" />
				{$t('anticall.screenshot.hint')}
			</span>
		</button>
	</div>
</section>
