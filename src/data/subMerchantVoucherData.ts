// Sub-Merchant Voucher Management Data Layer

import { VoucherBatch, VoucherBundle, VoucherCard, VoucherCardStatus, SoldVia, MerchantWalletTransaction, formatNum, generateBundlePrefix, generateCardSerial, generatePin, calculateBulkDiscount, generateBatchNumber } from "@/data/merchantVoucherData";

export interface ParentMerchant {
  id: string;
  name: string;
  city: string;
  state: string;
  discountRate: number;
  availableStock: MerchantStock[];
  status: "active" | "inactive";
  joinedDate: Date;
}

export interface MerchantStock {
  denomination: number;
  availableBundles: number;
  pricePerBundle: number;
}

export interface MerchantApplicationRequest {
  id: string;
  merchantName: string;
  merchantCity: string;
  dateSubmitted: Date;
  status: "pending" | "accepted" | "rejected";
  applicationFee: number;
}

// Parent merchants the sub-merchant is signed up with
export const mockParentMerchants: ParentMerchant[] = [
  {
    id: "pm-001",
    name: "Mobi-Express Lagos",
    city: "Lagos",
    state: "Lagos",
    discountRate: 5,
    status: "active",
    joinedDate: new Date(Date.now() - 90 * 86400000),
    availableStock: [
      { denomination: 100, availableBundles: 50, pricePerBundle: 9500 },
      { denomination: 500, availableBundles: 30, pricePerBundle: 47500 },
      { denomination: 1000, availableBundles: 20, pricePerBundle: 95000 },
      { denomination: 5000, availableBundles: 10, pricePerBundle: 475000 },
    ],
  },
  {
    id: "pm-002",
    name: "VoucherHub Nigeria",
    city: "Port Harcourt",
    state: "Rivers",
    discountRate: 8,
    status: "active",
    joinedDate: new Date(Date.now() - 60 * 86400000),
    availableStock: [
      { denomination: 100, availableBundles: 40, pricePerBundle: 9200 },
      { denomination: 500, availableBundles: 25, pricePerBundle: 46000 },
      { denomination: 1000, availableBundles: 15, pricePerBundle: 92000 },
    ],
  },
  {
    id: "pm-003",
    name: "Naira2Mobi Store",
    city: "Kano",
    state: "Kano",
    discountRate: 10,
    status: "active",
    joinedDate: new Date(Date.now() - 30 * 86400000),
    availableStock: [
      { denomination: 500, availableBundles: 20, pricePerBundle: 45000 },
      { denomination: 1000, availableBundles: 10, pricePerBundle: 90000 },
      { denomination: 5000, availableBundles: 5, pricePerBundle: 450000 },
    ],
  },
];

// Merchant application requests made by the sub-merchant
export const mockMerchantApplications: MerchantApplicationRequest[] = [
  { id: "ma-001", merchantName: "9ja Mobi Deals", merchantCity: "Enugu", dateSubmitted: new Date(Date.now() - 5 * 86400000), status: "pending", applicationFee: 5000 },
  { id: "ma-002", merchantName: "Mobi-Express Lagos", merchantCity: "Lagos", dateSubmitted: new Date(Date.now() - 95 * 86400000), status: "accepted", applicationFee: 5000 },
  { id: "ma-003", merchantName: "PayFast Benin", merchantCity: "Benin City", dateSubmitted: new Date(Date.now() - 20 * 86400000), status: "rejected", applicationFee: 5000 },
  { id: "ma-004", merchantName: "MobiKing Owerri", merchantCity: "Owerri", dateSubmitted: new Date(Date.now() - 2 * 86400000), status: "pending", applicationFee: 8000 },
];

