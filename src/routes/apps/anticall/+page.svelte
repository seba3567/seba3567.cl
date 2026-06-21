<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import {
		ArrowUpRight,
		GithubLogo,
		PhoneX,
		ShieldCheck,
		Database,
		Code,
		Globe,
		Lightning,
		Star,
	} from 'phosphor-svelte';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import OptimizedPicture from '$lib/components/OptimizedPicture.svelte';
	import { revealOnScroll, revealChars } from '$lib/animations';

	const PLAY_STORE =
		'https://play.google.com/store/apps/details?id=com.seba3567.anticall_chile&hl=en-US';
	const GITHUB_LANDING = 'https://github.com/seba3567/anticall_pages';
	const GITHUB_TELEFONIA = 'https://github.com/seba3567/telefonia_ido';
	const GITHUB_ORG = 'https://github.com/seba3567';

	const screenshots = [1, 2, 3, 4, 5, 6];

	const stack = [
		{ label: 'Android client', tech: 'Kotlin · Android SDK · SQLite · WorkManager' },
		{ label: 'Backend', tech: 'Python · FastAPI · REST · SQL' },
		{ label: 'Landing', tech: 'HTML · CSS · JS estático' },
		{ label: 'Repos', tech: 'anticall_pages · telefonia_ido' },
	];

	const features = [
		{
			icon: PhoneX,
			title: 'Bloqueo en tiempo real',
			body: 'Identifica y rechaza spam/telemarketing antes de que suene. Sin servidor central obligatorio.',
		},
		{
			icon: ShieldCheck,
			title: 'Lista curada chilena',
			body: 'Base de prefijos y números verificados para la red CL + reporte comunitario.',
		},
		{
			icon: Database,
			title: 'Sincronización opcional',
			body: 'Backend Python (`telefonia_ido`) reporta nuevos números y mantiene la lista fresca.',
		},
		{
			icon: Code,
			title: 'Open source',
			body: 'Repos públicos: `anticall_pages` (landing) + `telefonia_ido` (backend).',
		},
	];

	const related = [
		{ title: 'telefonia_ido.', sub: 'Python · backend de prefijos', href: GITHUB_TELEFONIA },
		{ title: 'anticall_pages.', sub: 'Landing estática del producto', href: GITHUB_LANDING },
		{ title: '@seba3567', sub: 'Más proyectos en el catálogo', href: `${GITHUB_ORG}?tab=repositories` },
	];

	let titleEl: HTMLElement | undefined = $state();
	let featuresSection: HTMLElement | undefined = $state();
	let gallerySection: HTMLElement | undefined = $state();
	let stackSection: HTMLElement | undefined = $state();
	let relatedSection: HTMLElement | undefined = $state();

	onMount(() => {
		if (titleEl) {
			revealChars(titleEl, { staggerMs: 35, offsetY: 60, duration: 700, delay: 200 });
		}
		for (const sec of [featuresSection, gallerySection, stackSection, relatedSection]) {
			if (sec) {
				revealOnScroll(sec, { selector: '[data-reveal]', staggerMs: 70, offsetY: 24, duration: 700 });
			}
		}
	});
</script>

<svelte:head>
	<title>AntiCallCL · App · seba3567.cl</title>
	<meta
		name="description"
		content="AntiCallCL — firewall anti-spam de llamadas para Android. Bloqueo en tiempo real, base curada chilena, open source."
	/>
</svelte:head>

