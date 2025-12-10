export function getToday(): Date {
  return new Date();
}

export function getCurrentYear(): number {
  return getToday().getFullYear();
}

export function yearsBetween(fromYear: number): number {
  return Math.max(0, getCurrentYear() - fromYear);
}

export function formatToday(): string {
  return getToday().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
