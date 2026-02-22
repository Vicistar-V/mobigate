// Nigerian States, LGAs, and Cities mock data for merchant browsing

export interface NigerianState {
  id: string;
  name: string;
  capital: string;
  lgas: NigerianLGA[];
}

export interface NigerianLGA {
  id: string;
  name: string;
  stateId: string;
  cities: NigerianCity[];
}

export interface NigerianCity {
  id: string;
  name: string;
  lgaId: string;
  stateId: string;
}

export const nigerianStates: NigerianState[] = [
  {
    id: "lagos",
    name: "Lagos",
    capital: "Ikeja",
    lgas: [
      {
        id: "lagos-island",
        name: "Lagos Island",
        stateId: "lagos",
        cities: [
          { id: "lagos-island-main", name: "Lagos Island", lgaId: "lagos-island", stateId: "lagos" },
          { id: "marina", name: "Marina", lgaId: "lagos-island", stateId: "lagos" },
        ],
      },
      {
        id: "ikeja",
        name: "Ikeja",
        stateId: "lagos",
        cities: [
          { id: "ikeja-city", name: "Ikeja", lgaId: "ikeja", stateId: "lagos" },
          { id: "alausa", name: "Alausa", lgaId: "ikeja", stateId: "lagos" },
          { id: "oregun", name: "Oregun", lgaId: "ikeja", stateId: "lagos" },
        ],
      },
      {
        id: "eti-osa",
        name: "Eti-Osa",
        stateId: "lagos",
        cities: [
          { id: "lekki", name: "Lekki", lgaId: "eti-osa", stateId: "lagos" },
          { id: "vi", name: "Victoria Island", lgaId: "eti-osa", stateId: "lagos" },
          { id: "ikoyi", name: "Ikoyi", lgaId: "eti-osa", stateId: "lagos" },
        ],
      },
      {
        id: "surulere",
        name: "Surulere",
        stateId: "lagos",
        cities: [
          { id: "surulere-city", name: "Surulere", lgaId: "surulere", stateId: "lagos" },
          { id: "aguda", name: "Aguda", lgaId: "surulere", stateId: "lagos" },
        ],
      },
    ],
  },
  {
    id: "abuja",
    name: "FCT Abuja",
    capital: "Abuja",
    lgas: [
      {
        id: "abuja-municipal",
        name: "Abuja Municipal",
        stateId: "abuja",
        cities: [
          { id: "garki", name: "Garki", lgaId: "abuja-municipal", stateId: "abuja" },
          { id: "wuse", name: "Wuse", lgaId: "abuja-municipal", stateId: "abuja" },
          { id: "maitama", name: "Maitama", lgaId: "abuja-municipal", stateId: "abuja" },
        ],
      },
      {
        id: "gwagwalada",
        name: "Gwagwalada",
        stateId: "abuja",
        cities: [
          { id: "gwagwalada-city", name: "Gwagwalada", lgaId: "gwagwalada", stateId: "abuja" },
        ],
      },
    ],
  },
  {
    id: "rivers",
    name: "Rivers",
    capital: "Port Harcourt",
    lgas: [
      {
        id: "ph-city",
        name: "Port Harcourt City",
        stateId: "rivers",
        cities: [
          { id: "ph-main", name: "Port Harcourt", lgaId: "ph-city", stateId: "rivers" },
          { id: "dline", name: "D/Line", lgaId: "ph-city", stateId: "rivers" },
        ],
      },
      {
        id: "obio-akpor",
        name: "Obio/Akpor",
        stateId: "rivers",
        cities: [
          { id: "rumuokoro", name: "Rumuokoro", lgaId: "obio-akpor", stateId: "rivers" },
          { id: "choba", name: "Choba", lgaId: "obio-akpor", stateId: "rivers" },
        ],
      },
    ],
  },
  {
    id: "kano",
    name: "Kano",
    capital: "Kano",
    lgas: [
      {
        id: "kano-municipal",
        name: "Kano Municipal",
        stateId: "kano",
        cities: [
          { id: "kano-city", name: "Kano City", lgaId: "kano-municipal", stateId: "kano" },
        ],
      },
      {
        id: "fagge",
        name: "Fagge",
        stateId: "kano",
        cities: [
          { id: "fagge-city", name: "Fagge", lgaId: "fagge", stateId: "kano" },
        ],
      },
    ],
  },
  {
    id: "oyo",
    name: "Oyo",
    capital: "Ibadan",
    lgas: [
      {
        id: "ibadan-north",
        name: "Ibadan North",
        stateId: "oyo",
        cities: [
          { id: "bodija", name: "Bodija", lgaId: "ibadan-north", stateId: "oyo" },
          { id: "ui", name: "University of Ibadan", lgaId: "ibadan-north", stateId: "oyo" },
        ],
      },
      {
        id: "ibadan-south",
        name: "Ibadan South-West",
        stateId: "oyo",
        cities: [
          { id: "ring-road", name: "Ring Road", lgaId: "ibadan-south", stateId: "oyo" },
        ],
      },
    ],
  },
  {
    id: "enugu",
    name: "Enugu",
    capital: "Enugu",
    lgas: [
      {
        id: "enugu-north",
        name: "Enugu North",
        stateId: "enugu",
        cities: [
          { id: "ogui", name: "Ogui", lgaId: "enugu-north", stateId: "enugu" },
          { id: "independence-layout", name: "Independence Layout", lgaId: "enugu-north", stateId: "enugu" },
        ],
      },
    ],
  },
  {
    id: "edo",
    name: "Edo",
    capital: "Benin City",
    lgas: [
      {
        id: "oredo",
        name: "Oredo",
        stateId: "edo",
        cities: [
          { id: "benin-city", name: "Benin City", lgaId: "oredo", stateId: "edo" },
        ],
      },
    ],
  },
  {
    id: "imo",
    name: "Imo",
    capital: "Owerri",
    lgas: [
      {
        id: "owerri-municipal",
        name: "Owerri Municipal",
        stateId: "imo",
        cities: [
          { id: "owerri-city", name: "Owerri", lgaId: "owerri-municipal", stateId: "imo" },
        ],
      },
    ],
  },
];

