"use client";

import { useId, useMemo, useState } from "react";

import {
  QUIET_SPOT_MAX_RATING_EXCLUSIVE,
  QUIET_SPOT_MAX_REVIEWS_EXCLUSIVE,
  QUIET_SPOTS_SEARCH_MAX_PAGES,
} from "@/lib/googlePlacesQuietDefaults";

type PlaceHit = {
  id: string;
  displayName: string;
  formattedAddress: string;
  rating: number | null;
  userRatingCount: number | null;
  googleMapsUri: string | null;
  types: string[];
};

const INCLUDED_TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Any (text query only)" },
  { value: "beauty_salon", label: "Beauty salon" },
  { value: "hair_care", label: "Hair care" },
  { value: "spa", label: "Spa" },
  { value: "barber_shop", label: "Barber shop" },
];

function formatReviewCount(n: number | null | undefined): string {
  if (n == null || n < 0) return "—";
  return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

function StarRow({ rating }: { rating: number }) {
  const uid = useId();
  const stars = useMemo(() => {
    const out: { fill: number }[] = [];
    for (let i = 0; i < 5; i++) {
      const fill = Math.min(Math.max(rating - i, 0), 1);
      out.push({ fill });
    }
    return out;
  }, [rating]);

  return (
    <div className="flex items-center gap-0.5" title={`${rating.toFixed(1)} / 5`}>
      {stars.map((s, i) => (
        <svg
          key={i}
          width={20}
          height={20}
          viewBox="0 0 24 24"
          className="shrink-0 text-amber-500 dark:text-amber-400"
          aria-hidden
        >
          <defs>
            <linearGradient id={`${uid}-star-${i}`} x1="0" x2="1" y1="0" y2="0">
              <stop offset={`${s.fill * 100}%`} stopColor="#f59e0b" />
              <stop offset={`${s.fill * 100}%`} stopColor="#71717a" />
            </linearGradient>
          </defs>
          <path
            fill={`url(#${uid}-star-${i})`}
            d="M12 3.1l2.47 5.01 5.53.8-4 3.9.94 5.5L12 15.9l-4.94 2.6.94-5.5-4-3.9 5.53-.8L12 3.1z"
          />
        </svg>
      ))}
      <span className="ml-1.5 tabular-nums text-sm font-semibold text-zinc-800 dark:text-zinc-100">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

function RatingCell({
  rating,
  userRatingCount,
}: {
  rating: number | null;
  userRatingCount: number | null;
}) {
  if (rating == null || rating <= 0) {
    return (
      <div className="text-sm text-zinc-500 dark:text-zinc-400">
        <span className="italic">No rating</span>
        {userRatingCount != null && userRatingCount > 0 ? (
          <div className="mt-0.5 text-xs text-zinc-400">
            {formatReviewCount(userRatingCount)} reviews
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <StarRow rating={rating} />
      <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
        {formatReviewCount(userRatingCount)} reviews
      </div>
    </div>
  );
}

export function FindTargetClient() {
  const [city, setCity] = useState("Closter");
  const [state, setState] = useState("NJ");
  const [businessTypes, setBusinessTypes] = useState("hair salons nail salons");
  const [includedType, setIncludedType] = useState("");
  const [strictType, setStrictType] = useState(false);
  const [quietSpotsOnly, setQuietSpotsOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [places, setPlaces] = useState<PlaceHit[]>([]);
  const [googleResultCount, setGoogleResultCount] = useState<number | null>(null);

  async function runSearch(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!city.trim() && !state.trim()) {
      setError("Enter a city, a state, or both. Clear the city and enter only a state for a wider statewide-style search.");
      return;
    }
    setLoading(true);
    setPlaces([]);
    setGoogleResultCount(null);
    try {
      const params = new URLSearchParams();
      if (city.trim()) params.set("city", city.trim());
      if (state.trim()) params.set("state", state.trim());
      params.set("businessTypes", businessTypes);
      if (includedType) params.set("includedType", includedType);
      if (strictType && includedType) params.set("strictTypeFiltering", "1");
      if (quietSpotsOnly) {
        params.set("quiet", "1");
        params.set("quietMaxRating", String(QUIET_SPOT_MAX_RATING_EXCLUSIVE));
        params.set("quietMaxReviews", String(QUIET_SPOT_MAX_REVIEWS_EXCLUSIVE));
      }

      const res = await fetch(`/api/admin/places-search?${params.toString()}`, {
        credentials: "include",
      });
      const json = (await res.json()) as {
        error?: string;
        places?: PlaceHit[];
        googleResultCount?: number;
      };
      if (!res.ok) {
        setError(json.error ?? `Request failed (${res.status})`);
        return;
      }
      setPlaces(json.places ?? []);
      setGoogleResultCount(
        typeof json.googleResultCount === "number" ? json.googleResultCount : null,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Find salons &amp; businesses
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
          Search Google Places in the <strong className="font-medium text-zinc-800 dark:text-zinc-200">United States</strong>{" "}
          by <strong className="font-medium text-zinc-800 dark:text-zinc-200">city</strong>,{" "}
          <strong className="font-medium text-zinc-800 dark:text-zinc-200">state</strong> (wider search — you can use{" "}
          <strong className="font-medium text-zinc-800 dark:text-zinc-200">state only</strong> and leave city blank), and{" "}
          <strong className="font-medium text-zinc-800 dark:text-zinc-200">business types</strong>. Optionally restrict to
          one Google place type. Results show star rating and review counts (up to 20 per request from Google).
        </p>
      </div>

      <form
        onSubmit={runSearch}
        className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              City or town
            </span>
            <input
              name="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none ring-teal-500/30 focus:border-teal-500 focus:ring-4 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
              placeholder="e.g. Closter — leave blank to search whole state"
              aria-label="City or town (optional if state is set)"
            />
            <span className="mt-1 block text-xs text-zinc-500 dark:text-zinc-400">
              Optional if you fill in state below (state-only = wider search).
            </span>
          </label>
          <label className="block sm:col-span-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              State
            </span>
            <input
              name="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none ring-teal-500/30 focus:border-teal-500 focus:ring-4 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
              placeholder="e.g. NJ, New Jersey, Texas"
              aria-label="US state (optional if city is set; use alone for statewide search)"
            />
            <span className="mt-1 block text-xs text-zinc-500 dark:text-zinc-400">
              Use with a city, or alone for a broader search in that state. Results stay biased to the US.
            </span>
          </label>
          <label className="block sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Business types (search text)
            </span>
            <input
              name="businessTypes"
              value={businessTypes}
              onChange={(e) => setBusinessTypes(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none ring-teal-500/30 focus:border-teal-500 focus:ring-4 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
              placeholder="hair salons, nail salons, barbershops…"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Optional: Google place type filter
            </span>
            <select
              name="includedType"
              value={includedType}
              onChange={(e) => setIncludedType(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none ring-teal-500/30 focus:border-teal-500 focus:ring-4 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
            >
              {INCLUDED_TYPE_OPTIONS.map((o) => (
                <option key={o.value || "none"} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 sm:col-span-2">
            <input
              type="checkbox"
              checked={strictType}
              onChange={(e) => setStrictType(e.target.checked)}
              className="size-4 rounded border-zinc-300 text-teal-600 focus:ring-teal-500"
            />
            <span className="text-sm text-zinc-700 dark:text-zinc-300">
              Strict type filtering (only when a place type is selected; see Google Places docs)
            </span>
          </label>
          <label className="flex items-start gap-2 sm:col-span-2">
            <input
              type="checkbox"
              checked={quietSpotsOnly}
              onChange={(e) => setQuietSpotsOnly(e.target.checked)}
              className="mt-0.5 size-4 rounded border-zinc-300 text-teal-600 focus:ring-teal-500"
            />
            <span className="text-sm text-zinc-700 dark:text-zinc-300">
              Only show places with fewer than {QUIET_SPOT_MAX_REVIEWS_EXCLUSIVE} reviews and average rating under{" "}
              {QUIET_SPOT_MAX_RATING_EXCLUSIVE} stars. Google’s first results are usually popular, highly rated
              listings; with this on we fetch up to {QUIET_SPOTS_SEARCH_MAX_PAGES} pages (then filter). Places with no
              star rating are excluded.
            </span>
          </label>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 disabled:opacity-60 dark:bg-teal-500 dark:hover:bg-teal-400"
          >
            {loading ? "Searching…" : "Search Places"}
          </button>
          {(places.length > 0 || googleResultCount != null) && (
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              {places.length} match{places.length === 1 ? "" : "es"}
              {quietSpotsOnly &&
              googleResultCount != null &&
              googleResultCount !== places.length ? (
                <span className="text-zinc-500"> ({googleResultCount} from Google before filter)</span>
              ) : null}
            </span>
          )}
        </div>
        {error ? (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200">
            {error}
          </p>
        ) : null}
        {quietSpotsOnly &&
        places.length === 0 &&
        googleResultCount != null &&
        googleResultCount > 0 ? (
          <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
            Google returned <strong className="font-medium">{googleResultCount}</strong> places in this search, but{" "}
            <strong className="font-medium">none</strong> matched “under {QUIET_SPOT_MAX_RATING_EXCLUSIVE}★ and under{" "}
            {QUIET_SPOT_MAX_REVIEWS_EXCLUSIVE} reviews” (or had no rating). That can happen when every listing on the
            scanned pages is well-rated. Uncheck the filter to see all results, or try a different area or business
            wording.
          </p>
        ) : null}
      </form>

      {places.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-800/50">
            <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Results</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-zinc-200 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                <tr>
                  <th className="px-4 py-3">Business</th>
                  <th className="px-4 py-3">Address</th>
                  <th className="px-4 py-3">Rating &amp; reviews</th>
                  <th className="px-4 py-3">Types</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {places.map((p) => (
                  <tr key={p.id} className="align-top hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40">
                    <td className="px-4 py-4 font-medium text-zinc-900 dark:text-zinc-100">{p.displayName}</td>
                    <td className="max-w-[280px] px-4 py-4 text-zinc-600 dark:text-zinc-300">
                      {p.formattedAddress || "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4">
                      <RatingCell rating={p.rating} userRatingCount={p.userRatingCount} />
                    </td>
                    <td className="max-w-[200px] px-4 py-4 text-xs text-zinc-500 dark:text-zinc-400">
                      {(p.types ?? []).slice(0, 4).join(", ")}
                      {(p.types?.length ?? 0) > 4 ? "…" : ""}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-right">
                      {p.googleMapsUri ? (
                        <a
                          href={p.googleMapsUri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-teal-700 underline-offset-2 hover:underline dark:text-teal-400"
                        >
                          Maps
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
