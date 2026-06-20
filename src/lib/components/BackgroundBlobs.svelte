<script lang="ts">
	const blobs = [
		{
			color: 'from-violet-600/30 via-fuchsia-500/20 to-transparent',
			size: 'w-[520px] h-[520px]',
			position: 'top-[-10%] left-[-10%]',
			speed: 'animate-blob',
		},
		{
			color: 'from-cyan-500/25 via-sky-500/15 to-transparent',
			size: 'w-[600px] h-[600px]',
			position: 'top-[20%] right-[-15%]',
			speed: 'animate-blob-slow',
		},
		{
			color: 'from-amber-500/20 via-rose-500/15 to-transparent',
			size: 'w-[480px] h-[480px]',
			position: 'bottom-[-15%] left-[20%]',
			speed: 'animate-blob',
		},
		{
			color: 'from-emerald-500/20 via-cyan-500/10 to-transparent',
			size: 'w-[420px] h-[420px]',
			position: 'bottom-[10%] right-[10%]',
			speed: 'animate-blob-slow',
		},
	] as const;
</script>

<div
	aria-hidden="true"
	class="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-neutral-950"
>
	<div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.08),transparent_60%)]"></div>

	{#each blobs as blob (blob.position)}
		<div
			class="{blob.position} {blob.size} {blob.speed} absolute rounded-full bg-gradient-to-br {blob.color} blur-3xl opacity-70"
		></div>
	{/each}

	<div class="absolute inset-0 grain"></div>

	<div
		class="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
	></div>
</div>