// Extended merchant type with Nigerian location data
export interface LocationMerchant {
  id: string;
  name: string;
  logo: string;
  category: string;
  rating: number;
  isVerified: boolean;
  isActive: boolean;
  discountPercent: number;
  countryId: string;
  countryName: string;
  countryFlag: string;
  stateId?: string;
  stateName?: string;
  lgaId?: string;
  lgaName?: string;
  cityId?: string;
  cityName?: string;
}

// Combine all merchants with location info
export const allLocationMerchants: LocationMerchant[] = [
  // Nigeria - Lagos
  { id: "ng-001", name: "Mobi-Express Lagos", logo: "/placeholder.svg", category: "Fintech", rating: 4.8, isVerified: true, isActive: true, discountPercent: 5, countryId: "ng", countryName: "Nigeria", countryFlag: "🇳🇬", stateId: "lagos", stateName: "Lagos", lgaId: "eti-osa", lgaName: "Eti-Osa", cityId: "lekki", cityName: "Lekki" },
  { id: "ng-010", name: "TechVentures Nigeria", logo: "/placeholder.svg", category: "Technology", rating: 4.9, isVerified: true, isActive: true, discountPercent: 8, countryId: "ng", countryName: "Nigeria", countryFlag: "🇳🇬", stateId: "lagos", stateName: "Lagos", lgaId: "ikeja", lgaName: "Ikeja", cityId: "ikeja-city", cityName: "Ikeja" },
  { id: "ng-011", name: "Lagos Digital Hub", logo: "/placeholder.svg", category: "E-Commerce", rating: 4.6, isVerified: true, isActive: true, discountPercent: 10, countryId: "ng", countryName: "Nigeria", countryFlag: "🇳🇬", stateId: "lagos", stateName: "Lagos", lgaId: "surulere", lgaName: "Surulere", cityId: "surulere-city", cityName: "Surulere" },
  { id: "ng-012", name: "Island Mobi Market", logo: "/placeholder.svg", category: "Retail", rating: 4.5, isVerified: true, isActive: true, discountPercent: 6, countryId: "ng", countryName: "Nigeria", countryFlag: "🇳🇬", stateId: "lagos", stateName: "Lagos", lgaId: "lagos-island", lgaName: "Lagos Island", cityId: "marina", cityName: "Marina" },
  // Nigeria - Abuja
  { id: "ng-002", name: "QuickPay Solutions", logo: "/placeholder.svg", category: "Payments", rating: 4.5, isVerified: true, isActive: true, discountPercent: 3, countryId: "ng", countryName: "Nigeria", countryFlag: "🇳🇬", stateId: "abuja", stateName: "FCT Abuja", lgaId: "abuja-municipal", lgaName: "Abuja Municipal", cityId: "wuse", cityName: "Wuse" },
  { id: "ng-013", name: "Abuja Premium Store", logo: "/placeholder.svg", category: "Luxury", rating: 4.7, isVerified: true, isActive: true, discountPercent: 4, countryId: "ng", countryName: "Nigeria", countryFlag: "🇳🇬", stateId: "abuja", stateName: "FCT Abuja", lgaId: "abuja-municipal", lgaName: "Abuja Municipal", cityId: "maitama", cityName: "Maitama" },
  // Nigeria - Rivers
  { id: "ng-003", name: "VoucherHub Nigeria", logo: "/placeholder.svg", category: "Vouchers", rating: 4.7, isVerified: true, isActive: true, discountPercent: 8, countryId: "ng", countryName: "Nigeria", countryFlag: "🇳🇬", stateId: "rivers", stateName: "Rivers", lgaId: "ph-city", lgaName: "Port Harcourt City", cityId: "ph-main", cityName: "Port Harcourt" },
  // Nigeria - Kano
  { id: "ng-004", name: "Naira2Mobi Store", logo: "/placeholder.svg", category: "Mobile Top-up", rating: 4.3, isVerified: true, isActive: true, discountPercent: 10, countryId: "ng", countryName: "Nigeria", countryFlag: "🇳🇬", stateId: "kano", stateName: "Kano", lgaId: "kano-municipal", lgaName: "Kano Municipal", cityId: "kano-city", cityName: "Kano City" },
  // Nigeria - Oyo
  { id: "ng-005", name: "FastCredit Ibadan", logo: "/placeholder.svg", category: "Finance", rating: 4.6, isVerified: true, isActive: true, discountPercent: 7, countryId: "ng", countryName: "Nigeria", countryFlag: "🇳🇬", stateId: "oyo", stateName: "Oyo", lgaId: "ibadan-north", lgaName: "Ibadan North", cityId: "bodija", cityName: "Bodija" },
  // Nigeria - Enugu
  { id: "ng-006", name: "9ja Mobi Deals", logo: "/placeholder.svg", category: "Deals", rating: 4.4, isVerified: true, isActive: true, discountPercent: 12, countryId: "ng", countryName: "Nigeria", countryFlag: "🇳🇬", stateId: "enugu", stateName: "Enugu", lgaId: "enugu-north", lgaName: "Enugu North", cityId: "ogui", cityName: "Ogui" },
  // Nigeria - Edo
  { id: "ng-007", name: "PayFast Benin", logo: "/placeholder.svg", category: "Payments", rating: 4.2, isVerified: true, isActive: true, discountPercent: 6, countryId: "ng", countryName: "Nigeria", countryFlag: "🇳🇬", stateId: "edo", stateName: "Edo", lgaId: "oredo", lgaName: "Oredo", cityId: "benin-city", cityName: "Benin City" },
  // Nigeria - Imo
  { id: "ng-008", name: "MobiKing Owerri", logo: "/placeholder.svg", category: "Mobile", rating: 4.9, isVerified: true, isActive: true, discountPercent: 15, countryId: "ng", countryName: "Nigeria", countryFlag: "🇳🇬", stateId: "imo", stateName: "Imo", lgaId: "owerri-municipal", lgaName: "Owerri Municipal", cityId: "owerri-city", cityName: "Owerri" },
  // Ghana
  { id: "gh-001", name: "Accra Mobi Hub", logo: "/placeholder.svg", category: "Fintech", rating: 4.6, isVerified: true, isActive: true, discountPercent: 4, countryId: "gh", countryName: "Ghana", countryFlag: "🇬🇭" },
  { id: "gh-002", name: "CediExchange", logo: "/placeholder.svg", category: "Exchange", rating: 4.4, isVerified: true, isActive: true, discountPercent: 6, countryId: "gh", countryName: "Ghana", countryFlag: "🇬🇭" },
  { id: "gh-003", name: "GhanaPay Solutions", logo: "/placeholder.svg", category: "Payments", rating: 4.5, isVerified: true, isActive: true, discountPercent: 8, countryId: "gh", countryName: "Ghana", countryFlag: "🇬🇭" },
  // Kenya
  { id: "ke-001", name: "Nairobi Mobi Shop", logo: "/placeholder.svg", category: "Mobile", rating: 4.7, isVerified: true, isActive: true, discountPercent: 5, countryId: "ke", countryName: "Kenya", countryFlag: "🇰🇪" },
  { id: "ke-002", name: "Safari Vouchers", logo: "/placeholder.svg", category: "Vouchers", rating: 4.5, isVerified: true, isActive: true, discountPercent: 9, countryId: "ke", countryName: "Kenya", countryFlag: "🇰🇪" },
  // South Africa
  { id: "za-001", name: "Joburg Mobi Center", logo: "/placeholder.svg", category: "Retail", rating: 4.8, isVerified: true, isActive: true, discountPercent: 4, countryId: "za", countryName: "South Africa", countryFlag: "🇿🇦" },
  { id: "za-002", name: "Cape Vouchers", logo: "/placeholder.svg", category: "Vouchers", rating: 4.6, isVerified: true, isActive: true, discountPercent: 6, countryId: "za", countryName: "South Africa", countryFlag: "🇿🇦" },
  // UK
  { id: "uk-001", name: "London Mobi Exchange", logo: "/placeholder.svg", category: "Exchange", rating: 4.9, isVerified: true, isActive: true, discountPercent: 3, countryId: "uk", countryName: "United Kingdom", countryFlag: "🇬🇧" },
  // USA
  { id: "us-001", name: "NYC Mobi Store", logo: "/placeholder.svg", category: "Mobile", rating: 4.8, isVerified: true, isActive: true, discountPercent: 2, countryId: "us", countryName: "United States", countryFlag: "🇺🇸" },
  { id: "us-002", name: "LA Digital Vouchers", logo: "/placeholder.svg", category: "Digital", rating: 4.6, isVerified: true, isActive: true, discountPercent: 4, countryId: "us", countryName: "United States", countryFlag: "🇺🇸" },
  // UAE
  { id: "ae-001", name: "Dubai Mobi Gold", logo: "/placeholder.svg", category: "Luxury", rating: 4.9, isVerified: true, isActive: true, discountPercent: 8, countryId: "ae", countryName: "United Arab Emirates", countryFlag: "🇦🇪" },
];

