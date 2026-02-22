import { mockMerchants } from "./mobigateInteractiveQuizData";

export interface MerchantGalleryItem {
  id: string;
  url: string;
  caption: string;
  type: "photo" | "video";
}

export interface MerchantLink {
  id: string;
  label: string;
  url: string;
  icon: "globe" | "facebook" | "twitter" | "instagram" | "youtube" | "linkedin";
}

export interface MerchantHomeData {
  merchantId: string;
  followers: number;
  likes: number;
  coverImage: string;
  gallery: MerchantGalleryItem[];
  videoHighlights: MerchantGalleryItem[];
  links: MerchantLink[];
  about: string;
}

export const merchantHomeDataMap: Record<string, MerchantHomeData> = {
  m1: {
    merchantId: "m1",
    followers: 12400,
    likes: 34200,
    coverImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
    about: "Nigeria's leading tech innovation hub. We empower the next generation through interactive quizzes, hackathons, and tech meetups.",
    gallery: [
      { id: "g1", url: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&q=80", caption: "Our Tech Lab", type: "photo" },
      { id: "g2", url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&q=80", caption: "Coding Bootcamp 2025", type: "photo" },
      { id: "g3", url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80", caption: "Hardware Workshop", type: "photo" },
      { id: "g4", url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80", caption: "Developer Conference", type: "photo" },
      { id: "g5", url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&q=80", caption: "Team Collaboration", type: "photo" },
    ],
    videoHighlights: [
      { id: "v1", url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&q=80", caption: "Season 1 Finale Highlights", type: "video" },
      { id: "v2", url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=80", caption: "Winners Interview", type: "video" },
      { id: "v3", url: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&q=80", caption: "Behind the Scenes", type: "video" },
    ],
    links: [
      { id: "l1", label: "Official Website", url: "https://techventures.ng", icon: "globe" },
      { id: "l2", label: "Facebook Page", url: "https://facebook.com/techventuresng", icon: "facebook" },
      { id: "l3", label: "Twitter / X", url: "https://x.com/techventuresng", icon: "twitter" },
      { id: "l4", label: "Instagram", url: "https://instagram.com/techventuresng", icon: "instagram" },
      { id: "l5", label: "YouTube Channel", url: "https://youtube.com/@techventuresng", icon: "youtube" },
    ],
  },
  m2: {
    merchantId: "m2",
    followers: 8700,
    likes: 21500,
    coverImage: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&q=80",
    about: "Your one-stop supermarket for fresh groceries, household essentials, and amazing deals. Join our quiz shows for incredible prizes!",
    gallery: [
      { id: "g1", url: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80", caption: "Fresh Produce Section", type: "photo" },
      { id: "g2", url: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=400&q=80", caption: "Grand Opening", type: "photo" },
      { id: "g3", url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80", caption: "Shopping Experience", type: "photo" },
    ],
    videoHighlights: [
      { id: "v1", url: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&q=80", caption: "Shopping Spree Quiz Promo", type: "video" },
    ],
    links: [
      { id: "l1", label: "Official Website", url: "https://foodco.ng", icon: "globe" },
      { id: "l2", label: "Instagram", url: "https://instagram.com/foodcong", icon: "instagram" },
    ],
  },
  m3: {
    merchantId: "m3",
    followers: 15600,
    likes: 45800,
    coverImage: "https://images.unsplash.com/photo-1523050854058-8df90110c476?w=800&q=80",
    about: "Premier educational institution offering world-class learning experiences. Our quiz competitions bring education to life!",
    gallery: [
      { id: "g1", url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80", caption: "Campus View", type: "photo" },
      { id: "g2", url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&q=80", caption: "Lecture Hall", type: "photo" },
      { id: "g3", url: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400&q=80", caption: "Graduation Day", type: "photo" },
      { id: "g4", url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&q=80", caption: "Student Activities", type: "photo" },
    ],
    videoHighlights: [
      { id: "v1", url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400&q=80", caption: "Quiz Competition Highlights", type: "video" },
      { id: "v2", url: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=400&q=80", caption: "Campus Tour", type: "video" },
    ],
    links: [
      { id: "l1", label: "Official Website", url: "https://edufirst.edu.ng", icon: "globe" },
      { id: "l2", label: "LinkedIn", url: "https://linkedin.com/company/edufirst", icon: "linkedin" },
      { id: "l3", label: "YouTube Channel", url: "https://youtube.com/@edufirst", icon: "youtube" },
    ],
  },
};

// Fallback data for merchants not in the map (e.g. location-based merchants)
const fallbackGallery: MerchantGalleryItem[] = [
  { id: "fg1", url: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=400&q=80", caption: "Store Front", type: "photo" },
  { id: "fg2", url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80", caption: "Products Display", type: "photo" },
  { id: "fg3", url: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&q=80", caption: "Shopping Experience", type: "photo" },
  { id: "fg4", url: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&q=80", caption: "Grand Opening", type: "photo" },
  { id: "fg5", url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80", caption: "Customer Service", type: "photo" },
  { id: "fg6", url: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&q=80", caption: "Special Offers", type: "photo" },
];

const fallbackVideos: MerchantGalleryItem[] = [
  { id: "fv1", url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80", caption: "Business Highlights", type: "video" },
  { id: "fv2", url: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&q=80", caption: "Behind the Scenes", type: "video" },
  { id: "fv3", url: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&q=80", caption: "Community Event Recap", type: "video" },
];

const fallbackLinks: MerchantLink[] = [
  { id: "fl1", label: "Official Website", url: "https://example.com", icon: "globe" },
  { id: "fl2", label: "Facebook Page", url: "https://facebook.com", icon: "facebook" },
  { id: "fl3", label: "Instagram", url: "https://instagram.com", icon: "instagram" },
  { id: "fl4", label: "Twitter / X", url: "https://x.com", icon: "twitter" },
];

export function getMerchantHomeData(merchantId: string): MerchantHomeData {
  if (merchantHomeDataMap[merchantId]) return merchantHomeDataMap[merchantId];
  
  // Generate fallback data for any merchant
  return {
    merchantId,
    followers: 2400 + Math.floor(merchantId.charCodeAt(merchantId.length - 1) * 100),
    likes: 5600 + Math.floor(merchantId.charCodeAt(merchantId.length - 1) * 200),
    coverImage: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=800&q=80",
    about: "Welcome to our business! We offer the best products and services in the area. Follow us for updates, events, and exciting quiz competitions.",
    gallery: fallbackGallery,
    videoHighlights: fallbackVideos,
    links: fallbackLinks,
  };
}

export function formatCount(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}
