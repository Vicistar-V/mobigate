import profilePhoto from "@/assets/profile-photo.jpg";
import profileSarah from "@/assets/profile-sarah-johnson.jpg";
import profileMichael from "@/assets/profile-michael-chen.jpg";
import profileEmily from "@/assets/profile-emily-davis.jpg";
import profileDavid from "@/assets/profile-david-martinez.jpg";
import profileLisa from "@/assets/profile-lisa-anderson.jpg";
import profileJames from "@/assets/profile-james-wilson.jpg";
import profileRobert from "@/assets/profile-robert-brown.jpg";

export interface MeetingParticipant {
  id: string;
  name: string;
  position: string;
  avatar: string;
  isOnline: boolean;
  isSpeaking: boolean;
  isMuted: boolean;
  isCameraOff: boolean;
}

export interface MeetingChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: Date;
}

export interface Meeting {
  id: string;
  type: 'general' | 'executive';
  name: string;
  date: Date;
  status: 'upcoming' | 'live' | 'completed';
  participants: MeetingParticipant[];
  chatMessages: MeetingChatMessage[];
  duration?: string;
}

// Extended Meeting Interfaces
export interface MeetingProceedings {
  id: string;
  meetingId: string;
  content: string;
  downloadUrl: string;
  fileType: 'PDF' | 'DOC' | 'DOCX';
  fileSize: string;
  createdAt: Date;
}

export interface MeetingHeadline {
  id: string;
  meetingId: string;
  headline: string;
  theme: string;
  description: string;
  agendaItems: string[];
}

export interface MeetingResolution {
  id: string;
  meetingId: string;
  title: string;
  description: string;
  votesFor: number;
  votesAgainst: number;
  abstentions: number;
  status: 'passed' | 'rejected' | 'tabled';
  proposedBy: string;
}

export interface ConflictOfInterest {
  id: string;
  meetingId: string;
  memberId: string;
  memberName: string;
  memberAvatar: string;
  description: string;
  resolution: string;
  status: 'declared' | 'resolved' | 'dismissed';
  declaredAt: Date;
}

export interface MeetingVoteNote {
  id: string;
  meetingId: string;
  resolutionId: string;
  voterId: string;
  voterName: string;
  voterAvatar: string;
  vote: 'for' | 'against' | 'abstain';
  note?: string;
  timestamp: Date;
}

export interface LighterMood {
  id: string;
  meetingId: string;
  memberId: string;
  memberName: string;
  memberAvatar: string;
  content: string;
  type: 'joke' | 'quote' | 'anecdote' | 'photo';
  mediaUrl?: string;
  likes: number;
  createdAt: Date;
}

export interface AttendanceRollCall {
  id: string;
  meetingId: string;
  memberId: string;
  memberName: string;
  avatar: string;
  position: string;
  status: 'present' | 'absent' | 'excused' | 'late';
  arrivalTime?: Date;
  departureTime?: Date;
  notes?: string;
}

export interface ExtendedMeeting extends Meeting {
  proceedings?: MeetingProceedings;
  headline?: MeetingHeadline;
  resolutions: MeetingResolution[];
  conflictsOfInterest: ConflictOfInterest[];
  voteNotes: MeetingVoteNote[];
  lighterMoods: LighterMood[];
  rollCalls: AttendanceRollCall[];
}

export const mockParticipants: MeetingParticipant[] = [
  {
    id: "p1",
    name: "Sarah Johnson",
    position: "President-General",
    avatar: profileSarah,
    isOnline: true,
    isSpeaking: true,
    isMuted: false,
    isCameraOff: false,
  },
  {
    id: "p2",
    name: "Michael Chen",
    position: "Secretary",
    avatar: profileMichael,
    isOnline: true,
    isSpeaking: false,
    isMuted: false,
    isCameraOff: false,
  },
  {
    id: "p3",
    name: "Emily Davis",
    position: "Treasurer",
    avatar: profileEmily,
    isOnline: true,
    isSpeaking: false,
    isMuted: true,
    isCameraOff: false,
  },
  {
    id: "p4",
    name: "David Martinez",
    position: "Vice President",
    avatar: profileDavid,
    isOnline: true,
    isSpeaking: false,
    isMuted: false,
    isCameraOff: false,
  },
  {
    id: "p5",
    name: "Lisa Anderson",
    position: "Executive Member",
    avatar: profileLisa,
    isOnline: true,
    isSpeaking: false,
    isMuted: false,
    isCameraOff: false,
  },
  {
    id: "p6",
    name: "James Wilson",
    position: "Member",
    avatar: profileJames,
    isOnline: true,
    isSpeaking: false,
    isMuted: false,
    isCameraOff: true,
  },
];

