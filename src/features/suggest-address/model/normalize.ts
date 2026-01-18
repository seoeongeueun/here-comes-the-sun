export function normalizeQuery(q: string): string[] {
  return (q ?? "")
    .trim()
    .replace(/[-/]+/g, " ")
    .replace(/\s+/g, " ")
    .split(" ")
    .filter(Boolean);
}

export function joinLabel(parts: string[]): string {
  return parts.filter(Boolean).join(" ");
}

export function uniqueByLabel<T extends { label: string }>(list: T[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const x of list) {
    if (seen.has(x.label)) continue;
    seen.add(x.label);
    out.push(x);
  }
  return out;
}

export function makeKey(sido: string, sigungu: string) {
  return `${sido}+${sigungu}`;
}
export function splitKey(key: string): [string, string] {
  const [sido, sigungu] = key.split("+");
  return [sido, sigungu];
}
