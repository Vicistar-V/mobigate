import { useState, useEffect } from 'react';
import { UserProfile } from '@/types/window';
import profilePhoto from '@/assets/profile-photo.jpg';

export function useUserProfile(): UserProfile {
  const [profile, setProfile] = useState<UserProfile>(() => {
    // Try to get PHP-injected data immediately
    if (typeof window !== 'undefined' && window.__USER_PROFILE__) {
      return window.__USER_PROFILE__;
    }
    
    // Fallback to mock data
    return {
      id: 'current-user',
      username: 'NKEMJKA PETER I.',
      fullName: 'NKEMJKA PETER IPREC',
      avatar: profilePhoto,
      email: 'peter@mobigate.com',
      greeting: 'Good Evening',
      timestamp: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      stats: {
        friends: 17,
        likes: 132,
        followers: 45,
        following: 38
      }
    };
  });

  useEffect(() => {
    // Double-check for late injection
    if (window.__USER_PROFILE__ && profile.id === 'current-user') {
      setProfile(window.__USER_PROFILE__);
    }
  }, [profile.id]);

  return profile;
}

export function useFriendsList() {
  const [friends, setFriends] = useState(() => {
    if (typeof window !== 'undefined' && window.__FRIENDS_LIST__) {
      return window.__FRIENDS_LIST__;
    }
    return null;
  });

  useEffect(() => {
    if (window.__FRIENDS_LIST__ && !friends) {
      setFriends(window.__FRIENDS_LIST__);
    }
  }, [friends]);

  return friends;
}

export function useLikesList() {
  const [likes, setLikes] = useState(() => {
    if (typeof window !== 'undefined' && window.__LIKES_LIST__) {
      return window.__LIKES_LIST__;
    }
    return null;
  });

  useEffect(() => {
    if (window.__LIKES_LIST__ && !likes) {
      setLikes(window.__LIKES_LIST__);
    }
  }, [likes]);

  return likes;
}

export function useFollowersList() {
  const [followers, setFollowers] = useState(() => {
    if (typeof window !== 'undefined' && window.__FOLLOWERS_LIST__) {
      return window.__FOLLOWERS_LIST__;
    }
    return null;
  });

  useEffect(() => {
    if (window.__FOLLOWERS_LIST__ && !followers) {
      setFollowers(window.__FOLLOWERS_LIST__);
    }
  }, [followers]);

  return followers;
}

export function useFollowingList() {
  const [following, setFollowing] = useState(() => {
    if (typeof window !== 'undefined' && window.__FOLLOWING_LIST__) {
      return window.__FOLLOWING_LIST__;
    }
    return null;
  });

  useEffect(() => {
    if (window.__FOLLOWING_LIST__ && !following) {
      setFollowing(window.__FOLLOWING_LIST__);
    }
  }, [following]);

  return following;
}

export function useReceivedGifts() {
  const [gifts, setGifts] = useState(() => {
    if (typeof window !== 'undefined' && window.__RECEIVED_GIFTS__) {
      return window.__RECEIVED_GIFTS__;
    }
    return null;
  });

  useEffect(() => {
    if (window.__RECEIVED_GIFTS__ && !gifts) {
      setGifts(window.__RECEIVED_GIFTS__);
    }
  }, [gifts]);

  return gifts;
}

export function useSentGifts() {
  const [gifts, setGifts] = useState(() => {
    if (typeof window !== 'undefined' && window.__SENT_GIFTS__) {
      return window.__SENT_GIFTS__;
    }
    return null;
  });

  useEffect(() => {
    if (window.__SENT_GIFTS__ && !gifts) {
      setGifts(window.__SENT_GIFTS__);
    }
  }, [gifts]);

  return gifts;
}

export function useProfileData() {
  const [profile, setProfile] = useState(() => {
    if (typeof window !== 'undefined' && window.__PROFILE_DATA__) {
      return window.__PROFILE_DATA__;
    }
    return null;
  });

  useEffect(() => {
    if (window.__PROFILE_DATA__ && !profile) {
      setProfile(window.__PROFILE_DATA__);
    }
  }, [profile]);

  return profile;
}

export function useAboutData() {
  const [about, setAbout] = useState(() => {
    if (typeof window !== 'undefined' && window.__ABOUT_DATA__) {
      return window.__ABOUT_DATA__;
    }
    return null;
  });

  useEffect(() => {
    if (window.__ABOUT_DATA__ && !about) {
      setAbout(window.__ABOUT_DATA__);
    }
  }, [about]);

  return about;
}

export function useUserPosts() {
  const [posts, setPosts] = useState(() => {
    if (typeof window !== 'undefined' && window.__USER_POSTS__) {
      return window.__USER_POSTS__;
    }
    return null;
  });

  useEffect(() => {
    if (window.__USER_POSTS__ && !posts) {
      setPosts(window.__USER_POSTS__);
    }
  }, [posts]);

  return posts;
}

export function useCurrentUserId(): string {
  const [userId, setUserId] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.__CURRENT_USER_ID__) {
      return window.__CURRENT_USER_ID__;
    }
    return 'current-user';
  });

  useEffect(() => {
    if (window.__CURRENT_USER_ID__ && userId === 'current-user') {
      setUserId(window.__CURRENT_USER_ID__);
    }
  }, [userId]);

  return userId;
}

