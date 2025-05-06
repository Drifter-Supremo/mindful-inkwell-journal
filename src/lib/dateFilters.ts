// src/lib/dateFilters.ts
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  subMonths,
  subYears,
  isToday,
  isWithinInterval,
  parseISO
} from 'date-fns';

/**
 * Get date range for a specific filter
 * @param filterName - The name of the filter (Today, This Week, Last Month, Last Year)
 * @returns Object with start and end dates, or null if no filter is applied
 *
 * Today: Entries from the current day
 * This Week: Entries from the current week (Monday to Sunday)
 * Last Month: Entries from the previous calendar month
 * Last Year: Entries from the previous calendar year
 */
export function getDateRangeForFilter(filterName: string | null): { start: Date; end: Date } | null {
  if (!filterName) return null;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  switch (filterName) {
    case 'Today':
      return {
        start: startOfDay(now),
        end: endOfDay(now)
      };

    case 'This Week':
      return {
        start: startOfWeek(now, { weekStartsOn: 1 }), // Week starts on Monday
        end: endOfWeek(now, { weekStartsOn: 1 })
      };

    case 'Last Month':
      // Entries from the previous calendar month

      // If current month is January (0), go to previous year's December
      const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const previousMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

      // First day of previous month
      const firstDayOfPreviousMonth = new Date(previousMonthYear, previousMonth, 1);

      // Last day of previous month (first day of current month minus 1 day)
      const lastDayOfPreviousMonth = new Date(currentYear, currentMonth, 0);

      return {
        start: startOfDay(firstDayOfPreviousMonth),
        end: endOfDay(lastDayOfPreviousMonth)
      };

    case 'Last Year':
      // Entries from the previous calendar year
      const previousYear = currentYear - 1;
      const firstDayOfPreviousYear = new Date(previousYear, 0, 1); // January 1st
      const lastDayOfPreviousYear = new Date(previousYear, 11, 31); // December 31st

      return {
        start: startOfDay(firstDayOfPreviousYear),
        end: endOfDay(lastDayOfPreviousYear)
      };

    default:
      return null;
  }
}

/**
 * Check if a date is within a specified range
 * @param dateString - ISO date string to check
 * @param range - Date range object with start and end dates
 * @returns Boolean indicating if the date is within the range
 */
export function isDateInRange(dateString: string, range: { start: Date; end: Date }): boolean {
  try {
    const date = parseISO(dateString);

    // Special case for Today filter
    if (isToday(range.start) && isToday(range.end)) {
      return isToday(date);
    }

    // For other filters
    return isWithinInterval(date, {
      start: range.start,
      end: range.end
    });
  } catch (error) {
    console.error("Error parsing date:", error);
    return false;
  }
}
