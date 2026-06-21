// Svelte 5 rune-friendly wrapper around svelte-i18n's locale store.
//
// svelte-i18n's `$locale` is a regular svelte/store Writable, not a
// rune-friendly value, so you can't directly use it inside $derived.
// This module exposes:
//  - `currentLocale()`: synchronous read for templates and
//    $derived expressions
//  - `switchLocale(code)`: persist to localStorage and update the
//    svelte-i18n store. Returns a Promise so callers can await
//    the store's set() if they need it.

import { locale } from 'svelte-i18n';
import { persistLocale, type SupportedLocale } from './index';

/** Reactive read of the current locale. Call inside $-expressions
 *  (templates, $derived, $effect) to track changes. */
export function currentLocale(): string {
	// svelte-i18n's $locale is a regular svelte/store. We grab
	// the current value with a no-op subscriber, then return.
	// The subscribe/unsubscribe pair is the standard pattern to
	// read a store synchronously.
	let value: string = 'es';
	const unsub = locale.subscribe((v) => {
		value = v ?? 'es';
	});
	unsub();
	return value;
}

/** Switch the locale, persist it, and return immediately. */
export async function switchLocale(next: SupportedLocale): Promise<void> {
	persistLocale(next);
	await locale.set(next);
}
