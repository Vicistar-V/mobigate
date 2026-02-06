import { AdvertisementCategoryOption, EnhancedAdvertisement, AdvertisementFeedback } from "@/types/advertisementSystem";

export const advertisementCategories: AdvertisementCategoryOption[] = [
  { value: "fashion", label: "Fashion & Clothing", icon: "Shirt" },
  { value: "electronics", label: "Electronics & Gadgets", icon: "Smartphone" },
  { value: "food", label: "Food & Catering", icon: "UtensilsCrossed" },
  { value: "real_estate", label: "Real Estate & Property", icon: "Home" },
  { value: "services", label: "Professional Services", icon: "Briefcase" },
  { value: "health", label: "Health & Wellness", icon: "Heart" },
  { value: "education", label: "Education & Training", icon: "GraduationCap" },
  { value: "automotive", label: "Automotive & Transport", icon: "Car" },
  { value: "beauty", label: "Beauty & Cosmetics", icon: "Sparkles" },
  { value: "other", label: "Other", icon: "Package" },
];

const generateMockFeedbacks = (adId: string, count: number): AdvertisementFeedback[] => {
  const texts = [
    "Great products! I ordered last week and got my delivery on time.",
    "How much is the large size? Can you deliver to Lekki?",
    "Best catering service in Lagos! Highly recommended.",
    "Do you have this in other colors? Would love to see more options.",
    "Very professional service. Will definitely patronize again.",
    "Your prices are fair. Keep it up!",
    "Can I visit your showroom? Where exactly in Victoria Island?",
    "I've been looking for this! How do I place an order?",
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `fb-${adId}-${i + 1}`,
    advertisementId: adId,
    feedbackText: texts[i % texts.length],
    submittedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    anonymousId: `Viewer #${Math.floor(1000 + Math.random() * 9000)}`,
    isRead: Math.random() > 0.3,
  }));
};

