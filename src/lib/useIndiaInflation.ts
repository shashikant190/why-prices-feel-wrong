import { useEffect, useState } from "react";
import {
  fetchIndiaInflationData,
  IndiaInflationYear,
} from "./fetchIndiaInflation";

export function useIndiaInflation() {
  const [data, setData] = useState<IndiaInflationYear[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIndiaInflationData()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
