import { SavedAdvert } from "@/types/advert";

// Mock advert data for demonstration
export const mockAdverts: SavedAdvert[] = [
  {
    id: "ad-demo-1",
    userId: "user-123",
    category: "pictorial",
    type: "single",
    size: "5x6",
    dpdPackage: "professional",
    catchmentMarket: {
      ownCity: 30,
      ownState: 25,
      ownCountry: 20,
      foreignCountries: 10,
      popularSearches: 5,
      random: 5,
      others: 5
    },
    launchDate: new Date("2025-02-01"),
    fileUrls: ["https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop"],
    status: "active",
    pricing: {
      setupFee: 30000,
      subscriptionMonths: 1,
      monthlyDpdCost: 5000,
      subscriptionDiscount: 0,
      subscriptionDiscountAmount: 0,
      totalDpdCost: 5000,
      dpdCost: 5000,
      extendedExposureCost: 0,
      recurrentAfterCost: 0,
      recurrentEveryCost: 0,
      totalCost: 35000,
      totalCostMobi: 35000,
      totalSubscriptionCost: 35000,
      displayPerDay: 300,
      displayFrequency: "1 Display per 5 Minutes"
    },
    statistics: {
      impressions: 12500,
      clicks: 845,
      views: 423,
      revenue: 2115,
      displayedToday: 187,
      lastDisplayed: new Date()
    },
    createdAt: new Date("2025-01-15"),
    updatedAt: new Date(),
    approvedAt: new Date("2025-01-16"),
    expiresAt: new Date("2027-01-16")
  },
  {
    id: "ad-demo-2",
    userId: "user-123",
    category: "video",
    type: "multiple-3",
    size: "10x6",
    dpdPackage: "deluxe-gold",
    extendedExposure: "extra-5",
    recurrentEvery: "every-6h",
    catchmentMarket: {
      ownCity: 20,
      ownState: 25,
      ownCountry: 25,
      foreignCountries: 15,
      popularSearches: 5,
      random: 5,
      others: 5
    },
    launchDate: new Date("2025-03-01"),
    fileUrls: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?w=800&auto=format&fit=crop"
    ],
    status: "pending",
    pricing: {
      setupFee: 90000,
      subscriptionMonths: 1,
      monthlyDpdCost: 27500,
      subscriptionDiscount: 0,
      subscriptionDiscountAmount: 0,
      totalDpdCost: 27500,
      dpdCost: 27500,
      extendedExposureCost: 23500,
      recurrentAfterCost: 0,
      recurrentEveryCost: 17625,
      totalCost: 158625,
      totalCostMobi: 158625,
      totalSubscriptionCost: 158625,
      displayPerDay: 1400,
      displayFrequency: "4 Displays per 1 Minute"
    },
    statistics: {
      impressions: 0,
      clicks: 0,
      views: 0,
      revenue: 0,
      displayedToday: 0
    },
    createdAt: new Date("2025-01-20"),
    updatedAt: new Date("2025-01-20")
  },
  {
    id: "ad-demo-3",
    userId: "user-123",
    category: "pictorial",
    type: "multiple-2",
    size: "6.5x6",
    dpdPackage: "enterprise",
    catchmentMarket: {
      ownCity: 25,
      ownState: 25,
      ownCountry: 25,
      foreignCountries: 10,
      popularSearches: 5,
      random: 5,
      others: 5
    },
    launchDate: new Date("2025-01-10"),
    fileUrls: [
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=800&auto=format&fit=crop"
    ],
    status: "paused",
    pricing: {
      setupFee: 40000,
      subscriptionMonths: 1,
      monthlyDpdCost: 10000,
      subscriptionDiscount: 0,
      subscriptionDiscountAmount: 0,
      totalDpdCost: 10000,
      dpdCost: 10000,
      extendedExposureCost: 0,
      recurrentAfterCost: 0,
      recurrentEveryCost: 0,
      totalCost: 50000,
      totalCostMobi: 50000,
      totalSubscriptionCost: 50000,
      displayPerDay: 500,
      displayFrequency: "1 Display per 3 Minutes"
    },
    statistics: {
      impressions: 8450,
      clicks: 512,
      views: 289,
      revenue: 1445,
      displayedToday: 0,
      lastDisplayed: new Date("2025-01-18")
    },
    createdAt: new Date("2025-01-05"),
    updatedAt: new Date("2025-01-18"),
    approvedAt: new Date("2025-01-06"),
    expiresAt: new Date("2027-01-06")
  }
];

// Helper to initialize demo data
export function initializeMockData() {
  const existingData = localStorage.getItem("mobigate_adverts");
  if (!existingData) {
    localStorage.setItem("mobigate_adverts", JSON.stringify(mockAdverts));
  }
}
