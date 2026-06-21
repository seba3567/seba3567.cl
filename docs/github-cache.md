# GitHub API cache — `src/lib/server/github.ts`

The site renders the public repos for `@seba3567` on `/`
and `/proyectos`. Without caching, every page load would
make ~91 GitHub API calls (1 list + 90 `languages_url`),
which would burn the [60 req/h unauthenticated
limit](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting)
in a single request.

This file documents the cache design so future changes
don't accidentally regress it.

## The two limits

GitHub returns 403/429 once you cross the rate limit. The
cache has to balance three things:

1. **Fresh data.** Stars, language breakdowns, and `pushed_at`
   need to update — at least daily.
2. **Stay under the 60/h cap.** Hard constraint.
3. **Never break the page.** A failed API call must not turn
   the site into a 500.

The two constants in the file (as of this writing):

```ts
CACHE_TTL_MS   = 15 * 60 * 1000;  // 15 min  (freshness)
API_COOLDOWN_MS = 20 * 60 * 1000; // 20 min  (API gate)
```

`CACHE_TTL_MS` is how long a successful response stays "fresh"
before it's considered stale. `API_COOLDOWN_MS` is the wall
clock between actual API calls. They are independent — the
cache can be stale (older than 15 min) but we still won't
hit the API if the cooldown hasn't elapsed.

## Cache keys (per-type)

```ts
repoListCacheKey(user) = `${repoListUrl(user)}#full`  // languages enriched
repoTopCacheKey(user)   = `${repoListUrl(user)}#top`   // no languages
```

The two getters cache different types:

- `getCachedRepos` stores `PublicRepo[]` (each repo carries
  a `languages` map).
- `getCachedTopRepos` stores `GitHubRepo[]` (raw, no
  languages).

If they shared a key, the second writer would clobber the
first and the reader expecting the richer type would crash
on `r.languages` being undefined.

## Flow on every page request

```
page calls getCachedRepos()
  │
  ├── cache fresh (expiresAt > now) ───► return cached
  ├── cache stale (entry exists) ──────► return stale,
  │                                       fire background refresh (gated by cooldown)
  └── no cache (cold start) ───────────► block on first fetch
                                          (only happens once per deploy)
```

`getCachedRepos` and `getCachedTopRepos` are **stale-while-
revalidate**: the page always reads from cache, never from
the network. The background refresh fills the cache for the
next page load. Worst case the user sees data up to 15 min
old; best case it's always fresh.

The cooldown (`API_COOLDOWN_MS = 20 min`) gates the
background refresh. A page load mid-cooldown will trigger
the warn log and skip the API call — we'll retry on the next
page load.

## Cold-start dedup

A cold start happens when there's no cache entry at all
(typically the first request after a deploy, or after the
dev server restarts). If 2 page-loads race in the same
tick, both would see the empty cache and both would fire
GitHub calls — doubling the cost of the first request.

The fix is `coldStartInFlight: Map<string, Promise<unknown>>`
keyed by `(kind, user, limit)`. The first request stores
its promise; the second request sees the existing entry
and returns the same promise. The `finally` clears the
entry so the next cold start (after a deploy) starts
clean.

This matters mostly in dev (HMR can fire 2 page-loads back
to back). In production with a single user-agent it's
academic, but it's free correctness.

## `githubFetch<T>` — the inner layer

`githubFetch` is the actual `fetch()` wrapper. It returns
the cached value if fresh, throws a distinctive `COOLDOWN`
error if the cooldown is active and no cache exists, and
updates the cache + cooldown timestamp on success.

The `COOLDOWN` error is caught by `fetchPublicRepos` for
each repo's `languages_url` — that path makes N parallel
calls and any one of them can hit the cooldown mid-flight.
Returning `{}` for the affected repo's languages lets the
page render with the data we *did* get, instead of failing
the whole call.

## Defensive `computeStats`

`computeStats` reads `r.languages` (the per-repo language
map). Older cache entries — or a repo that GitHub returned
without the field — would have `r.languages === undefined`,
and `Object.entries(undefined)` throws. The fix is one
line: `const langs = r.languages ?? {};`. The test suite
covers this case so it can't regress.

## The tests

`src/lib/server/github.test.ts` is the executable spec.
8 cases cover:

- cold-start hits the API, caches, second call is a cache
  hit
- concurrent cold-start: one fetch, not two
- cold-start failure returns `[]` (never throws)
- `getCachedTopRepos` is single-call (no languages
  enrichment)
- concurrent `getCachedTopRepos` dedup
- different `limit` values have different cache keys
- `computeStats` aggregates correctly
- `computeStats` doesn't crash on missing `r.languages`

Run with `bun run test:run` (or `bun run test` for watch).

## What NOT to do

- **Don't add a third consumer of the GitHub API without
  routing it through `githubFetch`.** It owns the cooldown
  + dedup logic. A new consumer that calls `fetch()`
  directly would re-introduce the rate-limit problem.
- **Don't try to "fix" the 20-min cooldown by shortening it.**
  60 req/h = 1 req/min average. A 91-call `fetchPublicRepos`
  on a cold start costs ~1.5 hours of budget. The 20-min
  cooldown is the right call for an unauthenticated site
  with ~90 repos.
- **Don't add an authenticated token to the repo's
  `.env` for production.** It would 5x the rate limit
  (5000/h) but it would also expose the token to anyone
  who clones the repo. If a future use case needs more
  headroom, the right answer is a server-side proxy that
  holds the token (the same pattern as the Go intranet
  for the contact form).
