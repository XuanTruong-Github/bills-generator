import { describe, it, expect } from 'vitest';
import { SAMPLE_BILL_DATA } from './bill';

describe('SAMPLE_BILL_DATA', () => {
  it('contains all required fields matching bill.JPG', () => {
    expect(SAMPLE_BILL_DATA.amount).toBe('110,000');
    expect(SAMPLE_BILL_DATA.accountNumber).toBe('16986889999');
    expect(SAMPLE_BILL_DATA.accountName).toBe('HKD CARNA SPORTS');
    expect(SAMPLE_BILL_DATA.bankId).toBe('tpbank');
    expect(SAMPLE_BILL_DATA.bankName).toBe('TPBANK');
    expect(SAMPLE_BILL_DATA.bankSubName).toBe('Ngân hàng Tiên phong');
    expect(SAMPLE_BILL_DATA.content).toBe('Thanh toan online ve SC31531');
    expect(SAMPLE_BILL_DATA.dateTime).toBe('09:08 Thứ Sáu 16/10/2026');
    expect(SAMPLE_BILL_DATA.referenceCode).toBe('6289BFTVGLCCKWSZ');
    expect(SAMPLE_BILL_DATA.transferFee).toBe('Miễn phí');
    expect(SAMPLE_BILL_DATA.transferType).toBe('Chuyển tiền nhanh');
    expect(SAMPLE_BILL_DATA.transactionId).toBe('16559745403');
    expect(SAMPLE_BILL_DATA.saveTemplate).toBe(false);
  });
});
