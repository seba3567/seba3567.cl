/**
 * Reusable anime.js v4 helpers for the site.
 *
 * Conventions:
 * - Every helper respects `prefers-reduced-motion` (no-op if true).
 * - Scroll-triggered animations use the native `IntersectionObserver` (simpler
 *   than anime.js's `onScroll` and fits our use case: trigger once on enter).
 * - Easings use anime's built-in cubic-bezier syntax: 'out(3)' = out-cubic, etc.
 * - All mutations are reverted on cleanup (returned by the setup helpers).
 */

import { animate, stagger, type AnimationParams } from 'animejs';

/** Respect prefers-reduced-motion. */
function prefersReducedMotion(): boolean {
	if (typeof window === 'undefined' || !window.matchMedia) return false;
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ============= EASING PRESETS =============
export const ease = {
	out: 'out(3)',
	outStrong: 'out(4)',
	outSmooth: 'out(2)',
	inOut: 'inOut(2)',
} as const;

// ============= ENTRANCE HELPERS =============

/**
 * Reveal all `[data-reveal]` children inside `root` with a staggered fade-up,
 * triggered the first time `root` enters the viewport.
 *
 * Returns a cleanup function that detaches the observer and clears inline styles.
 */
export function revealOnScroll(
	root: HTMLElement,
	options: {
		selector?: string;
		staggerMs?: number;
		offsetY?: number;
		duration?: number;
		threshold?: number;
		once?: boolean;
	} = {},
): () => void {
	const {
		selector = '[data-reveal]',
		staggerMs = 60,
		offsetY = 24,
		duration = 700,
		threshold = 0.15,
		once = true,
	} = options;

	if (!root) return () => {};
	const targets = Array.from(root.querySelectorAll<HTMLElement>(selector));
	if (!targets.length) return () => {};

	if (prefersReducedMotion()) {
		// Make sure the content is visible
		for (const el of targets) {
			el.style.opacity = '1';
			el.style.transform = 'none';
		}
		return () => {};
	}

	// Initial hidden state
	for (const el of targets) {
		el.style.opacity = '0';
		el.style.transform = `translateY(${offsetY}px)`;
	}

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					animate(targets, {
						opacity: [0, 1],
						translateY: [offsetY, 0],
						delay: stagger(staggerMs),
						duration,
						ease: ease.out,
					});
					if (once) observer.disconnect();
				}
			}
		},
		{ threshold },
	);

	observer.observe(root);

	return () => {
		observer.disconnect();
		for (const el of targets) {
			el.style.opacity = '';
			el.style.transform = '';
		}
	};
}

/**
 * Immediate stagger reveal (no scroll trigger). Used for above-the-fold content.
 * Returns a cleanup function.
 */
export function revealImmediate(
	target: HTMLElement | NodeListOf<Element> | string,
	options: { staggerMs?: number; offsetY?: number; duration?: number; delay?: number } = {},
): () => void {
	const { staggerMs = 80, offsetY = 30, duration = 900, delay = 100 } = options;

	const targets: HTMLElement[] =
		typeof target === 'string'
			? Array.from(document.querySelectorAll<HTMLElement>(target))
			: target instanceof NodeList
				? (Array.from(target) as HTMLElement[])
				: [target as HTMLElement];

	if (!targets.length) return () => {};

	if (prefersReducedMotion()) {
		for (const el of targets) {
			el.style.opacity = '1';
			el.style.transform = 'none';
		}
		return () => {};
	}

	for (const el of targets) {
		el.style.opacity = '0';
		el.style.transform = `translateY(${offsetY}px)`;
	}

	const anim = animate(targets, {
		opacity: [0, 1],
		translateY: [offsetY, 0],
		delay: stagger(staggerMs, { start: delay }),
		duration,
		ease: ease.outStrong,
	});

	return () => {
		try {
			anim.revert();
		} catch {
			/* ignore */
		}
	};
}

/**
 * Animate a numeric counter from 0 to `to` inside `el` over `duration` ms.
 * Triggers when the element enters the viewport.
 */
export function countUpOnVisible(
	el: HTMLElement,
	to: number,
	options: { duration?: number; delay?: number; format?: (n: number) => string } = {},
): () => void {
	const { duration = 1200, delay = 200, format = (n) => Math.round(n).toString() } = options;
	if (!el) return () => {};

	if (prefersReducedMotion()) {
		el.textContent = format(to);
		return () => {};
	}

	el.textContent = format(0);
	const obj = { v: 0 };

	let triggered = false;
	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting && !triggered) {
					triggered = true;
					animate(obj, {
						v: to,
						duration,
						delay,
						ease: ease.out,
						onUpdate: () => {
							el.textContent = format(obj.v);
						},
						onComplete: () => {
							el.textContent = format(to);
						},
					});
					observer.disconnect();
				}
			}
		},
		{ threshold: 0.4 },
	);

	observer.observe(el);

	return () => observer.disconnect();
}

/**
 * Splits the text content of `el` into <span> chars, then animates each one in
 * with a stagger. Returns a cleanup function that restores the original HTML.
 */
export function revealChars(
	el: HTMLElement,
	options: { staggerMs?: number; offsetY?: number; duration?: number; delay?: number } = {},
): () => void {
	const { staggerMs = 30, offsetY = 60, duration = 600, delay = 200 } = options;
	if (!el) return () => {};

	if (prefersReducedMotion()) return () => {};

	const original = el.innerHTML;
	const text = el.textContent ?? '';
	const chars = text.split('');

	el.innerHTML = chars
		.map((c) =>
			c === ' '
				? ' '
				: `<span style="display:inline-block;opacity:0;transform:translateY(${offsetY}px)">${c}</span>`,
		)
		.join('');

	const charEls = el.querySelectorAll<HTMLElement>('span');
	if (charEls.length) {
		animate(charEls, {
			opacity: [0, 1],
			translateY: [offsetY, 0],
			delay: stagger(staggerMs, { start: delay }),
			duration,
			ease: ease.out,
		});
	}

	return () => {
		el.innerHTML = original;
	};
}

/**
 * Re-triggerable scroll observer (for `data-reveal-replay`).
 * Same as revealOnScroll but replays each time the element re-enters view.
 */
export function replayOnScroll(
	root: HTMLElement,
	options: Parameters<typeof revealOnScroll>[1] = {},
): () => void {
	return revealOnScroll(root, { ...options, once: false });
}

/** Re-export for convenience. */
export { animate, stagger };
export type { AnimationParams };
