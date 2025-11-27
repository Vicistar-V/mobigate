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

export type MonthOfYear = 
  | "january" 
  | "february" 
  | "march" 
  | "april" 
  | "may" 
  | "june" 
  | "july" 
  | "august" 
  | "september" 
  | "october" 
  | "november" 
  | "december";

export type AccessLevel = 
  | "all-members"
  | "only-active-members"
  | "executives-officers"
  | "specified-admin";

export type PromotionVisibility = 
  | "all-public"
  | "common-state-origin"
  | "all-connections"
  | "members-friends"
  | "members-other-communities";

export type EventNature = "cultural" | "corporate" | "religious" | "social" | "financial";

export type EventAttendance = "mandatory" | "voluntary";

export type GuestAccessType = "allowed" | "not-allowed";

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
  monthOfYear?: MonthOfYear;
  weekOfMonth?: WeekOfMonth;
  dayOfWeek: DayOfWeek;
  time?: string;
}

export interface CommunityEvent {
  id: string;
  name: string;
  nature: EventNature;
  approvedDues: number;
  contraventions: string;
  contraventionCount: number;
  timeframe: string;
  validityDate: string;
  attendance: EventAttendance;
  penaltyAbsentPercent: number;
  penaltyOwingPercent: number;
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
  maxAdminsAllowed: number; // Number of admins allowed (1-20)
  
  // Meetings
  generalMeetings: MeetingSchedule[];
  executiveMeetings: MeetingSchedule[];
  attendanceRegister: boolean;
  
  // Offices & Positions
  positions: OfficialPosition[];
  
  // Events & Activities
  events: CommunityEvent[];
  
  // Origination
  originCountry: string;
  originState: string;
  originCity: string;
  visionStatement: string;
  
  // Official Contacts
  officeAddress: string;
  telephone: string;
  emailAddress: string;
  
  // Official Currency
  defaultCurrency: string;
  customCurrency: string;
  
  // Privacy Settings
  privacyCommunityFinances: AccessLevel;
  privacyMembersFinancialStatus: AccessLevel;
  privacyMembersComplaints: AccessLevel;
  privacyRecordingMeetings: AccessLevel;
  privacySeeGeneralPosts: AccessLevel;
  privacySeeMembersComments: AccessLevel;
  
  // General Settings
  handoverTime: string;
  communityAccountManager: string;
  meetingsDownloadFee: number;
  publicAccessFee: number;
  complaintBoxFee: number;
  postingFee: number;
  
  // Community Promotion
  communitySuggestion: PromotionVisibility[];
  communityVisibility: PromotionVisibility[];
  publicGuestUsers: GuestAccessType;
  
  // Community Elections
  whoCanVote: AccessLevel;
  whoCanViewElectionResults: AccessLevel;
  whoCanViewAccreditedVoters: AccessLevel;
  whoCanDownloadResources: AccessLevel;
  
  // Adding People
  whoCanAdd: AccessLevel;
  whoCanApproveNewMembers: AccessLevel;
  whoCanRemoveSuspendBlock: AccessLevel;
  
  // Posting on Community
  whoCanPost: AccessLevel;
  whoCanEditPauseDeleteApprove: AccessLevel;
  specifiedAdminNumbers: number[];
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
  maxAdminsAllowed: 1,
  generalMeetings: [],
  executiveMeetings: [],
  attendanceRegister: true,
  positions: [],
  events: [],
  originCountry: "",
  originState: "",
  originCity: "",
  visionStatement: "",
  officeAddress: "",
  telephone: "",
  emailAddress: "",
  defaultCurrency: "NGN",
  customCurrency: "",
  privacyCommunityFinances: "executives-officers",
  privacyMembersFinancialStatus: "executives-officers",
  privacyMembersComplaints: "executives-officers",
  privacyRecordingMeetings: "executives-officers",
  privacySeeGeneralPosts: "all-members",
  privacySeeMembersComments: "all-members",
  handoverTime: "",
  communityAccountManager: "",
  meetingsDownloadFee: 0,
  publicAccessFee: 0,
  complaintBoxFee: 0,
  postingFee: 0,
  communitySuggestion: [],
  communityVisibility: [],
  publicGuestUsers: "not-allowed",
  whoCanVote: "only-active-members",
  whoCanViewElectionResults: "all-members",
  whoCanViewAccreditedVoters: "executives-officers",
  whoCanDownloadResources: "executives-officers",
  whoCanAdd: "executives-officers",
  whoCanApproveNewMembers: "executives-officers",
  whoCanRemoveSuspendBlock: "executives-officers",
  whoCanPost: "all-members",
  whoCanEditPauseDeleteApprove: "executives-officers",
  specifiedAdminNumbers: []
};
