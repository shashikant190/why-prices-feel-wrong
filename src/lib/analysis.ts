import { PriceInputData } from "@/components/PricingForm";
import { getCurrentYear } from "./time";
import { calculateCumulativeInflation } from "./calculateInflation";
import { IndiaInflationYear } from "./fetchIndiaInflation";

/* -------------------- TYPES -------------------- */

export interface PsychologicalFactor {
  key: string;
  label: string;
  description: string;
}

export interface InflationContribution {
  estimatedInflationPercent: number;
  inflationExplainsPercent: number;
}

export interface AnalysisResult {
  productName: string;
  actualPrice: number;
  expectedPrice: number;
  gapPercentage: number;
  summary: string;
  inflationContribution?: InflationContribution;
  psychologicalFactors: PsychologicalFactor[];
  contextNotes: string[];
}

/* -------------------- HELPERS -------------------- */

function inferCategory(name: string): "service" | "housing" | "food" | "other" {
  const n = name.toLowerCase();

  if (n.includes("rent") || n.includes("room") || n.includes("apartment")) {
    return "housing";
  }

  if (n.includes("coffee") || n.includes("food") || n.includes("meal")) {
    return "food";
  }

  if (n.includes("hair") || n.includes("salon") || n.includes("cut")) {
    return "service";
  }

  return "other";
}

function categoryInflationBias(category: string): number {
  switch (category) {
    case "housing":
      return 1.5;
    case "service":
      return 1.3;
    case "food":
      return 1.2;
    default:
      return 1.0;
  }
}

function cityMultiplier(city?: string): number {
  switch (city) {
    case "Mumbai":
      return 1.35;
    case "Delhi":
      return 1.25;
    case "Bengaluru":
      return 1.3;
    case "Chennai":
      return 1.2;
    case "Hyderabad":
      return 1.15;
    default:
      return 1.0;
  }
}

/* -------------------- MAIN -------------------- */

export function analyzePriceFeeling(
  input: PriceInputData,
  indiaInflationData?: IndiaInflationYear[]
): AnalysisResult {
  const {
    productName,
    actualPrice,
    expectedPrice,
    lastPurchaseYear,
    countryCode,
    city,
  } = input;

  const gapRatio = (actualPrice - expectedPrice) / expectedPrice;
  const gapPercentage = Math.round(gapRatio * 100);

  const psychologicalFactors: PsychologicalFactor[] = [];
  const contextNotes: string[] = [];

  /* -------- 1️⃣ Price memory -------- */

  if (lastPurchaseYear) {
    const yearsAgo = getCurrentYear() - lastPurchaseYear;

    psychologicalFactors.push({
      key: "price_memory",
      label: "Based on an older reference price",
      description:
        "Your expectations are shaped by what the price used to be, and those reference points tend to update slowly.",
    });

    contextNotes.push(
      `Your reference price comes from about ${yearsAgo} year${
        yearsAgo > 1 ? "s" : ""
      } ago.`
    );
  }

  /* -------- 2️⃣ Inflation & cost pressure -------- */

  let inflationContribution: InflationContribution | undefined;

  if (
    lastPurchaseYear &&
    countryCode === "IN" &&
    indiaInflationData?.length
  ) {
    const baseInflation = calculateCumulativeInflation(
      indiaInflationData,
      lastPurchaseYear
    );

    const category = inferCategory(productName);
    const biasedInflation = baseInflation * categoryInflationBias(category);

    const adjustedExpected =
      expectedPrice * (1 + biasedInflation) * cityMultiplier(city);

    const explainedRatio =
      (adjustedExpected - expectedPrice) /
      (actualPrice - expectedPrice || 1);

    const explainsPercent = Math.max(
      0,
      Math.min(1, explainedRatio)
    );

    inflationContribution = {
      estimatedInflationPercent: biasedInflation * 100,
      inflationExplainsPercent: explainsPercent * 100,
    };

    /* ---- Soft context notes (not hardcoded truths) ---- */

    if (city && cityMultiplier(city) > 1) {
      contextNotes.push(
        "Prices in larger cities tend to change faster due to higher operating and living costs."
      );
    }

    if (explainsPercent > 30) {
      contextNotes.push(
        "General cost increases explain a noticeable part of the price change."
      );
    } else {
      contextNotes.push(
        "Cost increases alone don’t fully explain how much the price has changed."
      );
    }

    psychologicalFactors.push({
      key: "inflation_context",
      label:
        explainsPercent > 30
          ? "Rising costs play a role"
          : "Price increase exceeds normal cost changes",
      description:
        explainsPercent > 30
          ? "Some portion of the increase aligns with broader cost trends."
          : "Even after adjusting for inflation, the increase still feels steep.",
    });
  }

  /* -------- 3️⃣ Loss aversion -------- */

  if (gapRatio > 0.5) {
    psychologicalFactors.push({
      key: "loss_aversion",
      label: "Large jump relative to expectations",
      description:
        "Large increases feel disproportionately uncomfortable compared to gradual changes.",
    });
  }

  /* -------- 4️⃣ Summary -------- */

  let summary =
    "This price feels off because it clashes with your internal sense of what seems reasonable.";

  const inflationExplains =
    inflationContribution?.inflationExplainsPercent;

  if (
    gapRatio > 0.4 &&
    inflationExplains !== undefined &&
    inflationExplains < 40
  ) {
    summary =
      "This feels expensive because the price rose much more than you expected, and normal cost increases explain only part of that change.";
  } else if (gapRatio > 0.15) {
    summary =
      "This feels unfair mainly because your expectations haven’t adjusted to how prices have evolved.";
  }

  return {
    productName,
    actualPrice,
    expectedPrice,
    gapPercentage,
    summary,
    inflationContribution,
    psychologicalFactors,
    contextNotes,
  };
}
