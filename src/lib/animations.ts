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

import { type AnimationParams, animate, stagger } from 'animejs';

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
	options: {
		staggerMs?: number;
		offsetY?: number;
		duration?: number;
		delay?: number;
	} = {},
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
	options: {
		duration?: number;
		delay?: number;
		format?: (n: number) => string;
	} = {},
): () => void {
	const {
		duration = 1200,
		delay = 200,
		format = (n) => Math.round(n).toString(),
	} = options;
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
	options: {
		staggerMs?: number;
		offsetY?: number;
		duration?: number;
		delay?: number;
	} = {},
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
 * Reveal children sliding in from the LEFT (x: -offsetX → 0).
 * Best for horizontal-scroll rows: items enter as the user scrolls
 * horizontally into them.
 */
export function revealFromLeft(
	target: HTMLElement | NodeListOf<Element> | string,
	options: {
		offsetX?: number;
		staggerMs?: number;
		duration?: number;
		threshold?: number;
	} = {},
): () => void {
	return revealFromSide(target, -1, options);
}

/**
 * Reveal children sliding in from the RIGHT (x: +offsetX → 0).
 */
export function revealFromRight(
	target: HTMLElement | NodeListOf<Element> | string,
	options: {
		offsetX?: number;
		staggerMs?: number;
		duration?: number;
		threshold?: number;
	} = {},
): () => void {
	return revealFromSide(target, 1, options);
}

function revealFromSide(
	target: HTMLElement | NodeListOf<Element> | string,
	direction: -1 | 1,
	options: {
		offsetX?: number;
		staggerMs?: number;
		duration?: number;
		threshold?: number;
	},
): () => void {
	const {
		offsetX = 60,
		staggerMs = 70,
		duration = 700,
		threshold = 0.2,
	} = options;

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
		el.style.transform = `translateX(${direction * offsetX}px)`;
	}

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					animate(targets, {
						opacity: [0, 1],
						translateX: [direction * offsetX, 0],
						delay: stagger(staggerMs),
						duration,
						ease: ease.out,
					});
					observer.disconnect();
				}
			}
		},
		{ threshold },
	);

	// Observe the parent if possible, otherwise each target
	const parent = targets[0].parentElement;
	if (parent) observer.observe(parent);
	else for (const t of targets) observer.observe(t);

	return () => {
		observer.disconnect();
		for (const el of targets) {
			el.style.opacity = '';
			el.style.transform = '';
		}
	};
}

/**
 * Build a horizontally-scrolling marquee animation.
 * Animates `el`'s `translateX` from `0` to `-50%` (or `+50%` for reverse),
 * looping infinitely. Pause when `prefers-reduced-motion`.
 *
 * Expects the children inside `el` to be duplicated so the scroll loops
 * seamlessly.
 */
export function startMarquee(
	el: HTMLElement,
	options: {
		duration?: number;
		reverse?: boolean;
		pauseOnHover?: boolean;
	} = {},
): () => void {
	const { duration = 30000, reverse = false, pauseOnHover = true } = options;
	if (!el || prefersReducedMotion()) return () => {};

	const anim = animate(el, {
		translateX: reverse ? ['-50%', '0%'] : ['0%', '-50%'],
		duration,
		ease: 'linear',
		loop: true,
		autoplay: true,
	});

	if (pauseOnHover) {
		const onEnter = () => anim.pause();
		const onLeave = () => anim.play();
		el.addEventListener('mouseenter', onEnter);
		el.addEventListener('mouseleave', onLeave);
		return () => {
			anim.revert();
			el.removeEventListener('mouseenter', onEnter);
			el.removeEventListener('mouseleave', onLeave);
		};
	}

	return () => {
		anim.revert();
	};
}

export type { AnimationParams };
/** Re-export for convenience. */
export { animate, stagger };
