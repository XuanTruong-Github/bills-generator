import { BankOption } from '../types/bill';

export const BANKS_CATALOG: BankOption[] = [
  {
    id: 'tpbank',
    name: 'TPBANK',
    subName: 'Ngân hàng Tiên phong',
    shortName: 'TPBank',
    defaultTransferType: 'Chuyển tiền nhanh',
    hasNapas: true,
  },
  {
    id: 'vietcombank',
    name: 'VIETCOMBANK',
    subName: 'Ngoại thương Việt Nam',
    shortName: 'Vietcombank',
    defaultTransferType: 'Chuyển tiền trong VCB',
    hasNapas: false,
  },
  {
    id: 'vietinbank',
    name: 'VIETINBANK',
    subName: 'Công thương Việt Nam',
    shortName: 'VietinBank',
    defaultTransferType: 'Chuyển tiền nhanh',
    hasNapas: true,
  },
  {
    id: 'bidv',
    name: 'BIDV',
    subName: 'Đầu tư và Phát triển Việt Nam',
    shortName: 'BIDV',
    defaultTransferType: 'Chuyển tiền nhanh',
    hasNapas: true,
  },
  {
    id: 'techcombank',
    name: 'TECHCOMBANK',
    subName: 'Kỹ thương Việt Nam',
    shortName: 'Techcombank',
    defaultTransferType: 'Chuyển tiền nhanh',
    hasNapas: true,
  },
  {
    id: 'mbbank',
    name: 'MBBANK',
    subName: 'Quân đội',
    shortName: 'MBBank',
    defaultTransferType: 'Chuyển tiền nhanh',
    hasNapas: true,
  },
  {
    id: 'acb',
    name: 'ACB',
    subName: 'Á Châu',
    shortName: 'ACB',
    defaultTransferType: 'Chuyển tiền nhanh',
    hasNapas: true,
  },
  {
    id: 'vpbank',
    name: 'VPBANK',
    subName: 'Việt Nam Thịnh Vượng',
    shortName: 'VPBank',
    defaultTransferType: 'Chuyển tiền nhanh',
    hasNapas: true,
  },
  {
    id: 'sacombank',
    name: 'SACOMBANK',
    subName: 'Sài Gòn Thương Tín',
    shortName: 'Sacombank',
    defaultTransferType: 'Chuyển tiền nhanh',
    hasNapas: true,
  },
  {
    id: 'hdbank',
    name: 'HDBANK',
    subName: 'Phát triển TP.HCM',
    shortName: 'HDBank',
    defaultTransferType: 'Chuyển tiền nhanh',
    hasNapas: true,
  },
  {
    id: 'vib',
    name: 'VIB',
    subName: 'Quốc Tế Việt Nam',
    shortName: 'VIB',
    defaultTransferType: 'Chuyển tiền nhanh',
    hasNapas: true,
  },
  {
    id: 'shb',
    name: 'SHB',
    subName: 'Sài Gòn - Hà Nội',
    shortName: 'SHB',
    defaultTransferType: 'Chuyển tiền nhanh',
    hasNapas: true,
  },
];

export const DEFAULT_BANK: BankOption = BANKS_CATALOG[0];

export function getBankById(bankId: string): BankOption | undefined {
  if (!bankId) return undefined;
  const normalized = bankId.trim().toLowerCase();
  return BANKS_CATALOG.find((bank) => bank.id.toLowerCase() === normalized);
}
