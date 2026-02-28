export interface MobiMerchant {
  id: string;
  name: string;
  discountPercent: number; // 1-20%
  city: string;
  rating: number; // 1-5 stars
  isVerified: boolean;
  isActive: boolean;
  isSubMerchant?: boolean;
  stateId?: string;
  stateName?: string;
  lgaId?: string;
  lgaName?: string;
}

export interface MerchantCountry {
  id: string;
  name: string;
  flag: string;
  currencyCode: string;
  currencySymbol: string;
  isLocal?: boolean;
  merchants: MobiMerchant[];
}

// Nigeria Merchants (Local Country)
const nigeriaMerchants: MobiMerchant[] = [
  { id: "ng-001", name: "Mobi-Express Lagos", discountPercent: 5, city: "Lagos", rating: 4.8, isVerified: true, isActive: true, isSubMerchant: true, stateId: "lagos", stateName: "Lagos", lgaId: "ikeja", lgaName: "Ikeja" },
  { id: "ng-002", name: "QuickPay Solutions", discountPercent: 3, city: "Abuja", rating: 4.5, isVerified: true, isActive: true, isSubMerchant: true, stateId: "fct", stateName: "Abuja (FCT)", lgaId: "amac", lgaName: "Municipal Area Council" },
  { id: "ng-003", name: "VoucherHub Nigeria", discountPercent: 8, city: "Port Harcourt", rating: 4.7, isVerified: true, isActive: true, isSubMerchant: true, stateId: "rivers", stateName: "Rivers", lgaId: "ph", lgaName: "Port Harcourt" },
  { id: "ng-004", name: "Naira2Mobi Store", discountPercent: 10, city: "Kano", rating: 4.3, isVerified: true, isActive: true, isSubMerchant: true, stateId: "kano", stateName: "Kano", lgaId: "kano-municipal", lgaName: "Kano Municipal" },
  { id: "ng-005", name: "FastCredit Ibadan", discountPercent: 7, city: "Ibadan", rating: 4.6, isVerified: true, isActive: true, isSubMerchant: true, stateId: "oyo", stateName: "Oyo", lgaId: "ibadan-north", lgaName: "Ibadan North" },
  { id: "ng-006", name: "9ja Mobi Deals", discountPercent: 12, city: "Enugu", rating: 4.4, isVerified: true, isActive: true, isSubMerchant: true, stateId: "enugu", stateName: "Enugu", lgaId: "enugu-north", lgaName: "Enugu North" },
  { id: "ng-007", name: "PayFast Benin", discountPercent: 6, city: "Benin City", rating: 4.2, isVerified: true, isActive: true, isSubMerchant: true, stateId: "edo", stateName: "Edo", lgaId: "oredo", lgaName: "Oredo" },
  { id: "ng-008", name: "MobiKing Owerri", discountPercent: 15, city: "Owerri", rating: 4.9, isVerified: true, isActive: true, isSubMerchant: true, stateId: "imo", stateName: "Imo", lgaId: "owerri-municipal", lgaName: "Owerri Municipal" },
  { id: "ng-sm-001", name: "Adewale Mini Store", discountPercent: 3, city: "Ikeja", rating: 4.1, isVerified: true, isActive: true, isSubMerchant: true, stateId: "lagos", stateName: "Lagos", lgaId: "ikeja", lgaName: "Ikeja" },
  { id: "ng-sm-002", name: "ChiChi Voucher Hub", discountPercent: 2, city: "Surulere", rating: 4.0, isVerified: true, isActive: true, isSubMerchant: true, stateId: "lagos", stateName: "Lagos", lgaId: "surulere", lgaName: "Surulere" },
  { id: "ng-sm-003", name: "Fatima Mobi Corner", discountPercent: 3, city: "Kano", rating: 3.9, isVerified: true, isActive: true, isSubMerchant: true, stateId: "kano", stateName: "Kano", lgaId: "kano-municipal", lgaName: "Kano Municipal" },
];

// Ghana Merchants
const ghanaMerchants: MobiMerchant[] = [
  { id: "gh-001", name: "Accra Mobi Hub", discountPercent: 4, city: "Accra", rating: 4.6, isVerified: true, isActive: true, isSubMerchant: true },
  { id: "gh-002", name: "CediExchange", discountPercent: 6, city: "Kumasi", rating: 4.4, isVerified: true, isActive: true, isSubMerchant: true },
  { id: "gh-003", name: "GhanaPay Solutions", discountPercent: 8, city: "Takoradi", rating: 4.5, isVerified: true, isActive: true, isSubMerchant: true },
];

// Kenya Merchants
const kenyaMerchants: MobiMerchant[] = [
  { id: "ke-001", name: "Nairobi Mobi Shop", discountPercent: 5, city: "Nairobi", rating: 4.7, isVerified: true, isActive: true, isSubMerchant: true },
  { id: "ke-002", name: "Safari Vouchers", discountPercent: 9, city: "Mombasa", rating: 4.5, isVerified: true, isActive: true, isSubMerchant: true },
  { id: "ke-003", name: "M-Pesa Mobi Link", discountPercent: 7, city: "Kisumu", rating: 4.6, isVerified: true, isActive: true, isSubMerchant: true },
];

