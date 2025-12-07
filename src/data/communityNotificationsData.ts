// Community Notification Types and Mock Data

export type NotificationType = 
  | "birthday" 
  | "new_member" 
  | "event" 
  | "meeting" 
  | "announcement" 
  | "election" 
  | "fundraiser"
  | "membership_approved"
  | "post_liked"
  | "post_commented";

export interface CommunityNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  avatar?: string;
  personName?: string;
  communityId: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
}

// Mock notifications data
export const communityNotifications: CommunityNotification[] = [
  {
    id: "notif-1",
    type: "birthday",
    title: "Happy Birthday! 🎂",
    message: "Chidi Okonkwo is celebrating his birthday today. Wish him well!",
    personName: "Chidi Okonkwo",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    communityId: "1",
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    isRead: false,
  },
  {
    id: "notif-2",
    type: "new_member",
    title: "New Member Joined",
    message: "Emmanuel Nwosu has joined the community. Welcome him!",
    personName: "Emmanuel Nwosu",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    communityId: "1",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isRead: false,
  },
  {
    id: "notif-3",
    type: "meeting",
    title: "Upcoming Meeting",
    message: "Annual General Meeting starts tomorrow at 10:00 AM at Town Hall",
    communityId: "1",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    isRead: false,
  },
  {
    id: "notif-4",
    type: "event",
    title: "Event Reminder",
    message: "Community Town Hall event in 3 days. Don't miss it!",
    communityId: "1",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    isRead: false,
  },
  {
    id: "notif-5",
    type: "announcement",
    title: "New Announcement",
    message: "President-General posted a new announcement about community development projects",
    communityId: "1",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    isRead: true,
  },
  {
    id: "notif-6",
    type: "election",
    title: "Election Update",
    message: "Nominations for community elections open next week. Prepare your candidacy!",
    communityId: "1",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    isRead: true,
  },
  {
    id: "notif-7",
    type: "fundraiser",
    title: "Fundraiser Progress",
    message: "School Building Project fundraiser has reached 75% of its goal! 🎉",
    communityId: "1",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    isRead: true,
  },
  {
    id: "notif-8",
    type: "birthday",
    title: "Birthday Coming Up",
    message: "Adaeze Eze's birthday is in 2 days. Plan ahead!",
    personName: "Adaeze Eze",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    communityId: "1",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    isRead: true,
  },
  {
    id: "notif-9",
    type: "membership_approved",
    title: "Membership Approved",
    message: "Obioma Kalu's membership application has been approved",
    personName: "Obioma Kalu",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    communityId: "1",
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    isRead: true,
  },
  {
    id: "notif-10",
    type: "new_member",
    title: "New Member Joined",
    message: "Ngozi Amadi has joined the community. Welcome her!",
    personName: "Ngozi Amadi",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    communityId: "1",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    isRead: true,
  },
];

// Helper function to get notification icon based on type
export const getNotificationIcon = (type: NotificationType): string => {
  switch (type) {
    case "birthday":
      return "🎂";
    case "new_member":
    case "membership_approved":
      return "👤";
    case "event":
      return "📅";
    case "meeting":
      return "🗓️";
    case "announcement":
      return "📢";
    case "election":
      return "🗳️";
    case "fundraiser":
      return "💰";
    case "post_liked":
      return "❤️";
    case "post_commented":
      return "💬";
    default:
      return "🔔";
  }
};

// Helper function to format relative time
export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Group notifications by time period
export const groupNotificationsByTime = (notifications: CommunityNotification[]) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  const groups: { label: string; notifications: CommunityNotification[] }[] = [
    { label: "Today", notifications: [] },
    { label: "Yesterday", notifications: [] },
    { label: "This Week", notifications: [] },
    { label: "Earlier", notifications: [] },
  ];

  notifications.forEach((notification) => {
    const notifDate = new Date(notification.timestamp);
    
    if (notifDate >= today) {
      groups[0].notifications.push(notification);
    } else if (notifDate >= yesterday) {
      groups[1].notifications.push(notification);
    } else if (notifDate >= thisWeek) {
      groups[2].notifications.push(notification);
    } else {
      groups[3].notifications.push(notification);
    }
  });

  // Filter out empty groups
  return groups.filter(group => group.notifications.length > 0);
};
