import { 
  CampaignAudienceOption, 
  CampaignDurationOption, 
  FeeDistributionConfig, 
  FeeDistributionHistory,
  EnhancedCampaign,
  CampaignFeedback
} from "@/types/campaignSystem";

// Campaign Audience Options with descriptions and premium multipliers
export const campaignAudienceOptions: CampaignAudienceOption[] = [
  {
    value: "community_interface",
    label: "Within Community Interface Only",
    description: "Your campaign will only be visible to members browsing this community's pages",
    icon: "Users",
    premiumMultiplier: 1.0 // Base rate, no premium
  },
  {
    value: "members_interface",
    label: "On Members Interface",
    description: "Display on member profiles and activity feeds within the community",
    icon: "UserCircle",
    premiumMultiplier: 1.2 // 20% premium
  },
  {
    value: "mobigate_interface",
    label: "Across Mobigate Interface",
    description: "Reach users across the entire Mobigate platform for maximum exposure",
    icon: "Globe",
    premiumMultiplier: 1.5 // 50% premium
  },
  {
    value: "mobigate_users",
    label: "On Mobigate Users Interface",
    description: "Target all registered Mobigate users on their personalized feeds",
    icon: "UsersRound",
    premiumMultiplier: 1.4 // 40% premium
  },
  {
    value: "mobi_store_marketplace",
    label: "On Mobi-Store Marketplace",
    description: "Display your campaign to shoppers browsing the Mobi-Store marketplace",
    icon: "Store",
    premiumMultiplier: 1.3 // 30% premium
  }
];

// Campaign Duration Options with base fees
export const campaignDurationOptions: CampaignDurationOption[] = [
  {
    days: 3,
    feeInMobi: 5000,
    label: "3 Days",
    description: "Quick visibility boost"
  },
  {
    days: 7,
    feeInMobi: 10000,
    label: "7 Days",
    description: "Standard campaign period",
    popular: true
  },
  {
    days: 14,
    feeInMobi: 18000,
    label: "14 Days",
    description: "Extended reach campaign"
  },
  {
    days: 21,
    feeInMobi: 25000,
    label: "21 Days",
    description: "Comprehensive coverage",
    popular: true
  },
  {
    days: 30,
    feeInMobi: 32000,
    label: "30 Days",
    description: "Full month visibility"
  },
  {
    days: 45,
    feeInMobi: 40000,
    label: "45 Days",
    description: "Extended campaign period"
  },
  {
    days: 60,
    feeInMobi: 55000,
    label: "60 Days",
    description: "Extended two-month campaign"
  },
  {
    days: 90,
    feeInMobi: 75000,
    label: "90 Days",
    description: "Maximum exposure quarter"
  }
];

// Default Fee Distribution Configuration
export const defaultFeeDistributionConfig: FeeDistributionConfig = {
  id: "fee-dist-001",
  communityPercentage: 60,
  mobigatePercentage: 40,
  lastUpdatedBy: "System Admin",
  lastUpdatedAt: new Date("2024-01-15T10:00:00"),
  isActive: true
};

// Mock Fee Distribution History
export const mockFeeDistributionHistory: FeeDistributionHistory[] = [
  {
    id: "history-001",
    previousCommunityPercentage: 50,
    previousMobigatePercentage: 50,
    newCommunityPercentage: 60,
    newMobigatePercentage: 40,
    changedBy: "Mobigate Admin",
    changedAt: new Date("2024-01-15T10:00:00"),
    reason: "Increased community share to incentivize local campaigns"
  },
  {
    id: "history-002",
    previousCommunityPercentage: 55,
    previousMobigatePercentage: 45,
    newCommunityPercentage: 50,
    newMobigatePercentage: 50,
    changedBy: "System Admin",
    changedAt: new Date("2023-12-01T14:30:00"),
    reason: "Initial equal distribution"
  }
];

// Mock Campaign Feedbacks
const generateMockFeedbacks = (campaignId: string, count: number): CampaignFeedback[] => {
  const feedbackTexts = [
    "I really appreciate your focus on community development. Looking forward to seeing these plans implemented!",
    "Your manifesto addresses the issues we've been facing. You have my support.",
    "Can you elaborate more on your education policy? I'd like to understand the specifics.",
    "Great campaign! Your transparency is refreshing.",
    "I've seen your previous work in the community. Keep it up!",
    "How do you plan to fund these initiatives? Would love more details.",
    "Your priorities align with what our community needs right now.",
    "Impressive track record. Wishing you success in this election!",
    "Please consider adding youth employment to your priorities.",
    "Finally, someone who understands our local challenges!"
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `feedback-${campaignId}-${i + 1}`,
    campaignId,
    feedbackText: feedbackTexts[i % feedbackTexts.length],
    submittedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    anonymousId: `Viewer #${Math.floor(1000 + Math.random() * 9000)}`,
    isRead: Math.random() > 0.3
  }));
};

