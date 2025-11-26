export interface Community {
  id: string;
  name: string;
  description: string;
  coverImage?: string;
  type: "Town Union" | "Club" | "Association" | "Society" | "Group";
  memberCount: number;
  createdAt: Date;
  isOwner: boolean;        // true = user created/owns this
  isMember: boolean;       // true = user joined this
  role?: string;           // "Admin", "Member", "Moderator"
  status: "Active" | "Inactive";
  location?: string;
}

export interface CommunityProfile extends Community {
  motto?: string;
  bannerImage?: string;
  logoImage?: string;
  followers: number;
  likes: number;
  fundRaiserEnabled: boolean;
  mobiStoreEnabled: boolean;
  quizGameEnabled: boolean;
  donationEnabled: boolean;
  visionStatement?: string;
  originCountry?: string;
  originState?: string;
  originCity?: string;
  officeAddress?: string;
  telephone?: string;
  emailAddress?: string;
  defaultCurrency?: string;
  
  // Designations
  designation?: string;
  classification?: string;
  category?: string;
  interest?: string;
  
  // Founded/Formed
  foundedLocation?: string;
  foundedDate?: Date;
  parentBody?: string;
  currentCity?: string;
  
  // Membership & Gender
  gender?: "males" | "females" | "both";
  populationStrength?: number;
  maleMembers?: number;
  femaleMembers?: number;
  membershipChoice?: "mandatory" | "voluntary";
  
  // Leadership Style
  leadershipStyle?: string;
  topmostOffice?: string;
  deputyOffice?: string;
  officeTenure?: number;
  staffCount?: number;
  hasManagementCommittee?: boolean;
  
  // Meetings
  generalMeetingSchedule?: string;
  executiveMeetingSchedule?: string;
  meetingAttendance?: "mandatory" | "voluntary";
  
  // Additional contacts
  telephone2?: string;
}
