# Privacy Exceptions - Backend Integration Guide

## Overview
This document explains how to integrate the "All Except" privacy feature with your backend system.

## Frontend Implementation

### Components Created
1. **FriendExceptionDialog** (`src/components/profile/FriendExceptionDialog.tsx`)
   - Dialog for selecting friends to exclude from visibility
   - Text input with auto-suggestion
   - Friends list with search and multi-select
   - Handles both friend selection and custom name/email entry

2. **Enhanced PrivacySelector** (`src/components/profile/PrivacySelector.tsx`)
   - Opens exception dialog when "All Except" is selected
   - Displays exception count badge
   - Manages exception state

### Data Structure
```typescript
interface Location {
  id: string;
  place: string;
  description: string;
  period?: string;
  privacy?: string;
  exceptions?: string[]; // Array of user IDs or custom identifiers
}
```

### Exception ID Format
- **Friend IDs**: Regular user IDs from your database (e.g., `"user_123"`)
- **Custom entries**: Prefixed with `custom_` (e.g., `"custom_john@example.com"`)

## Backend Integration Requirements

### 1. Friends API Endpoint
Replace the `mockFriends` array in `FriendExceptionDialog.tsx` with a real API call:

```typescript
// Example API integration
import { useQuery } from '@tanstack/react-query';

const useFriends = () => {
  return useQuery({
    queryKey: ['friends'],
    queryFn: async () => {
      const response = await fetch('/api/friends', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.json();
    }
  });
};
```

### 2. User Search/Auto-suggestion Endpoint
Implement an API endpoint for user search:

```typescript
// GET /api/users/search?q=query
// Returns: { id, name, email, profileImage? }[]

const searchUsers = async (query: string) => {
  const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
  return response.json();
};
```

### 3. Database Schema

#### Supabase Example Schema
```sql
-- Profiles table
create table public.profiles (
  id uuid references auth.users primary key,
  name text not null,
  email text not null,
  avatar_url text
);

-- Friends table
create table public.friendships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) not null,
  friend_id uuid references public.profiles(id) not null,
  status text not null default 'pending', -- 'pending', 'accepted', 'blocked'
  created_at timestamp with time zone default now(),
  unique(user_id, friend_id)
);

-- Locations table with privacy
create table public.locations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) not null,
  place text not null,
  description text not null,
  period text,
  privacy text not null default 'public', -- 'public', 'friends', 'all-except', 'only-me'
  exceptions jsonb, -- Array of user IDs to exclude
  created_at timestamp with time zone default now()
);

-- Index for performance
create index idx_locations_user_id on public.locations(user_id);
create index idx_friendships_user_id on public.friendships(user_id);
create index idx_friendships_friend_id on public.friendships(friend_id);
```

#### Row Level Security (RLS) Policies
```sql
-- Enable RLS
alter table public.locations enable row level security;

-- Policy: Users can view their own locations
create policy "Users can view own locations"
  on public.locations for select
  using (auth.uid() = user_id);

-- Policy: Others can view based on privacy settings
create policy "Others can view locations based on privacy"
  on public.locations for select
  using (
    case privacy
      when 'public' then true
      when 'only-me' then auth.uid() = user_id
      when 'friends' then exists (
        select 1 from public.friendships
        where (user_id = auth.uid() and friend_id = locations.user_id and status = 'accepted')
           or (friend_id = auth.uid() and user_id = locations.user_id and status = 'accepted')
      )
      when 'all-except' then 
        auth.uid() != user_id 
        and not (exceptions ? auth.uid()::text)
        and not exists (
          select 1 from jsonb_array_elements_text(exceptions) as exc
          where exc like 'custom_%'
        )
      else false
    end
  );

-- Policy: Users can insert their own locations
create policy "Users can insert own locations"
  on public.locations for insert
  with check (auth.uid() = user_id);

-- Policy: Users can update their own locations
create policy "Users can update own locations"
  on public.locations for update
  using (auth.uid() = user_id);

-- Policy: Users can delete their own locations
create policy "Users can delete own locations"
  on public.locations for delete
  using (auth.uid() = user_id);
```

### 4. API Endpoints to Implement

#### Get Friends List
```typescript
// GET /api/friends
// Response: Friend[]
interface Friend {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
```

#### Search Users
```typescript
// GET /api/users/search?q=query&limit=10
// Response: User[]
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
```

#### Validate Email/User
```typescript
// POST /api/users/validate
// Body: { email: string } or { name: string }
// Response: { exists: boolean, user?: User }
```

### 5. Frontend Integration Steps

1. **Replace Mock Data**
   - Update `FriendExceptionDialog.tsx` to fetch real friends data
   - Implement API calls for user search

2. **Add Authentication**
   - Ensure API calls include authentication tokens
   - Handle authentication errors

3. **Update Auto-suggestion**
   - Connect custom input to user search API
   - Debounce search requests (300ms recommended)

4. **Handle Custom Entries**
   - Validate email format before adding
   - Check if user exists in system
   - Store custom entries appropriately

### Example Implementation with React Query

```typescript
// hooks/useFriends.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export const useFriends = () => {
  return useQuery({
    queryKey: ['friends'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('friendships')
        .select(`
          friend_id,
          profiles:friend_id (
            id,
            name,
            email,
            avatar_url
          )
        `)
        .eq('status', 'accepted');
      
      if (error) throw error;
      return data.map(f => f.profiles);
    }
  });
};

// hooks/useUserSearch.ts
export const useUserSearch = (query: string) => {
  return useQuery({
    queryKey: ['user-search', query],
    queryFn: async () => {
      if (!query || query.length < 2) return [];
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, avatar_url')
        .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
        .limit(10);
      
      if (error) throw error;
      return data;
    },
    enabled: query.length >= 2
  });
};
```

## Security Considerations

1. **Validate Exception IDs**: Always validate that exception IDs belong to real users
2. **Sanitize Custom Entries**: Validate and sanitize email addresses and names
3. **Rate Limiting**: Implement rate limiting on search endpoints
4. **Privacy Checks**: Ensure backend enforces privacy settings, not just frontend
5. **Audit Logs**: Log privacy setting changes for security auditing

## Testing Checklist

- [ ] Friends list loads correctly
- [ ] Search/auto-suggestion works
- [ ] Custom entries can be added
- [ ] Exceptions are saved and persisted
- [ ] Privacy filtering works correctly
- [ ] RLS policies prevent unauthorized access
- [ ] Performance is acceptable with large friend lists
- [ ] Error handling works properly
- [ ] UI is responsive and accessible

## Future Enhancements

1. **Groups**: Allow excluding entire groups
2. **Smart Lists**: Exclude "Close Friends", "Family", etc.
3. **Batch Operations**: Select/deselect all friends
4. **Recent Exclusions**: Show recently excluded people
5. **Verification**: Verify email addresses before adding custom entries