export const mockChatMessages: MeetingChatMessage[] = [
  {
    id: "m1",
    senderId: "p1",
    senderName: "Sarah Johnson",
    senderAvatar: profileSarah,
    content: "Welcome everyone to today's meeting!",
    timestamp: new Date(Date.now() - 300000),
  },
  {
    id: "m2",
    senderId: "p2",
    senderName: "Michael Chen",
    senderAvatar: profileMichael,
    content: "Thank you, Sarah. Glad to be here.",
    timestamp: new Date(Date.now() - 240000),
  },
  {
    id: "m3",
    senderId: "p3",
    senderName: "Emily Davis",
    senderAvatar: profileEmily,
    content: "I have the financial reports ready to share.",
    timestamp: new Date(Date.now() - 180000),
  },
  {
    id: "m4",
    senderId: "p4",
    senderName: "David Martinez",
    senderAvatar: profileDavid,
    content: "Great! Looking forward to the discussion.",
    timestamp: new Date(Date.now() - 120000),
  },
  {
    id: "m5",
    senderId: "p5",
    senderName: "Lisa Anderson",
    senderAvatar: profileLisa,
    content: "Can everyone see the shared screen?",
    timestamp: new Date(Date.now() - 60000),
  },
];

// Extended mock data
export const mockMeetingProceedings: MeetingProceedings[] = [
  {
    id: "proc1",
    meetingId: "meet2",
    content: "Meeting proceedings for Executive Meeting held on...",
    downloadUrl: "#",
    fileType: "PDF",
    fileSize: "2.4 MB",
    createdAt: new Date(Date.now() - 86400000 * 2),
  },
  {
    id: "proc2",
    meetingId: "meet3",
    content: "General Meeting proceedings and minutes...",
    downloadUrl: "#",
    fileType: "DOC",
    fileSize: "1.8 MB",
    createdAt: new Date(Date.now() - 86400000 * 7),
  },
];

export const mockMeetingHeadlines: MeetingHeadline[] = [
  {
    id: "head1",
    meetingId: "meet2",
    headline: "Strategic Planning & Budget Review",
    theme: "Financial Sustainability",
    description: "Comprehensive review of annual budget and strategic initiatives for the upcoming fiscal year.",
    agendaItems: ["Budget Review", "Strategic Goals", "Resource Allocation", "Timeline Discussion"],
  },
  {
    id: "head2",
    meetingId: "meet3",
    headline: "Community Engagement & Growth",
    theme: "Member Retention",
    description: "Discussion on improving community engagement and member retention strategies.",
    agendaItems: ["Member Feedback", "Event Planning", "Communication Strategy", "New Initiatives"],
  },
];

export const mockResolutions: MeetingResolution[] = [
  {
    id: "res1",
    meetingId: "meet2",
    title: "Approve Annual Budget 2025",
    description: "Motion to approve the proposed annual budget for fiscal year 2025 with allocated funds for community programs.",
    votesFor: 18,
    votesAgainst: 2,
    abstentions: 1,
    status: "passed",
    proposedBy: "Sarah Johnson",
  },
  {
    id: "res2",
    meetingId: "meet2",
    title: "Increase Membership Dues",
    description: "Proposal to increase annual membership dues by 15% to support enhanced community services.",
    votesFor: 12,
    votesAgainst: 8,
    abstentions: 1,
    status: "passed",
    proposedBy: "Emily Davis",
  },
  {
    id: "res3",
    meetingId: "meet3",
    title: "Establish New Committee",
    description: "Motion to establish a new Technology & Innovation Committee.",
    votesFor: 25,
    votesAgainst: 0,
    abstentions: 2,
    status: "passed",
    proposedBy: "Michael Chen",
  },
];

export const mockConflictsOfInterest: ConflictOfInterest[] = [
  {
    id: "conf1",
    meetingId: "meet2",
    memberId: "p3",
    memberName: "Emily Davis",
    memberAvatar: profileEmily,
    description: "Personal financial interest in vendor selection for community event management services.",
    resolution: "Recused from voting on vendor selection. Alternative oversight assigned.",
    status: "resolved",
    declaredAt: new Date(Date.now() - 86400000 * 2),
  },
  {
    id: "conf2",
    meetingId: "meet3",
    memberId: "p4",
    memberName: "David Martinez",
    memberAvatar: profileDavid,
    description: "Family member employed by proposed contractor for facility renovations.",
    resolution: "Declared and documented. Did not participate in contractor discussions.",
    status: "resolved",
    declaredAt: new Date(Date.now() - 86400000 * 7),
  },
];

export const mockVoteNotes: MeetingVoteNote[] = [
  {
    id: "vote1",
    meetingId: "meet2",
    resolutionId: "res1",
    voterId: "p1",
    voterName: "Sarah Johnson",
    voterAvatar: profileSarah,
    vote: "for",
    note: "The budget is well-balanced and addresses our key priorities.",
    timestamp: new Date(Date.now() - 86400000 * 2),
  },
  {
    id: "vote2",
    meetingId: "meet2",
    resolutionId: "res1",
    voterId: "p2",
    voterName: "Michael Chen",
    voterAvatar: profileMichael,
    vote: "for",
    timestamp: new Date(Date.now() - 86400000 * 2),
  },
  {
    id: "vote3",
    meetingId: "meet2",
    resolutionId: "res2",
    voterId: "p4",
    voterName: "David Martinez",
    voterAvatar: profileDavid,
    vote: "against",
    note: "I believe the increase is too steep for our members at this time.",
    timestamp: new Date(Date.now() - 86400000 * 2),
  },
];

