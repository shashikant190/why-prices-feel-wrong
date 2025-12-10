export type City =
  | "India Average"
  | "Mumbai"
  | "Delhi"
  | "Bengaluru"
  | "Hyderabad"
  | "Chennai";

export const CITY_MULTIPLIERS: Record<City, number> = {
  "India Average": 1.0,
  Mumbai: 1.35,
  Delhi: 1.25,
  Bengaluru: 1.3,
  Hyderabad: 1.15,
  Chennai: 1.2,
};