// Sub-merchant's own batches (purchased from merchants)
function createSubMerchantBatch(
  denomination: number,
  bundleCount: number,
  daysAgo: number,
  merchantName: string,
  statusOverrides?: Partial<Record<number, { status: VoucherCardStatus; soldVia: SoldVia }>>
): VoucherBatch & { purchasedFrom: string } {
  const createdAt = new Date();
  createdAt.setDate(createdAt.getDate() - daysAgo);
  const batchId = `sm-batch-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const batchNumber = generateBatchNumber(createdAt, "SM01");
  const discount = calculateBulkDiscount(denomination, bundleCount);

  const bundles: VoucherBundle[] = [];
  for (let b = 0; b < bundleCount; b++) {
    const prefix = generateBundlePrefix(denomination, createdAt);
    const cards: VoucherCard[] = [];
    for (let c = 0; c < 100; c++) {
      const cardIndex = b * 100 + c;
      const override = statusOverrides?.[cardIndex];
      cards.push({
        id: `sm-card-${batchId}-${b}-${c}`,
        serialNumber: generateCardSerial(prefix, c),
        pin: generatePin(),
        denomination,
        status: override?.status || "available",
        batchId,
        bundleSerialPrefix: prefix,
        soldVia: override?.soldVia || null,
        createdAt,
        invalidatedAt: null,
        soldAt: override?.status === "sold_unused" || override?.status === "used" ? new Date(createdAt.getTime() + Math.random() * 86400000 * 3) : null,
        usedAt: override?.status === "used" ? new Date(createdAt.getTime() + Math.random() * 86400000 * 7) : null,
      });
    }
    bundles.push({
      id: `sm-bundle-${batchId}-${b}`,
      serialPrefix: prefix,
      denomination,
      batchId,
      cardCount: 100,
      cards,
    });
  }

  return {
    id: batchId,
    batchNumber,
    denomination,
    bundleCount,
    totalCards: bundleCount * 100,
    status: "active",
    createdAt,
    totalCost: discount.total,
    discountApplied: discount.discountPercent > 0,
    discountPercent: discount.discountPercent,
    generationType: "new",
    replacedBatchId: null,
    bundles,
    purchasedFrom: merchantName,
  };
}

const smOverrides1: Record<number, { status: VoucherCardStatus; soldVia: SoldVia }> = {};
for (let i = 0; i < 30; i++) smOverrides1[i] = { status: "sold_unused", soldVia: "physical" };
for (let i = 30; i < 40; i++) smOverrides1[i] = { status: "used", soldVia: "physical" };

export const initialSubMerchantBatches = [
  createSubMerchantBatch(500, 3, 10, "Mobi-Express Lagos", smOverrides1),
  createSubMerchantBatch(1000, 2, 5, "VoucherHub Nigeria"),
  createSubMerchantBatch(100, 5, 2, "Naira2Mobi Store"),
];

export const initialSubMerchantTransactions: MerchantWalletTransaction[] = [
  {
    id: "sm-txn-1",
    type: "funding",
    amount: 2000000,
    currency: "NGN",
    reference: "SM-TXN-FND-001",
    createdAt: new Date(Date.now() - 12 * 86400000),
    description: "Wallet funding via bank transfer",
    batchId: null,
  },
  {
    id: "sm-txn-2",
    type: "voucher_generation",
    amount: -initialSubMerchantBatches[0].totalCost,
    currency: "NGN",
    reference: "SM-TXN-PUR-002",
    createdAt: initialSubMerchantBatches[0].createdAt,
    description: `Purchased from ${(initialSubMerchantBatches[0] as any).purchasedFrom} — M${initialSubMerchantBatches[0].denomination} × ${initialSubMerchantBatches[0].totalCards} cards`,
    batchId: initialSubMerchantBatches[0].id,
  },
  {
    id: "sm-txn-3",
    type: "voucher_generation",
    amount: -initialSubMerchantBatches[1].totalCost,
    currency: "NGN",
    reference: "SM-TXN-PUR-003",
    createdAt: initialSubMerchantBatches[1].createdAt,
    description: `Purchased from ${(initialSubMerchantBatches[1] as any).purchasedFrom} — M${initialSubMerchantBatches[1].denomination} × ${initialSubMerchantBatches[1].totalCards} cards`,
    batchId: initialSubMerchantBatches[1].id,
  },
  {
    id: "sm-txn-4",
    type: "funding",
    amount: 1000000,
    currency: "NGN",
    reference: "SM-TXN-FND-004",
    createdAt: new Date(Date.now() - 3 * 86400000),
    description: "Wallet funding via mobile money",
    batchId: null,
  },
];

export const initialSubMerchantWalletBalance = 1850000;

// Sub-merchant discount settings
export let subMerchantDiscountRate = 3; // percentage

export function setSubMerchantDiscountRate(rate: number): void {
  subMerchantDiscountRate = rate;
}

export function getSubMerchantDiscountRate(): number {
  return subMerchantDiscountRate;
}
