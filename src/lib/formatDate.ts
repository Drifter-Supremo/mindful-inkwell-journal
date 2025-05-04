// src/lib/formatDate.ts

import { formatDistanceToNow, format, isAfter, subDays } from 'date-fns';

/**
 * Format a date based on how old it is:
 * - If less than 24 hours old: "X minutes/hours ago"
 * - If older than 24 hours: "MM/DD/YYYY"
 * 
 * @param dateString - ISO date string to format
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const yesterday = subDays(new Date(), 1);
  
  // If the date is more recent than yesterday, use relative time
  if (isAfter(date, yesterday)) {
    return formatDistanceToNow(date, { addSuffix: true });
  }
  
  // Otherwise, use a simple date format
  return format(date, 'MM/dd/yyyy');
}