// Mock Enhanced Campaigns
export const mockEnhancedCampaigns: EnhancedCampaign[] = [
  {
    id: "camp-001",
    candidateId: "cand-001",
    candidateName: "Chief Adebayo Okonkwo",
    candidatePhoto: "https://randomuser.me/api/portraits/men/32.jpg",
    communityName: "Nigerian Professional Association",
    office: "President",
    tagline: "Building Tomorrow, Together",
    manifesto: "As your President, I pledge to prioritize transparency, economic development, and community unity. My administration will focus on creating opportunities for our youth, improving infrastructure, and ensuring every voice is heard in our governance.",
    campaignImage: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800",
    priorities: [
      { id: "p1", title: "Youth Employment", description: "Create 500 new job opportunities" },
      { id: "p2", title: "Infrastructure", description: "Improve roads and public facilities" },
      { id: "p3", title: "Education", description: "Scholarship programs for students" },
      { id: "p4", title: "Healthcare", description: "Community health center improvements" }
    ],
    audienceTargets: ["community_interface", "members_interface", "mobigate_interface"],
    durationDays: 21,
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-02-22"),
    baseFee: 2500,
    audiencePremium: 1750,
    totalFeeInMobi: 4250,
    communityShare: 2550,
    mobigateShare: 1700,
    paymentStatus: "paid",
    paidAt: new Date("2024-01-31"),
    views: 1247,
    clicks: 389,
    feedbackCount: 28,
    status: "active",
    createdAt: new Date("2024-01-30"),
    updatedAt: new Date("2024-02-01"),
    feedbacks: generateMockFeedbacks("camp-001", 28)
  },
  {
    id: "camp-002",
    candidateId: "cand-002",
    candidateName: "Dr. Amina Bello",
    candidatePhoto: "https://randomuser.me/api/portraits/women/44.jpg",
    communityName: "Nigerian Professional Association",
    office: "Vice President",
    tagline: "Excellence Through Service",
    manifesto: "With over 15 years of community service, I bring experience and dedication to the office of Vice President. My focus will be on strengthening our community bonds, promoting education, and ensuring sustainable development.",
    campaignImage: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800",
    priorities: [
      { id: "p1", title: "Community Unity", description: "Bridge-building initiatives" },
      { id: "p2", title: "Women Empowerment", description: "Support programs for women entrepreneurs" },
      { id: "p3", title: "Environmental Care", description: "Green community initiatives" }
    ],
    audienceTargets: ["community_interface", "mobi_store_marketplace"],
    durationDays: 14,
    startDate: new Date("2024-02-05"),
    endDate: new Date("2024-02-19"),
    baseFee: 1800,
    audiencePremium: 540,
    totalFeeInMobi: 2340,
    communityShare: 1404,
    mobigateShare: 936,
    paymentStatus: "paid",
    paidAt: new Date("2024-02-04"),
    views: 856,
    clicks: 234,
    feedbackCount: 15,
    status: "active",
    createdAt: new Date("2024-02-03"),
    updatedAt: new Date("2024-02-05"),
    feedbacks: generateMockFeedbacks("camp-002", 15)
  },
  {
    id: "camp-003",
    candidateId: "cand-003",
    candidateName: "Engr. Michael Eze",
    candidatePhoto: "https://randomuser.me/api/portraits/men/52.jpg",
    communityName: "Engineering Guild of Lagos",
    office: "Financial Secretary",
    tagline: "Accountability First",
    manifesto: "As a certified accountant with a track record of financial management, I commit to bringing transparency and accountability to our community's finances. Every naira will be accounted for.",
    priorities: [
      { id: "p1", title: "Financial Transparency", description: "Monthly public financial reports" },
      { id: "p2", title: "Cost Reduction", description: "Optimize community spending" },
      { id: "p3", title: "Investment", description: "Grow community reserves" }
    ],
    audienceTargets: ["community_interface"],
    durationDays: 7,
    startDate: new Date("2024-02-10"),
    endDate: new Date("2024-02-17"),
    baseFee: 1000,
    audiencePremium: 0,
    totalFeeInMobi: 1000,
    communityShare: 600,
    mobigateShare: 400,
    paymentStatus: "paid",
    paidAt: new Date("2024-02-09"),
    views: 423,
    clicks: 98,
    feedbackCount: 8,
    status: "active",
    createdAt: new Date("2024-02-08"),
    updatedAt: new Date("2024-02-10"),
    feedbacks: generateMockFeedbacks("camp-003", 8)
  },
  {
    id: "camp-004",
    candidateId: "cand-004",
    candidateName: "Mrs. Grace Nnamdi",
    candidatePhoto: "https://randomuser.me/api/portraits/women/28.jpg",
    communityName: "Women In Tech Africa",
    office: "Welfare Officer",
    tagline: "Caring for Every Member",
    manifesto: "Welfare is at the heart of community living. I will ensure that every member, young or old, receives the care and support they deserve during times of need.",
    priorities: [
      { id: "p1", title: "Emergency Support", description: "Quick response welfare fund" },
      { id: "p2", title: "Elder Care", description: "Monthly visitation programs" },
      { id: "p3", title: "Health Insurance", description: "Group health coverage scheme" }
    ],
    audienceTargets: ["community_interface", "mobigate_users"],
    durationDays: 30,
    startDate: new Date("2024-01-20"),
    endDate: new Date("2024-02-19"),
    baseFee: 3200,
    audiencePremium: 1280,
    totalFeeInMobi: 4480,
    communityShare: 2688,
    mobigateShare: 1792,
    paymentStatus: "paid",
    paidAt: new Date("2024-01-19"),
    views: 1876,
    clicks: 512,
    feedbackCount: 42,
    status: "ended",
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-02-19"),
    feedbacks: generateMockFeedbacks("camp-004", 42)
  },
  {
    id: "camp-005",
    candidateId: "cand-005",
    candidateName: "Barr. Samuel Okoro",
    candidatePhoto: "https://randomuser.me/api/portraits/men/45.jpg",
    communityName: "Nigerian Bar Association - Lagos Branch",
    office: "President",
    tagline: "Justice and Progress",
    manifesto: "Drawing from my legal background, I will ensure fair governance and protect the rights of all community members while driving progressive change.",
    priorities: [
      { id: "p1", title: "Legal Aid", description: "Free legal consultation for members" },
      { id: "p2", title: "Conflict Resolution", description: "Mediation services" },
      { id: "p3", title: "Policy Reform", description: "Update community by-laws" }
    ],
    audienceTargets: ["mobigate_interface", "mobigate_users", "mobi_store_marketplace"],
    durationDays: 60,
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-04-01"),
    baseFee: 5500,
    audiencePremium: 6600,
    totalFeeInMobi: 12100,
    communityShare: 7260,
    mobigateShare: 4840,
    paymentStatus: "pending",
    views: 0,
    clicks: 0,
    feedbackCount: 0,
    status: "pending_payment",
    createdAt: new Date("2024-01-28"),
    updatedAt: new Date("2024-01-28"),
    feedbacks: []
  }
];

