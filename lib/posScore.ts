/**
 * Level 1 (POS-keyed) scoring — a deterministic stand-in for the project's
 * original v1 behaviour, kept so the UI can show the progression from
 * part-of-speech emphasis to discourse emphasis.
 *
 * It tags the passage with compromise, maps each term's part of speech to the
 * old v1 score bands, and aligns those scores back onto OUR whitespace tokens
 * (compromise tokenizes differently). Context-free by design: the same word gets
 * the same score regardless of the passage — that's exactly the Level 1 ceiling.
 */
import nlp from "compromise";

/** Strip surrounding punctuation, lowercase — the comparable "core" of a token. */
function core(s: string): string {
  return s.toLowerCase().replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");
}

/** Map a term's POS tags to a v1-style emphasis score (function words low). */
function scoreFromTags(tags: string[]): number {
  const t = new Set(tags);
  if (t.has("ProperNoun")) return 0.92;
  if (t.has("Determiner") || t.has("Article")) return 0.05;
  if (t.has("Preposition")) return 0.1;
  if (t.has("Conjunction")) return 0.1;
  if (t.has("Pronoun")) return 0.16;
  if (t.has("Copula") || t.has("Auxiliary") || t.has("Modal")) return 0.2;
  if (t.has("Value") || t.has("Cardinal") || t.has("Ordinal")) return 0.45;
  if (t.has("Noun")) return 0.78;
  if (t.has("Verb")) return 0.7;
  if (t.has("Adjective")) return 0.62;
  if (t.has("Adverb")) return 0.58;
  return 0.45; // unknown content-ish word
}

/** Last-resort lookup for tokens compromise didn't align to a term. */
const FUNCTION_WORDS: Record<string, number> = {
  a: 0.05, an: 0.05, the: 0.05,
  and: 0.1, but: 0.1, or: 0.1, nor: 0.1, so: 0.1, yet: 0.1, because: 0.1,
  although: 0.1, while: 0.12, if: 0.12, that: 0.1, which: 0.1, than: 0.1, as: 0.12,
  of: 0.1, to: 0.1, in: 0.1, on: 0.1, at: 0.1, by: 0.1, for: 0.1, with: 0.1,
  from: 0.1, into: 0.1, over: 0.1, under: 0.1, about: 0.12, against: 0.12,
  across: 0.12, through: 0.12, between: 0.12, during: 0.12,
  i: 0.16, you: 0.16, he: 0.16, she: 0.16, it: 0.16, we: 0.16, they: 0.16,
  me: 0.16, him: 0.16, her: 0.18, us: 0.16, them: 0.16, his: 0.18, its: 0.18,
  their: 0.18, our: 0.18, my: 0.18, your: 0.18, this: 0.2, these: 0.2, those: 0.2,
  is: 0.2, are: 0.2, was: 0.2, were: 0.2, be: 0.2, been: 0.2, being: 0.2, am: 0.2,
  have: 0.22, has: 0.22, had: 0.22, do: 0.22, does: 0.22, did: 0.22, will: 0.22,
  would: 0.22, can: 0.22, could: 0.22, should: 0.22, may: 0.22, might: 0.22, must: 0.22,
};

interface Tagged {
  normal: string;
  tags: string[];
}

/** Score each of our tokens by part of speech. Returns one score per token. */
export function posScore(tokens: string[]): number[] {
  const text = tokens.join(" ");

  let terms: Tagged[] = [];
  try {
    const sentences = nlp(text).json() as Array<{
      terms?: Array<{ normal?: string; text?: string; tags?: string[] }>;
    }>;
    terms = sentences
      .flatMap((s) => s.terms ?? [])
      .map((tm) => ({ normal: core(tm.normal ?? tm.text ?? ""), tags: tm.tags ?? [] }));
  } catch {
    terms = [];
  }

  const scores: number[] = [];
  let j = 0;

  for (let i = 0; i < tokens.length; i++) {
    const tokCore = core(tokens[i]);
    if (tokCore === "") {
      scores.push(0); // punctuation-only token
      continue;
    }

    // Direct match at the cursor.
    if (j < terms.length && terms[j].normal === tokCore) {
      scores.push(scoreFromTags(terms[j].tags));
      j++;
      continue;
    }

    // Resync past compromise insertions/splits (e.g. contractions).
    let matched = false;
    for (let k = 1; k <= 3 && j + k < terms.length; k++) {
      if (terms[j + k].normal === tokCore) {
        scores.push(scoreFromTags(terms[j + k].tags));
        j += k + 1;
        matched = true;
        break;
      }
    }
    if (matched) continue;

    // Fallback: function-word table, else neutral-ish content.
    scores.push(FUNCTION_WORDS[tokCore] ?? 0.5);
    if (j < terms.length) j++;
  }

  return scores;
}
