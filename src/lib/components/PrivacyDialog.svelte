<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Database,
		Eye,
		ShareNetwork,
		ShieldCheck,
		Lock,
		Trash,
		Envelope,
		X,
		ArrowUpRight,
	} from 'phosphor-svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { revealChars } from '$lib/animations';

	type Section = {
		n: string;
		icon: typeof Database;
		title: string;
		body: string;
		bullets: string[];
	};

	type Props = { open: boolean; onOpenChange: (v: boolean) => void };
	let { open = $bindable(false), onOpenChange }: Props = $props();

	const PRIVACY_URL = 'https://seba3567.github.io/anticall_pages/';
	const CONTACT_EMAIL = 'seba3567.dev@gmail.com';
	const LAST_UPDATED = '3 de diciembre de 2025';

	const sections: Section[] = [
		{
			n: '01',
			icon: Database,
			title: 'Datos que recopilamos',
			body: 'Anticall Chile no recopila, almacena ni transmite datos personales a servidores externos. Toda la lógica de bloqueo y análisis ocurre localmente en tu dispositivo.',
			bullets: [
				'No solicitamos cuentas ni credenciales: la app opera sin registro.',
				'Los números bloqueados o listas personalizadas residen únicamente en tu teléfono.',
				'Las métricas de llamadas se guardan de manera local y puedes eliminarlas cuando quieras.',
				'Solo accedemos a permisos del sistema para ejecutar funciones esenciales y nunca copiamos esa información fuera del equipo.',
			],
		},
		{
			n: '02',
			icon: Eye,
			title: 'Cómo usamos la información',
			body: 'Al no existir transferencia a la nube, el uso de información se limita estrictamente al funcionamiento local de la aplicación.',
			bullets: [
				'Procesar eventos de llamadas en el dispositivo para detectar y bloquear spam.',
				'Recordar tus configuraciones, listas y preferencias solo dentro del almacenamiento de la app.',
				'Mostrar métricas básicas en la interfaz para que evalúes la efectividad del bloqueo.',
				'Permitir que exportes o elimines manualmente cualquier dato almacenado localmente.',
			],
		},
		{
			n: '03',
			icon: ShareNetwork,
			title: 'Cuándo compartimos datos',
			body: 'No hay transferencia ni compartición automática de datos, porque la información nunca abandona tu dispositivo.',
			bullets: [
				'No trabajamos con terceros que procesen tus datos personales.',
				'Solo puedes compartir información si decides exportarla o enviarla voluntariamente (por ejemplo, para soporte).',
				'En caso de obligación legal, primero te solicitaríamos la información pertinente, ya que no la almacenamos por defecto.',
			],
		},
		{
			n: '04',
			icon: ShieldCheck,
			title: 'Derechos de las personas usuarias',
			body: 'Aunque la aplicación no conserva datos en servidores, respetamos los derechos otorgados por la legislación chilena e internacional.',
			bullets: [
				'Control total desde la app para revisar o eliminar registros locales.',
				'Posibilidad de respaldar tus listas y métricas en tu propio dispositivo antes de desinstalar.',
				'Soporte para consultas relacionadas con privacidad o cumplimiento normativo.',
				'Canal abierto para reportar cualquier incidente o inquietud.',
			],
		},
		{
			n: '05',
			icon: Lock,
			title: 'Medidas de seguridad',
			body: 'Diseñamos la solución para minimizar superficie de ataque y dependencia externa.',
			bullets: [
				'Procesamiento local: sin sincronización con servidores ni copias en la nube.',
				'Uso de las API oficiales de la plataforma para gestionar permisos sensibles.',
				'Actualizaciones periódicas para mantener el software libre de vulnerabilidades conocidas.',
				'Recomendaciones dentro de la app para que protejas tu dispositivo (PIN, biometría, cifrado).',
			],
		},
		{
			n: '06',
			icon: Trash,
			title: 'Período de conservación',
			body: 'Como la información se mantiene solo en tu teléfono, tú decides cuánto tiempo conservarla.',
			bullets: [
				'Puedes borrar historial, listas y configuraciones desde los ajustes en cualquier momento.',
				'Al desinstalar la aplicación se eliminan automáticamente todos los datos asociados.',
			],
		},
	];

	let titleEl: HTMLElement | undefined = $state();

	$effect(() => {
		if (open && titleEl) {
			revealChars(titleEl, { staggerMs: 28, offsetY: 36, duration: 600, delay: 100 });
		}
	});
</script>

