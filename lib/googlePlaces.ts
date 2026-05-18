/** Google Places API (New) — Text Search. Server-only. */

import {
  QUIET_SPOT_MAX_RATING_EXCLUSIVE,
  QUIET_SPOT_MAX_REVIEWS_EXCLUSIVE,
  QUIET_SPOTS_SEARCH_MAX_PAGES,
} from "@/lib/googlePlacesQuietDefaults";

const SEARCH_TEXT_URL = "https://places.googleapis.com/v1/places:searchText";

/** Include `nextPageToken` so we can paginate when post-filtering (e.g. “quiet spots”). */
const FIELD_MASK =
  "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.googleMapsUri,places.types,nextPageToken";

function pickEnv(...keys: string[]): string {
  for (const key of keys) {
    const v = process.env[key]?.trim();
    if (v) return v;
  }
  return "";
}

/** Maps / Places **API key** (often starts with `AIza`). Not an OAuth client secret. */
export function getGooglePlacesApiKey(): string {
  return pickEnv(
    "GOOGLE_PLACES_API_KEY",
    "google_places_api_key",
    "google_place_api",
    "GOOGLE_PLACE_API",
    "GOOGLE_MAPS_API_KEY",
    "google_maps_api_key",
  );
}

function looksLikeGoogleOAuthClientSecret(value: string): boolean {
  return value.startsWith("GOCSPX-");
}

export type PlaceSearchHit = {
  id: string;
  displayName: string;
  formattedAddress: string;
  rating: number | null;
  userRatingCount: number | null;
  googleMapsUri: string | null;
  types: string[];
};

type GoogleDisplayName = { text?: string };
type GooglePlaceRaw = {
  id?: string;
  displayName?: GoogleDisplayName;
  formattedAddress?: string;
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  types?: string[];
};

type GoogleSearchTextResponse = {
  places?: GooglePlaceRaw[];
  nextPageToken?: string;
  error?: { message?: string; status?: string; code?: number };
};

function mapPlace(p: GooglePlaceRaw): PlaceSearchHit {
  return {
    id: p.id ?? "",
    displayName: p.displayName?.text?.trim() ?? "Unknown",
    formattedAddress: p.formattedAddress?.trim() ?? "",
    rating: typeof p.rating === "number" ? p.rating : null,
    userRatingCount: typeof p.userRatingCount === "number" ? p.userRatingCount : null,
    googleMapsUri: p.googleMapsUri?.trim() ?? null,
    types: Array.isArray(p.types) ? p.types : [],
  };
}

