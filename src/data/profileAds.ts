import { PremiumAdCardProps } from "@/components/PremiumAdCard";

// Friends List Ad Pool
export const friendsAdSlots: PremiumAdCardProps[][] = [
  [
    {
      id: "friends-ad-1",
      advertiser: { name: "SocialGrow Pro", verified: true, logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&q=80" },
      content: {
        headline: "Expand Your Network Instantly",
        description: "Connect with 10,000+ professionals in your industry. Build meaningful relationships.",
        ctaText: "Join Now",
        ctaUrl: "https://example.com/socialgrow",
      },
      media: {
        type: "image",
        items: [{ url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80" }],
      },
      layout: "standard",
      duration: 15,
    },
  ],
  [
    {
      id: "friends-ad-2",
      advertiser: { name: "NetworkHub", verified: true, logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&q=80" },
      content: {
        headline: "Premium Networking Events",
        description: "Join exclusive meetups and grow your professional circle.",
        ctaText: "Explore Events",
        ctaUrl: "https://example.com/networkhub",
      },
      media: {
        type: "carousel",
        items: [
          { url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80", caption: "Professional Meetups" },
          { url: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80", caption: "Networking Events" },
        ],
      },
      layout: "standard",
      duration: 15,
    },
  ],
  [
    {
      id: "friends-ad-3",
      advertiser: { name: "FriendFinder Elite", verified: false, logo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" },
      content: {
        headline: "Find Your Perfect Friend Match",
        description: "AI-powered friend recommendations based on your interests.",
        ctaText: "Get Started",
        ctaUrl: "https://example.com/friendfinder",
      },
      media: {
        type: "image",
        items: [{ url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80" }],
      },
      layout: "compact",
      duration: 15,
    },
  ],
];

// Followers List Ad Pool
export const followersAdSlots: PremiumAdCardProps[][] = [
  [
    {
      id: "followers-ad-1",
      advertiser: { name: "Influencer Hub", verified: true, logo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80" },
      content: {
        headline: "Turn Followers Into Fans",
        description: "Advanced analytics and engagement tools for creators. Grow your influence today.",
        ctaText: "Get Started",
        ctaUrl: "https://example.com/influencer",
      },
      media: {
        type: "carousel",
        items: [
          { url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80", caption: "Analytics Dashboard" },
          { url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80", caption: "Growth Tracking" },
        ],
      },
      layout: "standard",
      duration: 15,
    },
  ],
  [
    {
      id: "followers-ad-2",
      advertiser: { name: "SocialBoost", verified: true, logo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80" },
      content: {
        headline: "Grow Your Audience 10X Faster",
        description: "Proven strategies to increase your follower count organically.",
        ctaText: "Learn More",
        ctaUrl: "https://example.com/socialboost",
      },
      media: {
        type: "image",
        items: [{ url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&q=80" }],
      },
      layout: "standard",
      duration: 15,
    },
  ],
  [
    {
      id: "followers-ad-3",
      advertiser: { name: "FanBase Pro", verified: false, logo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80" },
      content: {
        headline: "Monetize Your Followers",
        description: "Turn your audience into income streams.",
        ctaText: "Start Earning",
        ctaUrl: "https://example.com/fanbase",
      },
      media: {
        type: "image",
        items: [{ url: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200&q=80" }],
      },
      layout: "compact",
      duration: 15,
    },
  ],
];

// Following List Ad Pool
export const followingAdSlots: PremiumAdCardProps[][] = [
  [
    {
      id: "following-ad-1",
      advertiser: { name: "ContentDiscover", verified: true, logo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80" },
      content: {
        headline: "Discover Trending Creators",
        description: "Follow the hottest new content creators in your niche. Never miss a trend.",
        ctaText: "Explore Now",
        ctaUrl: "https://example.com/contentdiscover",
      },
      media: {
        type: "image",
        items: [{ url: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1200&q=80" }],
      },
      layout: "standard",
      duration: 15,
    },
  ],
  [
    {
      id: "following-ad-2",
      advertiser: { name: "TrendWatcher", verified: true, logo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&q=80" },
      content: {
        headline: "Stay Ahead of Trends",
        description: "AI-powered recommendations for must-follow accounts.",
        ctaText: "Try It Free",
        ctaUrl: "https://example.com/trendwatcher",
      },
      media: {
        type: "carousel",
        items: [
          { url: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80", caption: "Trending Content" },
          { url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80", caption: "Popular Creators" },
        ],
      },
      layout: "standard",
      duration: 15,
    },
  ],
];

// Likes List Ad Pool
export const likesAdSlots: PremiumAdCardProps[][] = [
  [
    {
      id: "likes-ad-1",
      advertiser: { name: "EngageMax", verified: true, logo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80" },
      content: {
        headline: "Boost Your Engagement",
        description: "Get more likes, comments, and shares on every post. Premium engagement tools.",
        ctaText: "Start Now",
        ctaUrl: "https://example.com/engagemax",
      },
      media: {
        type: "image",
        items: [{ url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80" }],
      },
      layout: "standard",
      duration: 15,
    },
  ],
  [
    {
      id: "likes-ad-2",
      advertiser: { name: "SocialMetrics", verified: false, logo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&q=80" },
      content: {
        headline: "Track Your Popularity",
        description: "Detailed analytics on who likes your content.",
        ctaText: "View Analytics",
        ctaUrl: "https://example.com/socialmetrics",
      },
      media: {
        type: "image",
        items: [{ url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80" }],
      },
      layout: "compact",
      duration: 15,
    },
  ],
];

// Albums Photos Ad Pool
export const albumPhotosAdSlots: PremiumAdCardProps[][] = [
  [
    {
      id: "album-photos-ad-1",
      advertiser: { name: "PhotoPro Studio", verified: true, logo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80" },
      content: {
        headline: "Professional Photo Editing",
        description: "Transform your photos with AI-powered editing tools. Studio-quality results in seconds.",
        ctaText: "Try Free",
        ctaUrl: "https://example.com/photopro",
      },
      media: {
        type: "carousel",
        items: [
          { url: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80", caption: "Before", price: "$0" },
          { url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80", caption: "After", price: "$9.99/mo" },
        ],
      },
      layout: "standard",
      duration: 15,
    },
  ],
  [
    {
      id: "album-photos-ad-2",
      advertiser: { name: "CloudAlbum", verified: true, logo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" },
      content: {
        headline: "Unlimited Photo Storage",
        description: "Never lose a memory. Secure cloud storage for all your photos.",
        ctaText: "Get Started",
        ctaUrl: "https://example.com/cloudalbum",
      },
      media: {
        type: "image",
        items: [{ url: "https://images.unsplash.com/photo-1488998427799-e3362cec87c3?w=1200&q=80" }],
      },
      layout: "compact",
      duration: 15,
    },
  ],
];

// Albums Videos Ad Pool
export const albumVideosAdSlots: PremiumAdCardProps[][] = [
  [
    {
      id: "album-videos-ad-1",
      advertiser: { name: "VideoEdit Pro", verified: true, logo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" },
      content: {
        headline: "Edit Videos Like a Pro",
        description: "Professional video editing made simple. Create stunning content in minutes.",
        ctaText: "Start Creating",
        ctaUrl: "https://example.com/videoedit",
      },
      media: {
        type: "video",
        items: [{ url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" }],
      },
      layout: "standard",
      duration: 15,
    },
  ],
  [
    {
      id: "album-videos-ad-2",
      advertiser: { name: "StreamCloud", verified: false, logo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&q=80" },
      content: {
        headline: "4K Video Hosting",
        description: "Host and share your videos in crystal clear quality.",
        ctaText: "Upload Now",
        ctaUrl: "https://example.com/streamcloud",
      },
      media: {
        type: "image",
        items: [{ url: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=1200&q=80" }],
      },
      layout: "compact",
      duration: 15,
    },
  ],
];

// Albums Carousel Ad Pool
export const albumsCarouselAdSlots: PremiumAdCardProps[][] = [
  [
    {
      id: "albums-carousel-ad-1",
      advertiser: { name: "PhotoCloud Pro", verified: true, logo: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=100&q=80" },
      content: {
        headline: "Organize Your Memories",
        description: "Smart albums that auto-organize your photos by date, location, and people.",
        ctaText: "Try Free",
        ctaUrl: "https://example.com/photocloud",
      },
      media: {
        type: "carousel",
        items: [
          { url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80", caption: "Auto Organization" },
          { url: "https://images.unsplash.com/photo-1516542076529-1ea3854896f2?w=800&q=80", caption: "Smart Albums" },
        ],
      },
      layout: "standard",
      duration: 15,
    },
  ],
  [
    {
      id: "albums-carousel-ad-2",
      advertiser: { name: "AlbumShare", verified: true, logo: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=100&q=80" },
      content: {
        headline: "Share Albums Instantly",
        description: "Create shareable links for your albums. No app required.",
        ctaText: "Get Started",
        ctaUrl: "https://example.com/albumshare",
      },
      media: {
        type: "image",
        items: [{ url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80" }],
      },
      layout: "compact",
      duration: 15,
    },
  ],
  [
    {
      id: "albums-carousel-ad-3",
      advertiser: { name: "MemoryVault", verified: true, logo: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?w=100&q=80" },
      content: {
        headline: "Secure Cloud Storage",
        description: "Store unlimited albums with military-grade encryption. Never lose a memory.",
        ctaText: "Protect Now",
        ctaUrl: "https://example.com/memoryvault",
      },
      media: {
        type: "image",
        items: [{ url: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80" }],
      },
      layout: "standard",
      duration: 15,
    },
  ],
];

// Contents Tab Ad Pool
export const contentsAdSlots: PremiumAdCardProps[][] = [
  [
    {
      id: "contents-ad-1",
      advertiser: { 
        name: "ContentBoost Pro", 
        verified: true, 
        logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&q=80" 
      },
      content: {
        headline: "Amplify Your Content Reach",
        description: "Advanced content promotion tools. Get 50% more views on your posts.",
        ctaText: "Start Free Trial",
        ctaUrl: "https://example.com/contentboost",
      },
      media: {
        type: "image",
        items: [{ url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80" }],
      },
      layout: "standard",
      duration: 15,
    },
  ],
  [
    {
      id: "contents-ad-2",
      advertiser: { 
        name: "Creator Studio", 
        verified: true, 
        logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&q=80" 
      },
      content: {
        headline: "Professional Content Creation Tools",
        description: "Video editing, graphic design, and analytics - all in one platform.",
        ctaText: "Explore Tools",
        ctaUrl: "https://example.com/creatorstudio",
      },
      media: {
        type: "carousel",
        items: [
          { url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80", caption: "Video Editor" },
          { url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80", caption: "Design Studio" },
          { url: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80", caption: "Analytics Dashboard" },
        ],
      },
      layout: "standard",
      duration: 15,
    },
  ],
  [
    {
      id: "contents-ad-3",
      advertiser: { 
        name: "MediaMaster", 
        verified: false, 
        logo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" 
      },
      content: {
        headline: "Monetize Your Content Today",
        description: "Turn your passion into profit. Join 50,000+ creators earning online.",
        ctaText: "Join Now",
        ctaUrl: "https://example.com/mediamaster",
      },
      media: {
        type: "image",
        items: [{ url: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&q=80" }],
      },
      layout: "compact",
      duration: 15,
    },
  ],
];
