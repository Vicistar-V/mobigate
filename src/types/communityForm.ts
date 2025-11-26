export type CommunityClassification = "association" | "institution" | "community" | "government";

export type CommunityCategory = 
  | "religious"
  | "town-union"
  | "school"
  | "healthcare"
  | "social-club"
  | "agency"
  | "ministry"
  | "trade-unions"
  | "market"
  | "security"
  | "intelligence"
  | "force"
  | "military"
  | "law-enforcement"
  | "co-operative"
  | "social";

export type CommunityInterest = "personal" | "public";

export type MembershipGender = "males" | "females" | "both";

export type MembershipChoice = "mandatory" | "voluntary";

export type LeadershipStyle = 
  | "democratic-election"
  | "autocratic"
  | "promotion-merit"
  | "appointment"
  | "rights-privileges"
  | "divine-mandate";

export type PositionLevel = "topmost" | "deputy";

export type MeetingFrequency = 
  | "weekly"
  | "bi-weekly"
  | "monthly"
  | "quarterly"
  | "bi-annually"
  | "annually";

export type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export type WeekOfMonth = "first" | "second" | "third" | "fourth" | "last";

export interface OfficialPosition {
  id: string;
  title: string;
  level: PositionLevel;
  adminId?: string;
  adminName?: string;
  customTitle?: string;
}

export interface MeetingSchedule {
  id: string;
  type: "general" | "executive";
  frequency: MeetingFrequency;
  weekOfMonth?: WeekOfMonth;
  dayOfWeek: DayOfWeek;
  time?: string;
}

export interface CommunityFormData {
  // Community Identity
  name: string;
  shortDescription: string;
  
  // Classification & Type
  classification: CommunityClassification | "";
  category: CommunityCategory | "";
  interest: CommunityInterest;
  designation: string;
  
  // Founding
  founderId: string;
  founderName: string;
  
  // Membership & Gender
  gender: MembershipGender;
  membershipChoice: MembershipChoice;
  populationStrength: number;
  
  // Leadership Style
  leadershipStyle: LeadershipStyle | "";
  topmostOffice: string;
  customTopmostOffice: string;
  deputyOffice: string;
  customDeputyOffice: string;
  
  // Administration
  officeTenure: number; // in years
  staffCount: number;
  
  // Meetings
  generalMeetings: MeetingSchedule[];
  executiveMeetings: MeetingSchedule[];
  attendanceRegister: boolean;
  
  // Offices & Positions
  positions: OfficialPosition[];
}

export const defaultCommunityFormData: CommunityFormData = {
  name: "",
  shortDescription: "",
  classification: "",
  category: "",
  interest: "public",
  designation: "",
  founderId: "user-123", // Will be replaced with actual user ID
  founderName: "Current User", // Will be replaced with actual user name
  gender: "both",
  membershipChoice: "voluntary",
  populationStrength: 0,
  leadershipStyle: "",
  topmostOffice: "",
  customTopmostOffice: "",
  deputyOffice: "",
  customDeputyOffice: "",
  officeTenure: 2,
  staffCount: 0,
  generalMeetings: [],
  executiveMeetings: [],
  attendanceRegister: true,
  positions: []
};
