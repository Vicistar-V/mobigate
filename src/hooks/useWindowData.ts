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
