export interface CommunityStats {
  totalMembers: number;
  activeMembers: number;
  newMembersThisMonth: number;
  memberGrowthRate: number;
  maleMembers: number;
  femaleMembers: number;
  averageAge: number;
  engagementRate: number;
}

export interface ActivityData {
  date: string;
  events: number;
  meetings: number;
  posts: number;
}

export interface DemographicData {
  category: string;
  count: number;
  percentage: number;
}

export interface EngagementMetric {
  metric: string;
  value: number;
  trend: "up" | "down" | "stable";
  change: number;
}

export const communityStats: CommunityStats = {
  totalMembers: 850,
  activeMembers: 687,
  newMembersThisMonth: 23,
  memberGrowthRate: 8.5,
  maleMembers: 512,
  femaleMembers: 338,
  averageAge: 42,
  engagementRate: 78.4
};

export const activityData: ActivityData[] = [
  { date: "Jan", events: 12, meetings: 4, posts: 45 },
  { date: "Feb", events: 15, meetings: 4, posts: 52 },
  { date: "Mar", events: 18, meetings: 5, posts: 67 },
  { date: "Apr", events: 14, meetings: 4, posts: 58 },
  { date: "May", events: 20, meetings: 5, posts: 73 },
  { date: "Jun", events: 16, meetings: 4, posts: 61 },
  { date: "Jul", events: 19, meetings: 5, posts: 69 },
  { date: "Aug", events: 17, meetings: 4, posts: 64 },
  { date: "Sep", events: 22, meetings: 5, posts: 78 },
  { date: "Oct", events: 21, meetings: 5, posts: 81 },
  { date: "Nov", events: 24, meetings: 5, posts: 89 },
  { date: "Dec", events: 18, meetings: 4, posts: 72 }
];

export const ageDistribution: DemographicData[] = [
  { category: "18-25", count: 142, percentage: 16.7 },
  { category: "26-35", count: 234, percentage: 27.5 },
  { category: "36-45", count: 198, percentage: 23.3 },
  { category: "46-55", count: 156, percentage: 18.4 },
  { category: "56-65", count: 89, percentage: 10.5 },
  { category: "65+", count: 31, percentage: 3.6 }
];

export const locationDistribution: DemographicData[] = [
  { category: "Lagos", count: 312, percentage: 36.7 },
  { category: "Abuja", count: 198, percentage: 23.3 },
  { category: "Port Harcourt", count: 124, percentage: 14.6 },
  { category: "Enugu", count: 89, percentage: 10.5 },
  { category: "Kano", count: 67, percentage: 7.9 },
  { category: "Others", count: 60, percentage: 7.0 }
];

export const professionDistribution: DemographicData[] = [
  { category: "Business/Trade", count: 234, percentage: 27.5 },
  { category: "Civil Service", count: 187, percentage: 22.0 },
  { category: "Education", count: 142, percentage: 16.7 },
  { category: "Healthcare", count: 98, percentage: 11.5 },
  { category: "Tech/IT", count: 76, percentage: 8.9 },
  { category: "Agriculture", count: 54, percentage: 6.4 },
  { category: "Others", count: 59, percentage: 6.9 }
];

export const engagementMetrics: EngagementMetric[] = [
  {
    metric: "Meeting Attendance",
    value: 78.4,
    trend: "up",
    change: 5.2
  },
  {
    metric: "Event Participation",
    value: 65.8,
    trend: "up",
    change: 8.3
  },
  {
    metric: "Financial Compliance",
    value: 82.6,
    trend: "stable",
    change: 0.4
  },
  {
    metric: "Social Media Engagement",
    value: 71.2,
    trend: "up",
    change: 12.5
  },
  {
    metric: "Volunteer Participation",
    value: 54.3,
    trend: "down",
    change: -3.7
  }
];

export const recentActivities = [
  {
    id: "activity-1",
    type: "event",
    title: "December General Meeting",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    participants: 187,
    icon: "Users"
  },
  {
    id: "activity-2",
    type: "fundraiser",
    title: "Hospital Project Campaign",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    participants: 234,
    icon: "DollarSign"
  },
  {
    id: "activity-3",
    type: "election",
    title: "Executive Committee Voting",
    date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    participants: 412,
    icon: "Vote"
  },
  {
    id: "activity-4",
    type: "social",
    title: "Community Thanksgiving Service",
    date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
    participants: 234,
    icon: "Heart"
  }
];

export const growthData = [
  { month: "Jan", members: 756 },
  { month: "Feb", members: 768 },
  { month: "Mar", members: 782 },
  { month: "Apr", members: 794 },
  { month: "May", members: 801 },
  { month: "Jun", members: 812 },
  { month: "Jul", members: 820 },
  { month: "Aug", members: 827 },
  { month: "Sep", members: 835 },
  { month: "Oct", members: 842 },
  { month: "Nov", members: 850 },
  { month: "Dec", members: 850 }
];
