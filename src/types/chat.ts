export interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  isOnline?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  isRead?: boolean;
  attachments?: {
    type: 'image' | 'file' | 'gift' | 'audio';
    url: string;
    name: string;
    duration?: number;
    giftData?: {
      id: string;
      name: string;
      mobiValue: number;
      icon?: string;
      category?: string;
    };
  }[];
  reactions?: {
    userId: string;
    emoji: string;
  }[];
  isEdited?: boolean;
  replyTo?: {
    messageId: string;
    content: string;
    senderName: string;
  };
}

export interface Conversation {
  id: string;
  user: ChatUser;
  messages: Message[];
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
}