async function postPlacesSearchText(
  apiKey: string,
  body: Record<string, unknown>,
): Promise<{ ok: true; data: GoogleSearchTextResponse } | { ok: false; error: string; status: number }> {
  const res = await fetch(SEARCH_TEXT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": FIELD_MASK,
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let data: GoogleSearchTextResponse;
  try {
    data = JSON.parse(text) as GoogleSearchTextResponse;
  } catch {
    return {
      ok: false,
      status: res.status >= 400 && res.status < 600 ? res.status : 502,
      error: `Google Places returned non-JSON (HTTP ${res.status}): ${text.slice(0, 280)}`,
    };
  }

  if (!res.ok) {
    const msg =
      data.error?.message ??
      data.error?.status ??
      `Google Places request failed (${res.status})`;
    const status =
      typeof res.status === "number" && res.status >= 400 && res.status < 600 ? res.status : 502;
    return { ok: false, error: msg, status };
  }

  return { ok: true, data };
}

export type SearchPlacesByCityResult =
  | { ok: true; places: PlaceSearchHit[]; googleResultCount?: number }
  | { ok: false; error: string; status: number };

export type QuietSpotFilterOptions = {
  maxRatingExclusive: number;
  maxReviewsExclusive: number;
};

export function placeMatchesQuietSpotFilter(
  place: PlaceSearchHit,
  opts: QuietSpotFilterOptions = {
    maxRatingExclusive: QUIET_SPOT_MAX_RATING_EXCLUSIVE,
    maxReviewsExclusive: QUIET_SPOT_MAX_REVIEWS_EXCLUSIVE,
  },
): boolean {
  if (place.rating == null || place.rating <= 0) return false;
  if (place.rating >= opts.maxRatingExclusive) return false;
  const reviews = place.userRatingCount ?? 0;
  return reviews < opts.maxReviewsExclusive;
}

/** Google Text Search `regionCode` is a CLDR *country* code (e.g. `us`). US state goes in the text query, not here. */
const DEFAULT_COUNTRY_REGION_CODE = "us";

/**
 * Search for businesses. Builds `textQuery` from `businessTypes` and location:
 * - city + state: "{types} in {city}, {state}"
 * - city only: "{types} in {city}"
 * - state only (wider): "{types} in {state}"
 * At least one of `city` or `state` is required. Always uses `regionCode: "us"`.
 */
export async function searchPlacesByCityText(params: {
  /** Town or city; optional if `state` is set (statewide search). */
  city?: string;
  /** US state name or abbreviation; optional if `city` is set. Use alone for statewide-style search. */
  state?: string;
  businessTypes: string;
  includedType?: string;
  maxResultCount?: number;
  strictTypeFiltering?: boolean;
  /** When true, results are filtered after the Google response (not a Places API server filter). */
  quietSpotsOnly?: boolean;
  quietMaxRatingExclusive?: number;
  quietMaxReviewsExclusive?: number;
}): Promise<SearchPlacesByCityResult> {
  const apiKey = getGooglePlacesApiKey();
  if (!apiKey) {
    return {
      ok: false,
      status: 503,
      error:
        "Missing Google Places API key. Set GOOGLE_PLACES_API_KEY, google_place_api, or GOOGLE_MAPS_API_KEY in .env next to package.json, then restart the dev server.",
    };
  }
  if (looksLikeGoogleOAuthClientSecret(apiKey)) {
    return {
      ok: false,
      status: 503,
      error:
        "google_place_api (or your Places env var) contains a Google OAuth client secret (GOCSPX-…). Places Text Search needs a Maps Platform API key (usually AIza…). In Google Cloud Console: APIs & Services → Credentials → Create credentials → API key, enable “Places API (New)”, restrict the key, put that value in GOOGLE_PLACES_API_KEY or google_place_api. Your google_place_api_clientId is only for Sign in with Google, not for Places requests.",
    };
  }

  const city = params.city?.trim() ?? "";
  const state = params.state?.trim() ?? "";
  const businessTypes = params.businessTypes.trim() || "salons";
  if (!city && !state) {
    return {
      ok: false,
      error: "Provide at least a city or a state (or both). For a wider search, enter only the state.",
      status: 400,
    };
  }

  let locationLine: string;
  if (city && state) {
    locationLine = `${city}, ${state}`;
  } else if (city) {
    locationLine = city;
  } else {
    locationLine = state;
  }
  const textQuery = `${businessTypes} in ${locationLine}`.replace(/\s+/g, " ");

  const pageSize = Math.min(Math.max(params.maxResultCount ?? 20, 1), 20);

  const baseBody: Record<string, unknown> = {
    textQuery,
    languageCode: "en",
    pageSize,
  };

  const included = params.includedType?.trim();
  if (included) {
    baseBody.includedType = included;
    if (params.strictTypeFiltering) {
      baseBody.strictTypeFiltering = true;
    }
  }

  baseBody.regionCode = DEFAULT_COUNTRY_REGION_CODE;

  try {
    const maxPages = params.quietSpotsOnly ? QUIET_SPOTS_SEARCH_MAX_PAGES : 1;
    const merged: GooglePlaceRaw[] = [];
    const seen = new Set<string>();
    let pageToken: string | undefined;

    for (let page = 0; page < maxPages; page++) {
      const pageBody: Record<string, unknown> = { ...baseBody };
      if (pageToken) {
        pageBody.pageToken = pageToken;
      }

      const pr = await postPlacesSearchText(apiKey, pageBody);
      if (!pr.ok) {
        return pr;
      }

      for (const pl of pr.data.places ?? []) {
        const id = pl.id?.trim();
        if (id && !seen.has(id)) {
          seen.add(id);
          merged.push(pl);
        }
      }

      const next = pr.data.nextPageToken?.trim();
      if (!next) {
        break;
      }
      pageToken = next;
    }

    let places = merged.map(mapPlace).filter((p) => p.id);

    let googleResultCount: number | undefined;
    if (params.quietSpotsOnly) {
      const filterOpts: QuietSpotFilterOptions = {
        maxRatingExclusive:
          typeof params.quietMaxRatingExclusive === "number" &&
          Number.isFinite(params.quietMaxRatingExclusive) &&
          params.quietMaxRatingExclusive > 0 &&
          params.quietMaxRatingExclusive <= 5
            ? params.quietMaxRatingExclusive
            : QUIET_SPOT_MAX_RATING_EXCLUSIVE,
        maxReviewsExclusive:
          typeof params.quietMaxReviewsExclusive === "number" &&
          Number.isFinite(params.quietMaxReviewsExclusive) &&
          params.quietMaxReviewsExclusive > 0
            ? Math.floor(params.quietMaxReviewsExclusive)
            : QUIET_SPOT_MAX_REVIEWS_EXCLUSIVE,
      };
      googleResultCount = places.length;
      places = places.filter((p) => placeMatchesQuietSpotFilter(p, filterOpts));
    }

    return { ok: true, places, googleResultCount };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error calling Google Places.";
    return {
      ok: false,
      status: 502,
      error: `Request to Google Places failed: ${message}`,
    };
  }
}
