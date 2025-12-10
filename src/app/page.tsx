"use client";

import { useState } from "react";
import PricingForm, { PriceInputData } from "@/components/PricingForm";
import ExplanationResult from "@/components/ExplanationResult";
import { analyzePriceFeeling, AnalysisResult } from "@/lib/analysis";

export default function HomePage() {
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = (data: PriceInputData) => {
    const analysis = analyzePriceFeeling(data);
    setResult(analysis);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl rounded-2xl border border-slate-700 bg-slate-900/70 backdrop-blur-lg shadow-xl p-6 md:p-8">
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-50">
            Why Does This Price Feel Wrong?
          </h1>
          <p className="mt-2 text-sm md:text-base text-slate-300">
            Enter what you&apos;re buying and what it costs. We&apos;ll explain
            why it feels expensive or unfair — in plain language.
          </p>
        </header>

        <PricingForm onAnalyze={handleAnalyze} />

        {result && (
          <>
            <div className="my-6 border-t border-slate-700" />
            <ExplanationResult result={result} />
          </>
        )}

        <footer className="mt-8 text-xs text-slate-500">
          This is an educational tool. It doesn&apos;t give financial or legal
          advice.
        </footer>
      </div>
    </main>
  );
}
