import { AnalysisResult } from "@/lib/analysis";

interface Props {
  result: AnalysisResult;
}

export default function ExplanationResult({ result }: Props) {
  const {
    productName,
    summary,
    actualPrice,
    expectedPrice,
    gapPercentage,
    inflationContribution,
    psychologicalFactors,
    contextNotes
  } = result;

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-lg md:text-xl font-semibold text-slate-50">
          Here&apos;s what might be happening with this price
        </h2>
        <p className="mt-1 text-sm text-slate-300">{summary}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-4 text-sm">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Price vs your expectation
          </h3>
          <p className="mt-2 text-slate-100">
            <span className="block text-xs text-slate-400">
              Current price
            </span>
            <span className="text-base font-semibold">
              {actualPrice.toLocaleString(undefined, {
                maximumFractionDigits: 2
              })}
            </span>
          </p>
          <p className="mt-2 text-slate-100">
            <span className="block text-xs text-slate-400">
              Feels fair to you
            </span>
            <span className="text-base font-semibold">
              {expectedPrice.toLocaleString(undefined, {
                maximumFractionDigits: 2
              })}
            </span>
          </p>
          <p className="mt-3 text-xs text-slate-300">
            The current price is{" "}
            <span className="font-semibold">
              {gapPercentage > 0 ? `~${gapPercentage}%` : "slightly"}
            </span>{" "}
            {gapPercentage >= 0 ? "above" : "below"} what your brain feels is
            fair for {productName || "this"}.
          </p>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-4 text-sm">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Rough inflation contribution
          </h3>
          {inflationContribution ? (
            <>
              <p className="mt-2 text-slate-100">
                Since your last memory of this price, a rough inflation estimate
                in your region is:
              </p>
              <p className="mt-2 text-xl font-bold text-emerald-300">
                {inflationContribution.estimatedInflationPercent.toFixed(0)}%
              </p>
              <p className="mt-2 text-xs text-slate-300">
                Roughly{" "}
                <span className="font-semibold">
                  {inflationContribution.inflationExplainsPercent.toFixed(0)}%
                </span>{" "}
                of the price jump could be from &quot;the world got more
                expensive&quot;, not just this product.
              </p>
            </>
          ) : (
            <p className="mt-2 text-xs text-slate-300">
              We don&apos;t have enough info about your last purchase year to
              estimate inflation clearly, but your feeling still carries useful
              information about value and context.
            </p>
          )}
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-4 text-sm">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Psychological factors
          </h3>
          <ul className="mt-2 space-y-1">
            {psychologicalFactors.map((factor) => (
              <li key={factor.key} className="flex items-start gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-sky-400" />
                <div>
                  <p className="text-slate-100 text-xs font-semibold">
                    {factor.label}
                  </p>
                  <p className="text-xs text-slate-300">{factor.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {contextNotes.length > 0 && (
        <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-4 text-sm">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Context that might be influencing you
          </h3>
          <ul className="mt-2 space-y-1 list-disc list-inside text-slate-300">
            {contextNotes.map((note, idx) => (
              <li key={idx} className="text-xs">
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
