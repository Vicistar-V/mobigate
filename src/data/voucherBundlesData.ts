export interface VoucherBundle {
  id: string;
  name: string;
  tier: "basic" | "standard" | "premium";
  description: string;
  price: number;
  currency: string;
  voucherCount: number;
  voucherValue: number;
  savingsPercentage: number;
  features: string[];
  popular: boolean;
  validityPeriod: string;
}

export const voucherBundles: VoucherBundle[] = [
  {
    id: "bundle-1",
    name: "Basic Bundle",
    tier: "basic",
    description: "Perfect for occasional users who want to try out our voucher system",
    price: 5000,
    currency: "NGN",
    voucherCount: 10,
    voucherValue: 500,
    savingsPercentage: 10,
    features: [
      "10 vouchers worth NGN 500 each",
      "Use at partner merchants",
      "Valid for 3 months",
      "Can be gifted to others",
      "Email support"
    ],
    popular: false,
    validityPeriod: "3 months"
  },
  {
    id: "bundle-2",
    name: "Standard Bundle",
    tier: "standard",
    description: "Best value for regular users with more vouchers and better discounts",
    price: 18000,
    currency: "NGN",
    voucherCount: 40,
    voucherValue: 500,
    savingsPercentage: 20,
    features: [
      "40 vouchers worth NGN 500 each",
      "Use at partner merchants",
      "Valid for 6 months",
      "Bonus 5 extra vouchers",
      "Can be gifted to others",
      "Priority email support",
      "Monthly usage reports"
    ],
    popular: true,
    validityPeriod: "6 months"
  },
  {
    id: "bundle-3",
    name: "Premium Bundle",
    tier: "premium",
    description: "Ultimate package for power users with maximum savings and exclusive perks",
    price: 40000,
    currency: "NGN",
    voucherCount: 100,
    voucherValue: 500,
    savingsPercentage: 30,
    features: [
      "100 vouchers worth NGN 500 each",
      "Use at partner merchants",
      "Valid for 12 months",
      "Bonus 20 extra vouchers",
      "Exclusive premium merchant access",
      "Can be gifted to others",
      "24/7 priority support",
      "Monthly usage reports",
      "Quarterly bonus vouchers",
      "VIP merchant discounts"
    ],
    popular: false,
    validityPeriod: "12 months"
  }
];

export const partnerMerchants = [
  {
    id: "merchant-1",
    name: "Golden Cuisine Restaurant",
    category: "Food & Dining",
    logo: "/placeholder.svg",
    discount: "10% extra discount for bundle users"
  },
  {
    id: "merchant-2",
    name: "StyleHub Fashion Store",
    category: "Fashion & Apparel",
    logo: "/placeholder.svg",
    discount: "15% extra discount for bundle users"
  },
  {
    id: "merchant-3",
    name: "TechMart Electronics",
    category: "Electronics",
    logo: "/placeholder.svg",
    discount: "5% extra discount for bundle users"
  },
  {
    id: "merchant-4",
    name: "FreshMart Supermarket",
    category: "Groceries",
    logo: "/placeholder.svg",
    discount: "12% extra discount for bundle users"
  },
  {
    id: "merchant-5",
    name: "BookWise Stores",
    category: "Books & Education",
    logo: "/placeholder.svg",
    discount: "20% extra discount for bundle users"
  }
];

export const voucherTerms = [
  "Vouchers are non-refundable and non-transferable after activation",
  "Each voucher can only be used once",
  "Vouchers must be used before expiry date",
  "Bundle validity period starts from date of purchase",
  "Unused vouchers after expiry will not be refunded",
  "Vouchers can be used at any participating merchant",
  "Minimum purchase amount may apply at some merchants",
  "Cannot be combined with other promotional offers unless stated",
  "Community reserves the right to modify terms with notice"
];