export interface WalletData {
  mobi: number;
  credit: number;
}

export interface WalletStats {
  mobiReceived: number;
  creditReceived: number;
  mobiSpent: number;
  creditSpent: number;
}

/**
 * Get user's wallet balance from PHP or fallback to mock
 */
export function useWalletBalance(): WalletData {
  const [wallet, setWallet] = useState<WalletData>(() => {
    // Priority 1: Check window.__USER_PROFILE__ for PHP wallet data
    if (typeof window !== 'undefined' && window.__USER_PROFILE__?.walletBalance) {
      return window.__USER_PROFILE__.walletBalance;
    }
    
    // Priority 2: Mock data fallback (development)
    return {
      mobi: 50000,
      credit: 50000,
    };
  });

  useEffect(() => {
    if (window.__USER_PROFILE__?.walletBalance && 
        (wallet.mobi === 50000 || wallet.credit === 50000)) {
      setWallet(window.__USER_PROFILE__.walletBalance);
    }
  }, [wallet.mobi, wallet.credit]);

  return wallet;
}

/**
 * Get user's wallet statistics from PHP or fallback to mock
 */
export function useWalletStats(): WalletStats {
  const [stats, setStats] = useState<WalletStats>(() => {
    // Priority 1: Check window.__USER_PROFILE__ for PHP wallet stats
    if (typeof window !== 'undefined' && window.__USER_PROFILE__?.walletStats) {
      return window.__USER_PROFILE__.walletStats;
    }
    
    // Priority 2: Mock data fallback (development)
    return {
      mobiReceived: 150000,
      creditReceived: 150000,
      mobiSpent: 50000,
      creditSpent: 50000,
    };
  });

  useEffect(() => {
    if (window.__USER_PROFILE__?.walletStats) {
      setStats(window.__USER_PROFILE__.walletStats);
    }
  }, []);

  return stats;
}

export function useConversations() {
  const [conversations, setConversations] = useState(() => {
    if (typeof window !== 'undefined' && window.__CONVERSATIONS__) {
      // Convert timestamp strings to Date objects
      return window.__CONVERSATIONS__.map(conv => ({
        ...conv,
        messages: conv.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })),
        lastMessageTime: new Date(conv.lastMessageTime)
      }));
    }
    return null;
  });

  useEffect(() => {
    if (window.__CONVERSATIONS__ && !conversations) {
      const converted = window.__CONVERSATIONS__.map(conv => ({
        ...conv,
        messages: conv.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })),
        lastMessageTime: new Date(conv.lastMessageTime)
      }));
      setConversations(converted);
    }
  }, [conversations]);

  return conversations;
}

export function useUserAlbums() {
  const [albums, setAlbums] = useState(() => {
    if (typeof window !== 'undefined' && window.__USER_ALBUMS__) {
      return window.__USER_ALBUMS__;
    }
    return null;
  });

  useEffect(() => {
    if (window.__USER_ALBUMS__ && !albums) {
      setAlbums(window.__USER_ALBUMS__);
    }
  }, [albums]);

  return albums;
}

export function useFeedPosts() {
  const [posts, setPosts] = useState(() => {
    if (typeof window !== 'undefined' && window.__FEED_POSTS__) {
      return window.__FEED_POSTS__;
    }
    return null;
  });

  useEffect(() => {
    if (window.__FEED_POSTS__ && !posts) {
      setPosts(window.__FEED_POSTS__);
    }
  }, [posts]);

  return posts;
}

export function useWallStatusPosts() {
  const [posts, setPosts] = useState(() => {
    if (typeof window !== 'undefined' && window.__WALL_STATUS_POSTS__) {
      return window.__WALL_STATUS_POSTS__;
    }
    return null;
  });

  useEffect(() => {
    if (window.__WALL_STATUS_POSTS__ && !posts) {
      setPosts(window.__WALL_STATUS_POSTS__);
    }
  }, [posts]);

  return posts;
}

export function useUserAdverts() {
  const [adverts, setAdverts] = useState(() => {
    if (typeof window !== 'undefined' && window.__USER_ADVERTS__) {
      // Convert date strings to Date objects
      return window.__USER_ADVERTS__.map((ad: any) => ({
        ...ad,
        launchDate: new Date(ad.launchDate),
        createdAt: new Date(ad.createdAt),
        updatedAt: new Date(ad.updatedAt),
        approvedAt: ad.approvedAt ? new Date(ad.approvedAt) : undefined,
        expiresAt: ad.expiresAt ? new Date(ad.expiresAt) : undefined,
      }));
    }
    return null;
  });

  useEffect(() => {
    if (window.__USER_ADVERTS__ && !adverts) {
      setAdverts(
        window.__USER_ADVERTS__.map((ad: any) => ({
          ...ad,
          launchDate: new Date(ad.launchDate),
          createdAt: new Date(ad.createdAt),
          updatedAt: new Date(ad.updatedAt),
          approvedAt: ad.approvedAt ? new Date(ad.approvedAt) : undefined,
          expiresAt: ad.expiresAt ? new Date(ad.expiresAt) : undefined,
        }))
      );
    }
  }, [adverts]);

  return adverts;
}
