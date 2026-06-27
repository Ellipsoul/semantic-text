// Applies db/schema.sql to the Neon database in DATABASE_URL.
// Run: node --env-file=.env.local scripts/migrate.mjs
import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const raw = readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8");
const statements = raw
  .split("\n")
  .filter((line) => !line.trim().startsWith("--"))
  .join("\n")
  .split(";")
  .map((s) => s.trim())
  .filter(Boolean);

const sql = neon(url);
for (const stmt of statements) {
  await sql.query(stmt);
  console.log("✓", stmt.split("\n")[0].slice(0, 60));
}

const check = await sql.query(
  "SELECT column_name FROM information_schema.columns WHERE table_name = 'scoring_requests' ORDER BY ordinal_position",
);
console.log("\nscoring_requests columns:", check.map((r) => r.column_name).join(", "));
