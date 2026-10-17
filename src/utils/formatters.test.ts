import { describe, it, expect } from 'vitest';
import { formatVND, formatCurrentDateTime } from './formatters';

describe('formatVND', () => {
  it('formats number string with commas', () => {
    expect(formatVND('110000')).toBe('110,000');
    expect(formatVND(5000000)).toBe('5,000,000');
    expect(formatVND('abc')).toBe('0');
  });

  it('handles strings already containing commas or currency characters', () => {
    expect(formatVND('110,000')).toBe('110,000');
    expect(formatVND('5,000,000 VND')).toBe('5,000,000');
  });

  it('handles empty input or invalid values safely without returning NaN', () => {
    expect(formatVND('')).toBe('0');
    expect(formatVND('   ')).toBe('0');
    expect(formatVND('NaN')).toBe('0');
  });

  it('formats large numbers without precision loss', () => {
    expect(formatVND('1000000000000')).toBe('1,000,000,000,000');
  });

  it('handles leading zeroes correctly', () => {
    expect(formatVND('0')).toBe('0');
    expect(formatVND('000')).toBe('0');
    expect(formatVND('00123000')).toBe('123,000');
  });
});

describe('formatCurrentDateTime', () => {
  it('formats specified datetime in Vietnamese standard format', () => {
    const formatted = formatCurrentDateTime(new Date('2026-10-16T09:08:00'));
    expect(formatted).toBe('09:08 Thứ Sáu 16/10/2026');
  });

  it('handles Sunday as Chủ Nhật without Thứ prefix', () => {
    // 2026-10-18 is Sunday
    const formatted = formatCurrentDateTime(new Date('2026-10-18T14:30:00'));
    expect(formatted).toBe('14:30 Chủ Nhật 18/10/2026');
  });

  it('pads single-digit hours, minutes, days, and months with zero', () => {
    // 2026-05-04 is Monday (Thứ Hai)
    const formatted = formatCurrentDateTime(new Date('2026-05-04T08:05:00'));
    expect(formatted).toBe('08:05 Thứ Hai 04/05/2026');
  });

  it('defaults to current date when no argument is passed', () => {
    const formatted = formatCurrentDateTime();
    expect(formatted).toMatch(/^\d{2}:\d{2} (Thứ (Hai|Ba|Tư|Năm|Sáu|Bảy)|Chủ Nhật) \d{2}\/\d{2}\/\d{4}$/);
  });
});
