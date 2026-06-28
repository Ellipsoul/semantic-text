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
  {
    label: "Philosophical",
    text: "We tend to assume that happiness is something to be pursued, as though it were a destination waiting at the end of a long road. Yet the more directly we chase it, the more it seems to recede. Perhaps contentment is less a place we arrive at and more a quality of attention — a way of noticing the small, unremarkable moments that make up the texture of an ordinary life. The afternoon light on a wall, the warmth of a cup held in both hands, a conversation that drifts pleasantly nowhere in particular. These are easy to overlook precisely because they ask nothing of us. And yet, looking back, it is often these forgotten moments, rather than the grand achievements, that we find we treasured most.",
  },
  {
    label: "Sports",
    text: "With only seconds left on the clock and the crowd on its feet, the young midfielder collected the ball just inside the halfway line. She slipped past one defender, then another, the noise swelling with every stride. As the goalkeeper rushed out to narrow the angle, she paused for a heartbeat, then curled the ball delicately into the far corner. The stadium erupted. It was a goal that would be replayed for years, not merely because it won the championship, but because it captured something rare: the moment when months of relentless preparation collapse into a single, instinctive act of brilliance that no amount of planning could ever guarantee.",
  },
  {
    label: "Business",
    text: "Every great company begins with an uncomfortable observation: something everyone tolerates but no one has bothered to fix. Our product starts there. Small businesses lose countless hours each month wrestling with invoices, chasing late payments, and reconciling accounts by hand. We replace that drudgery with a single, intuitive dashboard that does the tedious work automatically, so owners can spend their time on the things that actually grow a business. The market is enormous, the problem is universal, and the technology is finally ready. What we are asking for is the chance to bring this to the millions of people who deserve better than spreadsheets and late nights.",
  },
  {
    label: "Nature",
    text: "At dawn the valley lies hidden beneath a sea of cloud, and only the highest peaks break through, glowing faintly pink in the first light. As the sun climbs, the mist begins to stir and dissolve, revealing terraced fields, a winding river, and a scattering of villages waking slowly to the day. The air is cold and impossibly clear, carrying the distant sound of bells from a herd grazing somewhere out of sight. To stand here, watching an entire landscape emerge from nothing, is to feel both very small and strangely at peace — a reminder that the world is far larger, older, and more beautiful than the narrow corridors of our daily worries.",
  },
  {
    label: "Mystery",
    text: "The house had been empty for years, or so everyone believed. But on the night of the storm, a single light appeared in the upstairs window, flickering behind the grimy glass. Mrs. Ableton, walking her dog along the lane, stopped and stared. She was certain the place had no electricity; the wires had been cut long ago. And yet there it was, steady now, as if someone inside were waiting. The dog began to growl, low and uneasy, pulling back toward home. For a long moment she hesitated, her hand tightening on the leash, before she noticed the front door — which she could have sworn was locked — standing slightly, invitingly, open.",
  },
  {
    label: "Wellness",
    text: "Sleep is not a luxury we can borrow against indefinitely; it is the foundation on which nearly everything else depends. During the hours we spend unconscious, the brain quietly does some of its most important work: consolidating memories, clearing away metabolic waste, and restoring the delicate chemical balance that governs mood and concentration. Skimp on it, and the consequences accumulate silently — sharper irritability, foggier thinking, a weaker immune response. The good news is that small, consistent changes make a real difference. A cooler room, a darker space, and a regular bedtime can transform the quality of your rest far more reliably than any expensive supplement ever will.",
  },
];
