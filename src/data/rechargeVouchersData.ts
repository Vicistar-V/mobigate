export interface RechargeVoucher {
  id: string;
  mobiValue: number;
  ngnPrice: number;
  usdPrice: number;
  isActive: boolean;
  isPopular?: boolean;
  tier: "low" | "mid" | "high";
}

// Helper to generate voucher entry
const v = (value: number, tier: "low" | "mid" | "high", isPopular?: boolean): RechargeVoucher => ({
  id: `voucher-${value}`,
  mobiValue: value,
  ngnPrice: value,
  usdPrice: Math.round(value * 0.006 * 100) / 100, // ~₦166 per $1
  isActive: true,
  isPopular,
  tier,
});

export const rechargeVouchers: RechargeVoucher[] = [
  // Low tier: 100 - 10,000
  v(100, "low"),
  v(200, "low"),
  v(500, "low"),
  v(1000, "low"),
  v(1500, "low"),
  v(2000, "low"),
  v(2500, "low"),
  v(3000, "low"),
  v(3500, "low"),
  v(4000, "low"),
  v(4500, "low"),
  v(5000, "low", true),
  v(5500, "low"),
  v(6000, "low"),
  v(6500, "low"),
  v(7000, "low"),
  v(7500, "low"),
  v(8000, "low"),
  v(8500, "low"),
  v(9000, "low"),
  v(9500, "low"),
  v(10000, "low", true),

  // Mid tier: 15,000 - 100,000
  v(15000, "mid"),
  v(20000, "mid"),
  v(25000, "mid"),
  v(30000, "mid"),
  v(35000, "mid"),
  v(40000, "mid"),
  v(45000, "mid"),
  v(50000, "mid", true),
  v(55000, "mid"),
  v(60000, "mid"),
  v(65000, "mid"),
  v(70000, "mid"),
  v(75000, "mid"),
  v(80000, "mid"),
  v(85000, "mid"),
  v(90000, "mid"),
  v(95000, "mid"),
  v(100000, "mid", true),

  // High tier: 125,000 - 1,000,000
  v(125000, "high"),
  v(150000, "high"),
  v(175000, "high"),
  v(200000, "high"),
  v(225000, "high"),
  v(250000, "high", true),
  v(275000, "high"),
  v(300000, "high"),
  v(350000, "high"),
  v(400000, "high"),
  v(450000, "high"),
  v(500000, "high", true),
  v(600000, "high"),
  v(700000, "high"),
  v(750000, "high"),
  v(800000, "high"),
  v(900000, "high"),
  v(1000000, "high", true),
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
