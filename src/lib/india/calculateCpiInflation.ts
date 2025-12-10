import { IndiaInflationYear } from "../fetchIndiaInflation";
import { getCurrentYear } from "../time";
import { PriceCategory } from "./categories";

/**
 * CPI bias multipliers per category.
 * These are empirically reasonable, not exact CPI weights.
 */
const CATEGORY_BIAS: Record<PriceCategory, number> = {
  food: 1.25,
  housing: 1.35,
  transport: 1.15,
  entertainment: 1.4,
  general: 1.0
};

export function calculateCategoryInflation(
  data: IndiaInflationYear[],
  fromYear: number,
  category: PriceCategory
): number {
  const currentYear = getCurrentYear();
  let factor = 1;

  for (let year = fromYear + 1; year <= currentYear; year++) {
    const record = data.find(d => d.year === year);
    if (record) {
      factor *= 1 + (record.inflation / 100);
    }
  }

  const bias = CATEGORY_BIAS[category];
  return factor ** bias - 1;
}
