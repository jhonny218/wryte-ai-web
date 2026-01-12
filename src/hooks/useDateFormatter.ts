/**
 * Utility functions to format dates consistently across the app, avoiding timezone shifts.
 * 
 * The database stores dates as UTC timestamps (e.g., "2026-01-20 00:00:00").
 * These functions ensure dates are displayed and edited without timezone conversion issues.
 */

/**
 * Format a date string from the database for display.
 * @param dateString - Date from database (e.g., "2026-01-20 00:00:00" or ISO)
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export const formatDate = (
  dateString: string | null | undefined,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
): string => {
  if (!dateString) return '-';

  try {
    // Normalize to ISO format with UTC timezone
    const raw = String(dateString).trim();
    const asIso = raw.includes('T') 
      ? raw.replace(' ', 'T') 
      : raw.replace(' ', 'T');
    const withZ = asIso.endsWith('Z') ? asIso : asIso + 'Z';
    
    const date = new Date(withZ);
    
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string:', dateString);
      return '-';
    }

    // Force UTC interpretation to match database
    return date.toLocaleDateString('en-US', {
      ...options,
      timeZone: 'UTC',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '-';
  }
};

/**
 * Convert a database date string to YYYY-MM-DD format for HTML date inputs.
 * @param dateString - Date from database (e.g., "2026-01-20 00:00:00" or ISO)
 * @returns Date in YYYY-MM-DD format
 */
export const toInputDate = (dateString: string | null | undefined): string => {
  if (!dateString) return '';

  try {
    // Normalize to ISO format with UTC timezone
    const raw = String(dateString).trim();
    const asIso = raw.includes('T') 
      ? raw.replace(' ', 'T') 
      : raw.replace(' ', 'T');
    const withZ = asIso.endsWith('Z') ? asIso : asIso + 'Z';
    
    const date = new Date(withZ);
    
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string:', dateString);
      return '';
    }

    // Extract YYYY-MM-DD from UTC ISO string
    return date.toISOString().slice(0, 10);
  } catch (error) {
    console.error('Error converting to input date:', error);
    return '';
  }
};

/**
 * Convert a YYYY-MM-DD input value to database format.
 * @param inputDate - Date string from HTML date input (YYYY-MM-DD)
 * @returns Date string suitable for database storage
 */
export const fromInputDate = (inputDate: string): string => {
  if (!inputDate) return '';
  
  // Input dates are already in YYYY-MM-DD format
  // Return as-is or convert to your preferred database format
  return inputDate;
};

/**
 * Hook version that returns the date formatting utilities.
 * Use this in React components.
 */
export function useDateFormatter() {
  return {
    formatDate,
    toInputDate,
    fromInputDate,
  };
}
