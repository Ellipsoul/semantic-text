-- Telemetry table. Run once against the Neon database (psql "$DATABASE_URL" -f db/schema.sql).
-- The `meta` JSONB column is the no-migration extensibility seam for future
-- research fields (drift counts, mapping config snapshots, raw model echo, etc).

CREATE TABLE IF NOT EXISTS scoring_requests (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  input_text     TEXT        NOT NULL,
  tokens         JSONB       NOT NULL,   -- string[]
  scores         JSONB,                  -- number[] (null if the call failed)
  model          TEXT        NOT NULL,
  prompt_version TEXT        NOT NULL,
  latency_ms     INTEGER,
  input_tokens   INTEGER,
  output_tokens  INTEGER,
  status         TEXT        NOT NULL,   -- 'ok' | 'misaligned' | 'parse_error' | 'api_error'
  error_message  TEXT,
  meta           JSONB
);

CREATE INDEX IF NOT EXISTS scoring_requests_created_at_idx
  ON scoring_requests (created_at DESC);
CREATE INDEX IF NOT EXISTS scoring_requests_version_idx
  ON scoring_requests (prompt_version);
