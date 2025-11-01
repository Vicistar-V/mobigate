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
