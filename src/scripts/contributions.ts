// Build-time GitHub activity for the Telemetry strip (Telemetry.astro).
//
// Merges the contribution calendars of several accounts into one daily
// series for the last N weeks. With GITHUB_TOKEN set (a token with no scopes
// is enough — it can read any user's public calendar, including private-work
// counts when that user has enabled "include private contributions"), it uses
// GitHub's GraphQL API. Without a token, or if the API call fails, it falls
// back to the committed snapshot so the build never breaks or goes blank.
// Only day-by-day counts are used: no repo names, no commit messages.

import snapshot from '../data/contributions.snapshot.json';

export interface Week {
  /** Sunday that starts the week, YYYY-MM-DD. */
  start: string;
  total: number;
  days: number[];
}

export interface Activity {
  weeks: Week[];
  total: number;
  activeDays: number;
  longestStreak: number;
  bestWeek: Week;
  /** Where the numbers came from, for the footnote. */
  source: 'github-api' | 'snapshot';
  asOf: string;
}

const QUERY = `query($login: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $login) {
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar { weeks { contributionDays { date contributionCount } } }
    }
  }
}`;

async function fetchCalendar(login: string, token: string, from: Date, to: Date) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { Authorization: `bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': 'portfolio-build' },
    body: JSON.stringify({ query: QUERY, variables: { login, from: from.toISOString(), to: to.toISOString() } }),
  });
  const json = await res.json();
  if (!res.ok || json.errors || !json.data?.user) {
    throw new Error(json.errors?.[0]?.message ?? `HTTP ${res.status}`);
  }
  const days: Record<string, number> = {};
  for (const w of json.data.user.contributionsCollection.contributionCalendar.weeks) {
    for (const d of w.contributionDays) days[d.date] = d.contributionCount;
  }
  return days;
}

const ymd = (d: Date) => d.toISOString().slice(0, 10);

export async function loadActivity(accounts: string[], weekCount = 52): Promise<Activity> {
  const to = new Date();
  const from = new Date(to);
  from.setUTCDate(from.getUTCDate() - weekCount * 7);

  let calendars: Record<string, number>[] | null = null;
  let source: Activity['source'] = 'snapshot';
  let asOf = (snapshot as { fetchedAt: string }).fetchedAt;

  // From a .env file, or the host's environment variables (e.g. Vercel).
  const env = (globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env ?? {};
  const token = import.meta.env.GITHUB_TOKEN ?? env.GITHUB_TOKEN;
  if (token) {
    try {
      calendars = await Promise.all(accounts.map((a) => fetchCalendar(a, token, from, to)));
      source = 'github-api';
      asOf = to.toISOString();
      console.log(`[telemetry] Loaded live GitHub activity for ${accounts.join(', ')}.`);
    } catch (err) {
      console.warn(`[telemetry] GitHub API failed (${(err as Error).message}); using the snapshot.`);
    }
  }
  if (!calendars) {
    const saved = (snapshot as { accounts: Record<string, Record<string, number>> }).accounts;
    calendars = accounts.map((a) => saved[a] ?? {});
  }

  // Merge, then lay out whole weeks (Sunday → Saturday) ending this week.
  const merged = new Map<string, number>();
  for (const cal of calendars) for (const [d, n] of Object.entries(cal)) merged.set(d, (merged.get(d) ?? 0) + n);

  const end = new Date(asOf);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 7 * (weekCount - 1) - end.getUTCDay());

  const weeks: Week[] = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    const week: Week = { start: ymd(cursor), total: 0, days: [] };
    for (let i = 0; i < 7; i++) {
      const n = cursor <= end ? merged.get(ymd(cursor)) ?? 0 : 0;
      week.days.push(n);
      week.total += n;
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
    weeks.push(week);
  }

  const daily = weeks.flatMap((w) => w.days);
  let longestStreak = 0;
  let run = 0;
  for (const n of daily) {
    run = n > 0 ? run + 1 : 0;
    longestStreak = Math.max(longestStreak, run);
  }

  return {
    weeks,
    total: daily.reduce((a, b) => a + b, 0),
    activeDays: daily.filter((n) => n > 0).length,
    longestStreak,
    bestWeek: weeks.reduce((best, w) => (w.total > best.total ? w : best), weeks[0]),
    source,
    asOf,
  };
}
