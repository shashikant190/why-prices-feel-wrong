import { PriceInputData } from "@/components/PricingForm";
import { estimateInflationSinceYear } from "./inflationData";
import { getCurrentYear } from "./time";

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

export function analyzePriceFeeling(
  input: PriceInputData
): AnalysisResult {
  const {
    productName,
    actualPrice,
    expectedPrice,
    lastPurchaseYear,
    countryCode,
  } = input;

  const gapRatio = (actualPrice - expectedPrice) / expectedPrice;
  const gapPercentage = Math.round(gapRatio * 100);

  const psychologicalFactors: PsychologicalFactor[] = [];
  const contextNotes: string[] = [];

  // ----------------------------
  // 1️⃣ Price anchoring (memory)
  // ----------------------------
  if (lastPurchaseYear) {
    const yearsAgo = getCurrentYear() - lastPurchaseYear;

    if (yearsAgo >= 5) {
      psychologicalFactors.push({
        key: "old_anchor",
        label: "Old price anchor",
        description:
          "Your sense of what’s fair is anchored to a price from years ago. The longer the gap, the stronger the discomfort feels.",
      });
    } else if (yearsAgo >= 2) {
      psychologicalFactors.push({
        key: "compressed_jump",
        label: "Compressed price shock",
        description:
          "Prices changed noticeably in a short time span, which makes the increase feel abrupt and unfair.",
      });
    }

    contextNotes.push(
      `You’re comparing today’s price with a mental reference from ${yearsAgo} year${
        yearsAgo > 1 ? "s" : ""
      } ago. Human price expectations update slowly.`
    );
  } else {
    contextNotes.push(
      "Without a clear memory of when you last paid for this, your brain may be blending older and newer price expectations."
    );
  }

  // ----------------------------
  // 2️⃣ Inflation contribution
  // ----------------------------
  let inflationContribution: InflationContribution | undefined;

  if (lastPurchaseYear && countryCode && countryCode !== "OTHER") {
    const inflation = estimateInflationSinceYear(
      countryCode,
      lastPurchaseYear
    );

    const inflatedExpected =
      expectedPrice * (1 + inflation.cumulativeInflation);

    const inflationGapRatio =
      (inflatedExpected - expectedPrice) /
      (actualPrice - expectedPrice || 1);

    const explainsPercent = Math.max(
      0,
      Math.min(1, inflationGapRatio)
    );

    inflationContribution = {
      estimatedInflationPercent:
        inflation.cumulativeInflation * 100,
      inflationExplainsPercent: explainsPercent * 100,
    };

    if (explainsPercent > 0.7) {
      psychologicalFactors.push({
        key: "inflation_main",
        label: "Inflation explains much of this",
        description:
          "A large part of the increase aligns with general cost-of-living changes, not just this product.",
      });
    } else if (explainsPercent > 0.3) {
      psychologicalFactors.push({
        key: "inflation_partial",
        label: "Inflation explains part of this",
        description:
          "Some of the price rise comes from inflation, but other forces are clearly at work too.",
      });
    } else {
      psychologicalFactors.push({
        key: "inflation_small",
        label: "Inflation doesn’t fully explain this",
        description:
          "Even after adjusting for inflation, the price still sits well above your internal ‘fair’ reference.",
      });
    }
  }

  // ----------------------------
  // 3️⃣ Loss aversion / gap size
  // ----------------------------
  if (gapRatio > 0.5) {
    psychologicalFactors.push({
      key: "large_gap",
      label: "Large jump vs expectation",
      description:
        "Big jumps trigger loss aversion. Your brain experiences this as a punishment or unfair loss.",
    });
  } else if (gapRatio > 0.2) {
    psychologicalFactors.push({
      key: "moderate_gap",
      label: "Noticeable mismatch",
      description:
        "The gap is large enough to feel uncomfortable, even if it’s not extreme.",
    });
  } else if (gapRatio > 0) {
    psychologicalFactors.push({
      key: "small_gap",
      label: "Small but irritating gap",
      description:
        "Even small mismatches trigger discomfort when spending money regularly.",
    });
  } else if (gapRatio < 0) {
    psychologicalFactors.push({
      key: "below_expectation",
      label: "Cheaper than expected",
      description:
        "If it still feels wrong, the issue may be trust, quality, or perceived risk—not price.",
    });
  }

  // ----------------------------
  // 4️⃣ Category-specific context
  // ----------------------------
  const name = productName.toLowerCase();

  if (name.includes("rent") || name.includes("apartment")) {
    contextNotes.push(
      "Housing prices often rise faster than average inflation due to demand, limited supply, and policy effects."
    );
  } else if (name.includes("coffee")) {
    contextNotes.push(
      "Frequent purchases like coffee hurt more because your brain remembers the old price very clearly."
    );
  } else if (name.includes("movie") || name.includes("ticket")) {
    contextNotes.push(
      "Entertainment pricing often hides rising fixed costs such as infrastructure, technology, and staffing."
    );
  }

  // ----------------------------
  // 5️⃣ Summary (human language)
  // ----------------------------
  let summary: string;

  if (
    gapRatio > 0.4 &&
    inflationContribution &&
    inflationContribution.inflationExplainsPercent < 40
  ) {
    summary =
      "This feels expensive because the price jumped far beyond what your brain expects, and general inflation explains only a small part of that jump.";
  } else if (gapRatio > 0.4) {
    summary =
      "This feels expensive mainly because your price expectations are anchored in the past while costs around you changed quickly.";
  } else if (gapRatio > 0.15) {
    summary =
      "This feels somewhat unfair due to a noticeable mismatch between price and expectation.";
  } else if (gapRatio > 0) {
    summary =
      "The price is only slightly higher than expected, but our brains are very sensitive to even small mismatches.";
  } else if (gapRatio < 0) {
    summary =
      "The price is below your expectation. If it still feels off, the discomfort likely isn’t about the number itself.";
  } else {
    summary =
      "Your expectation and the actual price are almost identical. Any discomfort likely comes from context, not price.";
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
