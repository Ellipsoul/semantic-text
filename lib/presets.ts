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
    text: "The new caching layer cut page load times in half, and the team shipped the release ahead of schedule to glowing feedback from early users around the world.",
  },
  {
    label: "Conversational",
    text: "I was thinking we could maybe meet for coffee sometime next week if you are free. Just let me know what works and we can figure out the details.",
  },
  {
    label: "Historical",
    text: "In 1969, Apollo 11 landed on the Moon, and Neil Armstrong became the first person to walk on its surface as millions of people watched live around the world.",
  },
  {
    label: "Literary",
    text: "The old lighthouse stood firm against the storm, its beam sweeping across the restless waves while gulls circled the darkened cliffs far below.",
  },
  {
    label: "Culinary",
    text: "Gently fold the melted chocolate into the whipped cream, then chill the mixture until it sets into a smooth and velvety mousse.",
  },
];
