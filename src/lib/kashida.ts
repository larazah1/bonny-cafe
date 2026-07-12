const TATWEEL = "ـ";

// Diacritics/combining marks — must stay attached to the base letter before
// them, never split off onto their own cluster.
const DIACRITIC = /[ً-ْٰۖ-ۭ]/;

// Letters that don't visually connect to a following letter — inserting a
// tatweel after these renders as a disconnected floating dash.
const NON_CONNECTING = new Set(["ا", "أ", "إ", "آ", "د", "ذ", "ر", "ز", "و", "ء", "ة"]);

function splitIntoClusters(word: string): string[] {
  const clusters: string[] = [];
  for (const ch of word) {
    if (DIACRITIC.test(ch) && clusters.length > 0) {
      clusters[clusters.length - 1] += ch;
    } else {
      clusters.push(ch);
    }
  }
  return clusters;
}

/**
 * Inserts Arabic tatweel (kashida) between connecting letters, within each
 * word, for decorative display headings. Never inserts before/after spaces
 * or word boundaries, after non-connecting letters, or between a letter and
 * its diacritic. Only use on large, short decorative text (logo lockups,
 * hero headings) — never on body copy, since it hurts readability.
 */
export function kashida(text: string, gap = 1): string {
  const filler = TATWEEL.repeat(Math.max(1, gap));
  return text
    .split(" ")
    .map((word) => {
      const clusters = splitIntoClusters(word);
      return clusters
        .map((cluster, i) => {
          const isLast = i === clusters.length - 1;
          const base = cluster[0];
          if (isLast || NON_CONNECTING.has(base)) return cluster;
          return cluster + filler;
        })
        .join("");
    })
    .join(" ");
}
