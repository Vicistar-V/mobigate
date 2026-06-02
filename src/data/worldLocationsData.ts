// ────────────────────────────────────────────────────────────────────────────
// World Locations Data + Adaptive Subdivision Nomenclature
// ────────────────────────────────────────────────────────────────────────────
// Powers the cascading Country → (State/Province/Region) → (LGA/County) →
// (City/Town) selectors used across the app.
//
// Every country carries its own LABELS so the UI shows the correct nomenclature
// for that country (e.g. Nigeria uses "State / LGA / City", the USA uses
// "State / County / City", the UK uses "Region / County / Town", Ghana uses
// "Region / District / Town", etc).
//
// Where we have real subdivision trees (e.g. Nigeria), the selector renders
// proper dropdowns and cascades down the levels. Where a country only provides a
// level-1 list, deeper levels gracefully fall back to free-text entry — still
// using the correct adaptive label for that country. Countries with no tree at
// all fall back to free-text on every level (label still adaptive).
// ────────────────────────────────────────────────────────────────────────────

import { nigerianStates } from "./nigerianLocationsData";

export interface LocationNode {
  name: string;
  children?: LocationNode[];
}

export interface CountryLocation {
  name: string;
  /** Adaptive labels for the 3 subdivision levels under the country. */
  labels: {
    level1: string; // State / Province / Region
    level2: string; // LGA / County / District
    level3: string; // City / Town
  };
  /** Level-1 subdivisions (optionally nested with level-2 / level-3 children). */
  divisions?: LocationNode[];
}

// Build Nigeria's full tree from the existing detailed dataset.
const nigeriaDivisions: LocationNode[] = nigerianStates.map((s) => ({
  name: s.name,
  children: s.lgas.map((lga) => ({
    name: lga.name,
    children: lga.cities.map((c) => ({ name: c.name })),
  })),
}));

export const COUNTRIES: CountryLocation[] = [
  {
    name: "Nigeria",
    labels: { level1: "State", level2: "LGA", level3: "City/Town" },
    divisions: nigeriaDivisions,
  },
  {
    name: "Ghana",
    labels: { level1: "Region", level2: "District", level3: "City/Town" },
    divisions: [
      { name: "Greater Accra" },
      { name: "Ashanti" },
      { name: "Western" },
      { name: "Central" },
      { name: "Eastern" },
      { name: "Volta" },
      { name: "Northern" },
      { name: "Upper East" },
      { name: "Upper West" },
      { name: "Bono" },
      { name: "Ahafo" },
      { name: "Bono East" },
      { name: "Oti" },
      { name: "Savannah" },
      { name: "North East" },
      { name: "Western North" },
    ],
  },
  {
    name: "Kenya",
    labels: { level1: "County", level2: "Sub-County", level3: "Ward/Town" },
    divisions: [
      { name: "Nairobi" },
      { name: "Mombasa" },
      { name: "Kisumu" },
      { name: "Nakuru" },
      { name: "Kiambu" },
      { name: "Uasin Gishu" },
      { name: "Machakos" },
      { name: "Kakamega" },
      { name: "Nyeri" },
      { name: "Meru" },
    ],
  },
  {
    name: "South Africa",
    labels: { level1: "Province", level2: "District/Municipality", level3: "City/Town" },
    divisions: [
      { name: "Gauteng" },
      { name: "Western Cape" },
      { name: "KwaZulu-Natal" },
      { name: "Eastern Cape" },
      { name: "Free State" },
      { name: "Limpopo" },
      { name: "Mpumalanga" },
      { name: "North West" },
      { name: "Northern Cape" },
    ],
  },
  {
    name: "United States",
    labels: { level1: "State", level2: "County", level3: "City/Town" },
    divisions: [
      "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
      "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
      "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
      "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire",
      "New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio",
      "Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota",
      "Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia",
      "Wisconsin","Wyoming",
    ].map((n) => ({ name: n })),
  },
  {
    name: "United Kingdom",
    labels: { level1: "Region/Nation", level2: "County", level3: "City/Town" },
    divisions: [
      { name: "England" },
      { name: "Scotland" },
      { name: "Wales" },
      { name: "Northern Ireland" },
      { name: "Greater London" },
      { name: "South East" },
      { name: "South West" },
      { name: "North West" },
      { name: "North East" },
      { name: "Yorkshire and the Humber" },
      { name: "East Midlands" },
      { name: "West Midlands" },
      { name: "East of England" },
    ],
  },
  {
    name: "Canada",
    labels: { level1: "Province/Territory", level2: "County/Region", level3: "City/Town" },
    divisions: [
      { name: "Ontario" },
      { name: "Quebec" },
      { name: "British Columbia" },
      { name: "Alberta" },
      { name: "Manitoba" },
      { name: "Saskatchewan" },
      { name: "Nova Scotia" },
      { name: "New Brunswick" },
      { name: "Newfoundland and Labrador" },
      { name: "Prince Edward Island" },
      { name: "Northwest Territories" },
      { name: "Yukon" },
      { name: "Nunavut" },
    ],
  },
  {
    name: "India",
    labels: { level1: "State", level2: "District", level3: "City/Town" },
    divisions: [
      "Andhra Pradesh","Assam","Bihar","Chhattisgarh","Delhi","Goa","Gujarat",
      "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
      "Maharashtra","Odisha","Punjab","Rajasthan","Tamil Nadu","Telangana",
      "Uttar Pradesh","Uttarakhand","West Bengal",
    ].map((n) => ({ name: n })),
  },
  {
    name: "Australia",
    labels: { level1: "State/Territory", level2: "Region/LGA", level3: "City/Town" },
    divisions: [
      { name: "New South Wales" },
      { name: "Victoria" },
      { name: "Queensland" },
      { name: "Western Australia" },
      { name: "South Australia" },
      { name: "Tasmania" },
      { name: "Australian Capital Territory" },
      { name: "Northern Territory" },
    ],
  },
];

// Default labels for any country not explicitly listed above.
export const DEFAULT_LABELS = {
  level1: "State/Province/Region",
  level2: "LGA/County",
  level3: "City/Town",
};

/** All selectable country names (sorted, with the listed ones kept on top). */
export const COUNTRY_NAMES: string[] = COUNTRIES.map((c) => c.name);

export function getCountry(name: string): CountryLocation | undefined {
  if (!name) return undefined;
  return COUNTRIES.find((c) => c.name.toLowerCase() === name.toLowerCase());
}

export function getLabelsFor(countryName: string) {
  return getCountry(countryName)?.labels ?? DEFAULT_LABELS;
}

/** Children for a given path. Returns [] when no dataset exists at that level. */
export function getDivisions(countryName: string): LocationNode[] {
  return getCountry(countryName)?.divisions ?? [];
}

export function getChildren(nodes: LocationNode[], name: string): LocationNode[] {
  const node = nodes.find((n) => n.name.toLowerCase() === name.toLowerCase());
  return node?.children ?? [];
}
