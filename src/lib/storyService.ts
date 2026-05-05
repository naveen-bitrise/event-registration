/**
 * Story service: searches Wikipedia for the user's query, takes the top five
 * page titles, and weaves them into a silly cosy mad-libs story.
 *
 * No API key required — Wikipedia OpenSearch is free and CORS-enabled.
 * Docs: https://www.mediawiki.org/wiki/API:Opensearch
 */

const SEARCH_ENDPOINT = 'https://en.wikipedia.org/w/api.php';

type OpenSearchResponse = [string, string[], string[], string[]];

export type StoryResult = {
  story: string;
  titles: string[];
};

export async function fetchTopFiveTitles(query: string): Promise<string[]> {
  const url =
    `${SEARCH_ENDPOINT}?action=opensearch&format=json&origin=*` +
    `&limit=5&search=${encodeURIComponent(query)}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Search failed (${response.status})`);
  }

  const data = (await response.json()) as OpenSearchResponse;
  const titles = (data[1] ?? [])
    .map((t) => t.trim())
    .filter((t) => t.length > 0)
    .slice(0, 5);

  if (titles.length === 0) {
    throw new Error('Wikipedia returned no results. Try a different prompt.');
  }

  return titles;
}

const STORY_TEMPLATES: ((hero: string, t: string[]) => string)[] = [
  (hero, t) =>
    `Once upon a marshmallow morning, ${hero} sleepily wandered into a place called "${t[0]}". ` +
    `A sign on the door warned about "${t[1]}", but ${hero} just giggled and tiptoed in anyway. ` +
    `Inside, an extremely polite raccoon was hosting a workshop on "${t[2]}", complete with tiny hats. ` +
    `Halfway through the second song, "${t[3]}" came stomping down the hallway demanding snacks. ` +
    `${hero} solved everything by sharing a thermos of cocoa and reading aloud from the legendary scroll: "${t[4]}". The end. 🍵`,

  (hero, t) =>
    `Chapter one. ${hero} woke up inside a fluffy pillow fort labeled "${t[0]}". ` +
    `Chapter two. A wise toaster whispered the prophecy of "${t[1]}". ` +
    `Chapter three. Three confused pigeons performed an interpretive dance titled "${t[2]}". ` +
    `Chapter four. Just when "${t[3]}" tried to ruin everything, ${hero} produced a slightly used coupon for it. ` +
    `Chapter five. Everyone celebrated by inventing a new holiday: "${t[4]}". 🎉`,

  (hero, t) =>
    `Legend says ${hero} once went looking for the rumored land of "${t[0]}". ` +
    `On the way, a sleepy badger handed over a map labeled "${t[1]}" — upside down, of course. ` +
    `${hero} accidentally signed up for a part-time job at "${t[2]}" (the uniform was very cosy). ` +
    `Then "${t[3]}" appeared in a cloud of glitter and demanded a thumb war. ${hero} won, obviously. ` +
    `The reward? A laminated certificate that simply read: "${t[4]}". 🏅`,

  (hero, t) =>
    `Dear diary, today ${hero} discovered a hidden café called "${t[0]}". The pastries were suspicious. ` +
    `A poster on the wall tried to explain "${t[1]}", but it was written entirely in emojis. ` +
    `The barista, a part-time inventor, was demoing their newest gadget: "${t[2]}". It made tea. Probably. ` +
    `Out of nowhere, "${t[3]}" rolled in on a tiny scooter and ordered the spicy croissant. ` +
    `${hero} left a five-star review titled "${t[4]}" and skipped home through the leaves. 🍂`,
];

export function composeStory(query: string, titles: string[]): string {
  const padded = [...titles];
  while (padded.length < 5) padded.push('a mysterious unlabeled jar');

  const hero = query.trim() || 'a brave little muffin';
  const template = STORY_TEMPLATES[Math.floor(Math.random() * STORY_TEMPLATES.length)];
  return template(hero, padded);
}

export async function generateStory(query: string): Promise<StoryResult> {
  const titles = await fetchTopFiveTitles(query);
  const story = composeStory(query, titles);
  return { story, titles };
}
