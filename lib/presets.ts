/** Demo presets shipped with the MVP, covering distinct prose registers. */
export interface Preset {
  label: string;
  text: string;
}

export const PRESETS: Preset[] = [
  {
    label: "Scientific",
    text: "Scientists have discovered a new species of butterfly in the Amazon rainforest, demonstrating that biodiversity surveys remain critically important in an era of climate change and habitat destruction.",
  },
  {
    label: "Technical",
    text: "The database query failed because the connection pool was exhausted. Increase the maximum connection limit and add retry logic with exponential backoff to prevent cascading failures.",
  },
  {
    label: "Conversational",
    text: "I was thinking we could maybe meet for coffee sometime next week if you are free. Just let me know what works and we can figure out the details.",
  },
];
