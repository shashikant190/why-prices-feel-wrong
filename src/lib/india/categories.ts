export type PriceCategory =
  | "food"
  | "housing"
  | "transport"
  | "entertainment"
  | "general";

export function inferCategory(productName: string): PriceCategory {
  const name = productName.toLowerCase();

  if (
    name.includes("rent") ||
    name.includes("flat") ||
    name.includes("apartment")
  ) {
    return "housing";
  }

  if (
    name.includes("coffee") ||
    name.includes("tea") ||
    name.includes("food") ||
    name.includes("meal")
  ) {
    return "food";
  }

  if (
    name.includes("ticket") ||
    name.includes("movie") ||
    name.includes("cinema")
  ) {
    return "entertainment";
  }

  if (
    name.includes("uber") ||
    name.includes("auto") ||
    name.includes("bus")
  ) {
    return "transport";
  }

  return "general";
}
