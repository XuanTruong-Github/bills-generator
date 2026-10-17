const VIETNAMESE_DAYS = [
  'Chủ Nhật',
  'Thứ Hai',
  'Thứ Ba',
  'Thứ Tư',
  'Thứ Năm',
  'Thứ Sáu',
  'Thứ Bảy',
];

/**
 * Formats a number or string into Vietnamese Dong standard currency string (e.g., '110,000').
 * Strips non-digit characters, removes redundant leading zeroes, and handles invalid inputs gracefully.
 */
export function formatVND(value: string | number): string {
  if (value === null || value === undefined) {
    return '0';
  }

  const str = String(value);
  const digitsOnly = str.replace(/\D/g, '');

  if (!digitsOnly) {
    return '0';
  }

  // Remove leading zeroes, leaving at least a single "0" if all were zeroes
  const trimmed = digitsOnly.replace(/^0+/, '') || '0';

  // Format with thousand separator commas
  return trimmed.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Formats a Date object into Vietnamese banking standard datetime string
 * e.g., '09:08 Thứ Sáu 16/10/2026' or '14:30 Chủ Nhật 18/10/2026'
 */
export function formatCurrentDateTime(date: Date = new Date()): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const dayOfWeek = VIETNAMESE_DAYS[date.getDay()];
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${hours}:${minutes} ${dayOfWeek} ${day}/${month}/${year}`;
}
