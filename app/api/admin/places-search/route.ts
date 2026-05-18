import { NextResponse } from "next/server";

import { searchPlacesByCityText } from "@/lib/googlePlaces";

export const runtime = "nodejs";

/**
 * Optional `quiet=1`: keep only places with rating strictly below `quietMaxRating` (default 4) and review count strictly below `quietMaxReviews` (default 50).
 * Provide **`city` and/or `state`** (at least one). State alone runs a wider statewide-style text search. `regionCode` is always `us`.
 * Protected by admin session (middleware).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city")?.trim() ?? "";
  const state = searchParams.get("state")?.trim() ?? "";
  const businessTypes =
    searchParams.get("businessTypes")?.trim() ?? "hair salons beauty salons";
  const includedType = searchParams.get("includedType")?.trim() || undefined;
  const strictTypeFiltering = searchParams.get("strictTypeFiltering") === "1";
  const maxRaw = searchParams.get("maxResultCount");
  const maxResultCount = maxRaw ? Number.parseInt(maxRaw, 10) : undefined;

  const quietSpotsOnly = searchParams.get("quiet") === "1";
  const quietMaxRatingRaw = searchParams.get("quietMaxRating");
  const quietMaxReviewsRaw = searchParams.get("quietMaxReviews");
  const quietMaxRatingExclusive = quietMaxRatingRaw ? Number.parseFloat(quietMaxRatingRaw) : undefined;
  const quietMaxReviewsExclusive = quietMaxReviewsRaw ? Number.parseInt(quietMaxReviewsRaw, 10) : undefined;

  if (!city && !state) {
    return NextResponse.json(
      { error: "Provide at least `city` or `state` (query params). For a statewide search, set `state` only." },
      { status: 400 },
    );
  }

  const result = await searchPlacesByCityText({
    city: city || undefined,
    state: state || undefined,
    businessTypes,
    includedType,
    maxResultCount: Number.isFinite(maxResultCount) ? maxResultCount : undefined,
    strictTypeFiltering,
    quietSpotsOnly,
    quietMaxRatingExclusive: Number.isFinite(quietMaxRatingExclusive)
      ? quietMaxRatingExclusive
      : undefined,
    quietMaxReviewsExclusive: Number.isFinite(quietMaxReviewsExclusive)
      ? quietMaxReviewsExclusive
      : undefined,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({
    places: result.places,
    ...(result.googleResultCount != null ? { googleResultCount: result.googleResultCount } : {}),
  });
}