<Dialog.Root bind:open={() => open, (v) => { open = v; onOpenChange?.(v); }}>
	<Dialog.Portal>
		<Dialog.Overlay
			class="fixed inset-0 z-50 bg-neutral-950/85 backdrop-blur-2xl data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
		/>
		<Dialog.Content
			class="glass-liquid-static fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[min(96vw,860px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl shadow-2xl shadow-black/70 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
		>
			<!-- Top bar: close button + badge -->
			<div
				class="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-3 p-5 sm:p-6"
			>
				<Badge
					variant="outline"
					class="pointer-events-auto border-emerald-400/20 bg-emerald-500/5 px-2.5 py-0.5 font-mono text-[10px] font-normal uppercase tracking-wider text-emerald-300"
				>
					<span class="relative flex size-1.5">
						<span
							class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"
						></span>
						<span class="relative inline-flex size-1.5 rounded-full bg-emerald-400"></span>
					</span>
					Privacidad
				</Badge>
				<Dialog.Close
					class="pointer-events-auto inline-flex size-9 items-center justify-center rounded-full border border-white/10 bg-neutral-950/80 text-neutral-300 backdrop-blur transition-colors hover:bg-white/10 hover:text-neutral-100"
					aria-label="Cerrar"
				>
					<X size={14} weight="bold" />
				</Dialog.Close>
			</div>

			<!-- Scrollable body -->
			<div class="max-h-[90vh] overflow-y-auto px-6 pt-20 pb-6 sm:px-10 sm:pt-24 sm:pb-8">
				<Dialog.Header class="mb-10">
					<Dialog.Title bind:ref={titleEl} class="sr-only">Política de Privacidad de Anticall Chile</Dialog.Title>
					<div class="text-balance text-3xl font-semibold leading-[1.05] tracking-[-0.03em] text-neutral-50 sm:text-4xl md:text-5xl">
						<span bind:this={titleEl}>Política de Privacidad.</span>
					</div>
					<Dialog.Description class="mt-3 text-sm text-neutral-400 sm:text-base">
						Tu confianza es fundamental. Esta política describe cómo recopilamos, utilizamos y
						protegemos tus datos al usar Anticall Chile.
					</Dialog.Description>
					<p class="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
						Última actualización · {LAST_UPDATED}
					</p>
				</Dialog.Header>

				<div class="space-y-10">
					{#each sections as s (s.n)}
						{@const Icon = s.icon}
						<section class="border-t border-white/5 pt-8 first:border-t-0 first:pt-0">
							<div class="flex items-start gap-4">
								<div
									class="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5"
								>
									<Icon size={18} weight="duotone" class="text-emerald-300" />
								</div>
								<div class="min-w-0 flex-1">
									<div class="flex items-baseline gap-2.5">
										<span
											class="font-mono text-[10px] text-neutral-600 transition-colors group-hover:text-neutral-400"
											>{s.n}</span
										>
										<h3
											class="text-balance text-lg font-semibold tracking-tight text-neutral-100 sm:text-xl"
										>
											{s.title}
										</h3>
									</div>
									<p class="mt-2 text-pretty text-sm leading-relaxed text-neutral-300 sm:text-[15px]">
										{s.body}
									</p>
									<ul class="mt-3 space-y-1.5">
										{#each s.bullets as b (b)}
											<li class="flex items-start gap-2.5 text-sm leading-relaxed text-neutral-400">
												<span
													class="mt-1.5 size-1 shrink-0 rounded-full bg-neutral-600"
												></span>
												<span>{b}</span>
											</li>
										{/each}
									</ul>
								</div>
							</div>
						</section>
					{/each}

					<!-- Contact block (07 from the original policy) -->
					<section
						class="rounded-2xl border border-white/5 bg-white/[0.02] p-5 sm:p-6"
					>
						<div class="flex items-start gap-4">
							<div
								class="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5"
							>
								<Envelope size={18} weight="duotone" class="text-amber-300" />
							</div>
							<div class="min-w-0 flex-1">
								<p class="font-mono text-[10px] text-neutral-600">07</p>
								<h3
									class="text-balance text-lg font-semibold tracking-tight text-neutral-100 sm:text-xl"
								>
									Contacto de privacidad
								</h3>
								<p class="mt-2 text-pretty text-sm leading-relaxed text-neutral-300 sm:text-[15px]">
									¿Tienes preguntas o solicitudes? Nuestro equipo está disponible para
									ayudarte.
								</p>
								<a
									href="mailto:{CONTACT_EMAIL}"
									class="mt-3 inline-flex items-center gap-1.5 break-all font-mono text-sm text-neutral-200 transition-colors hover:text-emerald-300"
								>
									{CONTACT_EMAIL}
									<ArrowUpRight
										size={11}
										weight="bold"
										class="shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
									/>
								</a>
							</div>
						</div>
					</section>
				</div>

				<!-- Footer / actions -->
				<Dialog.Footer
					class="mt-10 flex flex-col items-stretch gap-2 border-t border-white/5 pt-6 sm:flex-row sm:items-center sm:justify-between"
				>
					<p class="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
						© 2025 Anticall Chile · Todos los derechos reservados
					</p>
					<div class="flex flex-wrap items-center gap-2">
						<Button
							href={PRIVACY_URL}
							target="_blank"
							rel="noreferrer noopener"
							variant="outline"
							size="sm"
						>
							<ArrowUpRight size={11} weight="bold" data-icon="inline-end" />
							Ver original
						</Button>
						<Dialog.Close>
							{#snippet child({ props })}
								<Button {...props} size="sm">Entendido</Button>
							{/snippet}
						</Dialog.Close>
					</div>
				</Dialog.Footer>
			</div>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
