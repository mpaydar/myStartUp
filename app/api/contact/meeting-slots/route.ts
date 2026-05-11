import { NextResponse } from "next/server";

import { getBookedMeetingInstantsInRange } from "@/lib/bookedMeetingSlots";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "Meeting availability is not configured yet." },
      { status: 503 },
    );
  }

  const { searchParams } = new URL(request.url);
  const fromRaw = searchParams.get("from")?.trim();
  const toRaw = searchParams.get("to")?.trim();

  if (!fromRaw || !toRaw) {
    return NextResponse.json(
      { error: "A date range is required to load meeting availability." },
      { status: 400 },
    );
  }

  const from = new Date(fromRaw);
  const to = new Date(toRaw);

  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || from > to) {
    return NextResponse.json(
      { error: "Invalid date range for meeting availability." },
      { status: 400 },
    );
  }

  try {
    const meetingAt = await getBookedMeetingInstantsInRange(from, to);
    return NextResponse.json({
      meetingAt: meetingAt.map((value) => value.toISOString()),
    });
  } catch (err) {
    console.error("Meeting availability lookup failed:", err);
    return NextResponse.json(
      { error: "Could not load meeting availability." },
      { status: 500 },
    );
  }
}
