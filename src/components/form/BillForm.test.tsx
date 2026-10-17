import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BillForm } from './BillForm';
import { QuickActions } from './QuickActions';
import { SAMPLE_BILL_DATA, BillData } from '../../types/bill';

describe('BillForm', () => {
  const initialData: BillData = { ...SAMPLE_BILL_DATA };

  it('renders all form input fields with initial values', () => {
    const handleChange = vi.fn();
    render(<BillForm data={initialData} onChange={handleChange} />);

    expect(screen.getByLabelText(/Số tiền/i)).toHaveValue('110,000');
    expect(screen.getByLabelText(/Tài khoản nhận/i)).toHaveValue('16986889999');
    expect(screen.getByLabelText(/Tên người nhận/i)).toHaveValue('HKD CARNA SPORTS');
    expect(screen.getByLabelText(/Ngân hàng nhận/i)).toHaveValue('tpbank');
    expect(screen.getByLabelText(/Nội dung giao dịch/i)).toHaveValue('Thanh toan online ve SC31531');
    expect(screen.getByLabelText(/Thời gian giao dịch/i)).toHaveValue('09:08 Thứ Sáu 16/10/2026');
    expect(screen.getByLabelText(/^Mã tham chiếu/i)).toHaveValue('6289BFTVGLCCKWSZ');
    expect(screen.getByLabelText(/^Mã giao dịch/i)).toHaveValue('16559745403');
    expect(screen.getByLabelText(/Phí chuyển tiền/i)).toHaveValue('Miễn phí');
    expect(screen.getByLabelText(/Lưu mẫu/i)).not.toBeChecked();
  });

  it('calls onChange with uppercase recipient name when typed', () => {
    const handleChange = vi.fn();
    render(<BillForm data={initialData} onChange={handleChange} />);

    const nameInput = screen.getByLabelText(/Tên người nhận/i);
    fireEvent.change(nameInput, { target: { value: 'nguyen van a' } });

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        accountName: 'NGUYEN VAN A',
      })
    );
  });

  it('formats amount automatically on input change with VND commas', () => {
    const handleChange = vi.fn();
    render(<BillForm data={initialData} onChange={handleChange} />);

    const amountInput = screen.getByLabelText(/Số tiền/i);
    fireEvent.change(amountInput, { target: { value: '2500000' } });

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: '2,500,000',
      })
    );
  });

  it('adds quick preset amount when chip button is clicked', () => {
    const handleChange = vi.fn();
    render(<BillForm data={{ ...initialData, amount: '100,000' }} onChange={handleChange} />);

    const chip50k = screen.getByRole('button', { name: /\+50\.000/i });
    fireEvent.click(chip50k);

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: '150,000',
      })
    );
  });

  it('updates account number when typed', () => {
    const handleChange = vi.fn();
    render(<BillForm data={initialData} onChange={handleChange} />);

    const accountInput = screen.getByLabelText(/Tài khoản nhận/i);
    fireEvent.change(accountInput, { target: { value: '9876543210' } });

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        accountNumber: '9876543210',
      })
    );
  });

  it('updates bank and sets corresponding bank details and transfer type when bank selection changes', () => {
    const handleChange = vi.fn();
    render(<BillForm data={initialData} onChange={handleChange} />);

    const bankSelect = screen.getByLabelText(/Ngân hàng nhận/i);

    // Switch to Vietcombank: should set transferType to 'Chuyển tiền trong Vietcombank'
    fireEvent.change(bankSelect, { target: { value: 'vietcombank' } });

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        bankId: 'vietcombank',
        bankName: 'VIETCOMBANK',
        bankSubName: 'Ngoại thương Việt Nam',
        transferType: 'Chuyển tiền trong Vietcombank',
      })
    );

    // Switch to VietinBank: should set transferType to 'Chuyển tiền nhanh'
    fireEvent.change(bankSelect, { target: { value: 'vietinbank' } });

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        bankId: 'vietinbank',
        bankName: 'VIETINBANK',
        bankSubName: 'Công thương Việt Nam',
        transferType: 'Chuyển tiền nhanh',
      })
    );
  });

  it('updates transfer content when typed', () => {
    const handleChange = vi.fn();
    render(<BillForm data={initialData} onChange={handleChange} />);

    const contentInput = screen.getByLabelText(/Nội dung giao dịch/i);
    fireEvent.change(contentInput, { target: { value: 'Chuyen tien mua hang' } });

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        content: 'Chuyen tien mua hang',
      })
    );
  });

  it('updates transfer fee and transfer type when typed', () => {
    const handleChange = vi.fn();
    render(<BillForm data={initialData} onChange={handleChange} />);

    const feeInput = screen.getByLabelText(/Phí chuyển tiền/i);
    fireEvent.change(feeInput, { target: { value: '3,300 VND' } });

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        transferFee: '3,300 VND',
      })
    );

    const typeInput = screen.getByLabelText(/Hình thức chuyển/i);
    fireEvent.change(typeInput, { target: { value: 'Chuyển tiền 24/7' } });

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        transferType: 'Chuyển tiền 24/7',
      })
    );
  });

  it('updates datetime when "Lấy giờ hiện tại" button is clicked', () => {
    const handleChange = vi.fn();
    render(<BillForm data={initialData} onChange={handleChange} />);

    const nowButton = screen.getByRole('button', { name: /Lấy giờ hiện tại/i });
    fireEvent.click(nowButton);

    expect(handleChange).toHaveBeenCalled();
    const updatedCall = handleChange.mock.calls[0][0];
    expect(updatedCall.dateTime).toMatch(/\d{2}:\d{2} (Chủ Nhật|Thứ \S+) \d{2}\/\d{2}\/\d{4}/);
  });

  it('generates new reference code (16 chars alphanumeric) when "Tạo mã mới" is clicked', () => {
    const handleChange = vi.fn();
    render(<BillForm data={initialData} onChange={handleChange} />);

    const genRefButton = screen.getByRole('button', { name: /Tạo mã tham chiếu mới/i });
    fireEvent.click(genRefButton);

    expect(handleChange).toHaveBeenCalled();
    const updatedCall = handleChange.mock.calls[0][0];
    expect(updatedCall.referenceCode).toMatch(/^[A-Z0-9]{16}$/);
  });

  it('generates new transaction ID (11 digits) when "Tạo mã mới" is clicked', () => {
    const handleChange = vi.fn();
    render(<BillForm data={initialData} onChange={handleChange} />);

    const genTxButton = screen.getByRole('button', { name: /Tạo mã giao dịch mới/i });
    fireEvent.click(genTxButton);

    expect(handleChange).toHaveBeenCalled();
    const updatedCall = handleChange.mock.calls[0][0];
    expect(updatedCall.transactionId).toMatch(/^[1-9][0-9]{10}$/);
  });

  it('toggles saveTemplate checkbox/switch when clicked', () => {
    const handleChange = vi.fn();
    render(<BillForm data={{ ...initialData, saveTemplate: false }} onChange={handleChange} />);

    const saveCheckbox = screen.getByLabelText(/Lưu mẫu/i);
    fireEvent.click(saveCheckbox);

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        saveTemplate: true,
      })
    );
  });
});

