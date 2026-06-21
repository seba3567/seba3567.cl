<script lang="ts">
import GlassCard from '$lib/components/GlassCard.svelte';

type Section = { id: string; label: string };

type Props = {
	sections: ReadonlyArray<Section>;
	activeId: string;
	onSelect: (id: string) => void;
};

let { sections, activeId, onSelect }: Props = $props();
</script>

<div class="pointer-events-none fixed inset-x-0 bottom-6 z-30 flex justify-center">
	<GlassCard
		variant="strong"
		class="pointer-events-auto flex items-center gap-1 rounded-md px-2 py-1.5"
	>
		{#each sections as s (s.id)}
			<button
				type="button"
				onclick={() => onSelect(s.id)}
				aria-label={'Ir a ' + s.label}
				title={s.label}
				class="group/dot flex items-center gap-1.5 rounded px-2 py-1 transition-colors hover:bg-white/5"
			>
				<span
					class="size-1.5 rounded-full transition-all duration-500 {s.id === activeId
						? 'w-5 bg-mint-300'
						: 'bg-neutral-600 group-hover/dot:bg-neutral-400'}"
				></span>
				<span
					class="hidden font-mono text-[10px] uppercase tracking-wider text-neutral-400 transition-opacity duration-300 sm:inline {s.id ===
					activeId
						? 'opacity-100'
						: 'opacity-0'}"
				>
					{s.label}
				</span>
			</button>
		{/each}
	</GlassCard>
</div>
