import { 
  CommunityClassification, 
  CommunityCategory,
  LeadershipStyle,
  MembershipGender,
  MembershipChoice,
  MeetingFrequency,
  DayOfWeek,
  WeekOfMonth,
  MonthOfYear
} from "@/types/communityForm";

export const classificationOptions: { value: CommunityClassification; label: string }[] = [
  { value: "association", label: "Association" },
  { value: "institution", label: "Institution" },
  { value: "community", label: "Community" },
  { value: "government", label: "Government" },
  { value: "other", label: "Other" }
];

export const categoryOptions: { value: CommunityCategory; label: string }[] = [
  { value: "religious", label: "Religious" },
  { value: "town-union", label: "Town Union" },
  { value: "school", label: "School" },
  { value: "healthcare", label: "Healthcare" },
  { value: "social-club", label: "Social Club" },
  { value: "agency", label: "Agency" },
  { value: "ministry", label: "Ministry" },
  { value: "trade-unions", label: "Trade Unions" },
  { value: "market", label: "Market" },
  { value: "security", label: "Security" },
  { value: "intelligence", label: "Intelligence" },
  { value: "force", label: "Force" },
  { value: "military", label: "Military" },
  { value: "law-enforcement", label: "Law Enforcement" },
  { value: "co-operative", label: "Co-operative" },
  { value: "social", label: "Social" },
  { value: "professional-body", label: "Professional Body" },
  { value: "association", label: "Association" },
  { value: "other", label: "Other" }
];

export const genderOptions: { value: MembershipGender; label: string }[] = [
  { value: "males", label: "Males Only" },
  { value: "females", label: "Females Only" },
  { value: "both", label: "Both Genders" }
];

export const membershipChoiceOptions: { value: MembershipChoice; label: string }[] = [
  { value: "mandatory", label: "Mandatory" },
  { value: "voluntary", label: "Voluntary" }
];

export const leadershipStyleOptions: { value: LeadershipStyle; label: string }[] = [
  { value: "democratic-election", label: "Democratic Election" },
  { value: "autocratic", label: "Autocratic/Dictatorial" },
  { value: "promotion-merit", label: "Promotion Merit" },
  { value: "appointment", label: "Appointment" },
  { value: "rights-privileges", label: "Rights & Privileges" },
  { value: "divine-mandate", label: "Divine Mandate" }
];

export const topmostOfficeOptions = [
  "President",
  "President-General",
  "Chief Executive Officer",
  "Chairman",
  "Executive Chairman",
  "Executive Secretary",
  "Secretary-General",
  "Executive Director",
  "Director-General",
  "Director",
  "Controller",
  "Controller-General",
  "Managing Director",
  "General Manager",
  "Manager"
];

export const deputyOfficeOptions = [
  "Vice-President",
  "Vice-President-General",
  "Assistant Chief Executive Officer",
  "Vice-Chairman",
  "Deputy Chairman",
  "Assistant Executive Secretary",
  "Assistant Secretary-General",
  "Deputy Executive Director",
  "Deputy Director-General",
  "Deputy Controller-General",
  "Deputy Managing Director",
  "Assistant General Manager",
  "Assistant Manager"
];

export const meetingFrequencyOptions: { value: MeetingFrequency; label: string }[] = [
  { value: "weekly", label: "Weekly" },
  { value: "bi-weekly", label: "Bi-Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "bi-annually", label: "Bi-Annually" },
  { value: "annually", label: "Annually" }
];

export const weekOfMonthOptions: { value: WeekOfMonth; label: string }[] = [
  { value: "first", label: "1st Week" },
  { value: "second", label: "2nd Week" },
  { value: "third", label: "3rd Week" },
  { value: "fourth", label: "4th Week" },
  { value: "last", label: "Last Week" }
];

export const dayOfWeekOptions: { value: DayOfWeek; label: string }[] = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" }
];

export const monthOfYearOptions: { value: MonthOfYear; label: string }[] = [
  { value: "january", label: "January" },
  { value: "february", label: "February" },
  { value: "march", label: "March" },
  { value: "april", label: "April" },
  { value: "may", label: "May" },
  { value: "june", label: "June" },
  { value: "july", label: "July" },
  { value: "august", label: "August" },
  { value: "september", label: "September" },
  { value: "october", label: "October" },
  { value: "november", label: "November" },
  { value: "december", label: "December" }
];

// Mock admin options for UI demonstration
export const mockAdminOptions = [
  { id: "admin-1", name: "Admin-1" },
  { id: "admin-2", name: "Admin-2" },
  { id: "admin-3", name: "Admin-3" },
  { id: "admin-4", name: "Admin-4" },
  { id: "admin-5", name: "Admin-5" },
];

// Access Level Options
export const accessLevelOptions = [
  { value: "all-members", label: "All Members" },
  { value: "only-active-members", label: "Only Active Members" },
  { value: "executives-officers", label: "Executives/Officers" },
  { value: "specified-admin", label: "Only a Specified Admin [1-20]" },
];

// Promotion Visibility Options (for multi-select)
export const promotionVisibilityOptions = [
  { value: "all-public", label: "All Public" },
  { value: "common-state-origin", label: "Common State of Origin" },
  { value: "all-connections", label: "All Connections [Same Town, City, School, Workplace, Location, etc]" },
  { value: "members-friends", label: "Members' Friends" },
  { value: "members-other-communities", label: "Members' Other Communities" },
];

// Event Nature Options
export const eventNatureOptions = [
  { value: "cultural", label: "Cultural" },
  { value: "corporate", label: "Corporate" },
  { value: "religious", label: "Religious" },
  { value: "social", label: "Social" },
  { value: "financial", label: "Financial" },
];

// Currency Options
export const currencyOptions = [
  { value: "NGN", label: "Nigerian Naira (₦)" },
  { value: "USD", label: "US Dollar ($)" },
  { value: "GBP", label: "British Pound (£)" },
  { value: "EUR", label: "Euro (€)" },
  { value: "GHS", label: "Ghanaian Cedi (₵)" },
  { value: "KES", label: "Kenyan Shilling (KSh)" },
  { value: "ZAR", label: "South African Rand (R)" },
  { value: "custom", label: "Custom Currency" },
];

// Nigerian States
export const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
  "FCT", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi",
  "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun",
  "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];