describe('QuickActions', () => {
  it('renders quick action buttons and handles callbacks', () => {
    const handleReset = vi.fn();
    const handleRandomize = vi.fn();

    render(
      <QuickActions
        onResetSample={handleReset}
        onRandomizeTimeAndCodes={handleRandomize}
      />
    );

    const resetButton = screen.getByRole('button', { name: /Điền mẫu bill gốc/i });
    const randomButton = screen.getByRole('button', { name: /Ngẫu nhiên mã & thời gian/i });

    expect(resetButton).toBeInTheDocument();
    expect(randomButton).toBeInTheDocument();

    fireEvent.click(resetButton);
    expect(handleReset).toHaveBeenCalledTimes(1);

    fireEvent.click(randomButton);
    expect(handleRandomize).toHaveBeenCalledTimes(1);
  });

  it('renders with custom className', () => {
    const { container } = render(
      <QuickActions
        onResetSample={() => {}}
        onRandomizeTimeAndCodes={() => {}}
        className="custom-quick-actions"
      />
    );
    expect(container.firstChild).toHaveClass('custom-quick-actions');
  });
});

describe('BillForm with embedded QuickActions', () => {
  it('renders embedded QuickActions when onResetSample and onRandomizeTimeAndCodes are passed', () => {
    const handleChange = vi.fn();
    const handleReset = vi.fn();
    const handleRandomize = vi.fn();

    render(
      <BillForm
        data={SAMPLE_BILL_DATA}
        onChange={handleChange}
        onResetSample={handleReset}
        onRandomizeTimeAndCodes={handleRandomize}
        className="custom-form-class"
      />
    );

    const form = screen.getByTestId('bill-form');
    expect(form).toHaveClass('custom-form-class');

    const resetButton = screen.getByRole('button', { name: /Điền mẫu bill gốc/i });
    const randomButton = screen.getByRole('button', { name: /Ngẫu nhiên mã & thời gian/i });

    expect(resetButton).toBeInTheDocument();
    expect(randomButton).toBeInTheDocument();

    fireEvent.click(resetButton);
    expect(handleReset).toHaveBeenCalledTimes(1);

    fireEvent.click(randomButton);
    expect(handleRandomize).toHaveBeenCalledTimes(1);
  });
});
