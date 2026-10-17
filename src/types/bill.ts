export interface BillData {
  amount: string;
  accountNumber: string;
  accountName: string;
  bankId: string;
  bankName: string;
  bankSubName: string;
  content: string;
  dateTime: string;
  referenceCode: string;
  transferFee: string;
  transferType: string;
  transactionId: string;
  saveTemplate: boolean;
}

export interface BankOption {
  id: string;
  name: string;
  subName: string;
  shortName?: string;
  defaultTransferType?: string;
  hasNapas?: boolean;
}

export const SAMPLE_BILL_DATA: BillData = {
  amount: '110,000',
  accountNumber: '16986889999',
  accountName: 'HKD CARNA SPORTS',
  bankId: 'tpbank',
  bankName: 'TPBANK',
  bankSubName: 'Ngân hàng Tiên phong',
  content: 'Thanh toan online ve SC31531',
  dateTime: '09:08 Thứ Sáu 16/10/2026',
  referenceCode: '6289BFTVGLCCKWSZ',
  transferFee: 'Miễn phí',
  transferType: 'Chuyển tiền nhanh',
  transactionId: '16559745403',
  saveTemplate: false,
};
