<script lang="ts">
	import { onMount } from 'svelte';
	import { PhoneX, ArrowUpRight, GithubLogo, Star, ShieldCheck, Database, Code } from 'phosphor-svelte';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import OptimizedPicture from '$lib/components/OptimizedPicture.svelte';
	import { revealOnScroll, revealChars } from '$lib/animations';

	const AVATAR_URL = 'https://avatars.githubusercontent.com/u/44386561?v=4';

	type App = {
		slug: string;
		name: string;
		tagline: string;
		description: string;
		status: 'live' | 'wip' | 'archived';
		stack: string[];
		features: string[];
		href?: string;
		playStore?: string;
		github?: string;
		screenshots: number[];
		accent: 'violet' | 'cyan' | 'emerald' | 'amber';
	};

	const apps: App[] = [
		{
			slug: 'anticall',
			name: 'AntiCallCL.',
			tagline: 'Firewall anti-spam de llamadas para Android.',
			description:
				'Aplicación Android nativa (Kotlin) que identifica y bloquea llamadas spam/telemarketing en tiempo real sobre la red chilena. Base curada de prefijos + reporte comunitario, sin depender de servidor central.',
			status: 'wip',
			stack: ['Kotlin', 'Android', 'Python', 'SQLite', 'REST'],
			features: [
				'Bloqueo en tiempo real sin servidor central obligatorio',
				'Lista curada de prefijos chilenos + reporte comunitario',
				'Backend Python (`telefonia_ido`) para sincronización',
				'Onboarding y métricas en landing estática',
			],
			playStore:
				'https://play.google.com/store/apps/details?id=com.seba3567.anticall_chile&hl=en-US',
			github: 'https://github.com/seba3567/anticall_pages',
			screenshots: [1, 2, 3, 4, 5, 6],
			accent: 'violet',
		},
	];

	const accentMap: Record<App['accent'], { text: string; bg: string; border: string; ring: string }> = {
		violet: { text: 'text-violet-300', bg: 'bg-violet-500/10', border: 'border-violet-400/20', ring: 'ring-violet-400/30' },
		cyan: { text: 'text-cyan-300', bg: 'bg-cyan-500/10', border: 'border-cyan-400/20', ring: 'ring-cyan-400/30' },
		emerald: { text: 'text-emerald-300', bg: 'bg-emerald-500/10', border: 'border-emerald-400/20', ring: 'ring-emerald-400/30' },
		amber: { text: 'text-amber-300', bg: 'bg-amber-500/10', border: 'border-amber-400/20', ring: 'ring-amber-400/30' },
	};

	let workSectionEl: HTMLElement | undefined = $state();
	let titleEl: HTMLElement | undefined = $state();

	onMount(() => {
		if (titleEl) {
			revealChars(titleEl, { staggerMs: 35, offsetY: 60, duration: 700, delay: 200 });
		}
		if (workSectionEl) {
			revealOnScroll(workSectionEl, {
				selector: '[data-reveal-tile]',
				staggerMs: 80,
				offsetY: 24,
				duration: 700,
			});
		}
	});
</script>

<svelte:head>
	<title>Apps · seba3567.cl</title>
	<meta
		name="description"
		content="Aplicaciones publicadas de Sebastián Muñoz · AntiCallCL (Android) y más."
	/>
</svelte:head>

