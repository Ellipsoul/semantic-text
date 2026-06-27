"use client";

import { MAX_INPUT_CHARS } from "@/lib/config";
import { PRESETS } from "@/lib/presets";

export function TextInput({
  value,
  onChange,
  onSubmit,
  loading,
}: {
  value: string;
  onChange: (next: string) => void;
  onSubmit: () => void;
  loading: boolean;
}) {
  const over = value.length > MAX_INPUT_CHARS;
  const empty = value.trim().length === 0;
  const disabled = loading || empty || over;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => onChange(preset.text)}
            disabled={loading}
            className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted transition-colors hover:text-foreground disabled:opacity-50"
          >
            {preset.label}
          </button>
        ))}
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste a sentence or two and watch its emphasis emerge…"
        rows={4}
        className="w-full resize-y rounded-xl border border-border bg-surface p-4 text-base leading-relaxed outline-none transition-colors focus:border-foreground/30"
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && !disabled) {
            onSubmit();
          }
        }}
      />

      <div className="flex items-center justify-between">
        <span
          className={`font-mono text-xs ${over ? "text-red-500" : "text-muted"}`}
        >
          {value.length} / {MAX_INPUT_CHARS}
        </span>
        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled}
          className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-opacity disabled:opacity-40"
        >
          {loading ? "Scoring…" : "Render emphasis"}
        </button>
      </div>
    </div>
  );
}
