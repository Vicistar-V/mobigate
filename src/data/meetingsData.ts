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
