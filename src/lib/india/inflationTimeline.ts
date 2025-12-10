import { IndiaInflationYear } from "../fetchIndiaInflation";

export function buildInflationTimeline(
  data: IndiaInflationYear[],
  fromYear?: number
) {
  if (!fromYear) return [];

  return data
    .filter((d) => d.year >= fromYear)
    .sort((a, b) => a.year - b.year);
}
