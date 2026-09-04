/**
 * Orientation event dataset and queries.
 */

export type EventCategory = 'welcome' | 'food' | 'social' | 'traditions' | 'resources';

export type OrientationEvent = {
  id: string;
  day: string;
  date: string;
  time: string;
  title: string;
  place: string;
  category: EventCategory;
  icon: string;
  description: string;
};

export const ORIENTATION_MONTH = 'AUG';
export const ORIENTATION_YEAR = 2026;

export const orientationEvents: OrientationEvent[] = [
  {
    id: 'aggie-welcome', day: 'MON', date: '24', time: '9:00 AM',
    title: 'The Ultimate Aggie Welcome', place: 'Taggart Student Center',
    category: 'welcome', icon: '🚀',
    description: 'Check in, meet your orientation group, pick up your materials, and hear what to expect during your first week.',
  },
  {
    id: 'lunch-quad', day: 'MON', date: '24', time: '12:00 PM',
    title: 'Lunch on the Quad', place: 'The Quad',
    category: 'food', icon: '🍕',
    description: 'Grab a free lunch on the Quad and meet other incoming students between morning and afternoon sessions.',
  },
  {
    id: 'resource-fair', day: 'TUE', date: '25', time: '11:30 AM',
    title: 'Campus Resource Discovery', place: 'The Quad',
    category: 'resources', icon: '🧭',
    description: 'Talk with staff from student services, academic support, campus recreation, clubs, and other USU resources.',
  },
  {
    id: 'club-rush', day: 'WED', date: '26', time: '4:00 PM',
    title: 'Find Your People: Club Rush', place: 'TSC Patio',
    category: 'social', icon: '🤝',
    description: 'Meet student organizations, learn what they do, and find a group you may want to join this semester.',
  },
  {
    id: 'true-aggie', day: 'FRI', date: '28', time: '7:30 PM',
    title: 'True Aggie Traditions Night', place: 'Old Main Hill',
    category: 'traditions', icon: '🐂',
    description: 'Learn the traditions, songs, and stories that new Aggies encounter during their first year.',
  },
  {
    id: 'luminary', day: 'SAT', date: '29', time: '8:30 PM',
    title: 'USU Luminary', place: 'Spectrum → Old Main',
    category: 'traditions', icon: '✨',
    description: 'Join the incoming class for the Luminary procession and watch the A light up on Old Main in a powerful shared moment.',
  },
];

/** Lowercases, pads `9am` out to `9 am`, and collapses runs of whitespace. */
function normalizeForSearch(value: string) {
  return value
    .toLowerCase()
    .replace(/(\d)\s*(am|pm)\b/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Time spellings an event answers to, so `9 AM` finds a session listed as `9:00 AM`. */
function timeSearchTerms(time: string) {
  const match = /^(\d{1,2}):(\d{2}) (AM|PM)$/i.exec(time.trim());
  if (!match) return [time];

  const [, hour, minute, meridiem] = match;
  const terms = [`${hour}:${minute} ${meridiem}`];
  if (minute === '00') terms.push(`${hour} ${meridiem}`);
  return terms;
}

export function filterEvents(events: OrientationEvent[], query: string, category: string) {
  const normalizedQuery = normalizeForSearch(query);

  return events.filter((event) => {
    if (category !== 'all' && event.category !== category) return false;
    if (!normalizedQuery) return true;

    const searchable = normalizeForSearch(
      `${event.title} ${event.place} ${event.description} ${timeSearchTerms(event.time).join(' ')}`,
    );
    return searchable.includes(normalizedQuery);
  });
}

export function filterEventsByDate(events: OrientationEvent[], date: string) {
  return date === 'all' ? events : events.filter((event) => event.date === date);
}

export function findOrientationEventById(id: string) {
  return orientationEvents.find((event) => event.id === id);
}

/** ISO date for an event, derived from the dataset's month and year. */
export function eventIsoDate(event: OrientationEvent) {
  return `${ORIENTATION_YEAR}-08-${event.date}`;
}

export function savedSummary(count: number) {
  if (count === 0) return 'No saved vibes yet';
  return `${count} saved ${count === 1 ? 'experience' : 'experiences'}`;
}
