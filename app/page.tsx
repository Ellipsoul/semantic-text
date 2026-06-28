"use client";

import { useMemo, useState } from "react";
import { ChevronRight, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { tokenise } from "@/lib/tokenise";
import { posScore } from "@/lib/posScore";
import { normalizeScores } from "@/lib/normalize";
import { NORMALIZE_TARGET_MEAN } from "@/lib/config";
import { useIsDark } from "@/lib/useIsDark";
import type { ScoredToken, ScoreResponse, EmphasisMode } from "@/lib/types";
import { TextInput } from "@/components/TextInput";
import { ProgressBar } from "@/components/ProgressBar";
import { EmphasisRenderer } from "@/components/EmphasisRenderer";
import { RhythmBars } from "@/components/RhythmBars";
import { WeightSample } from "@/components/WeightSample";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function Home() {
  const [text, setText] = useState("");
  const [tokens, setTokens] = useState<ScoredToken[] | null>(null);
  const [corePoint, setCorePoint] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Whether the model's echo slipped (even if recovered) and how many words
  // couldn't be aligned — drives the warning banner.
  const [slipped, setSlipped] = useState(false);
  const [driftCount, setDriftCount] = useState(0);
  // Shared between the rendered words and the rhythm bars so hovering either
  // highlights its counterpart.
  const [hovered, setHovered] = useState<number | null>(null);
  const [sampleOpen, setSampleOpen] = useState(false);
  // Which level of emphasis the render shows (none / POS / discourse). Shared
  // with the rhythm bars so both views follow the same toggle.
  const [mode, setMode] = useState<EmphasisMode>("emphasis");
  const isDark = useIsDark();

  // Level-1 POS scores, normalized to the v2 mean so the views differ only in
  // distribution. Computed once per scored passage, reused by text + bars.
  const posScores = useMemo(
    () =>
      tokens
        ? normalizeScores(
            posScore(tokens.map((t) => t.word)),
            NORMALIZE_TARGET_MEAN,
          )
        : [],
    [tokens],
  );

  async function handleSubmit() {
    const clientTokens = tokenise(text);
    if (clientTokens.length === 0) return;

    setLoading(true);
    setError(null);
    setSlipped(false);
    setHovered(null);

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
      setSlipped(data.slipped);
      setDriftCount(data.driftCount);
    } catch {
      setError("Couldn't score that text. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-16 sm:py-24 lg:max-w-5xl">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Semantic Emphasis
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
          Reading is silent, but it has a voice. Paste any passage and watch an
          AI find the words that carry the meaning — letting their weight rise to
          the surface while the scaffolding quietly fades into the background.
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
        <Alert variant="destructive">
          <AlertTitle>{error}</AlertTitle>
          <AlertDescription className="flex items-center justify-between gap-4">
            <span>The scoring request did not go through.</span>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={handleSubmit}
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {tokens && !loading && slipped && (
        <Alert className="border-amber-500/40 text-amber-700 dark:text-amber-400 [&>svg]:text-amber-500">
          <TriangleAlert />
          <AlertTitle>The model&rsquo;s response slipped</AlertTitle>
          <AlertDescription className="text-amber-700/90 dark:text-amber-400/90">
            {driftCount === 0
              ? "The scoring response drifted out of alignment but was automatically realigned — every word still scored correctly."
              : `The scoring response drifted out of alignment. ${driftCount} word${driftCount === 1 ? "" : "s"} couldn't be matched and ${driftCount === 1 ? "is" : "are"} shown at a neutral weight. Try again for a cleaner result.`}
          </AlertDescription>
        </Alert>
      )}

      {tokens && !loading && (
        <section className="flex flex-col gap-10">
          {corePoint && (
            <p className="max-w-xl text-sm italic leading-relaxed text-muted-foreground">
              <span className="font-mono text-xs not-italic uppercase tracking-wider">
                The point ·{" "}
              </span>
              {corePoint}
            </p>
          )}
          <EmphasisRenderer
            tokens={tokens}
            posScores={posScores}
            isDark={isDark}
            mode={mode}
            onModeChange={setMode}
            hovered={hovered}
            onHover={setHovered}
          />
          <div className="flex flex-col gap-3">
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Rhythm
            </span>
            <RhythmBars
              tokens={tokens}
              posScores={posScores}
              isDark={isDark}
              mode={mode}
              hovered={hovered}
              onHover={setHovered}
            />
          </div>
        </section>
      )}

      <footer className="mt-auto border-t border-border pt-8">
        <Collapsible
          open={sampleOpen}
          onOpenChange={setSampleOpen}
          className="flex flex-col gap-3"
        >
          <CollapsibleTrigger className="flex w-fit cursor-pointer items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground">
            <ChevronRight
              className={cn(
                "size-3 transition-transform",
                sampleOpen && "rotate-90",
              )}
            />
            Sample · score → weight (0.00–1.00)
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4">
            <WeightSample isDark={isDark} />
          </CollapsibleContent>
        </Collapsible>
      </footer>
    </main>
  );
}
