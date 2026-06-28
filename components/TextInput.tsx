"use client";

import { MAX_INPUT_CHARS } from "@/lib/config";
import { PRESETS } from "@/lib/presets";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

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
          <Button
            key={preset.label}
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full text-muted-foreground"
            onClick={() => onChange(preset.text)}
            disabled={loading}
          >
            {preset.label}
          </Button>
        ))}
      </div>

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your passage here and watch its emphasis emerge…"
        rows={8}
        className="min-h-48 resize-y rounded-xl p-4 text-base leading-relaxed"
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && !disabled) {
            onSubmit();
          }
        }}
      />

      <div className="flex items-center justify-between">
        <span
          className={cn(
            "font-mono text-xs",
            over ? "text-destructive" : "text-muted-foreground",
          )}
        >
          {value.length} / {MAX_INPUT_CHARS}
        </span>
        <Button
          type="button"
          className="rounded-full"
          onClick={onSubmit}
          disabled={disabled}
        >
          {loading ? "Scoring…" : "Render emphasis"}
        </Button>
      </div>
    </div>
  );
}