<main class="relative mx-auto w-full max-w-6xl flex-1 px-6 sm:px-10">
	<header class="pt-24 pb-20 sm:pt-36 sm:pb-28">
		<p class="font-mono text-xs text-neutral-500">/ apps · published software</p>
		<h1
			bind:this={titleEl}
			class="mt-8 text-[clamp(3rem,10vw,7.5rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-neutral-50"
		>
			Apps<span class="text-neutral-600">.</span>
		</h1>
		<p class="mt-8 max-w-xl text-balance text-lg leading-relaxed text-neutral-400 sm:text-xl">
			Software que se puede descargar, abrir y usar. Separado del catálogo de
			<a href="/proyectos" class="underline decoration-neutral-700 underline-offset-4 transition-colors hover:text-neutral-100 hover:decoration-neutral-400">proyectos de GitHub</a>
			— son cosas distintas.
		</p>
	</header>

	<section bind:this={workSectionEl} class="py-12">
		<Separator class="mb-12 bg-white/5" />

		<div class="grid gap-6 lg:grid-cols-1">
			{#each apps as app (app.slug)}
				{@const accent = accentMap[app.accent]}
				{@const statusColor =
					app.status === 'live'
						? 'border-emerald-400/20 bg-emerald-500/5 text-emerald-300'
						: app.status === 'wip'
							? 'border-amber-400/20 bg-amber-500/5 text-amber-300'
							: 'border-neutral-400/20 bg-neutral-500/5 text-neutral-400'}
				<Card.Root
					data-reveal-tile
					data-slot="card"
					class="group relative overflow-hidden rounded-2xl border-white/5 bg-white/[0.015] p-0 transition-all duration-500 hover:border-white/15 hover:bg-white/[0.04]"
				>
					<div class="grid gap-0 lg:grid-cols-[1fr_1.4fr]">
						<!-- LEFT: app info -->
						<div class="flex flex-col gap-5 p-8 sm:p-10">
							<div class="flex items-center gap-4">
								<div
									class="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-500 ring-1 {accent.ring}"
								>
									<PhoneX size={32} weight="duotone" class="text-neutral-950" />
								</div>
								<div>
									<Badge
										variant="outline"
										class="border {statusColor} px-2 py-0.5 font-mono text-[9px] font-normal uppercase tracking-wider"
									>
										{app.status === 'live' ? 'Live' : app.status === 'wip' ? 'WIP' : 'Archived'}
									</Badge>
									<h2 class="mt-1 text-2xl font-semibold tracking-tight text-neutral-50">
										{app.name}
									</h2>
								</div>
							</div>

							<p class="text-balance text-sm text-neutral-400 sm:text-base">
								{app.tagline}
							</p>

							<p class="text-sm leading-relaxed text-neutral-300">
								{app.description}
							</p>

							<div class="flex flex-wrap gap-1.5">
								{#each app.stack as s (s)}
									<Badge
										variant="outline"
										class="border-white/5 bg-white/[0.02] px-1.5 py-0 font-mono text-[10px] text-neutral-400"
									>
										{s}
									</Badge>
								{/each}
							</div>

							<ul class="flex flex-col gap-2 pt-2">
								{#each app.features as f (f)}
									<li class="flex items-start gap-2 text-sm text-neutral-300">
										<ShieldCheck size={14} weight="duotone" class="mt-0.5 shrink-0 {accent.text}" />
										<span>{f}</span>
									</li>
								{/each}
							</ul>

							<div class="mt-auto flex flex-wrap gap-2 pt-4">
								{#if app.playStore}
									<a
										href={app.playStore}
										target="_blank"
										rel="noreferrer noopener"
										class="inline-flex items-center gap-2 rounded-lg border border-emerald-400/20 bg-emerald-500/5 px-3.5 py-2 text-sm font-medium text-emerald-100 transition-all hover:border-emerald-400/40 hover:bg-emerald-500/15"
									>
										<svg
											viewBox="0 0 24 24"
											class="size-3.5 fill-current"
											aria-hidden="true"
										>
											<path
												d="M3.609 1.814 13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893 2.302 2.302-10.937 6.333zm2.302-2.302L18.4 13.18l-3.013 1.745zm3.199-3.198-2.807-1.626L13.792 12l3.6 2.079 2.6-1.504a1 1 0 0 0 0-1.726zM5.864 2.658 16.8 9.99l-2.302 2.303z"
											/>
										</svg>
										Get it on Play Store
										<ArrowUpRight size={11} weight="bold" />
									</a>
								{/if}
								{#if app.github}
									<a
										href={app.github}
										target="_blank"
										rel="noreferrer noopener"
										class="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm font-medium text-neutral-200 transition-all hover:border-white/20 hover:bg-white/[0.08]"
									>
										<GithubLogo size={14} weight="bold" />
										GitHub
									</a>
								{/if}
								<a
									href="/apps/{app.slug}"
									class="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm font-medium text-neutral-200 transition-all hover:border-white/20 hover:bg-white/[0.08]"
								>
									View app
									<ArrowUpRight size={11} weight="bold" />
								</a>
							</div>
						</div>

						<!-- RIGHT: screenshots preview -->
						<div class="relative border-t border-white/5 bg-neutral-950/30 p-8 sm:p-10 lg:border-l lg:border-t-0">
							<div class="grid grid-cols-3 gap-2">
								{#each app.screenshots.slice(0, 3) as n, i (n)}
									<a
										href="/apps/{app.slug}"
										class="group/shot relative block aspect-[9/16] overflow-hidden rounded-xl border border-white/5 transition-all duration-500 hover:border-white/30"
										style="animation-delay: {i * 80}ms"
									>
										<OptimizedPicture
											src="/apps/{app.slug}/{n}"
											alt="AntiCallCL screenshot {n}"
											class="size-full object-cover transition-transform duration-500 group-hover/shot:scale-[1.03]"
											width={540}
											height={1200}
										/>
									</a>
								{/each}
							</div>
							<div class="mt-3 grid grid-cols-3 gap-2">
								{#each app.screenshots.slice(3, 6) as n, i (n)}
									<a
										href="/apps/{app.slug}"
										class="group/shot relative block aspect-[9/16] overflow-hidden rounded-xl border border-white/5 transition-all duration-500 hover:border-white/30"
										style="animation-delay: {(i + 3) * 80}ms"
									>
										<OptimizedPicture
											src="/apps/{app.slug}/{n}"
											alt="AntiCallCL screenshot {n}"
											class="size-full object-cover transition-transform duration-500 group-hover/shot:scale-[1.03]"
											width={540}
											height={1200}
										/>
									</a>
								{/each}
							</div>
							<a
								href="/apps/{app.slug}"
								class="absolute right-6 top-6 inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[10px] text-neutral-300 backdrop-blur transition-colors hover:bg-white/10 lg:right-10 lg:top-10"
							>
								6 shots
								<ArrowUpRight size={10} weight="bold" />
							</a>
						</div>
					</div>
				</Card.Root>
			{/each}
		</div>
	</section>

	<section class="border-t border-white/5 py-12">
		<p class="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-600">
			© {new Date().getFullYear()} · /apps · /proyectos · /work
		</p>
	</section>
</main>
