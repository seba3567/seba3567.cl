export type GitHubRepo = {
	id: number;
	name: string;
	full_name: string;
	description: string | null;
	html_url: string;
	homepage: string | null;
	language: string | null;
	languages_url: string;
	stargazers_count: number;
	forks_count: number;
	open_issues_count: number;
	watchers_count: number;
	topics: string[];
	updated_at: string;
	created_at: string;
	pushed_at: string;
	fork: boolean;
	archived: boolean;
	private: boolean;
	disabled: boolean;
	visibility: 'public' | 'private' | 'internal';
	default_branch: string;
};

export type RepoWithLanguages = GitHubRepo & {
	languages: Record<string, number>;
};

const USER_AGENT = 'seba3567-cl/0.1 (+https://seba3567.cl)';
const CACHE_TTL_MS = 1000 * 60 * 60; // 1h — how long a successful response stays fresh

/**
 * Cooldown between GitHub API calls.
 *
 * GitHub's unauthenticated rate limit is 60 req/hour/IP. With ~90 repos
 * on seba3567's profile, fetchPublicRepos alone does 1 + N (≥90) requests
 * per call, which exhausts the hourly budget in ONE page load. To stay
 * well under the limit we serialize everything through a single
 * 20-minute cooldown — at most 1 actual API call per 20 min, regardless
 * of cache state.
 *
 * 20 min was chosen because:
 *   - 60 req / hour = 1 req / min average. A burst of 90 requests costs
 *     ~1.5 hours of budget, so a 20-min cooldown means worst case we
 *     still hit the limit ~3 times per day (only on hard refreshes
 *     after dev-server restarts wipe the in-memory cache).
 *   - 10 min is too aggressive: a quick tab refresh + a navigation
 *     = 2 cache misses = rate limit hit.
 *   - 20 min is the sweet spot: still feels "live" but well under
 *     the 60/h limit even in the worst case.
 *
 * If a call is requested inside the cooldown window:
 *   - Fresh cache    -> return it (no API call)
 *   - Stale cache     -> return it (stale-while-cooldown) + warn
 *   - Cold cache      -> throw COOLDOWN so caller can fall back
 */
const API_COOLDOWN_MS = 20 * 60 * 1000; // 20 min

type CacheEntry<T> = {
	value: T;
	expiresAt: number;
};

const cache = new Map<string, CacheEntry<unknown>>();

/** Timestamp (ms) of the last real API call. 0 = never. */
let lastApiCallAt = 0;

function withinCooldown(): boolean {
	return lastApiCallAt > 0 && Date.now() - lastApiCallAt < API_COOLDOWN_MS;
}

function cooldownRemainingMs(): number {
	if (lastApiCallAt === 0) return 0;
	const elapsed = Date.now() - lastApiCallAt;
	return Math.max(0, API_COOLDOWN_MS - elapsed);
}

async function githubFetch<T>(url: string): Promise<T> {
	const cached = cache.get(url);
	if (cached && cached.expiresAt > Date.now()) {
		// Fresh cache — no API call needed.
		return cached.value as T;
	}

	// Cache miss or stale. If we're inside the cooldown window, return
	// whatever we have (even if stale) instead of hammering GitHub.
	if (withinCooldown()) {
		const remaining = Math.ceil(cooldownRemainingMs() / 1000);
		if (cached) {
			// Stale-while-cooldown: serve the old value, log it.
			console.warn(
				`[github] cooldown active (${remaining}s remaining), ` +
					`serving stale cache for ${url}`,
			);
			return cached.value as T;
		}
		// Cold cache + cooldown = we have nothing to serve. Throw a
		// distinctive error so the caller can fall back gracefully.
		const err = new Error(
			`GitHub API in cooldown (${remaining}s remaining) and no cached value for ${url}`,
		);
		(err as Error & { code?: string }).code = 'COOLDOWN';
		throw err;
	}

	// Cooldown elapsed (or never called) — make the real request.
	const res = await fetch(url, {
		headers: {
			'User-Agent': USER_AGENT,
			Accept: 'application/vnd.github+json',
			'X-GitHub-Api-Version': '2022-11-28',
		},
	});
	if (!res.ok) {
		// 403/429 — the rate limiter caught us despite the cooldown.
		// Could be a shared IP (the Vercel edge, the dev tunnel, etc).
		// Reset the cooldown so we don't keep hammering for 20 min.
		const remaining = Math.ceil(cooldownRemainingMs() / 1000);
		console.error(
			`[github] API ${res.status} ${res.statusText} for ${url} ` +
				`(cooldown was at ${remaining}s remaining — GitHub's 60/h limit hit anyway)`,
		);
		throw new Error(`GitHub API ${res.status} ${res.statusText} for ${url}`);
	}
	const data = (await res.json()) as T;
	cache.set(url, { value: data, expiresAt: Date.now() + CACHE_TTL_MS });
	lastApiCallAt = Date.now();
	console.log(
		`[github] OK · ${url.split('/').slice(-1)[0] || url} · ` +
			`next refresh in ${API_COOLDOWN_MS / 1000}s`,
	);
	return data;
}