<main class="relative mx-auto w-full max-w-6xl flex-1 px-6 sm:px-10">
	<!-- ============= HERO ============= -->
	<header class="pt-20 pb-20 sm:pt-32 sm:pb-28">
		<div class="flex items-center gap-2 font-mono text-xs text-neutral-500">
			<a href="/apps" class="transition-colors hover:text-neutral-300">/ apps</a>
			<span class="text-neutral-700">/</span>
			<span class="text-neutral-300">anticall</span>
		</div>

		<div class="mt-10 grid grid-cols-12 items-end gap-6">
			<div class="col-span-12 lg:col-span-8">
				<div class="flex items-center gap-4">
					<div
						class="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-500 ring-1 ring-violet-400/30"
					>
						<PhoneX size={30} weight="duotone" class="text-neutral-950" />
					</div>
					<Badge
						variant="outline"
						class="border-amber-400/20 bg-amber-500/5 px-2 py-0.5 font-mono text-[10px] font-normal uppercase tracking-wider text-amber-300"
					>
						WIP · en desarrollo activo
					</Badge>
				</div>

				<h1
					bind:this={titleEl}
					class="mt-8 text-[clamp(3rem,9vw,6.5rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-neutral-50"
				>
					AntiCallCL<span class="text-neutral-600">.</span>
				</h1>

				<p class="mt-6 max-w-xl text-balance text-lg leading-relaxed text-neutral-400 sm:text-xl">
					Firewall anti-spam de llamadas para Android. Bloqueo en tiempo real sobre la red
					chilena, base curada de prefijos, sin depender de un servidor central.
				</p>

				<div class="mt-8 flex flex-wrap items-center gap-2">
					<a
						href={PLAY_STORE}
						target="_blank"
						rel="noreferrer noopener"
						class="group inline-flex items-center gap-2 rounded-lg border border-emerald-400/20 bg-emerald-500/5 px-4 py-2.5 text-sm font-semibold text-emerald-100 transition-all duration-300 hover:border-emerald-400/40 hover:bg-emerald-500/15"
					>
						<svg viewBox="0 0 24 24" class="size-3.5 fill-current" aria-hidden="true">
							<path
								d="M3.609 1.814 13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893 2.302 2.302-10.937 6.333zm2.302-2.302L18.4 13.18l-3.013 1.745zm3.199-3.198-2.807-1.626L13.792 12l3.6 2.079 2.6-1.504a1 1 0 0 0 0-1.726zM5.864 2.658 16.8 9.99l-2.302 2.303z"
							/>
						</svg>
						Get it on Play Store
						<ArrowUpRight
							size={11}
							weight="bold"
							class="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
						/>
					</a>
					<a
						href={GITHUB_LANDING}
						target="_blank"
						rel="noreferrer noopener"
						class="group inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-neutral-100 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08]"
					>
						<GithubLogo size={14} weight="bold" />
						GitHub
						<ArrowUpRight
							size={11}
							weight="bold"
							class="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
						/>
					</a>
				</div>
			</div>

			<div class="col-span-12 lg:col-span-4" data-reveal>
				<div class="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/5">
					<div class="bg-neutral-950 p-4">
						<p class="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-500">
							Estado
						</p>
						<p class="mt-2 font-mono text-sm font-semibold text-amber-300">WIP</p>
					</div>
					<div class="bg-neutral-950 p-4">
						<p class="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-500">
							Plataforma
						</p>
						<p class="mt-2 font-mono text-sm font-semibold text-neutral-100">Android</p>
					</div>
					<div class="bg-neutral-950 p-4">
						<p class="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-500">
							Package
						</p>
						<p class="mt-2 font-mono text-[11px] text-neutral-100">
							com.seba3567<br />.anticall_chile
						</p>
					</div>
					<div class="bg-neutral-950 p-4">
						<p class="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-500">
							Open source
						</p>
						<p class="mt-2 font-mono text-sm font-semibold text-emerald-300">100%</p>
					</div>
				</div>
			</div>
		</div>
	</header>

	<!-- ============= FEATURES ============= -->
	<section bind:this={featuresSection} class="scroll-mt-24 py-16">
		<Separator class="mb-12 bg-white/5" />

		<div class="mb-12" data-reveal>
			<Badge
				variant="outline"
				class="border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-400"
			>
				Features
			</Badge>
			<h2 class="mt-4 text-4xl font-semibold tracking-[-0.03em] text-neutral-50 sm:text-5xl">
				What it does.
			</h2>
		</div>

		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			{#each features as f (f.title)}
				{@const Icon = f.icon}
				<Card.Root
					data-reveal
					data-slot="card"
					class="group rounded-2xl border-white/5 bg-white/[0.015] p-6 transition-all duration-500 hover:border-white/15 hover:bg-white/[0.04]"
				>
					<div
						class="flex size-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition-all group-hover:scale-110 group-hover:border-violet-400/40 group-hover:bg-violet-500/10"
					>
						<Icon
							size={20}
							weight="duotone"
							class="text-neutral-300 transition-colors group-hover:text-violet-300"
						/>
					</div>
					<h3 class="mt-4 text-base font-semibold text-neutral-100">{f.title}</h3>
					<p class="mt-1.5 text-sm leading-relaxed text-neutral-400">{f.body}</p>
				</Card.Root>
			{/each}
		</div>
	</section>

	<!-- ============= SCREENSHOTS ============= -->
	<section bind:this={gallerySection} class="scroll-mt-24 py-16">
		<Separator class="mb-12 bg-white/5" />

		<div class="mb-12 flex items-end justify-between gap-6" data-reveal>
			<div>
				<Badge
					variant="outline"
					class="border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-400"
				>
					Gallery
				</Badge>
				<h2 class="mt-4 text-4xl font-semibold tracking-[-0.03em] text-neutral-50 sm:text-5xl">
					Screenshots.
				</h2>
			</div>
			<p class="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500 sm:block">
				AVIF · WebP · JPG · 1x & 2x
			</p>
		</div>

		<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
			{#each screenshots as n (n)}
				<a
					href={PLAY_STORE}
					target="_blank"
					rel="noreferrer noopener"
					data-reveal
					class="group/shot relative block aspect-[9/16] overflow-hidden rounded-2xl border border-white/5 bg-white/[0.015] transition-all duration-500 hover:border-white/30 hover:bg-white/[0.04]"
				>
					<OptimizedPicture
						src="/apps/anticall/{n}"
						alt="AntiCallCL screenshot {n}"
						class="size-full object-cover transition-transform duration-500 group-hover/shot:scale-[1.04]"
						width={540}
						height={1200}
					/>
					<div
						class="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-950/60 to-transparent opacity-0 transition-opacity duration-500 group-hover/shot:opacity-100"
					></div>
					<span
						class="absolute right-2 bottom-2 rounded-md border border-white/10 bg-neutral-950/80 px-1.5 py-0.5 font-mono text-[9px] text-neutral-300 backdrop-blur"
					>
						{n}
					</span>
				</a>
			{/each}
		</div>
	</section>

	<!-- ============= STACK ============= -->
	<section bind:this={stackSection} class="scroll-mt-24 py-16">
		<Separator class="mb-12 bg-white/5" />

		<div class="mb-12" data-reveal>
			<Badge
				variant="outline"
				class="border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-400"
			>
				Stack
			</Badge>
			<h2 class="mt-4 text-4xl font-semibold tracking-[-0.03em] text-neutral-50 sm:text-5xl">
				Under the hood.
			</h2>
		</div>

		<div class="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/5 md:grid-cols-2">
			{#each stack as s (s.label)}
				<div class="bg-neutral-950 p-6" data-reveal>
					<p class="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
						{s.label}
					</p>
					<p class="mt-3 text-lg text-neutral-100 sm:text-xl">{s.tech}</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- ============= RELATED ============= -->
	<section bind:this={relatedSection} class="scroll-mt-24 py-16">
		<Separator class="mb-12 bg-white/5" />

		<div class="mb-12" data-reveal>
			<Badge
				variant="outline"
				class="border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-400"
			>
				Related
			</Badge>
			<h2 class="mt-4 text-4xl font-semibold tracking-[-0.03em] text-neutral-50 sm:text-5xl">
				Repos & resources.
			</h2>
		</div>

		<div class="grid grid-cols-1 gap-3 md:grid-cols-3">
			{#each related as r (r.title)}
				<a
					href={r.href}
					target="_blank"
					rel="noreferrer noopener"
					data-reveal
					class="group/repo flex items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/[0.015] p-5 transition-all duration-500 hover:border-white/20 hover:bg-white/[0.04]"
				>
					<div>
						<div class="text-base font-semibold text-neutral-100">{r.title}</div>
						<div class="mt-1 font-mono text-[10px] uppercase tracking-wider text-neutral-500">
							{r.sub}
						</div>
					</div>
					<ArrowUpRight
						size={14}
						weight="bold"
						class="text-neutral-500 transition-all group-hover/repo:-translate-y-0.5 group-hover/repo:translate-x-0.5 group-hover/repo:text-neutral-200"
					/>
				</a>
			{/each}
		</div>

		<p class="mt-16 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-600">
			© {new Date().getFullYear()} · AntiCallCL · seba3567.cl
		</p>
	</section>
</main>
