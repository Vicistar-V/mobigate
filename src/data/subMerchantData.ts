// Sub-Merchant Management Data Layer

export type SubMerchantStatus = "active" | "suspended";
export type ApplicationStatus = "pending" | "approved" | "rejected";

export interface SubMerchant {
  id: string;
  name: string;
  city: string;
  state: string;
  status: SubMerchantStatus;
  joinDate: Date;
  totalPurchases: number;
  totalBatches: number;
  totalBundles: number;
  totalCards: number;
  totalSpend: number;
  discountRate: number; // their own rate for end-users
}

export interface SubMerchantPurchase {
  id: string;
  subMerchantId: string;
  date: Date;
  batchReference: string;
  denomination: number;
  bundlesBought: number;
  totalCards: number;
  totalCost: number;
  status: "completed" | "processing" | "failed";
}

export interface SubMerchantApplication {
  id: string;
  applicantName: string;
  city: string;
  state: string;
  dateSubmitted: Date;
  status: ApplicationStatus;
  feePaid: number;
}

export interface SubMerchantSettings {
  applicationFee: number; // in Naira
  currency: string;
}

// Mock Sub-Merchants under the main merchant
export const mockSubMerchants: SubMerchant[] = [
  {
    id: "sm-001",
    name: "Adewale Mini Store",
    city: "Ikeja",
    state: "Lagos",
    status: "active",
    joinDate: new Date(Date.now() - 90 * 86400000),
    totalPurchases: 45,
    totalBatches: 12,
    totalBundles: 38,
    totalCards: 3800,
    totalSpend: 1250000,
    discountRate: 3,
  },
  {
    id: "sm-002",
    name: "ChiChi Voucher Hub",
    city: "Surulere",
    state: "Lagos",
    status: "active",
    joinDate: new Date(Date.now() - 60 * 86400000),
    totalPurchases: 28,
    totalBatches: 8,
    totalBundles: 22,
    totalCards: 2200,
    totalSpend: 780000,
    discountRate: 2,
  },
  {
    id: "sm-003",
    name: "Ibrahim Digital Pay",
    city: "Wuse",
    state: "Abuja (FCT)",
    status: "active",
    joinDate: new Date(Date.now() - 45 * 86400000),
    totalPurchases: 15,
    totalBatches: 5,
    totalBundles: 12,
    totalCards: 1200,
    totalSpend: 450000,
    discountRate: 4,
  },
  {
    id: "sm-004",
    name: "Emeka Fast Credit",
    city: "Port Harcourt",
    state: "Rivers",
    status: "suspended",
    joinDate: new Date(Date.now() - 120 * 86400000),
    totalPurchases: 5,
    totalBatches: 2,
    totalBundles: 4,
    totalCards: 400,
    totalSpend: 150000,
    discountRate: 2,
  },
  {
    id: "sm-005",
    name: "Fatima Mobi Corner",
    city: "Kano",
    state: "Kano",
    status: "active",
    joinDate: new Date(Date.now() - 30 * 86400000),
    totalPurchases: 8,
    totalBatches: 3,
    totalBundles: 6,
    totalCards: 600,
    totalSpend: 280000,
    discountRate: 3,
  },
];

// Mock purchase history for sub-merchants
export const mockSubMerchantPurchases: SubMerchantPurchase[] = [
  { id: "smp-001", subMerchantId: "sm-001", date: new Date(Date.now() - 2 * 86400000), batchReference: "BDL-500-260226-1201", denomination: 500, bundlesBought: 5, totalCards: 500, totalCost: 237500, status: "completed" },
  { id: "smp-002", subMerchantId: "sm-001", date: new Date(Date.now() - 7 * 86400000), batchReference: "BDL-1000-260219-1202", denomination: 1000, bundlesBought: 3, totalCards: 300, totalCost: 285000, status: "completed" },
  { id: "smp-003", subMerchantId: "sm-001", date: new Date(Date.now() - 14 * 86400000), batchReference: "BDL-5000-260212-1203", denomination: 5000, bundlesBought: 2, totalCards: 200, totalCost: 950000, status: "completed" },
  { id: "smp-004", subMerchantId: "sm-002", date: new Date(Date.now() - 3 * 86400000), batchReference: "BDL-500-260225-1204", denomination: 500, bundlesBought: 4, totalCards: 400, totalCost: 190000, status: "completed" },
  { id: "smp-005", subMerchantId: "sm-002", date: new Date(Date.now() - 10 * 86400000), batchReference: "BDL-100-260216-1205", denomination: 100, bundlesBought: 10, totalCards: 1000, totalCost: 95000, status: "completed" },
  { id: "smp-006", subMerchantId: "sm-003", date: new Date(Date.now() - 5 * 86400000), batchReference: "BDL-1000-260223-1206", denomination: 1000, bundlesBought: 2, totalCards: 200, totalCost: 190000, status: "completed" },
  { id: "smp-007", subMerchantId: "sm-005", date: new Date(Date.now() - 1 * 86400000), batchReference: "BDL-500-260227-1207", denomination: 500, bundlesBought: 3, totalCards: 300, totalCost: 142500, status: "processing" },
];

// Mock applications
export const mockSubMerchantApplications: SubMerchantApplication[] = [
  { id: "sma-001", applicantName: "Blessing Okoro", city: "Lekki", state: "Lagos", dateSubmitted: new Date(Date.now() - 1 * 86400000), status: "pending", feePaid: 5000 },
  { id: "sma-002", applicantName: "Yusuf Bello", city: "Garki", state: "Abuja (FCT)", dateSubmitted: new Date(Date.now() - 2 * 86400000), status: "pending", feePaid: 5000 },
  { id: "sma-003", applicantName: "Grace Adeola", city: "Victoria Island", state: "Lagos", dateSubmitted: new Date(Date.now() - 10 * 86400000), status: "approved", feePaid: 5000 },
  { id: "sma-004", applicantName: "Samuel Nwachukwu", city: "Aba", state: "Abia", dateSubmitted: new Date(Date.now() - 15 * 86400000), status: "rejected", feePaid: 5000 },
  { id: "sma-005", applicantName: "Amina Danjuma", city: "Kaduna", state: "Kaduna", dateSubmitted: new Date(Date.now() - 3 * 86400000), status: "pending", feePaid: 5000 },
];

// Settings
export let subMerchantSettings: SubMerchantSettings = {
  applicationFee: 5000,
  currency: "NGN",
};

export function setApplicationFee(fee: number): void {
  subMerchantSettings = { ...subMerchantSettings, applicationFee: fee };
}

export const formatNum = (n: number) => n.toLocaleString("en-NG");
