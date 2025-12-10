export interface IndiaInflationYear {
  year: number;
  inflation: number; // %
}

const WORLD_BANK_URL =
  "https://api.worldbank.org/v2/country/IND/indicator/FP.CPI.TOTL.ZG?format=json&per_page=100";

export async function fetchIndiaInflationData(): Promise<
  IndiaInflationYear[]
> {
  const res = await fetch(WORLD_BANK_URL);

  if (!res.ok) {
    throw new Error("Failed to fetch India inflation data");
  }

  const data = await res.json();

  // data[1] contains the actual entries
  const records = data[1];

  if (!Array.isArray(records)) return [];

  return records
    .filter((r) => r.value !== null)
    .map((r) => ({
      year: Number(r.date),
      inflation: Number(r.value),
    }));
}
