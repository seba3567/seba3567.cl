<script lang="ts">
import { Heart, Lightning, Smiley } from 'phosphor-svelte';
import { Button } from '$lib/components/ui/button';

// Svelte 5 Rune for reactive state
let clicks = $state(0);
</script>

<svelte:head>
	<title>Svelte 5 + Tailwind v4 + Shadcn + Phosphor</title>
</svelte:head>

<main class="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-center items-center p-6 selection:bg-neutral-800">
	<!-- Decorative glow background -->
	<div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(63,63,70,0.15),transparent_60%)] pointer-events-none"></div>

	<div class="relative max-w-md w-full bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 p-8 rounded-2xl shadow-2xl flex flex-col items-center text-center space-y-6">
		<!-- Icon Badge -->
		<div class="w-12 h-12 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-amber-400">
			<Lightning size={24} weight="fill" class="animate-pulse" />
		</div>

		<!-- Title -->
		<div class="space-y-2">
			<h1 class="text-3xl font-bold tracking-tight bg-gradient-to-r from-neutral-100 via-neutral-300 to-neutral-500 bg-clip-text text-transparent">
				Hello World
			</h1>
			<p class="text-sm text-neutral-400">
				Svelte 5 (Runes) + Tailwind v4 + Shadcn + Phosphor
			</p>
		</div>

		<!-- Svelte 5 Rune Showcase -->
		<div class="w-full border-t border-neutral-800/80 pt-6 flex flex-col items-center space-y-4">
			<p class="text-xs text-neutral-500 font-mono">
				Rune Counter: {clicks}
			</p>
			
			<div class="flex gap-2">
				<Button onclick={() => clicks++} variant="default" class="gap-2">
					<Smiley size={18} weight="bold" />
					Click Me
				</Button>

				<Button onclick={() => clicks = 0} variant="outline" class="gap-2 border-neutral-800 text-neutral-400 hover:text-neutral-200">
					Reset
				</Button>
			</div>
		</div>

		<!-- Footer Brand -->
		<div class="flex items-center gap-1.5 text-[10px] text-neutral-600 font-medium pt-2">
			<span>Built with BunJS</span>
			<span class="text-red-500/60"><Heart size={10} weight="fill" /></span>
		</div>
	</div>
</main>
