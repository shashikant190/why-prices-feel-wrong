interface Props {
  data: { year: number; inflation: number }[];
}

export default function InflationChart({ data }: Props) {
  if (!data || data.length < 2) return null;

  // India CPI has historically stayed under ~15%
  const MAX_INFLATION = 10;

  return (
    <div className="mt-4">
      <p className="text-xs text-slate-400 mb-2">
        Official inflation trend (India)
      </p>

      <div className="flex items-end gap-0.5 h-20">
        {data.map((d) => {
          const heightPercent = Math.min(
            (d.inflation / MAX_INFLATION) * 100,
            100
          );

          return (
            <div
              key={d.year}
              className="flex-1 rounded-sm bg-sky-500/70 hover:bg-sky-400 transition"
              title={`${d.year}: ${d.inflation.toFixed(1)}%`}
              style={{ height: `${heightPercent}%` }}
            />
          );
        })}
      </div>

      <div className="flex justify-between text-[10px] text-slate-500 mt-1">
        <span>{data[0].year}</span>
        <span>{data[data.length - 1].year}</span>
      </div>
    </div>
  );
}
