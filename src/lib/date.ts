/**
 * Calendar-date helpers for expiration handling.
 *
 * Dates coming from `<input type="date">` + `z.coerce.date` are UTC midnight of
 * the chosen calendar day, so every comparison here normalizes both sides to
 * "calendar date at UTC midnight". "Today" is derived from the wall-clock date
 * in the pharmacy's zone, not the server's (Vercel runs UTC).
 */

/** The pharmacy operates in Venezuela. */
export const BUSINESS_TIME_ZONE = "America/Caracas";

/** Batches/products expiring within this many days are flagged "Por vencer". */
export const EXPIRY_WARNING_DAYS = 90;

const MS_PER_DAY = 86_400_000;

/** Today's calendar date in the business time zone as "YYYY-MM-DD". */
export function todayDateInputValue(): string {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: BUSINESS_TIME_ZONE,
  }).format(new Date());
}

/** Today's calendar date normalized to UTC midnight (comparable to stored dates). */
export function todayCalendarDate(): Date {
  return new Date(`${todayDateInputValue()}T00:00:00.000Z`);
}

/** True when the date (a UTC-midnight calendar date) is strictly before today. */
export function isExpired(date: Date | null | undefined): boolean {
  return date != null && date.getTime() < todayCalendarDate().getTime();
}

/** True when the date is not expired but falls within `days` days of today. */
export function isNearExpiry(
  date: Date | null | undefined,
  days: number = EXPIRY_WARNING_DAYS,
): boolean {
  if (date == null || isExpired(date)) return false;
  return date.getTime() - todayCalendarDate().getTime() <= days * MS_PER_DAY;
}

/** "YYYY-MM-DD" for `<input type="date">` values, reading UTC fields. */
export function toDateInputValue(date: Date | null | undefined): string {
  return date ? date.toISOString().slice(0, 10) : "";
}

/**
 * Spanish display of a calendar date. `timeZone: "UTC"` is required: the value
 * is UTC midnight, so local formatting in Venezuela (UTC-4) would show the
 * previous day.
 */
export function formatCalendarDateEs(date: Date | string): string {
  return new Date(date).toLocaleDateString("es-VE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Spanish display of a real timestamp, rendered in the business time zone. */
export function formatDateTimeEs(date: Date | string): string {
  return new Date(date).toLocaleString("es-VE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: BUSINESS_TIME_ZONE,
  });
}
