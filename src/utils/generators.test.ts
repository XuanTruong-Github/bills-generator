import { describe, it, expect } from 'vitest';
import { generateRandomReferenceCode, generateRandomTransactionId } from './generators';

describe('generators', () => {
  describe('generateRandomReferenceCode', () => {
    it('generates 16-character alphanumeric uppercase reference code', () => {
      const code = generateRandomReferenceCode();
      expect(code).toMatch(/^[A-Z0-9]{16}$/);
    });

    it('generates unique reference codes on successive calls', () => {
      const codes = new Set(Array.from({ length: 20 }, () => generateRandomReferenceCode()));
      expect(codes.size).toBe(20);
    });
  });

  describe('generateRandomTransactionId', () => {
    it('generates 11-digit numeric transaction id', () => {
      const id = generateRandomTransactionId();
      expect(id).toMatch(/^\d{11}$/);
    });

    it('generates unique transaction ids on successive calls', () => {
      const ids = new Set(Array.from({ length: 20 }, () => generateRandomTransactionId()));
      expect(ids.size).toBe(20);
    });
  });
});