export const mockAdvertisements: EnhancedAdvertisement[] = [
  {
    id: "ad-001",
    advertiserId: "user-001",
    advertiserName: "Amara Okafor",
    advertiserPhoto: "https://randomuser.me/api/portraits/women/65.jpg",
    communityName: "Nigerian Professional Association",
    businessName: "Amara's Kitchen",
    category: "food",
    productTitle: "Premium Catering Services",
    description: "We provide top-quality catering services for all events — weddings, birthdays, corporate gatherings, and community celebrations. Authentic Nigerian dishes prepared with the freshest ingredients. We deliver across Lagos and Ogun State. Minimum order of 50 guests. Special discount for community members!",
    city: "Lagos, Nigeria",
    phone1: "+234 801 234 5678",
    phone2: "+234 909 876 5432",
    email: "orders@amaraskitchen.ng",
    website: "https://amaraskitchen.ng",
    media: [
      { url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400", type: "image" },
      { url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400", type: "image" },
      { url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400", type: "image" },
      { url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400", type: "image" },
    ],
    audienceTargets: ["community_interface", "members_interface", "mobigate_interface"],
    durationDays: 21,
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-02-22"),
    baseFee: 25000,
    audiencePremium: 17500,
    totalFeeInMobi: 42500,
    communityShare: 25500,
    mobigateShare: 17000,
    paymentStatus: "paid",
    paidAt: new Date("2024-01-31"),
    views: 2340,
    clicks: 567,
    feedbackCount: 18,
    status: "active",
    createdAt: new Date("2024-01-30"),
    updatedAt: new Date("2024-02-01"),
    feedbacks: generateMockFeedbacks("ad-001", 18),
  },
  {
    id: "ad-002",
    advertiserId: "user-002",
    advertiserName: "Chidi Nwankwo",
    advertiserPhoto: "https://randomuser.me/api/portraits/men/75.jpg",
    communityName: "Nigerian Professional Association",
    businessName: "TechZone Electronics",
    category: "electronics",
    productTitle: "Phones, Laptops & Accessories",
    description: "Your one-stop shop for genuine electronics. We sell brand-new and UK-used laptops, smartphones, tablets, and accessories at the best prices in Lagos. All products come with warranty. Visit our store at Computer Village, Ikeja or order online for home delivery.",
    city: "Ikeja, Lagos",
    phone1: "+234 803 456 7890",
    email: "sales@techzone.ng",
    website: "https://techzone.ng",
    media: [
      { url: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400", type: "image" },
      { url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400", type: "image" },
      { url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400", type: "image" },
    ],
    audienceTargets: ["community_interface", "mobi_store_marketplace"],
    durationDays: 14,
    startDate: new Date("2024-02-05"),
    endDate: new Date("2024-02-19"),
    baseFee: 18000,
    audiencePremium: 5400,
    totalFeeInMobi: 23400,
    communityShare: 14040,
    mobigateShare: 9360,
    paymentStatus: "paid",
    paidAt: new Date("2024-02-04"),
    views: 1856,
    clicks: 423,
    feedbackCount: 12,
    status: "active",
    createdAt: new Date("2024-02-03"),
    updatedAt: new Date("2024-02-05"),
    feedbacks: generateMockFeedbacks("ad-002", 12),
  },
  {
    id: "ad-003",
    advertiserId: "user-003",
    advertiserName: "Ngozi Adekunle",
    advertiserPhoto: "https://randomuser.me/api/portraits/women/32.jpg",
    communityName: "Nigerian Professional Association",
    businessName: "Prestige Homes",
    category: "real_estate",
    productTitle: "Luxury Apartments in Lekki",
    description: "Beautiful 2 & 3 bedroom apartments now available in Lekki Phase 1. Fully serviced with 24/7 power, swimming pool, gym, and security. Flexible payment plans available. Schedule a viewing today!",
    city: "Lekki, Lagos",
    phone1: "+234 805 678 9012",
    phone2: "+234 701 234 5678",
    email: "info@prestigehomes.ng",
    website: "https://prestigehomes.ng",
    media: [
      { url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400", type: "image" },
      { url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400", type: "image" },
    ],
    audienceTargets: ["community_interface", "mobigate_interface", "mobigate_users"],
    durationDays: 30,
    startDate: new Date("2024-01-20"),
    endDate: new Date("2024-02-19"),
    baseFee: 32000,
    audiencePremium: 28800,
    totalFeeInMobi: 60800,
    communityShare: 36480,
    mobigateShare: 24320,
    paymentStatus: "paid",
    paidAt: new Date("2024-01-19"),
    views: 3120,
    clicks: 890,
    feedbackCount: 24,
    status: "active",
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-02-01"),
    feedbacks: generateMockFeedbacks("ad-003", 24),
  },
  {
    id: "ad-004",
    advertiserId: "user-004",
    advertiserName: "Kunle Fashola",
    advertiserPhoto: "https://randomuser.me/api/portraits/men/22.jpg",
    communityName: "Nigerian Professional Association",
    businessName: "KF Auto Gallery",
    category: "automotive",
    productTitle: "Quality Pre-owned Vehicles",
    description: "We deal in clean and affordable Tokunbo and Nigerian-used cars. Toyota, Honda, Mercedes-Benz, and more. All vehicles are properly inspected and come with documentation. Trade-ins accepted. Visit our lot in Berger, Lagos.",
    city: "Berger, Lagos",
    phone1: "+234 802 345 6789",
    media: [
      { url: "https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=400", type: "image" },
      { url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400", type: "image" },
      { url: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400", type: "image" },
      { url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400", type: "image" },
    ],
    audienceTargets: ["community_interface"],
    durationDays: 7,
    startDate: new Date("2024-01-10"),
    endDate: new Date("2024-01-17"),
    baseFee: 10000,
    audiencePremium: 0,
    totalFeeInMobi: 10000,
    communityShare: 6000,
    mobigateShare: 4000,
    paymentStatus: "paid",
    paidAt: new Date("2024-01-09"),
    views: 654,
    clicks: 145,
    feedbackCount: 6,
    status: "ended",
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-17"),
    feedbacks: generateMockFeedbacks("ad-004", 6),
  },
  {
    id: "ad-005",
    advertiserId: "user-001",
    advertiserName: "Amara Okafor",
    advertiserPhoto: "https://randomuser.me/api/portraits/women/65.jpg",
    communityName: "Nigerian Professional Association",
    businessName: "Amara's Kitchen",
    category: "food",
    productTitle: "Valentine's Day Special Menu",
    description: "Treat your loved ones to a special Valentine's dinner package! 3-course meal for two with complimentary wine. Book now before slots run out. Home delivery available across Lagos Island and Mainland.",
    city: "Lagos, Nigeria",
    phone1: "+234 801 234 5678",
    email: "orders@amaraskitchen.ng",
    media: [
      { url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400", type: "image" },
    ],
    audienceTargets: ["community_interface", "members_interface"],
    durationDays: 7,
    startDate: new Date("2024-02-07"),
    endDate: new Date("2024-02-14"),
    baseFee: 10000,
    audiencePremium: 2000,
    totalFeeInMobi: 12000,
    communityShare: 7200,
    mobigateShare: 4800,
    paymentStatus: "paid",
    paidAt: new Date("2024-02-06"),
    views: 987,
    clicks: 234,
    feedbackCount: 8,
    status: "active",
    createdAt: new Date("2024-02-06"),
    updatedAt: new Date("2024-02-07"),
    feedbacks: generateMockFeedbacks("ad-005", 8),
  },
];

export const getActiveAdvertisements = (): EnhancedAdvertisement[] => {
  return mockAdvertisements.filter((ad) => ad.status === "active");
};

export const getMyAdvertisements = (userId: string = "user-001"): EnhancedAdvertisement[] => {
  return mockAdvertisements.filter((ad) => ad.advertiserId === userId);
};

export const getEndedAdvertisements = (): EnhancedAdvertisement[] => {
  return mockAdvertisements.filter((ad) => ad.status === "ended");
};

export const getAdvertisementStats = () => {
  const active = mockAdvertisements.filter((a) => a.status === "active").length;
  const pending = mockAdvertisements.filter((a) => a.status === "pending_payment").length;
  const ended = mockAdvertisements.filter((a) => a.status === "ended").length;
  const totalFees = mockAdvertisements
    .filter((a) => a.paymentStatus === "paid")
    .reduce((sum, a) => sum + a.totalFeeInMobi, 0);
  const totalCommunityShare = mockAdvertisements
    .filter((a) => a.paymentStatus === "paid")
    .reduce((sum, a) => sum + a.communityShare, 0);

  return { active, pending, ended, total: mockAdvertisements.length, totalFees, totalCommunityShare };
};

export const getCategoryLabel = (categoryValue: string): string => {
  const cat = advertisementCategories.find((c) => c.value === categoryValue);
  return cat?.label ?? categoryValue;
};
