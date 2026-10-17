import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import * as exportImageModule from './utils/exportImage';

vi.mock('./utils/exportImage', () => ({
  downloadBillImage: vi.fn(),
  copyBillImageToClipboard: vi.fn(),
}));

describe('App Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(exportImageModule.downloadBillImage).mockResolvedValue(true);
    vi.mocked(exportImageModule.copyBillImageToClipboard).mockResolvedValue(true);
  });

  it('renders header with branding, title, and action buttons', () => {
    render(<App />);
    expect(screen.getAllByAltText(/VCB Digibank/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('button', { name: /Tải ảnh Bill/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sao chép ảnh/i })).toBeInTheDocument();
  });

  it('renders split layout with form and iPhone preview frame', () => {
    render(<App />);
    expect(screen.getByTestId('bill-form')).toBeInTheDocument();
    expect(screen.getByTestId('iphone-frame')).toBeInTheDocument();
    expect(screen.getByTestId('bill-preview-canvas')).toBeInTheDocument();
  });

  it('synchronizes form changes to preview in real-time', () => {
    render(<App />);
    // Check initial sample data rendered in preview
    expect(screen.getByText('HKD CARNA SPORTS')).toBeInTheDocument();

    const nameInput = screen.getByLabelText(/Tên người nhận/i);
    fireEvent.change(nameInput, { target: { value: 'NGUYEN VAN B' } });

    expect(screen.getByText('NGUYEN VAN B')).toBeInTheDocument();
  });

  it('resets to sample data when reset button is clicked', () => {
    render(<App />);
    const nameInput = screen.getByLabelText(/Tên người nhận/i);
    fireEvent.change(nameInput, { target: { value: 'NGUYEN VAN TEST' } });
    expect(screen.getByText('NGUYEN VAN TEST')).toBeInTheDocument();

    const resetButtons = screen.getAllByRole('button', { name: /Điền mẫu bill gốc/i });
    fireEvent.click(resetButtons[0]);

    expect(screen.getByText('HKD CARNA SPORTS')).toBeInTheDocument();
  });

  it('randomizes codes and time when randomize button is clicked', () => {
    render(<App />);
    const randomizeButtons = screen.getAllByRole('button', { name: /Ngẫu nhiên mã/i });
    fireEvent.click(randomizeButtons[0]);

    // Check that reference code is changed or input updated
    const refCodeInput = screen.getByLabelText(/Mã tham chiếu \(16 ký tự\)/i) as HTMLInputElement;
    expect(refCodeInput.value).not.toBe('6289BFTVGLCCKWSZ');
    expect(refCodeInput.value.length).toBe(16);
  });

  it('triggers downloadBillImage with the canvas ref when download button is clicked', async () => {
    render(<App />);
    const downloadBtn = screen.getByRole('button', { name: /Tải ảnh Bill/i });
    fireEvent.click(downloadBtn);

    await waitFor(() => {
      expect(exportImageModule.downloadBillImage).toHaveBeenCalledTimes(1);
    });

    const calledNode = vi.mocked(exportImageModule.downloadBillImage).mock.calls[0][0];
    expect(calledNode).toBe(screen.getByTestId('bill-preview-canvas'));
  });

  it('triggers copyBillImageToClipboard when copy button is clicked', async () => {
    render(<App />);
    const copyBtn = screen.getByRole('button', { name: /Sao chép ảnh/i });
    fireEvent.click(copyBtn);

    await waitFor(() => {
      expect(exportImageModule.copyBillImageToClipboard).toHaveBeenCalledTimes(1);
    });

    const calledNode = vi.mocked(exportImageModule.copyBillImageToClipboard).mock.calls[0][0];
    expect(calledNode).toBe(screen.getByTestId('bill-preview-canvas'));
  });

  it('renders floating download action button near preview', async () => {
    render(<App />);
    const floatingBtn = screen.getByTestId('floating-download-btn');
    expect(floatingBtn).toBeInTheDocument();
    fireEvent.click(floatingBtn);

    await waitFor(() => {
      expect(exportImageModule.downloadBillImage).toHaveBeenCalledTimes(1);
    });
  });

  it('supports responsive mobile tab switching', () => {
    render(<App />);
    const formTab = screen.getByTestId('tab-form');
    const previewTab = screen.getByTestId('tab-preview');

    expect(formTab).toBeInTheDocument();
    expect(previewTab).toBeInTheDocument();

    fireEvent.click(previewTab);
    expect(previewTab).toHaveAttribute('data-active', 'true');

    fireEvent.click(formTab);
    expect(formTab).toHaveAttribute('data-active', 'true');
  });

  it('shows toast or status indicator on export feedback', async () => {
    render(<App />);
    const downloadBtn = screen.getByRole('button', { name: /Tải ảnh Bill/i });
    fireEvent.click(downloadBtn);

    await waitFor(() => {
      expect(screen.getByTestId('export-status-toast')).toBeInTheDocument();
    });
  });
});
