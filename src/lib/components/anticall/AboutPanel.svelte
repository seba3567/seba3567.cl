<script lang="ts">
	import { t } from 'svelte-i18n';
	import { Badge } from '$lib/components/ui/badge';
	import { aboutParagraphKeys, features } from '$lib/data/anticall';
</script>

<section
	id="about"
	class="panel relative flex h-full w-screen flex-col justify-center overflow-y-auto px-6 py-20 sm:px-12 sm:py-24 lg:px-20"
>
	<div class="mx-auto w-full max-w-6xl">
		<!--
		  Header: badge + title + eyebrow. Eyebrow is a small
		  monospaced label so the section reads as part of the
		  same library as the AOSP page.
		-->
		<div class="mb-8 sm:mb-10" data-panel-anim>
			<Badge
				variant="outline"
				class="border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-400"
			>
				{$t('anticall.about.badge')}
			</Badge>
			<h2
				class="mt-3 text-balance text-3xl font-semibold tracking-[-0.03em] text-neutral-50 sm:text-4xl lg:text-5xl"
			>
				{$t('anticall.about.title')}
			</h2>
		</div>

		<!--
		  Two-column layout on desktop:
		  - Left col (5/12): the 3 origin paragraphs, full-bleed text.
		  - Right col (7/12): 2×2 feature grid. Each card is wider
		    than the old stacked design so the title + body wraps
		    cleanly without awkward line breaks.
		  On mobile: single column, paragraphs first then cards.
		-->
		<div class="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
			<div
				class="space-y-4 text-pretty text-base leading-relaxed text-neutral-300 lg:col-span-5"
			>
				{#each aboutParagraphKeys as key, i (i)}
					<p data-panel-anim class="text-balance">
						{$t(`anticall.about.paragraphs.${key}`)}
					</p>
				{/each}
			</div>

			<aside
				class="grid grid-cols-1 gap-2.5 self-start sm:grid-cols-2 lg:col-span-7 lg:grid-cols-2"
			>
				{#each features as f, i (f.titleKey)}
					{@const Icon = f.icon}
					<article
						data-panel-anim
						class="group/feat flex h-full flex-col gap-3 rounded-2xl border border-white/5 bg-white/[0.015] p-4 transition-all duration-500 hover:-translate-y-0.5 hover:border-mint-400/20 hover:bg-white/[0.04] sm:p-5"
					>
						<div class="flex items-center gap-3">
							<span
								class="font-mono text-[10px] text-neutral-600 transition-colors group-hover/feat:text-neutral-400"
								>0{i + 1}</span
							>
							<div
								class="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition-all group-hover/feat:scale-110 group-hover/feat:border-mint-400/40 group-hover/feat:bg-mint-500/10"
							>
								<Icon
									size={16}
									weight="duotone"
									class="text-neutral-300 transition-colors group-hover/feat:text-mint-300"
								/>
							</div>
						</div>
						<div class="min-w-0 flex-1">
							<h3 class="text-sm font-semibold text-neutral-100 sm:text-base">
								{$t(`anticall.about.features.${f.titleKey}.title`)}
							</h3>
							<p class="mt-1.5 text-xs leading-relaxed text-neutral-400 sm:text-sm">
								{$t(`anticall.about.features.${f.bodyKey}.body`)}
							</p>
						</div>
					</article>
				{/each}
			</aside>
		</div>
	</div>
</section>
