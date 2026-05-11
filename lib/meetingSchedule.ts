export const MEETING_BLOCK_MINUTES = 30;
export const MEETING_START_TIME = "08:00";
export const MEETING_LAST_START_TIME = "19:30";
export const MEETING_TIME_STEP_SECONDS = MEETING_BLOCK_MINUTES * 60;

export const MEETING_SCHEDULE_ERROR =
  "Choose a 30-minute start time between 8:00 AM and 7:30 PM in your local timezone.";

const MEETING_TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

function parseMeetingTimeParts(
  time: string,
): { hours: number; minutes: number } | null {
  const match = MEETING_TIME_PATTERN.exec(time.trim());
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) return null;

  return { hours, minutes };
}

export function isAllowedMeetingTime(time: string): boolean {
  const parts = parseMeetingTimeParts(time);
  if (!parts) return false;

  if (parts.minutes % MEETING_BLOCK_MINUTES !== 0) return false;

  const startMinutes = parts.hours * 60 + parts.minutes;
  const earliestStart = 8 * 60;
  const latestStart = 20 * 60 - MEETING_BLOCK_MINUTES;

  return startMinutes >= earliestStart && startMinutes <= latestStart;
}

export function parseLocalMeetingDateTime(
  date: string,
  time: string,
): Date | null {
  const dt = new Date(`${date.trim()}T${time.trim()}`);
  if (Number.isNaN(dt.getTime())) return null;
  return dt;
}

export type MeetingStartTimeOption = {
  value: string;
  label: string;
};

function formatMeetingTimeLabel(hours: number, minutes: number): string {
  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${String(minutes).padStart(2, "0")} ${period}`;
}

export function getLocalDayRange(date: string): { from: Date; to: Date } {
  return {
    from: new Date(`${date}T00:00:00`),
    to: new Date(`${date}T23:59:59.999`),
  };
}

export function isMeetingOnLocalDate(meetingAt: Date, date: string): boolean {
  const [year, month, day] = date.split("-").map(Number);
  if (!year || !month || !day) return false;

  return (
    meetingAt.getFullYear() === year &&
    meetingAt.getMonth() + 1 === month &&
    meetingAt.getDate() === day
  );
}

export function getLocalMeetingTimeValue(meetingAt: Date): string {
  const hours = meetingAt.getHours();
  const minutes = meetingAt.getMinutes();
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function getBookedMeetingTimeValuesForDate(
  date: string,
  meetingInstants: Date[],
): string[] {
  const booked = new Set<string>();

  for (const meetingAt of meetingInstants) {
    if (!isMeetingOnLocalDate(meetingAt, date)) continue;
    booked.add(getLocalMeetingTimeValue(meetingAt));
  }

  return [...booked];
}

export function isMeetingSlotInPast(date: string, time: string): boolean {
  const meetingAt = parseLocalMeetingDateTime(date, time);
  if (!meetingAt) return true;
  return meetingAt.getTime() < Date.now() - 60_000;
}

export function getMeetingStartTimeOptions(): MeetingStartTimeOption[] {
  const options: MeetingStartTimeOption[] = [];
  const earliestStart = 8 * 60;
  const latestStart = 20 * 60 - MEETING_BLOCK_MINUTES;

  for (let startMinutes = earliestStart; startMinutes <= latestStart; startMinutes += MEETING_BLOCK_MINUTES) {
    const hours = Math.floor(startMinutes / 60);
    const minutes = startMinutes % 60;
    const value = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    options.push({
      value,
      label: formatMeetingTimeLabel(hours, minutes),
    });
  }

  return options;
}
