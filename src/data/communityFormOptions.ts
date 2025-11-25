import { 
  CommunityClassification, 
  CommunityCategory,
  LeadershipStyle,
  MembershipGender,
  MembershipChoice,
  MeetingFrequency,
  DayOfWeek,
  WeekOfMonth
} from "@/types/communityForm";

export const classificationOptions: { value: CommunityClassification; label: string }[] = [
  { value: "association", label: "Association" },
  { value: "institution", label: "Institution" },
  { value: "community", label: "Community" },
  { value: "government", label: "Government" }
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
  { value: "social", label: "Social" }
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

// Mock admin options for UI demonstration
export const mockAdminOptions = [
  { id: "admin-1", name: "John Doe" },
  { id: "admin-2", name: "Jane Smith" },
  { id: "admin-3", name: "Michael Johnson" },
  { id: "admin-4", name: "Sarah Williams" },
  { id: "admin-5", name: "David Brown" },
  { id: "admin-6", name: "Emily Davis" },
  { id: "admin-7", name: "Robert Miller" },
  { id: "admin-8", name: "Lisa Anderson" }
];