// Get active campaigns for a specific audience
export const getActiveCampaignsForAudience = (audience: string): EnhancedCampaign[] => {
  return mockEnhancedCampaigns.filter(
    campaign => 
      campaign.status === "active" && 
      campaign.audienceTargets.includes(audience as any)
  );
};

// Get campaign statistics
export const getCampaignStats = () => {
  const active = mockEnhancedCampaigns.filter(c => c.status === "active").length;
  const pending = mockEnhancedCampaigns.filter(c => c.status === "pending_payment").length;
  const ended = mockEnhancedCampaigns.filter(c => c.status === "ended").length;
  const totalFees = mockEnhancedCampaigns
    .filter(c => c.paymentStatus === "paid")
    .reduce((sum, c) => sum + c.totalFeeInMobi, 0);
  const totalCommunityShare = mockEnhancedCampaigns
    .filter(c => c.paymentStatus === "paid")
    .reduce((sum, c) => sum + c.communityShare, 0);
  const totalMobigateShare = mockEnhancedCampaigns
    .filter(c => c.paymentStatus === "paid")
    .reduce((sum, c) => sum + c.mobigateShare, 0);

  return {
    active,
    pending,
    ended,
    total: mockEnhancedCampaigns.length,
    totalFees,
    totalCommunityShare,
    totalMobigateShare
  };
};