// Helper to get unique countries from merchants
export function getUniqueCountries() {
  const seen = new Map<string, { id: string; name: string; flag: string }>();
  allLocationMerchants.forEach(m => {
    if (!seen.has(m.countryId)) {
      seen.set(m.countryId, { id: m.countryId, name: m.countryName, flag: m.countryFlag });
    }
  });
  return Array.from(seen.values());
}

// Helper to get unique states for Nigeria
export function getNigerianStatesForFilter() {
  return nigerianStates.map(s => ({ id: s.id, name: s.name }));
}

// Helper to get LGAs for a state, or ALL LGAs if no state specified
export function getLGAsForState(stateId?: string) {
  if (stateId) {
    const state = nigerianStates.find(s => s.id === stateId);
    return state?.lgas.map(l => ({ id: l.id, name: l.name, stateName: state.name })) ?? [];
  }
  // Return all LGAs from all states
  return nigerianStates.flatMap(s =>
    s.lgas.map(l => ({ id: l.id, name: `${l.name} (${s.name})`, stateName: s.name }))
  );
}

// Helper to get cities for an LGA, or ALL cities if no LGA specified
export function getCitiesForLGA(lgaId?: string) {
  if (lgaId) {
    for (const state of nigerianStates) {
      const lga = state.lgas.find(l => l.id === lgaId);
      if (lga) return lga.cities.map(c => ({ id: c.id, name: c.name }));
    }
    return [];
  }
  // Return all cities from all LGAs
  return nigerianStates.flatMap(s =>
    s.lgas.flatMap(l =>
      l.cities.map(c => ({ id: c.id, name: `${c.name} (${l.name}, ${s.name})` }))
    )
  );
}
