# AGENTS.md

Convenciones y preferencias persistentes para agentes IA que trabajen en este repo
(seba3567.cl). Editá este archivo cuando el usuario exprese una nueva preferencia.

## Servidores de desarrollo

**Regla dura:** el usuario ejecuta los dev servers, no el agente.

- NUNCA arrancar `bun run dev`, `vite dev`, ni `npm run dev` desde un agente.
- Si el agente necesita verificar que una página renderiza, usar `bun run build` + leer
  el output, o `curl`/PowerShell contra un dev server que el usuario ya tenga corriendo.
- Si accidentalmente se inicia un proceso, matarlo inmediatamente (`Stop-Process` por PID
  sobre `bun` / `vite` / `node`) y avisar al usuario.
- Puertos de dev usuales en este repo: `5173` (default Vite), a veces `5179`–`5181` cuando
  hay colisión. No asumir que un puerto libre significa "lo puedo usar"; preguntar primero.

## Git

- El usuario decide cuándo commitear/pushear. El agente prepara los cambios y avisa, pero
  NO ejecuta `git push` sin confirmación explícita.
- El remote oficial es `git@github.com:seba3567/seba3567.cl.git` (SSH).
- El `frontend.skeleton` (github.com/seba3567/frontend.skeleton) es de solo lectura desde
  este repo: clonar, pero nunca pushear a su remote.

## Stack del proyecto

- Svelte 5 (Runes) · SvelteKit 2 · Tailwind v4 (`@theme` + `@utility`) · shadcn-svelte (bits-ui)
- Bun como runtime · Vite 8 · BiomeJS
- Phosphor Svelte para iconos
- Glassmorphism: utilities `glass` / `glass-strong` / `glass-hover` / `glass-tap` / `glass-glow`
  en `src/routes/layout.css`

## AI skills instaladas (autoskills)

`bun run skills` (o `bunx autoskills`) regenera las skills; `bun run skills:check` es
dry-run. El lock está en `skills-lock.json`. No commitear `.agents/skills/` si se quiere
mantener el repo chico: está en `.gitignore`-friendly, pero por ahora SÍ se commitea.

## Convenciones Svelte 5

- `let x = $state(...)` · `$derived(...)` · `$props()` · `{@render snippet?.()}`
- `onclick` (no `on:click`) · `bind:this={ref}` con `ref = $bindable(null)`
- `class={cn(...)}` en vez de template literal ternarios
- `gap-*` en vez de `space-x/y-*`
- `size-*` cuando ancho y alto son iguales
- `truncate` shorthand, no `overflow-hidden text-ellipsis whitespace-nowrap`
- Sin raw `dark:` overrides — usar tokens semánticos (`bg-background`, `text-muted-foreground`)
