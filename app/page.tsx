"use client";

import { useState } from "react";
import { tokenise } from "@/lib/tokenise";
import { useIsDark } from "@/lib/useIsDark";
import type { ScoredToken, ScoreResponse } from "@/lib/types";
import { TextInput } from "@/components/TextInput";
import { ProgressBar } from "@/components/ProgressBar";
import { EmphasisRenderer } from "@/components/EmphasisRenderer";
import { RhythmBars } from "@/components/RhythmBars";
import { WeightSample } from "@/components/WeightSample";

export default function Home() {
  const [text, setText] = useState("");
  const [tokens, setTokens] = useState<ScoredToken[] | null>(null);
  const [corePoint, setCorePoint] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isDark = useIsDark();

  async function handleSubmit() {
    const clientTokens = tokenise(text);
    if (clientTokens.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, tokens: clientTokens }),
      });

      if (!res.ok) throw new Error(`Request failed (${res.status})`);

      const data: ScoreResponse = await res.json();
      setTokens(data.tokens);
      setCorePoint(data.corePoint);
    } catch {
      setError("Couldn't score that text. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-16 sm:py-24">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Semantic Emphasis
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-muted">
          Plain text, re-rendered so each word&rsquo;s font weight reflects how
          much meaning it carries — a typographic view of the sentence&rsquo;s
          stress profile.
        </p>
      </header>

      <TextInput
        value={text}
        onChange={setText}
        onSubmit={handleSubmit}
        loading={loading}
      />

      <div className="min-h-[2px]">{loading && <ProgressBar />}</div>

      {error && (
        <div
          role="alert"
          className="flex items-center justify-between rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-600 dark:text-red-400"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={handleSubmit}
            className="font-medium underline underline-offset-2"
          >
            Retry
          </button>
        </div>
      )}

      {tokens && !loading && (
        <section className="flex flex-col gap-10">
          {corePoint && (
            <p className="max-w-xl text-sm italic leading-relaxed text-muted">
              <span className="font-mono text-xs not-italic uppercase tracking-wider">
                The point ·{" "}
              </span>
              {corePoint}
            </p>
          )}
          <EmphasisRenderer tokens={tokens} isDark={isDark} />
          <div className="flex flex-col gap-3">
            <span className="font-mono text-xs uppercase tracking-wider text-muted">
              Rhythm
            </span>
            <RhythmBars tokens={tokens} isDark={isDark} />
          </div>
        </section>
      )}

      <footer className="mt-auto flex flex-col gap-3 border-t border-border pt-8">
        <span className="font-mono text-xs uppercase tracking-wider text-muted">
          Sample · score → weight (0.00–1.00)
        </span>
        <WeightSample isDark={isDark} />
      </footer>
    </main>
  );
}
