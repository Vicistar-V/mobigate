// ═══════════════════════════════════════════════════════════════
// Merchant Voucher Management - Data Layer
// ═══════════════════════════════════════════════════════════════

export type VoucherCardStatus = "available" | "sold_unused" | "used" | "invalidated";
export type SoldVia = "physical" | "mobigate_digital" | null;
export type GenerationType = "new" | "replacement";

export interface VoucherCard {
  id: string;
  serialNumber: string;
  pin: string;
  denomination: number;
  status: VoucherCardStatus;
  batchId: string;
  bundleSerialPrefix: string;
  soldVia: SoldVia;
  createdAt: Date;
  invalidatedAt: Date | null;
  soldAt: Date | null;
  usedAt: Date | null;
}

export interface VoucherBundle {
  id: string;
  serialPrefix: string;
  denomination: number;
  batchId: string;
  cardCount: number;
  cards: VoucherCard[];
}

export interface VoucherBatch {
  id: string;
  batchNumber: string;
  denomination: number;
  bundleCount: number;
  totalCards: number;
  status: "active" | "partially_invalidated" | "fully_invalidated";
  createdAt: Date;
  totalCost: number;
  discountApplied: boolean;
  discountPercent: number;
  generationType: GenerationType;
  replacedBatchId: string | null;
  bundles: VoucherBundle[];
}

export interface MerchantWalletTransaction {
  id: string;
  type: "funding" | "voucher_generation";
  amount: number;
  currency: string;
  reference: string;
  createdAt: Date;
  description: string;
  batchId: string | null;
}

// ─── Discount Calculation (dynamic, based on platform settings) ───
import { platformVoucherDiscountSettings } from "@/data/platformSettingsData";

export interface DiscountResult {
  discountPercent: number;
  label: string;
}

export function getDiscountForBundles(bundleCount: number): DiscountResult {
  const rate = platformVoucherDiscountSettings.discountPercentPerBundle;
  const percent = bundleCount * rate;
  const rounded = Math.round(percent * 100) / 100;
  return {
    discountPercent: rounded,
    label: rounded > 0 ? `${rounded}% off` : "No discount",
  };
}

export function calculateBulkDiscount(denomination: number, bundleCount: number): {
  cardsPerBundle: number;
  totalCards: number;
  unitCost: number;
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  total: number;
} {
  const cardsPerBundle = 100;
  const totalCards = bundleCount * cardsPerBundle;
  const unitCost = denomination;
  const subtotal = totalCards * unitCost;
  const disc = getDiscountForBundles(bundleCount);
  const discountAmount = Math.round(subtotal * disc.discountPercent / 100);
  return {
    cardsPerBundle,
    totalCards,
    unitCost,
    subtotal,
    discountPercent: disc.discountPercent,
    discountAmount,
    total: subtotal - discountAmount,
  };
}

// ─── Serial Number & PIN Generators ───
let serialCounter = 1000;

export function generateBundlePrefix(denomination: number, date: Date): string {
  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const seq = String(++serialCounter).padStart(4, "0");
  return `BDL-${denomination}-${yy}${mm}${dd}-${seq}`;
}

export function generateCardSerial(bundlePrefix: string, index: number): string {
  return `${bundlePrefix}-C${String(index + 1).padStart(3, "0")}`;
}

export function generatePin(): string {
  return String(Math.floor(1000000000000000 + Math.random() * 9000000000000000));
}

export function hashPin(pin: string): string {
  return "****" + pin.slice(-4);
}

const DEFAULT_MERCHANT_ID = "0001";

export function generateBatchNumber(date: Date, merchantId: string = DEFAULT_MERCHANT_ID): string {
  const year = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const unique = String(Math.floor(1000 + Math.random() * 9000));
  return `BATCH-${year}-${mm}${dd}-${merchantId}-${unique}`;
}

