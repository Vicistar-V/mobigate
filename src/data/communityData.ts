import { Community } from "@/types/community";

const MOCK_OWNED_COMMUNITIES: Community[] = [
  {
    id: "own-1",
    name: "Lagos Tech Innovators",
    description: "A community for tech entrepreneurs and innovators in Lagos",
    coverImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop",
    type: "Club",
    memberCount: 245,
    createdAt: new Date("2023-06-15"),
    isOwner: true,
    isMember: true,
    role: "Owner",
    status: "Active",
    location: "Lagos, Nigeria"
  },
  {
    id: "own-2",
    name: "Igbo Cultural Heritage",
    description: "Preserving and promoting Igbo culture and traditions",
    coverImage: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=300&fit=crop",
    type: "Society",
    memberCount: 892,
    createdAt: new Date("2022-03-20"),
    isOwner: true,
    isMember: true,
    role: "Owner",
    status: "Active",
    location: "Enugu, Nigeria"
  },
  {
    id: "own-3",
    name: "Abuja Business Network",
    description: "Connecting business professionals across Abuja",
    coverImage: "https://images.unsplash.com/photo-1560439514-4e9645039924?w=400&h=300&fit=crop",
    type: "Association",
    memberCount: 567,
    createdAt: new Date("2023-01-10"),
    isOwner: true,
    isMember: true,
    role: "Owner",
    status: "Active",
    location: "Abuja, Nigeria"
  },
  {
    id: "own-4",
    name: "Youth Empowerment Initiative",
    description: "Empowering young Nigerians through skills and mentorship",
    coverImage: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop",
    type: "Group",
    memberCount: 1234,
    createdAt: new Date("2021-09-05"),
    isOwner: true,
    isMember: true,
    role: "Owner",
    status: "Active",
    location: "Nigeria"
  }
];

const MOCK_JOINED_COMMUNITIES: Community[] = [
  {
    id: "join-1",
    name: "Onitsha Town Union",
    description: "Official community for Onitsha indigenes",
    type: "Town Union",
    memberCount: 3456,
    createdAt: new Date("2020-01-15"),
    isOwner: false,
    isMember: true,
    role: "Admin",
    status: "Active",
    location: "Onitsha, Anambra"
  },
  {
    id: "join-2",
    name: "Tech Enthusiasts Nigeria",
    description: "For everyone passionate about technology",
    coverImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop",
    type: "Club",
    memberCount: 5678,
    createdAt: new Date("2021-03-20"),
    isOwner: false,
    isMember: true,
    role: "Member",
    status: "Active",
    location: "Nigeria"
  },
  {
    id: "join-3",
    name: "Nigerian Medical Association",
    description: "Professional body for medical practitioners",
    type: "Association",
    memberCount: 12340,
    createdAt: new Date("2019-06-10"),
    isOwner: false,
    isMember: true,
    role: "Member",
    status: "Active",
    location: "Nigeria"
  },
  {
    id: "join-4",
    name: "Enugu Sports Club",
    description: "Sports and recreation for Enugu residents",
    coverImage: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=300&fit=crop",
    type: "Club",
    memberCount: 789,
    createdAt: new Date("2022-02-14"),
    isOwner: false,
    isMember: true,
    role: "Moderator",
    status: "Active",
    location: "Enugu, Nigeria"
  },
  {
    id: "join-5",
    name: "Writers Guild of Nigeria",
    description: "Community for Nigerian writers and authors",
    type: "Society",
    memberCount: 2345,
    createdAt: new Date("2020-08-22"),
    isOwner: false,
    isMember: true,
    role: "Member",
    status: "Active",
    location: "Nigeria"
  },
  {
    id: "join-6",
    name: "Owerri Community Development",
    description: "Driving development and progress in Owerri",
    type: "Town Union",
    memberCount: 4567,
    createdAt: new Date("2018-11-05"),
    isOwner: false,
    isMember: true,
    role: "Member",
    status: "Active",
    location: "Owerri, Imo"
  },
  {
    id: "join-7",
    name: "Nigerian Entrepreneurs Forum",
    description: "Supporting and connecting entrepreneurs nationwide",
    coverImage: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop",
    type: "Association",
    memberCount: 8901,
    createdAt: new Date("2021-07-18"),
    isOwner: false,
    isMember: true,
    role: "Member",
    status: "Active",
    location: "Nigeria"
  },
  {
    id: "join-8",
    name: "Port Harcourt Alumni Network",
    description: "Connecting UNIPORT alumni worldwide",
    type: "Society",
    memberCount: 6789,
    createdAt: new Date("2019-04-30"),
    isOwner: false,
    isMember: true,
    role: "Member",
    status: "Active",
    location: "Port Harcourt, Rivers"
  }
];

export function getOwnedCommunities(): Community[] {
  return MOCK_OWNED_COMMUNITIES;
}

export function getJoinedCommunities(): Community[] {
  return MOCK_JOINED_COMMUNITIES;
}
