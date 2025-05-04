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
 */
export function getDateRangeForFilter(filterName: string | null): { start: Date; end: Date } | null {
  if (!filterName) return null;

  const now = new Date();

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
      // Only entries from the last 30 days, but not including entries from today
      const lastMonthStart = subMonths(now, 1);
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      return {
        start: startOfDay(lastMonthStart),
        end: endOfDay(yesterday)
      };

    case 'Last Year':
      // Only entries from the last 365 days, not including the last month
      const lastYearStart = subYears(now, 1);
      const lastMonthEnd = subMonths(now, 1);
      return {
        start: startOfDay(lastYearStart),
        end: endOfDay(lastMonthEnd)
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
