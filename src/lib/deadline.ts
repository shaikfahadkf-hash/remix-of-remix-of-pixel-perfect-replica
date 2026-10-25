export function formatDeadline(iso: string) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata", day: "numeric", month: "long", year: "numeric",
  }).format(new Date(iso));
}

export function deadlineInput(iso: string) {
  return new Date(new Date(iso).getTime() + 330 * 60000).toISOString().slice(0, 16);
}

export function parseDeadline(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) throw new Error("Choose a valid registration deadline");
  const date = new Date(`${value}:00+05:30`);
  if (!Number.isFinite(date.getTime())) throw new Error("Choose a valid registration deadline");
  return date.toISOString();
}

export function remainingTime(deadline: string, now: number) {
  const ms = Math.max(0, new Date(deadline).getTime() - now);
  return { days: Math.floor(ms / 86400000), hours: Math.floor((ms / 3600000) % 24), minutes: Math.floor((ms / 60000) % 60), seconds: Math.floor((ms / 1000) % 60) };
}