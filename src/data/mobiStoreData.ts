export interface StoreProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: "merchandise" | "services" | "digital";
  image: string;
  inStock: boolean;
  featured: boolean;
}

export interface StoreCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const storeCategories: StoreCategory[] = [
  {
    id: "merchandise",
    name: "Community Merchandise",
    description: "Official branded items and souvenirs",
    icon: "ShoppingBag"
  },
  {
    id: "services",
    name: "Services",
    description: "Professional services from community members",
    icon: "Briefcase"
  },
  {
    id: "digital",
    name: "Digital Products",
    description: "E-books, courses, and digital content",
    icon: "Download"
  }
];

export const storeProducts: StoreProduct[] = [
  {
    id: "prod-1",
    name: "Community T-Shirt (Premium)",
    description: "High-quality cotton t-shirt with embroidered community logo. Available in multiple sizes and colors.",
    price: 2500,
    currency: "NGN",
    category: "merchandise",
    image: "/placeholder.svg",
    inStock: true,
    featured: true
  },
  {
    id: "prod-2",
    name: "Official Community Cap",
    description: "Adjustable snapback cap with embroidered logo. Perfect for events and casual wear.",
    price: 1500,
    currency: "NGN",
    category: "merchandise",
    image: "/placeholder.svg",
    inStock: true,
    featured: true
  },
  {
    id: "prod-3",
    name: "Community Hoodie",
    description: "Warm and comfortable hoodie with printed community emblem. Premium quality fabric.",
    price: 5000,
    currency: "NGN",
    category: "merchandise",
    image: "/placeholder.svg",
    inStock: true,
    featured: false
  },
  {
    id: "prod-4",
    name: "Community Mug Set (2pcs)",
    description: "Ceramic mug set with community logo. Microwave and dishwasher safe.",
    price: 3000,
    currency: "NGN",
    category: "merchandise",
    image: "/placeholder.svg",
    inStock: true,
    featured: false
  },
  {
    id: "prod-5",
    name: "Professional Photography Service",
    description: "Event photography by certified community photographers. Includes editing and digital delivery.",
    price: 25000,
    currency: "NGN",
    category: "services",
    image: "/placeholder.svg",
    inStock: true,
    featured: true
  },
  {
    id: "prod-6",
    name: "Legal Consultation (1 Hour)",
    description: "Professional legal advice from community lawyers. Online or in-person sessions available.",
    price: 15000,
    currency: "NGN",
    category: "services",
    image: "/placeholder.svg",
    inStock: true,
    featured: false
  },
  {
    id: "prod-7",
    name: "Catering Services",
    description: "Full-service catering for community events. Customizable menu options available.",
    price: 50000,
    currency: "NGN",
    category: "services",
    image: "/placeholder.svg",
    inStock: true,
    featured: false
  },
  {
    id: "prod-8",
    name: "Community History E-Book",
    description: "Comprehensive digital book covering the history and heritage of our community. PDF format with images.",
    price: 1000,
    currency: "NGN",
    category: "digital",
    image: "/placeholder.svg",
    inStock: true,
    featured: true
  },
  {
    id: "prod-9",
    name: "Online Leadership Course",
    description: "12-week online course on community leadership and management. Includes certificate upon completion.",
    price: 8000,
    currency: "NGN",
    category: "digital",
    image: "/placeholder.svg",
    inStock: true,
    featured: false
  },
  {
    id: "prod-10",
    name: "Traditional Recipe Collection",
    description: "Digital cookbook featuring 50+ traditional recipes from community members.",
    price: 1500,
    currency: "NGN",
    category: "digital",
    image: "/placeholder.svg",
    inStock: true,
    featured: false
  }
];

export const comingSoonMessage = {
  title: "Coming to Your Community Soon!",
  description: "The Mobi-Store will enable your community to sell products and services directly to members. Features include secure payments, inventory management, and order tracking.",
  benefits: [
    "Sell community merchandise and branded items",
    "Offer services from community members",
    "Distribute digital products and content",
    "Integrated payment processing",
    "Automated order management"
  ]
};
