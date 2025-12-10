import { IndiaInflationYear } from "./fetchIndiaInflation";
import { getCurrentYear } from "./time";

export function calculateCumulativeInflation(
  inflationData: IndiaInflationYear[],
  fromYear: number
): number {
  const currentYear = getCurrentYear();

  let factor = 1;

  for (let year = fromYear + 1; year <= currentYear; year++) {
    const record = inflationData.find((r) => r.year === year);
    if (record) {
      factor *= 1 + record.inflation / 100;
    }
  }

  return factor - 1;
}
