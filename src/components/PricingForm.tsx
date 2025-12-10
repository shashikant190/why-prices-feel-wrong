"use client";

import { useState } from "react";

export interface PriceInputData {
  productName: string;
  actualPrice: number;
  expectedPrice: number;
  lastPurchaseYear?: number;
  countryCode?: string;
}

interface Props {
  onAnalyze: (data: PriceInputData) => void;
}

const currentYear = new Date().getFullYear();

export default function PricingForm({ onAnalyze }: Props) {
  const [productName, setProductName] = useState("");
  const [actualPrice, setActualPrice] = useState<string>("");
  const [expectedPrice, setExpectedPrice] = useState<string>("");
  const [lastPurchaseYear, setLastPurchaseYear] = useState<string>("");
  const [countryCode, setCountryCode] = useState("IN");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const actual = Number(actualPrice);
    const expected = Number(expectedPrice);
    const year = lastPurchaseYear ? Number(lastPurchaseYear) : undefined;

    if (!productName.trim()) {
      setError("Please enter a product or service name.");
      return;
    }

    if (!Number.isFinite(actual) || actual <= 0) {
      setError("Please enter a valid current price.");
      return;
    }

    if (!Number.isFinite(expected) || expected <= 0) {
      setError("Please enter what price feels fair to you.");
      return;
    }

    if (year && (year < 1980 || year > currentYear)) {
      setError(`Last purchase year should be between 1980 and ${currentYear}.`);
      return;
    }

    onAnalyze({
      productName: productName.trim(),
      actualPrice: actual,
      expectedPrice: expected,
      lastPurchaseYear: year,
      countryCode: countryCode || undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-200">
          What are you buying?
        </label>
        <input
          type="text"
          className="w-full rounded-lg border border-slate-600 bg-slate-800/80 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
          placeholder="e.g. movie ticket, coffee, haircut, rent"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-200">
            Current price
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            className="w-full rounded-lg border border-slate-600 bg-slate-800/80 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="e.g. 350"
            value={actualPrice}
            onChange={(e) => setActualPrice(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-200">
            What price feels fair to you?
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            className="w-full rounded-lg border border-slate-600 bg-slate-800/80 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="e.g. 200"
            value={expectedPrice}
            onChange={(e) => setExpectedPrice(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-200">
            Last time you paid for something like this (year)
            <span className="text-slate-400"> — optional</span>
          </label>
          <input
            type="number"
            min="1980"
            max={currentYear}
            className="w-full rounded-lg border border-slate-600 bg-slate-800/80 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="e.g. 2018"
            value={lastPurchaseYear}
            onChange={(e) => setLastPurchaseYear(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-200">
            Country
          </label>
          <select
            className="w-full rounded-lg border border-slate-600 bg-slate-800/80 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
          >
            <option value="IN">India</option>
            <option value="US">United States</option>
            <option value="EU">Euro area</option>
            <option value="OTHER">Other / not listed</option>
          </select>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-400 bg-red-950/40 border border-red-700 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-md shadow-sky-500/30 hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition"
      >
        Explain why this feels expensive
      </button>
    </form>
  );
}
