export interface RechargeVoucher {
  id: string;
  mobiValue: number;
  ngnPrice: number;
  usdPrice: number;
  isActive: boolean;
  isPopular?: boolean;
}

export const rechargeVouchers: RechargeVoucher[] = [
  { id: "voucher-500", mobiValue: 500, ngnPrice: 500, usdPrice: 3, isActive: true },
  { id: "voucher-1000", mobiValue: 1000, ngnPrice: 1000, usdPrice: 6, isActive: true },
  { id: "voucher-1500", mobiValue: 1500, ngnPrice: 1500, usdPrice: 9, isActive: true },
  { id: "voucher-2000", mobiValue: 2000, ngnPrice: 2000, usdPrice: 12, isActive: true },
  { id: "voucher-3000", mobiValue: 3000, ngnPrice: 3000, usdPrice: 18, isActive: true },
  { id: "voucher-4000", mobiValue: 4000, ngnPrice: 4000, usdPrice: 24, isActive: true },
  { id: "voucher-5000", mobiValue: 5000, ngnPrice: 5000, usdPrice: 30, isActive: true, isPopular: true },
  { id: "voucher-6000", mobiValue: 6000, ngnPrice: 6000, usdPrice: 36, isActive: true },
  { id: "voucher-7000", mobiValue: 7000, ngnPrice: 7000, usdPrice: 42, isActive: true },
  { id: "voucher-8000", mobiValue: 8000, ngnPrice: 8000, usdPrice: 48, isActive: true },
  { id: "voucher-9000", mobiValue: 9000, ngnPrice: 9000, usdPrice: 54, isActive: true },
  { id: "voucher-10000", mobiValue: 10000, ngnPrice: 10000, usdPrice: 60, isActive: true, isPopular: true },
  { id: "voucher-15000", mobiValue: 15000, ngnPrice: 15000, usdPrice: 90, isActive: true },
  { id: "voucher-20000", mobiValue: 20000, ngnPrice: 20000, usdPrice: 120, isActive: true },
  { id: "voucher-50000", mobiValue: 50000, ngnPrice: 50000, usdPrice: 300, isActive: true, isPopular: true },
  { id: "voucher-100000", mobiValue: 100000, ngnPrice: 100000, usdPrice: 600, isActive: true },
];

export interface SelectedVoucher {
  voucher: RechargeVoucher;
  quantity: number;
}

export const calculateVoucherTotals = (selectedVouchers: SelectedVoucher[]) => {
  const totalNgn = selectedVouchers.reduce(
    (sum, sv) => sum + sv.voucher.ngnPrice * sv.quantity,
    0
  );
  const totalUsd = selectedVouchers.reduce(
    (sum, sv) => sum + sv.voucher.usdPrice * sv.quantity,
    0
  );
  const totalMobi = selectedVouchers.reduce(
    (sum, sv) => sum + sv.voucher.mobiValue * sv.quantity,
    0
  );
  const totalVouchers = selectedVouchers.reduce((sum, sv) => sum + sv.quantity, 0);

  return { totalNgn, totalUsd, totalMobi, totalVouchers };
};