// South Africa Merchants
const southAfricaMerchants: MobiMerchant[] = [
  { id: "za-001", name: "Joburg Mobi Center", discountPercent: 4, city: "Johannesburg", rating: 4.8, isVerified: true, isActive: true, isSubMerchant: true },
  { id: "za-002", name: "Cape Vouchers", discountPercent: 6, city: "Cape Town", rating: 4.6, isVerified: true, isActive: true, isSubMerchant: true },
  { id: "za-003", name: "Durban Digital Pay", discountPercent: 10, city: "Durban", rating: 4.4, isVerified: true, isActive: true, isSubMerchant: true },
];

// UK Merchants
const ukMerchants: MobiMerchant[] = [
  { id: "uk-001", name: "London Mobi Exchange", discountPercent: 3, city: "London", rating: 4.9, isVerified: true, isActive: true, isSubMerchant: true },
  { id: "uk-002", name: "Manchester Vouchers", discountPercent: 5, city: "Manchester", rating: 4.7, isVerified: true, isActive: true, isSubMerchant: true },
  { id: "uk-003", name: "Birmingham Pay Hub", discountPercent: 4, city: "Birmingham", rating: 4.5, isVerified: true, isActive: true, isSubMerchant: true },
];

// USA Merchants
const usaMerchants: MobiMerchant[] = [
  { id: "us-001", name: "NYC Mobi Store", discountPercent: 2, city: "New York", rating: 4.8, isVerified: true, isActive: true, isSubMerchant: true },
  { id: "us-002", name: "LA Digital Vouchers", discountPercent: 4, city: "Los Angeles", rating: 4.6, isVerified: true, isActive: true, isSubMerchant: true },
  { id: "us-003", name: "Houston Pay Center", discountPercent: 5, city: "Houston", rating: 4.5, isVerified: true, isActive: true, isSubMerchant: true },
  { id: "us-004", name: "Atlanta Mobi Hub", discountPercent: 6, city: "Atlanta", rating: 4.7, isVerified: true, isActive: true, isSubMerchant: true },
];

// Canada Merchants
const canadaMerchants: MobiMerchant[] = [
  { id: "ca-001", name: "Toronto Mobi Express", discountPercent: 3, city: "Toronto", rating: 4.7, isVerified: true, isActive: true, isSubMerchant: true },
  { id: "ca-002", name: "Vancouver Vouchers", discountPercent: 5, city: "Vancouver", rating: 4.6, isVerified: true, isActive: true, isSubMerchant: true },
];

// UAE Merchants
const uaeMerchants: MobiMerchant[] = [
  { id: "ae-001", name: "Dubai Mobi Gold", discountPercent: 8, city: "Dubai", rating: 4.9, isVerified: true, isActive: true, isSubMerchant: true },
  { id: "ae-002", name: "Abu Dhabi Pay Hub", discountPercent: 6, city: "Abu Dhabi", rating: 4.7, isVerified: true, isActive: true, isSubMerchant: true },
];

export const merchantCountries: MerchantCountry[] = [
  {
    id: "ng",
    name: "Nigeria",
    flag: "🇳🇬",
    currencyCode: "NGN",
    currencySymbol: "₦",
    isLocal: true,
    merchants: nigeriaMerchants,
  },
  {
    id: "gh",
    name: "Ghana",
    flag: "🇬🇭",
    currencyCode: "GHS",
    currencySymbol: "₵",
    merchants: ghanaMerchants,
  },
  {
    id: "ke",
    name: "Kenya",
    flag: "🇰🇪",
    currencyCode: "KES",
    currencySymbol: "KSh",
    merchants: kenyaMerchants,
  },
  {
    id: "za",
    name: "South Africa",
    flag: "🇿🇦",
    currencyCode: "ZAR",
    currencySymbol: "R",
    merchants: southAfricaMerchants,
  },
  {
    id: "uk",
    name: "United Kingdom",
    flag: "🇬🇧",
    currencyCode: "GBP",
    currencySymbol: "£",
    merchants: ukMerchants,
  },
  {
    id: "us",
    name: "United States",
    flag: "🇺🇸",
    currencyCode: "USD",
    currencySymbol: "$",
    merchants: usaMerchants,
  },
  {
    id: "ca",
    name: "Canada",
    flag: "🇨🇦",
    currencyCode: "CAD",
    currencySymbol: "C$",
    merchants: canadaMerchants,
  },
  {
    id: "ae",
    name: "United Arab Emirates",
    flag: "🇦🇪",
    currencyCode: "AED",
    currencySymbol: "د.إ",
    merchants: uaeMerchants,
  },
];

export const getLocalCountry = (): MerchantCountry | undefined => {
  return merchantCountries.find((c) => c.isLocal);
};

export const getOtherCountries = (): MerchantCountry[] => {
  return merchantCountries.filter((c) => !c.isLocal);
};

export const getMerchantsByCountry = (countryId: string): MobiMerchant[] => {
  const country = merchantCountries.find((c) => c.id === countryId);
  return country?.merchants.filter((m) => m.isActive) || [];
};

export const calculateDiscountedAmount = (
  originalAmount: number,
  discountPercent: number
): { discounted: number; savings: number } => {
  const savings = Math.round(originalAmount * (discountPercent / 100));
  const discounted = originalAmount - savings;
  return { discounted, savings };
};
