import { yearsBetween } from "./time";

export interface InflationEstimate {
  cumulativeInflation: number; // e.g. 0.42 = +42%
  annualRateUsed: number;
  yearsConsidered: number;
}

/**
 * Approximate long-term average inflation.
 * These are NOT exact CPI values.
 */
const AVERAGE_ANNUAL_INFLATION: Record<string, number> = {
  IN: 0.055, // India ~5–6%
  US: 0.03,  // USA ~3%
  EU: 0.025, // Eurozone ~2–3%
  DEFAULT: 0.035,
};

export function estimateInflationSinceYear(
  countryCode: string,
  fromYear: number
): InflationEstimate {
  const years = yearsBetween(fromYear);

  const rate =
    AVERAGE_ANNUAL_INFLATION[countryCode] ??
    AVERAGE_ANNUAL_INFLATION.DEFAULT;

  const cumulativeInflation = Math.pow(1 + rate, years) - 1;

  return {
    cumulativeInflation,
    annualRateUsed: rate,
    yearsConsidered: years,
  };
}
