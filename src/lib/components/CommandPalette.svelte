<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import {
		House,
		DeviceMobile,
		Stack,
		Folder,
		GithubLogo,
		EnvelopeSimple,
		LinkedinLogo,
		Lock,
		ShieldCheck,
		Flask,
		MagnifyingGlass,
		ArrowRight,
	} from 'phosphor-svelte';
	import * as Dialog from '$lib/components/ui/dialog';

	type Action = {
		id: string;
		label: string;
		subtitle?: string;
		icon: typeof House;
		group: string;
		keywords?: string[];
		href?: string;
		action?: () => void;
	};

	type Props = { open: boolean; onOpenChange: (v: boolean) => void };
	let { open = $bindable(false), onOpenChange }: Props = $props();

	const PRIVACY_URL = 'https://seba3567.github.io/anticall_pages/';
	const BETA = 'https://play.google.com/apps/testing/com.seba3567.anticall_chile';
	const PLAY = 'https://play.google.com/store/apps/details?id=com.seba3567.anticall_chile&hl=en-US';
	const GITHUB = 'https://github.com/seba3567';
	const LINKEDIN = 'https://www.linkedin.com/in/seba3567';
	const EMAIL = 'mailto:seba3567.dev@gmail.com';

	let privacyDialogOpen = $state(false);
	const dispatch = (e: CustomEvent<{ open: boolean }>) => (privacyDialogOpen = e.detail.open);

	const actions: Action[] = [
		// Navigation
		{
			id: 'go-home',
			label: 'Ir a Inicio',
			subtitle: '/',
			icon: House,
			group: 'Navegación',
			keywords: ['home', 'inicio', 'index', 'perfil'],
			href: '/',
		},
		{
			id: 'go-apps',
			label: 'Ir a Apps',
			subtitle: '/apps',
			icon: DeviceMobile,
			group: 'Navegación',
			keywords: ['apps', 'aplicaciones', 'anticall'],
			href: '/apps',
		},
		{
			id: 'go-anticall',
			label: 'Ver AntiCallCL',
			subtitle: '/apps/anticall',
			icon: DeviceMobile,
			group: 'Navegación',
			keywords: ['anticall', 'app', 'android', 'llamadas', 'spam'],
			href: '/apps/anticall',
		},
		{
			id: 'go-proyectos',
			label: 'Ir a Proyectos (GitHub)',
			subtitle: '/proyectos',
			icon: Folder,
			group: 'Navegación',
			keywords: ['proyectos', 'github', 'repos', 'work', 'repositorio'],
			href: '/proyectos',
		},
		// Actions
		{
			id: 'beta',
			label: 'Unirme a la beta (AntiCallCL)',
			subtitle: 'Google Play · early access',
			icon: Flask,
			group: 'Acciones',
			keywords: ['beta', 'testing', 'anticall', 'play', 'google'],
			href: BETA,
		},
		{
			id: 'play',
			label: 'Abrir Play Store (AntiCallCL)',
			subtitle: 'Instalar o actualizar',
			icon: ShieldCheck,
			group: 'Acciones',
			keywords: ['play', 'store', 'instalar', 'android', 'anticall'],
			href: PLAY,
		},
		{
			id: 'privacy',
			label: 'Política de privacidad (AntiCallCL)',
			subtitle: 'Lee la policy completa',
			icon: Lock,
			group: 'Acciones',
			keywords: ['privacidad', 'privacy', 'policy', 'datos', 'anticall'],
			action: () => {
				open = false;
				queueMicrotask(() => {
					window.dispatchEvent(new CustomEvent('seba:privacy', { detail: { open: true } }));
				});
			},
		},
		{
			id: 'privacy-original',
			label: 'Privacy policy original (seba3567.github.io)',
			subtitle: 'Versión canónica hospedada en GitHub Pages',
			icon: Lock,
			group: 'Acciones',
			keywords: ['privacidad', 'original', 'github', 'pages', 'policy'],
			href: PRIVACY_URL,
		},
		// External
		{
			id: 'github',
			label: 'GitHub · @seba3567',
			subtitle: GITHUB.replace('https://', ''),
			icon: GithubLogo,
			group: 'Externo',
			keywords: ['github', 'repos', 'code', 'código'],
			href: GITHUB,
		},
		{
			id: 'linkedin',
			label: 'LinkedIn · in/seba3567',
			subtitle: 'linkedin.com/in/seba3567',
			icon: LinkedinLogo,
			group: 'Externo',
			keywords: ['linkedin', 'trabajo', 'red', 'profesional'],
			href: LINKEDIN,
		},
		{
			id: 'email',
			label: 'Email · seba3567.dev@gmail.com',
			subtitle: 'Escribir mail',
			icon: EnvelopeSimple,
			group: 'Externo',
			keywords: ['email', 'mail', 'contacto', 'gmail'],
			href: EMAIL,
		},
		{
			id: 'stack',
			label: 'Sección Stack del home',
			subtitle: '/#stack',
			icon: Stack,
			group: 'Navegación',
			keywords: ['stack', 'tecnologias', 'tech', 'languages'],
			href: '/#stack',
		},
	];

	let query = $state('');
	let selectedIndex = $state(0);
	let inputEl: HTMLInputElement | undefined = $state();

	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase();
		if (!q) return actions;
		return actions
			.map((a) => {
				const haystack = `${a.label} ${a.subtitle ?? ''} ${a.keywords?.join(' ') ?? ''} ${a.group}`
					.toLowerCase();
				const idx = haystack.indexOf(q);
				if (idx === -1) return null;
				return { action: a, score: idx };
			})
			.filter(Boolean)
			.sort((a, b) => (a!.score - b!.score))
			.map((x) => x!.action);
	});

	$effect(() => {
		// Keep selection in bounds
		if (selectedIndex >= filtered.length) selectedIndex = 0;
	});

	$effect(() => {
		if (open) {
			query = '';
			selectedIndex = 0;
			// Focus after mount
			setTimeout(() => inputEl?.focus(), 50);
		}
	});

	function isExternal(href: string): boolean {
		return /^https?:|^mailto:/.test(href);
	}

	function run(action: Action) {
		open = false;
		// Defer so the dialog closes first
		queueMicrotask(() => {
			if (action.action) {
				action.action();
			} else if (action.href) {
				if (isExternal(action.href)) {
					window.open(action.href, '_blank', 'noopener,noreferrer');
				} else {
					goto(action.href);
				}
			}
		});
	}

	function handleKey(e: KeyboardEvent) {
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			selectedIndex = Math.min(selectedIndex + 1, filtered.length - 1);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			selectedIndex = Math.max(selectedIndex - 1, 0);
		} else if (e.key === 'Enter') {
			e.preventDefault();
			const a = filtered[selectedIndex];
			if (a) run(a);
		}
	}

	// Cmd+K / Ctrl+K to open
	onMount(() => {
		const onKey = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
				e.preventDefault();
				open = !open;
			}
			if (e.key === '/' && !open && !isTypingTarget(e.target)) {
				e.preventDefault();
				open = true;
			}
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});

	function isTypingTarget(el: EventTarget | null): boolean {
		if (!el || !(el instanceof HTMLElement)) return false;
		const tag = el.tagName;
		return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable;
	}

	// Listen for privacy dialog requests
	onMount(() => {
		const onPrivacy = () => {
			privacyDialogOpen = true;
		};
		window.addEventListener('seba:privacy', onPrivacy as EventListener);
		return () => window.removeEventListener('seba:privacy', onPrivacy as EventListener);
	});

	const groups = $derived.by(() => {
		const map = new Map<string, Action[]>();
		for (const a of filtered) {
			const g = map.get(a.group) ?? [];
			g.push(a);
			map.set(a.group, g);
		}
		return Array.from(map.entries());
	});
