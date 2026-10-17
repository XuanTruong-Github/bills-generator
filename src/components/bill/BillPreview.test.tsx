import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BillPreview } from './BillPreview';
import { SAMPLE_BILL_DATA, BillData } from '../../types/bill';

describe('BillPreview', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders VCB header branding using logo.svg and circular Home button', () => {
    render(<BillPreview data={SAMPLE_BILL_DATA} />);
    expect(screen.getByAltText('VCB Digibank')).toBeInTheDocument();
    expect(screen.getByTestId('vcb-logo')).toHaveAttribute('src', '/logo.svg');
    expect(screen.getByRole('button', { name: /trang chủ/i })).toBeInTheDocument();
  });

  it('renders success status text and checkmark badge', () => {
    render(<BillPreview data={SAMPLE_BILL_DATA} />);
    expect(screen.getByText('Giao dịch thành công!')).toBeInTheDocument();
    expect(screen.getByTestId('checkmark-badge')).toBeInTheDocument();
  });

  it('renders transaction amount with 24px font-size, VND label and date time', () => {
    render(<BillPreview data={SAMPLE_BILL_DATA} />);
    const amountElement = screen.getByText('110,000');
    expect(amountElement).toBeInTheDocument();
    expect(amountElement).toHaveClass('text-2xl');
    expect(screen.getByText('VND')).toBeInTheDocument();
    expect(screen.getByText('09:08 Thứ Sáu 16/10/2026')).toBeInTheDocument();
  });

  it('renders all key transaction details from bill data', () => {
    render(<BillPreview data={SAMPLE_BILL_DATA} />);

    // Account number & Recipient name
    expect(screen.getByText('Tài khoản nhận')).toBeInTheDocument();
    expect(screen.getByText('16986889999')).toBeInTheDocument();
    expect(screen.getByText('Tên người nhận')).toBeInTheDocument();
    expect(screen.getByText('HKD CARNA SPORTS')).toBeInTheDocument();

    // Bank
    expect(screen.getByText('Ngân hàng nhận')).toBeInTheDocument();
    expect(screen.getByText('TPBANK')).toBeInTheDocument();
    expect(screen.getByText('Ngân hàng Tiên phong')).toBeInTheDocument();

    // Content
    expect(screen.getByText('Nội dung')).toBeInTheDocument();
    expect(screen.getByText('Thanh toan online ve SC31531')).toBeInTheDocument();

    // Reference code
    expect(screen.getByText('Mã tham chiếu')).toBeInTheDocument();
    expect(screen.getByText('6289BFTVGLCCKWSZ')).toBeInTheDocument();

    // Fee
    expect(screen.getByText('Phí chuyển tiền')).toBeInTheDocument();
    expect(screen.getByText('Miễn phí')).toBeInTheDocument();

    // Transfer type
    expect(screen.getByText('Hình thức chuyển')).toBeInTheDocument();
    expect(screen.getByText('Chuyển tiền nhanh')).toBeInTheDocument();

    // Transaction ID
    expect(screen.getByText('Mã giao dịch')).toBeInTheDocument();
    expect(screen.getByText('16559745403')).toBeInTheDocument();
  });

  it('renders NapasLogo when transfer is fast transfer to non-VCB bank', () => {
    render(<BillPreview data={SAMPLE_BILL_DATA} />);
    expect(screen.getByText('napas')).toBeInTheDocument();
    expect(screen.getByText('247')).toBeInTheDocument();
  });

  it('does NOT render NapasLogo when destination bank is Vietcombank', () => {
    const vcbBillData: BillData = {
      ...SAMPLE_BILL_DATA,
      bankId: 'vietcombank',
      bankName: 'VIETCOMBANK',
      bankSubName: 'Ngân hàng Ngoại thương Việt Nam',
      transferType: 'Chuyển tiền trong Vietcombank',
    };
    render(<BillPreview data={vcbBillData} />);
    expect(screen.queryByText('napas')).not.toBeInTheDocument();
    expect(screen.queryByText('247')).not.toBeInTheDocument();
  });

  it('renders toggle switch reflecting saveTemplate state', () => {
    const { rerender } = render(<BillPreview data={{ ...SAMPLE_BILL_DATA, saveTemplate: false }} />);
    const switchEl = screen.getByRole('switch', { name: /lưu mẫu/i });
    expect(switchEl).toHaveAttribute('aria-checked', 'false');

    rerender(<BillPreview data={{ ...SAMPLE_BILL_DATA, saveTemplate: true }} />);
    expect(screen.getByRole('switch', { name: /lưu mẫu/i })).toHaveAttribute('aria-checked', 'true');
  });

  it('copies reference code to clipboard when copy button is clicked', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(<BillPreview data={SAMPLE_BILL_DATA} />);
    const copyButton = screen.getByRole('button', { name: /sao chép mã tham chiếu/i });
    await act(async () => {
      fireEvent.click(copyButton);
    });

    expect(writeTextMock).toHaveBeenCalledWith('6289BFTVGLCCKWSZ');
  });

  it('passes forwarded ref to the outer DOM element for canvas capture', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<BillPreview ref={ref} data={SAMPLE_BILL_DATA} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute('data-testid', 'bill-preview-canvas');
  });

  it('does NOT render any phone status bar inside the bill canvas', () => {
    render(<BillPreview data={SAMPLE_BILL_DATA} />);
    expect(screen.queryByTestId('status-bar')).not.toBeInTheDocument();
    expect(screen.queryByText('9:41')).not.toBeInTheDocument();
    expect(screen.queryByText('100%')).not.toBeInTheDocument();
  });

  it('renders bill terminating at save template toggle switch matching bill.JPG', () => {
    render(<BillPreview data={SAMPLE_BILL_DATA} />);
    expect(screen.getByText('Lưu mẫu chuyển tiền')).toBeInTheDocument();
    expect(screen.getByRole('switch', { name: /lưu mẫu/i })).toBeInTheDocument();
  });
});
