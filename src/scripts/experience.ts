// Years of experience for the About stats, e.g. "2.3+". Counts whole months
// since the start date, sits one month behind (the "+" covers the rest), and
// rounds down to one decimal so it never overstates.

export function experienceYears(start: string, now = new Date()): number {
  // Read "YYYY-MM-DD" by parts, so the visitor's timezone can't shift it a day.
  const [y, m, d] = start.split('-').map(Number);
  let months = (now.getFullYear() - y) * 12 + (now.getMonth() + 1 - m);
  if (now.getDate() < (d || 1)) months--; // this month isn't complete yet
  months = Math.max(0, months - 1);
  return Math.floor((months / 12) * 10) / 10;
}
