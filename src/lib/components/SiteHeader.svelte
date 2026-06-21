<script lang="ts">
	import { page } from '$app/state';
	import { GithubLogo, Lightning, List } from 'phosphor-svelte';
	import * as NavigationMenu from '$lib/components/ui/navigation-menu';
	import * as Sheet from '$lib/components/ui/sheet';
	import { Separator } from '$lib/components/ui/separator';
	import { Button } from '$lib/components/ui/button';
	import GlassCard from './GlassCard.svelte';

	type Props = {
		username?: string;
		repoCount?: number;
	};

	let { username = 'seba3567', repoCount = 0 }: Props = $props();

	const currentPath = $derived(page.url?.pathname ?? '/');
	const isHome = $derived(currentPath === '/');
	const isProjects = $derived(currentPath.startsWith('/proyectos'));

	type NavItem = {
		href: string;
		label: string;
		match?: (path: string) => boolean;
		description?: string;
	};

	const items: { label: string; href?: string; match?: (path: string) => boolean; submenu?: NavItem[] }[] =
		[
			{ label: 'Inicio', href: '/', match: (p) => p === '/' || p === '' },
			{
				label: 'Proyectos',
				href: '/proyectos',
				match: (p) => p.startsWith('/proyectos'),
				submenu: [
					{
						href: '/proyectos#destacado',
						label: 'Destacados',
						description: 'AntiCallCL, autoskills, frontend.skeleton',
					},
					{
						href: '/proyectos#todos',
						label: 'Todos los repos',
						description: 'Catálogo vivo desde la API de GitHub',
					},
				],
			},
			{
				label: 'Stack',
				href: '/#stack',
				match: (p) => p.includes('#stack'),
				submenu: [
					{
						href: '/#valor',
						label: 'Propuesta de valor',
						description: 'Cómo traduzco requerimientos en entregables',
					},
					{
						href: '/#stack',
						label: 'Stack principal',
						description: 'Intermedio · En progreso · Base',
					},
				],
			},
		];

	function isActive(item: { match?: (path: string) => boolean; href?: string }): boolean {
		if (item.match) return item.match(currentPath);
		return false;
	}
</script>

<header class="sticky top-4 z-40 mx-auto w-full max-w-6xl px-4">
	<GlassCard variant="strong" class="flex items-center justify-between gap-3 px-3 py-2.5 sm:px-4">
		<a
			href="/"
			class="group flex items-center gap-2.5 rounded-lg px-1 py-1 transition-all hover:opacity-90"
		>
			<div
				class="relative flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-500 shadow-lg"
			>
				<Lightning size={18} weight="fill" class="text-neutral-950" />
				<span
					class="absolute -inset-0.5 -z-10 rounded-lg bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-500 opacity-50 blur-md transition-opacity group-hover:opacity-80"
				></span>
			</div>
			<div class="hidden flex-col leading-tight sm:flex">
				<span class="text-sm font-semibold tracking-tight text-neutral-50">seba3567.cl</span>
				<span class="font-mono text-[10px] text-neutral-500">/ {isHome ? 'perfil' : isProjects ? 'proyectos' : 'sitio'}</span>
			</div>
		</a>

		<NavigationMenu.Root class="hidden md:flex">
			<NavigationMenu.List class="gap-1">
				{#each items as item (item.label)}
					{#if item.submenu}
						<NavigationMenu.Item>
							<NavigationMenu.Trigger
								class="bg-transparent text-neutral-300 hover:bg-white/5 hover:text-neutral-100 data-[popup-open]:bg-white/5 data-[popup-open]:text-neutral-100"
							>
								{item.label}
							</NavigationMenu.Trigger>
							<NavigationMenu.Content
								class="glass-strong !mt-2 w-72 rounded-xl !p-1.5"
							>
								<ul class="flex flex-col gap-0.5">
									{#each item.submenu as sub (sub.href)}
										<li>
											<NavigationMenu.Link
												href={sub.href}
												class="block rounded-lg p-3 transition-colors hover:bg-white/5"
											>
												<div class="text-sm font-semibold text-neutral-100">
													{sub.label}
												</div>
												{#if sub.description}
													<p class="mt-0.5 text-xs text-neutral-500">
														{sub.description}
													</p>
												{/if}
											</NavigationMenu.Link>
										</li>
									{/each}
								</ul>
							</NavigationMenu.Content>
						</NavigationMenu.Item>
					{:else}
						<NavigationMenu.Item>
							<NavigationMenu.Link
								href={item.href}
								class="rounded-lg px-3 py-1.5 text-sm font-medium transition-all {isActive(item)
									? 'bg-white/10 text-neutral-50'
									: 'text-neutral-300 hover:bg-white/5 hover:text-neutral-100'}"
							>
								{item.label}
							</NavigationMenu.Link>
						</NavigationMenu.Item>
					{/if}
				{/each}
			</NavigationMenu.List>
		</NavigationMenu.Root>

		<div class="flex items-center gap-2">
			<a
				href="https://github.com/{username}"
				target="_blank"
				rel="noreferrer noopener"
				class="hidden items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-neutral-200 transition-all hover:scale-[1.02] hover:border-white/20 hover:bg-white/10 sm:inline-flex"
			>
				<GithubLogo size={14} weight="bold" />
				<span class="font-mono">@{username}</span>
				<span class="text-[10px] text-neutral-500">({repoCount})</span>
			</a>

			<!-- Mobile menu -->
			<Sheet.Root>
				<Sheet.Trigger
					class="inline-flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-neutral-300 transition-colors hover:bg-white/10 md:hidden"
				>
					<List size={18} weight="bold" />
				</Sheet.Trigger>
				<Sheet.Content side="right" class="w-72 gap-0 p-0">
					<Sheet.Header class="border-b border-white/5 p-4">
						<Sheet.Title class="text-sm">seba3567.cl</Sheet.Title>
						<Sheet.Description class="text-xs">Sebastián Muñoz</Sheet.Description>
					</Sheet.Header>
					<nav class="flex flex-col p-2">
						{#each items as item (item.label)}
							<a
								href={item.href}
								class="rounded-lg px-3 py-2 text-sm font-medium transition-colors {isActive(
									item,
								)
									? 'bg-white/10 text-neutral-50'
									: 'text-neutral-300 hover:bg-white/5 hover:text-neutral-100'}"
							>
								{item.label}
							</a>
							{#if item.submenu}
								{#each item.submenu as sub (sub.href)}
									<a
										href={sub.href}
										class="ml-3 rounded-lg px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:bg-white/5 hover:text-neutral-200"
									>
										· {sub.label}
									</a>
								{/each}
							{/if}
						{/each}
					</nav>
					<Separator class="bg-white/5" />
					<div class="p-4">
						<Button
							href="https://github.com/{username}"
							target="_blank"
							rel="noreferrer noopener"
							variant="outline"
							class="w-full justify-center"
						>
							<GithubLogo size={14} weight="bold" data-icon="inline-start" />
							@{username}
						</Button>
					</div>
				</Sheet.Content>
			</Sheet.Root>
		</div>
	</GlassCard>
</header>
