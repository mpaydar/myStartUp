import { getPrisma } from "@/lib/prisma";

export async function getBookedMeetingInstantsInRange(
  from: Date,
  to: Date,
): Promise<Date[]> {
  const rows = await getPrisma().contactRequest.findMany({
    where: {
      meetingAt: {
        gte: from,
        lte: to,
      },
    },
    select: {
      meetingAt: true,
    },
    orderBy: {
      meetingAt: "asc",
    },
  });

  return rows
    .map((row) => row.meetingAt)
    .filter((value): value is Date => value instanceof Date);
}

export async function isMeetingSlotBooked(meetingAt: Date): Promise<boolean> {
  const existing = await getPrisma().contactRequest.findFirst({
    where: { meetingAt },
    select: { id: true },
  });

  return Boolean(existing);
}
