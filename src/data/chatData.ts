import { Conversation } from "@/types/chat";

export const mockConversations: Conversation[] = [
  {
    id: "1",
    user: {
      id: "user-1",
      name: "Tunde Bakare",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=tunde",
      isOnline: true,
    },
    messages: [
      {
        id: "msg-1",
        senderId: "user-1",
        content: "Hey! Did you see my latest post about tech startups?",
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        isRead: false,
      },
      {
        id: "msg-2",
        senderId: "current-user",
        content: "Not yet! I'll check it out now.",
        timestamp: new Date(Date.now() - 8 * 60 * 1000),
        isRead: true,
      },
    ],
    lastMessage: "Hey! Did you see my latest post about tech startups?",
    lastMessageTime: new Date(Date.now() - 10 * 60 * 1000),
    unreadCount: 1,
  },
  {
    id: "2",
    user: {
      id: "user-2",
      name: "Chef Ngozi",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ngozi",
      isOnline: true,
    },
    messages: [
      {
        id: "msg-3",
        senderId: "user-2",
        content: "Thank you for your support! Check out my new recipe.",
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        isRead: false,
      },
    ],
    lastMessage: "Thank you for your support! Check out my new recipe.",
    lastMessageTime: new Date(Date.now() - 60 * 60 * 1000),
    unreadCount: 1,
  },
  {
    id: "3",
    user: {
      id: "user-3",
      name: "Emeka Nwosu",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emeka",
      isOnline: false,
    },
    messages: [
      {
        id: "msg-4",
        senderId: "user-3",
        content: "Let's collaborate on the real estate project.",
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        isRead: true,
      },
      {
        id: "msg-5",
        senderId: "current-user",
        content: "Sounds good! When can we meet?",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isRead: true,
      },
    ],
    lastMessage: "Sounds good! When can we meet?",
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    unreadCount: 0,
  },
  {
    id: "4",
    user: {
      id: "user-4",
      name: "Sarah Okafor",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah2",
      isOnline: false,
    },
    messages: [
      {
        id: "msg-6",
        senderId: "user-4",
        content: "Great article! Very insightful content.",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        isRead: true,
      },
    ],
    lastMessage: "Great article! Very insightful content.",
    lastMessageTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
    unreadCount: 0,
  },
  {
    id: "5",
    user: {
      id: "user-5",
      name: "Amaka Jane Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
      isOnline: true,
    },
    messages: [
      {
        id: "msg-7",
        senderId: "current-user",
        content: "Hi Amaka! How are you?",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        isRead: true,
      },
    ],
    lastMessage: "Hi Amaka! How are you?",
    lastMessageTime: new Date(Date.now() - 5 * 60 * 1000),
    unreadCount: 0,
  },
];

export const getConversationById = (id: string): Conversation | undefined => {
  return mockConversations.find((conv) => conv.id === id);
};

export const formatMessageTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  
  return date.toLocaleDateString();
};

export const formatChatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
};
