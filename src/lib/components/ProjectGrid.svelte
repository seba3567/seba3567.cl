<script lang="ts">
import { featuredProjects } from '$lib/data/featured';
import type { PublicRepo } from '$lib/server/github';
import ProjectCard from './ProjectCard.svelte';

type Props = { repos: PublicRepo[] };
let { repos }: Props = $props();

const featuredSlugs = $derived(
	new Set(featuredProjects.flatMap((p) => p.relatedRepos ?? [p.slug])),
);

function isFeatured(repo: PublicRepo): boolean {
	return (
		featuredSlugs.has(repo.name) || featuredSlugs.has(repo.name.toLowerCase())
	);
}
</script>

{#if repos.length === 0}
	<div
		class="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center"
	>
		<p class="text-sm text-neutral-400">No hay proyectos que coincidan con tu búsqueda.</p>
	</div>
{:else}
	<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
		{#each repos as repo (repo.id)}
			<ProjectCard {repo} isFeatured={isFeatured(repo)} />
		{/each}
	</div>
{/if}
