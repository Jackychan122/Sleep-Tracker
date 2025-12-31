import { format, formatDistanceToNow, parseISO, isValid } from "date-fns";

/**
 * Format a date to a readable string
 */
export function formatDate(date: string | Date, formatStr: string = "MMM dd, yyyy"): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(dateObj)) return "";
  return format(dateObj, formatStr);
}

/**
 * Format a date to a short string
 */
export function formatShortDate(date: string | Date): string {
  return formatDate(date, "MM/dd/yyyy");
}

/**
 * Format a date to include time
 */
export function formatDateTime(date: string | Date): string {
  return formatDate(date, "MMM dd, yyyy HH:mm");
}

/**
 * Format time only
 */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(":");
  const date = new Date();
  date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);
  return format(date, "h:mm a");
}

/**
 * Get relative time string (e.g., "2 days ago")
 */
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(dateObj)) return "";
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

/**
 * Get today's date in ISO format
 */
export function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Get date range (start and end of week/month)
 */
export function getDateRange(
  type: "week" | "month",
  date: Date = new Date()
): { start: string; end: string } {
  const start = new Date(date);
  const end = new Date(date);

  if (type === "week") {
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    end.setDate(diff + 6);
  } else {
    start.setDate(1);
    end.setMonth(end.getMonth() + 1);
    end.setDate(0);
  }

  return {
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0],
  };
}

/**
 * Calculate duration between two times in minutes
 */
export function calculateDuration(startTime: string, endTime: string): number {
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);

  const startDate = new Date();
  startDate.setHours(startHours, startMinutes, 0);

  const endDate = new Date();
  endDate.setHours(endHours, endMinutes, 0);

  // Handle overnight sleep
  if (endDate < startDate) {
    endDate.setDate(endDate.getDate() + 1);
  }

  return Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60));
}
