/** Demo presets shipped with the MVP, covering distinct prose registers. */
export interface Preset {
  label: string;
  text: string;
}

export const PRESETS: Preset[] = [
  {
    label: "Scientific",
    text: "Scientists working deep in the Amazon rainforest have discovered a new species of butterfly whose wings shift colour depending on the angle of the light. The find emerged almost by accident during a routine biodiversity survey, when a researcher noticed an unfamiliar shimmer among the undergrowth. Subsequent genetic analysis confirmed that the insect belongs to a previously undocumented lineage, one that appears to have adapted specifically to the dim, humid conditions of the forest floor. Beyond the novelty of the discovery itself, the researchers argue that it underscores how much of the planet's biodiversity remains unknown to science. As climate change accelerates and habitat destruction spreads, they warn, countless species may vanish before they are ever catalogued, taking with them clues about evolution, medicine, and resilience that we cannot yet imagine.",
  },
  {
    label: "Technical",
    text: "After months of careful profiling, the engineering team finally shipped the new caching layer, and the results exceeded everyone's expectations. Page load times dropped by more than half, the database stopped buckling under traffic spikes, and the support queue grew noticeably quieter almost overnight. What made the project succeed was not a single clever trick but a disciplined sequence of small, measurable improvements: instrumenting the slow paths first, agreeing on clear performance budgets, and refusing to merge anything that regressed the key metrics. The release went out ahead of schedule, and early users responded with genuine enthusiasm, praising how responsive the application now felt. More importantly, the team came away with a repeatable playbook, confident that the same methodical approach would carry over to the next ambitious feature on the roadmap.",
  },
  {
    label: "Conversational",
    text: "Hey, I was thinking we could maybe meet for coffee sometime next week if you happen to be free. It feels like ages since we actually caught up properly, and there's honestly so much I want to tell you about everything that's been going on lately. I'm pretty flexible most afternoons, although Wednesday is a bit of a write-off because of a thing at work that I can't really get out of. There's that little place near the station we went to once, the one with the ridiculously good pastries, or we could try somewhere new if you'd rather. Anyway, no pressure at all, just let me know what works for you and we can figure out the details from there. Really looking forward to seeing you and finally hearing how the new job has been treating you.",
  },
  {
    label: "Historical",
    text: "In the summer of 1969, after nearly a decade of frantic effort and several hundred billion dollars, Apollo 11 carried three astronauts toward the Moon. On the twentieth of July, while Michael Collins orbited overhead in the command module, Neil Armstrong and Buzz Aldrin guided the fragile lunar lander down toward a barren plain called the Sea of Tranquility. With only seconds of fuel remaining, Armstrong took manual control and set the craft gently onto the surface. Hours later he descended the ladder and became the first human being ever to walk on another world, his words carried live to an audience of hundreds of millions watching anxiously back on Earth. The achievement was as much political as scientific, a triumph in a long rivalry, yet for a brief moment it felt as though the whole of humanity had stepped onto the Moon together.",
  },
  {
    label: "Literary",
    text: "The old lighthouse stood firm against the storm, as it had through every winter for more than a century. Its weathered stone shoulders took the full weight of the wind, and its single beam swept patiently across the restless black water, searching the dark for ships that might have lost their way. Far below, the waves threw themselves against the rocks and shattered into pale ribbons of foam, while gulls wheeled and cried somewhere out in the murk. Inside, the keeper sat alone with his lamp and his thoughts, listening to the rhythm of the sea as it rose and fell, rose and fell, a sound he had come to know better than his own heartbeat. He had long since stopped being afraid of the storms; he understood, now, that the light was not there to defeat the darkness but simply to endure it, and to be seen.",
  },
  {
    label: "Culinary",
    text: "Begin by melting the dark chocolate slowly over a pan of barely simmering water, stirring gently so that it never overheats and turns grainy. While it cools to just above body temperature, whip the cream until it holds soft, billowing peaks that fold over on themselves rather than standing stiffly upright. The secret to a light mousse lies entirely in this next step: fold the cooled chocolate into the cream with a slow, deliberate motion, lifting from the bottom of the bowl and turning the mixture over itself, taking care not to knock out the air you have just worked so hard to incorporate. Spoon the finished mousse into small glasses, cover them loosely, and let them chill in the refrigerator for at least four hours, or overnight if you can bear to wait. The reward is a dessert that is impossibly smooth, deeply rich, and yet somehow still feels weightless on the tongue.",
  },
];