export const mockLighterMoods: LighterMood[] = [
  {
    id: "mood1",
    meetingId: "meet2",
    memberId: "p5",
    memberName: "Lisa Anderson",
    memberAvatar: profileLisa,
    content: "Why did the meeting go to therapy? It had too many issues to resolve! 😄",
    type: "joke",
    likes: 12,
    createdAt: new Date(Date.now() - 86400000 * 2),
  },
  {
    id: "mood2",
    meetingId: "meet3",
    memberId: "p6",
    memberName: "James Wilson",
    memberAvatar: profileJames,
    content: "Coming together is a beginning, staying together is progress, and working together is success. - Henry Ford",
    type: "quote",
    likes: 24,
    createdAt: new Date(Date.now() - 86400000 * 7),
  },
  {
    id: "mood3",
    meetingId: "meet3",
    memberId: "p1",
    memberName: "Sarah Johnson",
    memberAvatar: profileSarah,
    content: "Remember when we tried to use the new video conferencing software and spent 10 minutes trying to unmute everyone? Classic!",
    type: "anecdote",
    likes: 18,
    createdAt: new Date(Date.now() - 86400000 * 7),
  },
];

export const mockAttendance: AttendanceRollCall[] = [
  {
    id: "att1",
    meetingId: "meet2",
    memberId: "p1",
    memberName: "Sarah Johnson",
    avatar: profileSarah,
    position: "President-General",
    status: "present",
    arrivalTime: new Date(Date.now() - 86400000 * 2),
  },
  {
    id: "att2",
    meetingId: "meet2",
    memberId: "p2",
    memberName: "Michael Chen",
    avatar: profileMichael,
    position: "Secretary",
    status: "present",
    arrivalTime: new Date(Date.now() - 86400000 * 2),
  },
  {
    id: "att3",
    meetingId: "meet2",
    memberId: "p3",
    memberName: "Emily Davis",
    avatar: profileEmily,
    position: "Treasurer",
    status: "late",
    arrivalTime: new Date(Date.now() - 86400000 * 2 + 900000),
    notes: "Traffic delay",
  },
  {
    id: "att4",
    meetingId: "meet3",
    memberId: "p1",
    memberName: "Sarah Johnson",
    avatar: profileSarah,
    position: "President-General",
    status: "present",
  },
  {
    id: "att5",
    meetingId: "meet3",
    memberId: "p6",
    memberName: "James Wilson",
    avatar: profileJames,
    position: "Member",
    status: "absent",
    notes: "Out of town",
  },
];

export const mockMeetings: Meeting[] = [
  {
    id: "meet1",
    type: "general",
    name: "General Meeting",
    date: new Date(),
    status: "live",
    participants: mockParticipants,
    chatMessages: mockChatMessages,
  },
  {
    id: "meet2",
    type: "executive",
    name: "Executive Meeting",
    date: new Date(Date.now() - 86400000 * 2),
    status: "completed",
    participants: mockParticipants.slice(0, 4),
    chatMessages: mockChatMessages.slice(0, 3),
    duration: "1h 45m",
  },
  {
    id: "meet3",
    type: "general",
    name: "General Meeting",
    date: new Date(Date.now() - 86400000 * 7),
    status: "completed",
    participants: mockParticipants,
    chatMessages: mockChatMessages,
    duration: "2h 15m",
  },
  {
    id: "meet4",
    type: "executive",
    name: "Exco Meeting",
    date: new Date(Date.now() - 86400000 * 14),
    status: "completed",
    participants: mockParticipants.slice(0, 4),
    chatMessages: mockChatMessages.slice(0, 2),
    duration: "1h 30m",
  },
];

export const mockUpcomingMeetings: Meeting[] = [
  {
    id: "upcoming1",
    type: "general",
    name: "General Meeting",
    date: new Date(Date.now() + 86400000 * 3),
    status: "upcoming",
    participants: [],
    chatMessages: [],
  },
  {
    id: "upcoming2",
    type: "executive",
    name: "Executive Meeting",
    date: new Date(Date.now() + 86400000 * 7),
    status: "upcoming",
    participants: [],
    chatMessages: [],
  },
  {
    id: "upcoming3",
    type: "general",
    name: "Special General Meeting",
    date: new Date(Date.now() + 86400000 * 14),
    status: "upcoming",
    participants: [],
    chatMessages: [],
  },
];

export const mockUpcomingEvents = [
  {
    id: "event1",
    name: "Community Fundraiser",
    date: new Date(Date.now() + 86400000 * 5),
    type: "event",
  },
  {
    id: "event2",
    name: "Annual General Assembly",
    date: new Date(Date.now() + 86400000 * 30),
    type: "event",
  },
];

export const mockInvitations = [
  {
    id: "inv1",
    name: "Joint Community Meeting",
    date: new Date(Date.now() + 86400000 * 10),
    from: "Partner Community",
  },
  {
    id: "inv2",
    name: "Regional Conference",
    date: new Date(Date.now() + 86400000 * 21),
    from: "Regional Office",
  },
];
