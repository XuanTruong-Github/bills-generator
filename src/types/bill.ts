export interface BillData {
  time: string;
  batteryLevel: number;
  showWifi: boolean;
  showSignal: boolean;
  amount: string;
  recipientName: string;
  recipientAccount: string;
  bankName: string;
  bankCode: string;
  transactionContent: string;
  includeFrame: boolean;
}

export const DEFAULT_BILL_DATA: BillData = {
  time: "21:17",
  batteryLevel: 59,
  showWifi: true,
  showSignal: true,
  amount: "10000",
  recipientName: "LE XUAN TRUONG",
  recipientAccount: "9375083463",
  bankName: "Vietcombank",
  bankCode: "VCB",
  transactionContent: "Le Xuan Truong chuyen tien tu ViettelMoney",
  includeFrame: true,
};