function generateTransactionRef(): string {
  return `TXN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

// ─── Mock Data Generator ───
function createMockBatch(
  denomination: number,
  bundleCount: number,
  daysAgo: number,
  generationType: GenerationType = "new",
  replacedBatchId: string | null = null,
  statusOverrides?: Partial<Record<number, { status: VoucherCardStatus; soldVia: SoldVia }>>
): VoucherBatch {
  const createdAt = new Date();
  createdAt.setDate(createdAt.getDate() - daysAgo);

  const batchId = `batch-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const batchNumber = generateBatchNumber(createdAt);
  const discount = calculateBulkDiscount(denomination, bundleCount);

  const bundles: VoucherBundle[] = [];
  for (let b = 0; b < bundleCount; b++) {
    const prefix = generateBundlePrefix(denomination, createdAt);
    const cards: VoucherCard[] = [];
    for (let c = 0; c < 100; c++) {
      const cardIndex = b * 100 + c;
      const override = statusOverrides?.[cardIndex];
      cards.push({
        id: `card-${batchId}-${b}-${c}`,
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
      id: `bundle-${batchId}-${b}`,
      serialPrefix: prefix,
      denomination,
      batchId,
      cardCount: 100,
      cards,
    });
  }

  const allCards = bundles.flatMap(b => b.cards);
  const hasInvalidated = allCards.some(c => c.status === "invalidated");
  const allInvalidated = allCards.every(c => c.status === "invalidated" || c.status === "used");

  return {
    id: batchId,
    batchNumber,
    denomination,
    bundleCount,
    totalCards: bundleCount * 100,
    status: allInvalidated ? "fully_invalidated" : hasInvalidated ? "partially_invalidated" : "active",
    createdAt,
    totalCost: discount.total,
    discountApplied: discount.discountPercent > 0,
    discountPercent: discount.discountPercent,
    generationType,
    replacedBatchId,
    bundles,
  };
}

// Create mock batches with varied statuses
const statusOverrides1: Record<number, { status: VoucherCardStatus; soldVia: SoldVia }> = {};
// First batch: mix of statuses across 200 cards (2 bundles)
for (let i = 0; i < 50; i++) statusOverrides1[i] = { status: "sold_unused", soldVia: "physical" };
for (let i = 50; i < 70; i++) statusOverrides1[i] = { status: "used", soldVia: "physical" };
for (let i = 70; i < 80; i++) statusOverrides1[i] = { status: "sold_unused", soldVia: "mobigate_digital" };
for (let i = 80; i < 85; i++) statusOverrides1[i] = { status: "used", soldVia: "mobigate_digital" };

const statusOverrides2: Record<number, { status: VoucherCardStatus; soldVia: SoldVia }> = {};
for (let i = 0; i < 30; i++) statusOverrides2[i] = { status: "used", soldVia: "physical" };
for (let i = 30; i < 45; i++) statusOverrides2[i] = { status: "sold_unused", soldVia: "physical" };

export const initialMockBatches: VoucherBatch[] = [
  createMockBatch(500, 2, 14, "new", null, statusOverrides1),
  createMockBatch(1000, 5, 7, "new", null, statusOverrides2),
  createMockBatch(5000, 1, 3),
  createMockBatch(100, 15, 1),
];

export const initialMockTransactions: MerchantWalletTransaction[] = [
  {
    id: "txn-1",
    type: "funding",
    amount: 5000000,
    currency: "NGN",
    reference: "TXN-FND-001A",
    createdAt: new Date(Date.now() - 15 * 86400000),
    description: "Wallet funding via bank transfer",
    batchId: null,
  },
  {
    id: "txn-2",
    type: "voucher_generation",
    amount: -initialMockBatches[0].totalCost,
    currency: "NGN",
    reference: "TXN-GEN-002B",
    createdAt: initialMockBatches[0].createdAt,
    description: `Generated ${initialMockBatches[0].batchNumber} — M${initialMockBatches[0].denomination} × ${initialMockBatches[0].totalCards} cards`,
    batchId: initialMockBatches[0].id,
  },
  {
    id: "txn-3",
    type: "voucher_generation",
    amount: -initialMockBatches[1].totalCost,
    currency: "NGN",
    reference: "TXN-GEN-003C",
    createdAt: initialMockBatches[1].createdAt,
    description: `Generated ${initialMockBatches[1].batchNumber} — M${initialMockBatches[1].denomination} × ${initialMockBatches[1].totalCards} cards`,
    batchId: initialMockBatches[1].id,
  },
  {
    id: "txn-4",
    type: "funding",
    amount: 2000000,
    currency: "NGN",
    reference: "TXN-FND-004D",
    createdAt: new Date(Date.now() - 5 * 86400000),
    description: "Wallet funding via mobile money",
    batchId: null,
  },
  {
    id: "txn-5",
    type: "voucher_generation",
    amount: -initialMockBatches[2].totalCost,
    currency: "NGN",
    reference: "TXN-GEN-005E",
    createdAt: initialMockBatches[2].createdAt,
    description: `Generated ${initialMockBatches[2].batchNumber} — M${initialMockBatches[2].denomination} × ${initialMockBatches[2].totalCards} cards`,
    batchId: initialMockBatches[2].id,
  },
];

export const initialMerchantWalletBalance = 3450000; // ₦3,450,000

// ─── Helper: Get invalidatable cards ───
export function getInvalidatableCards(cards: VoucherCard[]): VoucherCard[] {
  return cards.filter(c =>
    (c.status === "available") ||
    (c.status === "sold_unused" && c.soldVia === "physical")
  );
}

export function getBatchStatusCounts(batch: VoucherBatch) {
  const allCards = batch.bundles.flatMap(b => b.cards);
  return {
    available: allCards.filter(c => c.status === "available").length,
    sold_unused: allCards.filter(c => c.status === "sold_unused").length,
    used: allCards.filter(c => c.status === "used").length,
    invalidated: allCards.filter(c => c.status === "invalidated").length,
    total: allCards.length,
  };
}

export function getBundleStatusCounts(bundle: VoucherBundle) {
  return {
    available: bundle.cards.filter(c => c.status === "available").length,
    sold_unused: bundle.cards.filter(c => c.status === "sold_unused").length,
    used: bundle.cards.filter(c => c.status === "used").length,
    invalidated: bundle.cards.filter(c => c.status === "invalidated").length,
    total: bundle.cards.length,
  };
}

export const formatNum = (n: number) => n.toLocaleString("en-NG");
