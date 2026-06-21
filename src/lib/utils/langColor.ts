// Maps a GitHub primary `language` string to the canonical hex
// color used in the language chip dot on the Selección panel.
// Falls back to neutral grey for unknown languages.

const COLORS: Record<string, string> = {
	TypeScript: '#3178c6',
	JavaScript: '#f1e05a',
	Python: '#3572A5',
	Svelte: '#ff3e00',
	Kotlin: '#A97BFF',
	Dart: '#00B4AB',
	Go: '#00ADD8',
	Rust: '#dea584',
	HTML: '#e34c26',
	Java: '#b07219',
};

export function langColor(name: string | null | undefined): string {
	if (!name) return '#888';
	return COLORS[name] ?? '#888';
}