</script>

<Dialog.Root bind:open={() => open, (v) => { open = v; onOpenChange?.(v); }}>
	<Dialog.Portal>
		<Dialog.Overlay
			class="fixed inset-0 z-50 bg-neutral-950/85 backdrop-blur-2xl data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
		/>
		<Dialog.Content
			class="glass-liquid-static fixed left-1/2 top-[18%] z-50 max-h-[70vh] w-[min(96vw,640px)] -translate-x-1/2 overflow-hidden rounded-2xl shadow-2xl shadow-black/70 backdrop-blur-2xl data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
		>
			<!-- Search input -->
			<div class="flex items-center gap-3 border-b border-white/5 px-5 py-4">
				<MagnifyingGlass size={18} weight="bold" class="text-neutral-500" />
				<input
					bind:this={inputEl}
					bind:value={query}
					onkeydown={handleKey}
					placeholder="Buscar página, acción, app, repo…"
					class="w-full bg-transparent text-base text-neutral-100 placeholder:text-neutral-500 focus:outline-none"
					autocomplete="off"
					spellcheck="false"
				/>
				<kbd
					class="hidden rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-neutral-500 sm:inline"
				>esc</kbd>
			</div>

			<!-- Results -->
			<div class="max-h-[55vh] overflow-y-auto p-2">
				{#if filtered.length === 0}
					<div class="px-4 py-10 text-center">
						<p class="text-sm text-neutral-500">Sin resultados para "{query}"</p>
					</div>
				{:else}
					{#each groups as [group, items], gi (group)}
						<div class={gi > 0 ? 'mt-2' : ''}>
							<p
								class="px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-600"
							>
								{group}
							</p>
							{#each items as action, ii (action.id)}
								{@const Icon = action.icon}
								{@const globalIndex = filtered.indexOf(action)}
								{@const isSelected = globalIndex === selectedIndex}
								<button
									type="button"
									onmouseenter={() => (selectedIndex = globalIndex)}
									onclick={() => run(action)}
									class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors {isSelected
										? 'bg-white/[0.06] text-neutral-50'
										: 'text-neutral-300 hover:bg-white/[0.03]'}"
								>
									<div
										class="flex size-8 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5"
									>
										<Icon
											size={14}
											weight="duotone"
											class={isSelected ? 'text-violet-300' : 'text-neutral-400'}
										/>
									</div>
									<div class="min-w-0 flex-1">
										<p class="truncate text-sm font-medium">{action.label}</p>
										{#if action.subtitle}
											<p class="truncate font-mono text-[10px] text-neutral-500">
												{action.subtitle}
											</p>
										{/if}
									</div>
									<ArrowRight
										size={12}
										weight="bold"
										class="shrink-0 text-neutral-600 transition-opacity {isSelected
											? 'opacity-100'
											: 'opacity-0'}"
									/>
								</button>
							{/each}
						</div>
					{/each}
				{/if}
			</div>

			<!-- Footer -->
			<div
				class="flex items-center justify-between gap-2 border-t border-white/5 bg-white/[0.02] px-5 py-2.5"
			>
				<div class="flex items-center gap-3 font-mono text-[10px] text-neutral-500">
					<span class="flex items-center gap-1">
						<kbd class="rounded border border-white/10 bg-white/5 px-1 py-0.5">↑</kbd>
						<kbd class="rounded border border-white/10 bg-white/5 px-1 py-0.5">↓</kbd>
						navegar
					</span>
					<span class="flex items-center gap-1">
						<kbd class="rounded border border-white/10 bg-white/5 px-1 py-0.5">↵</kbd>
						ejecutar
					</span>
				</div>
				<span class="font-mono text-[10px] text-neutral-600">Cmd K</span>
			</div>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
