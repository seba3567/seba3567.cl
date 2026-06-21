<script lang="ts">
import {
	ArrowUpRight,
	Database,
	GithubLogo,
	Globe,
	Phone,
	PhoneSlash,
	PhoneX,
	ShieldCheck,
	WarningOctagon,
} from 'phosphor-svelte';
import type { FeaturedProject } from '$lib/data/featured';
import { ACCENT_CLASSES, STATUS_LABELS } from '$lib/data/featured';
import GlassCard from './GlassCard.svelte';

type Props = { project: FeaturedProject };
let { project }: Props = $props();

const accent = $derived(ACCENT_CLASSES[project.accent]);
const status = $derived(STATUS_LABELS[project.status]);

const callLog = $derived([
	{ who: '+56 9 4123 8800', blocked: true },
	{ who: 'Mamá', blocked: false },
	{ who: '+56 2 2845 1199', blocked: true },
	{ who: 'Banco Estado', blocked: false },
	{ who: '+56 9 7845 1102', blocked: true },
]);
</script>

<GlassCard
	variant="strong"
	hover
	glow={accent.glow}
	class="group relative overflow-hidden p-6 sm:p-8"
>
	<div
		aria-hidden="true"
		class="pointer-events-none absolute -top-32 -right-32 size-80 rounded-full {accent.bg
			.replace('bg-', 'bg-gradient-to-br from-')
			.replace('/10', '/30')} to-transparent blur-3xl"
	></div>
	<div
		aria-hidden="true"
		class="pointer-events-none absolute -bottom-32 -left-32 size-80 rounded-full {accent.bg
			.replace('bg-', 'bg-gradient-to-tr from-')
			.replace('/10', '/20')} to-transparent blur-3xl"
	></div>

	<div class="relative grid gap-8 lg:grid-cols-[1.4fr_1fr]">
		<div class="space-y-5">
			<div class="flex flex-wrap items-center gap-2">
				<span
					class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider {status.color}"
				>
					<span class="size-1.5 rounded-full bg-current"></span>
					{status.label}
				</span>
				<span
					class="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-300"
				>
					<span class="size-1.5 rounded-full {accent.text}"></span>
					Featured
				</span>
			</div>

			<div class="space-y-2">
				<div class="flex items-center gap-3">
					<div
						class="flex size-12 items-center justify-center rounded-xl {accent.bg} {accent.border} border ring-1 {accent.ring}"
					>
						<PhoneX size={26} weight="duotone" class={accent.text} />
					</div>
					<div>
						<h3 class="text-2xl font-bold tracking-tight text-neutral-50 sm:text-3xl">
							{project.name}
						</h3>
						<p class="text-sm text-neutral-400">{project.tagline}</p>
					</div>
				</div>
			</div>

			<p class="text-pretty text-sm leading-relaxed text-neutral-300 sm:text-base">
				{project.description}
			</p>

			{#if project.highlights && project.highlights.length}
				<ul class="space-y-2 pt-2">
					{#each project.highlights as h (h)}
						<li class="flex items-start gap-2.5 text-sm text-neutral-300">
							<ShieldCheck size={16} weight="duotone" class={accent.text} />
							<span>{h}</span>
						</li>
					{/each}
				</ul>
			{/if}

			<div class="flex flex-wrap items-center gap-2 pt-2">
				{#each project.stack as tech (tech)}
					<span
						class="rounded-md border border-white/10 bg-white/5 px-2 py-1 font-mono text-[11px] text-neutral-300"
					>
						{tech}
					</span>
				{/each}
			</div>

			<div class="flex flex-wrap gap-2 pt-2">
				{#if project.links.github}
					<a
						href={project.links.github}
						target="_blank"
						rel="noreferrer noopener"
						class="inline-flex items-center gap-2 rounded-lg {accent.bg} {accent.border} border px-3.5 py-2 text-sm font-medium text-neutral-100 transition-all hover:brightness-125"
					>
						<GithubLogo size={16} weight="bold" />
						Ver en GitHub
					</a>
				{/if}
				{#if project.links.demo}
					<a
						href={project.links.demo}
						target="_blank"
						rel="noreferrer noopener"
						class="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3.5 py-2 text-sm font-medium text-neutral-200 transition-all hover:border-white/20 hover:bg-white/10"
					>
						<Globe size={16} weight="bold" />
						Demo
						<ArrowUpRight size={12} weight="bold" />
					</a>
				{/if}
				{#if project.links.docs}
					<a
						href={project.links.docs}
						target="_blank"
						rel="noreferrer noopener"
						class="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3.5 py-2 text-sm font-medium text-neutral-200 transition-all hover:border-white/20 hover:bg-white/10"
					>
						Docs
						<ArrowUpRight size={12} weight="bold" />
					</a>
				{/if}
			</div>
		</div>

		<div class="relative">
			<div
				class="relative h-full overflow-hidden rounded-xl border border-white/10 bg-neutral-950/60 p-4 shadow-inner"
			>
				<div
					aria-hidden="true"
					class="absolute inset-0 bg-gradient-to-br {accent.bg} to-transparent opacity-50"
				></div>

				<div class="relative space-y-3">
					<div class="flex items-center justify-between border-b border-white/5 pb-2">
						<div class="flex items-center gap-1.5">
							<span class="size-2 rounded-full bg-red-400/70"></span>
							<span class="size-2 rounded-full bg-amber-400/70"></span>
							<span class="size-2 rounded-full bg-mint-400/70"></span>
						</div>
						<span class="font-mono text-[10px] text-neutral-500">AntiCallCL · dashboard</span>
					</div>

					<div class="rounded-lg {accent.bg} p-3 ring-1 {accent.ring}">
						<div class="flex items-center justify-between text-[11px]">
							<span class="font-mono {accent.text}">Llamadas hoy</span>
							<span class="font-mono text-neutral-500">CL</span>
						</div>
						<div class="mt-1 flex items-baseline gap-2">
							<span class="font-mono text-3xl font-bold text-neutral-100">128</span>
							<span class="text-xs text-mint-300">−42% spam</span>
						</div>
					</div>

					<div class="space-y-1.5">
						{#each callLog as call, i (i)}
							<div
								class="flex items-center justify-between rounded-md border border-white/5 bg-white/[0.02] px-2.5 py-1.5"
							>
								<div class="flex items-center gap-2">
									{#if call.blocked}
										<PhoneSlash size={14} weight="duotone" class="text-rose-400" />
									{:else}
										<Phone size={14} weight="duotone" class="text-mint-400" />
									{/if}
									<span class="font-mono text-[11px] text-neutral-300">{call.who}</span>
								</div>
								<span
									class="rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider {call.blocked
										? 'bg-rose-500/10 text-rose-300'
										: 'bg-mint-500/10 text-mint-300'}"
								>
									{call.blocked ? 'blocked' : 'passed'}
								</span>
							</div>
						{/each}
					</div>

					<div class="grid grid-cols-3 gap-2 pt-2">
						<div class="rounded-md border border-white/5 bg-white/[0.02] p-2">
							<div class="text-[9px] uppercase tracking-wider text-neutral-500">Bloq.</div>
							<div class="font-mono text-sm text-neutral-100">87</div>
						</div>
						<div class="rounded-md border border-white/5 bg-white/[0.02] p-2">
							<div class="text-[9px] uppercase tracking-wider text-neutral-500">Pasadas</div>
							<div class="font-mono text-sm text-neutral-100">41</div>
						</div>
						<div class="rounded-md border border-white/5 bg-white/[0.02] p-2">
							<div class="text-[9px] uppercase tracking-wider text-neutral-500">DB</div>
							<div class="flex items-center gap-1 font-mono text-sm text-neutral-100">
								<Database size={12} weight="duotone" />
								12k
							</div>
						</div>
					</div>

					<div
						class="mt-2 flex items-center gap-2 rounded-md border border-amber-400/20 bg-amber-500/5 p-2"
					>
						<WarningOctagon size={14} weight="duotone" class="text-amber-300" />
						<span class="text-[10px] text-amber-200/80">WIP · app en desarrollo activo</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</GlassCard>
