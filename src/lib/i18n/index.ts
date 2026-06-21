// svelte-i18n setup.
//
// We use a simple store-based locale (not URL-prefixed) because
// this is a portfolio site with one or two languages and the SEO
// cost of route-based locales isn't worth the added complexity.
// The user's preference is persisted in localStorage so a returning
// visitor doesn't have to switch back.
//
// The locale is exposed to components via the $locale rune (from
// svelte-i18n's getLocale()), but we also re-export a Svelte 5
// rune-friendly wrapper in $lib/i18n/locale.svelte.ts so panels
// can $derive off it.

import { addMessages, getLocaleFromNavigator, init } from 'svelte-i18n';
import en from './locales/en.json';
import es from './locales/es.json';

const STORAGE_KEY = 'seba3567.locale';
export const SUPPORTED_LOCALES = ['es', 'en'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: SupportedLocale = 'es';

/** Read the persisted locale from localStorage, with a safe fallback. */
function readPersisted(): SupportedLocale | null {
	if (typeof window === 'undefined') return null;
	try {
		const v = window.localStorage.getItem(STORAGE_KEY);
		if (v && (SUPPORTED_LOCALES as readonly string[]).includes(v)) {
			return v as SupportedLocale;
		}
	} catch {
		// localStorage can throw in private mode / disabled
	}
	return null;
}

/** Persist the locale so a returning visitor keeps their choice. */
export function persistLocale(locale: SupportedLocale): void {
	if (typeof window === 'undefined') return;
	try {
		window.localStorage.setItem(STORAGE_KEY, locale);
	} catch {
		// Same as above
	}
}

let initialized = false;

/** Idempotent init — safe to call from any component/layout. */
export function setupI18n() {
	if (initialized) return;
	initialized = true;

	addMessages('es', es);
	addMessages('en', en);

	// Default to Spanish on the server, browser preference first
	// on the client. The switcher overrides this later.
	init({
		fallbackLocale: DEFAULT_LOCALE,
		initialLocale:
			typeof window === 'undefined'
				? DEFAULT_LOCALE
				: getLocaleFromNavigator() || DEFAULT_LOCALE,
	});
}

/** Resolve the initial locale: persisted > navigator > default. */
export function resolveInitialLocale(): SupportedLocale {
	return readPersisted() ?? DEFAULT_LOCALE;
}
