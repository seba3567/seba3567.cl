<script lang="ts">
import { onMount } from 'svelte';
import { t } from 'svelte-i18n';
import {
	DEFAULT_LOCALE,
	resolveInitialLocale,
	SUPPORTED_LOCALES,
	type SupportedLocale,
} from '$lib/i18n/index';
import { switchLocale } from '$lib/i18n/locale.svelte';

// Two-pill toggle (ES | EN). Mobile collapses to a single
// button that cycles the locale — the desktop dots look
// weird in the tight mobile nav.

let locale = $state<SupportedLocale>(DEFAULT_LOCALE);

// i18n is initialized at the top of the root layout (before
// any child mounts), so by the time this component runs
// setupI18n() is already done. We only sync our local state
// to whatever the layout applied. (No `setupI18n()` call
// here — calling it twice is a no-op but adds noise to the
// predev/prebuild logs.)
onMount(() => {
	locale = resolveInitialLocale();
});

function onSelect(next: SupportedLocale) {
	if (next === locale) return;
	void switchLocale(next);
	locale = next;
}
</script>

<div
	class="inline-flex items-center gap-0.5 rounded-full border border-white/10 bg-white/[0.04] p-0.5"
	role="group"
	aria-label="Idioma"
>
	{#each SUPPORTED_LOCALES as code (code)}
		{@const active = code === locale}
		<button
			type="button"
			onclick={() => onSelect(code)}
			aria-pressed={active}
			aria-label={$t(`language.switchTo${code === 'es' ? 'Es' : 'En'}`)}
			class="rounded-full px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider transition-all duration-300 {active
				? 'bg-mint-500/20 text-mint-200'
				: 'text-neutral-500 hover:text-neutral-200'}"
		>
			{code}
		</button>
	{/each}
</div>