export type PublicRepo = GitHubRepo & {
	languages: Record<string, number>;
};

export async function fetchPublicRepos(
	user: string,
	options: { includeForks?: boolean } = {},
): Promise<PublicRepo[]> {
	const repos = await githubFetch<GitHubRepo[]>(
		`https://api.github.com/users/${user}/repos?per_page=100&sort=updated&type=owner`,
	);
	const filtered = repos.filter(
		(r) => !r.private && !r.disabled && (options.includeForks || !r.fork) && !r.archived,
	);
	// Enrich with languages. The cooldown is per-module (1 call / 5min),
	// but the cache is per-URL. The repo list URL is already cached
	// after the first call, but each repo's languages_url is a NEW URL
	// that we haven't seen. If we're in cooldown, the languages fetch
	// would throw — which breaks the whole page. Catch the COOLDOWN
	// error per-repo and return empty languages so the page still
	// renders (just without per-repo language stats for that call).
	const enriched = await Promise.all(
		filtered.map(async (r) => {
			try {
				const langs = await githubFetch<Record<string, number>>(r.languages_url);
				return { ...r, languages: langs };
			} catch (err) {
				if ((err as Error & { code?: string }).code === 'COOLDOWN') {
					// Stale-while-cooldown: repo shows but no language data yet.
					return { ...r, languages: {} as Record<string, number> };
				}
				throw err;
			}
		}),
	);
	return enriched.sort((a, b) => {
		if (b.stargazers_count !== a.stargazers_count) {
			return b.stargazers_count - a.stargazers_count;
		}
		return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime();
	});
}

/**
 * fetchTopRepos: lightweight variant for the home page.
 *
 * Makes a SINGLE GitHub API call (the repo list). The list already
 * includes the primary `language` field per repo, which is all the
 * home page renders — so we skip the N parallel `languages_url`
 * requests that fetchPublicRepos does (those are what burned the
 * rate limit).
 *
 * Returns the top `limit` non-archived, non-fork repos sorted by
 * `pushed_at` DESC.
 */
export async function fetchTopRepos(
	user: string,
	limit: number,
): Promise<GitHubRepo[]> {
	const repos = await githubFetch<GitHubRepo[]>(
		`https://api.github.com/users/${user}/repos?per_page=100&sort=updated&type=owner`,
	);
	return repos
		.filter((r) => !r.archived && !r.fork && !r.private && !r.disabled)
		.sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())
		.slice(0, limit);
}

export type RepoStats = {
	total: number;
	stars: number;
	forks: number;
	languages: Array<{ name: string; count: number; bytes: number }>;
	topics: Array<{ name: string; count: number }>;
};

export function computeStats(repos: PublicRepo[]): RepoStats {
	const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
	const totalForks = repos.reduce((s, r) => s + r.forks_count, 0);
	const langCount = new Map<string, number>();
	const langBytes = new Map<string, number>();
	const topicCount = new Map<string, number>();
	for (const r of repos) {
		for (const [lang, bytes] of Object.entries(r.languages)) {
			langCount.set(lang, (langCount.get(lang) ?? 0) + 1);
			langBytes.set(lang, (langBytes.get(lang) ?? 0) + bytes);
		}
		for (const t of r.topics) {
			topicCount.set(t, (topicCount.get(t) ?? 0) + 1);
		}
	}
	const languages = [...langCount.entries()]
		.map(([name, count]) => ({ name, count, bytes: langBytes.get(name) ?? 0 }))
		.sort((a, b) => b.count - a.count || b.bytes - a.bytes);
	const topics = [...topicCount.entries()]
		.map(([name, count]) => ({ name, count }))
		.sort((a, b) => b.count - a.count);
	return {
		total: repos.length,
		stars: totalStars,
		forks: totalForks,
		languages,
		topics,
	};
}
