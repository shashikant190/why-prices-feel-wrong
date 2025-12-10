"use client";

import { useState } from "react";

export interface PriceInputData {
  productName: string;
  actualPrice: number;
  expectedPrice: number;
  lastPurchaseYear?: number;
  countryCode?: string;
  city?: string;
}

interface Props {
  onAnalyze: (data: PriceInputData) => void;
}

const currentYear = new Date().getFullYear();

export default function PricingForm({ onAnalyze }: Props) {
  const [productName, setProductName] = useState("");
  const [actualPrice, setActualPrice] = useState("");
  const [expectedPrice, setExpectedPrice] = useState("");
  const [lastPurchaseYear, setLastPurchaseYear] = useState("");
  const [countryCode, setCountryCode] = useState("IN");
  const [city, setCity] = useState("India Average");
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
    if (!actual || actual <= 0) {
      setError("Please enter a valid current price.");
      return;
    }
    if (!expected || expected <= 0) {
      setError("Please enter a fair expected price.");
      return;
    }
    if (year && (year < 1980 || year > currentYear)) {
      setError(`Year must be between 1980 and ${currentYear}.`);
      return;
    }

    onAnalyze({
      productName: productName.trim(),
      actualPrice: actual,
      expectedPrice: expected,
      lastPurchaseYear: year,
      countryCode,
      city,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input
        className="w-full rounded-lg bg-slate-800 px-3 py-2 text-slate-100"
        placeholder="e.g. haircut, movie ticket, rent"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      />

      <div className="grid grid-cols-2 gap-4">
        <input
          type="number"
          placeholder="Current price"
          className="rounded-lg bg-slate-800 px-3 py-2 text-slate-100"
          value={actualPrice}
          onChange={(e) => setActualPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Feels fair"
          className="rounded-lg bg-slate-800 px-3 py-2 text-slate-100"
          value={expectedPrice}
          onChange={(e) => setExpectedPrice(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <input
          type="number"
          placeholder="Last paid (year)"
          className="rounded-lg bg-slate-800 px-3 py-2 text-slate-100"
          value={lastPurchaseYear}
          onChange={(e) => setLastPurchaseYear(e.target.value)}
        />

        <select
          className="rounded-lg bg-slate-800 px-3 py-2 text-slate-100"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        >
          <option>India Average</option>
          <option>Mumbai</option>
          <option>Delhi</option>
          <option>Bengaluru</option>
          <option>Hyderabad</option>
          <option>Chennai</option>
        </select>

        <select
          className="rounded-lg bg-slate-800 px-3 py-2 text-slate-100"
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
        >
          <option value="IN">India</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      {error && <p className="text-red-400">{error}</p>}

      <button className="rounded-lg bg-sky-500 px-4 py-2 font-semibold">
        Explain why this feels expensive
      </button>
    </form>
  );
}
