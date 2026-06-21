<script lang="ts">
import './layout.css';
import favicon from '$lib/assets/favicon.svg';
import BackgroundBlobs from '$lib/components/BackgroundBlobs.svelte';
import BackToTop from '$lib/components/BackToTop.svelte';
import SearchPanel from '$lib/components/SearchPanel.svelte';
import SiteHeader from '$lib/components/SiteHeader.svelte';

let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!--
  Skip-to-content link: hidden until focused, then jumps keyboard users
  past the site header straight to <main>. WCAG 2.4.1 bypass blocks.
  The link sits OUTSIDE the BackgroundBlobs so it inherits a solid
  z-stack and works regardless of layout context.
-->
<a
	href="#main"
	class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-mint-500 focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:font-medium focus:text-neutral-950 focus:shadow-2xl focus:shadow-mint-500/40 focus:outline-none"
>
	Saltar al contenido principal
</a>

<BackgroundBlobs />

<div class="relative z-10 flex min-h-screen flex-col">
	<SiteHeader />
	<main id="main" tabindex="-1" class="flex-1 outline-none">
		{@render children()}
	</main>
</div>

<SearchPanel />
<BackToTop />
