<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Variant = 'soft' | 'strong' | 'subtle';
	type Props = HTMLAttributes<HTMLElement> & {
		variant?: Variant;
		hover?: boolean;
		glow?: string;
		accent?: string;
		as?: 'div' | 'article' | 'section' | 'aside';
		class?: string;
		children?: Snippet;
	};

	let {
		variant = 'soft',
		hover = false,
		glow = '',
		accent = '',
		as = 'div',
		class: className = '',
		children,
		...rest
	}: Props = $props();

	const baseClass = $derived(
		[
			'rounded-2xl',
			variant === 'soft' ? 'glass' : variant === 'strong' ? 'glass-strong' : 'glass',
			hover ? 'glass-hover cursor-default' : '',
			glow,
			accent,
			className,
		]
			.filter(Boolean)
			.join(' '),
	);
</script>

<svelte:element this={as} class={baseClass} {...rest}>
	{@render children?.()}
</svelte:element>
