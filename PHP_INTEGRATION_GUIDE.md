# PHP Integration Guide for Mobigate Frontend

This guide documents all `window.__*__` properties that the PHP backend should inject into the frontend application for seamless data integration.

## Overview

The Mobigate frontend is designed to work with data injected by the PHP backend through the global `window` object. This allows the React application to access server-rendered data without additional API calls, improving performance and user experience.

## Data Injection Pattern

All PHP-injected data follows the naming convention: `window.__PROPERTY_NAME__`

The frontend always checks for PHP data first, then falls back to localStorage or mock data for development.

---

## User Profile & Identity

### `window.__CURRENT_USER_ID__`
**Type:** `string`  
**Description:** The authenticated user's unique identifier  
**Example:** `"user-123"`  
**Usage:** Used throughout the app to identify the current user

### `window.__USER_PROFILE__`
**Type:** `UserProfile` object  
**Description:** Complete user profile information

```typescript
interface UserProfile {
  id: string;
  name: string;
  email: string;
  username?: string;
  profileImage?: string;
  bannerImage?: string;
  bio?: string;
  location?: string;
  verified?: boolean;
  status?: "Online" | "Offline" | "Away";
  stats?: {
    friends: string;
    followers: string;
    following: string;
    likes: string;
    gifts: string;
    contents: string;
  };
  // Discount profile fields for advertiser tiers
  accreditedTier?: "bronze" | "silver" | "gold" | "platinum" | null;
  totalCampaigns?: number;
  activeAdverts?: number;
  successfulCampaigns?: number;
}
```

**New Fields:**
- `accreditedTier`: The user's advertiser accreditation level (null if not accredited)
- `totalCampaigns`: Total number of advertising campaigns run by the user
- `activeAdverts`: Number of currently active advertisements
- `successfulCampaigns`: Number of successfully completed campaigns

**Used in:**
- `src/data/discountData.ts` - Fetches discount profile data
- `src/pages/SubmitAdvert.tsx` - Applies tier-based discounts
- `src/hooks/useComments.ts` - Gets author name and avatar for comments

---

## Social Connections

### `window.__FRIENDS_LIST__`
**Type:** `Friend[]`  
**Description:** Array of user's friends

```typescript
interface Friend {
  id: string;
  name: string;
  email: string;
  username?: string;
  profileImage?: string;
  status?: "Online" | "Offline" | "Away";
  mutualFriends?: number;
}
```

**Used in:**
- Privacy exception dialogs
- Friend suggestion features
- Chat contact lists

### `window.__FOLLOWERS_LIST__`
**Type:** `Follower[]`  
**Description:** Users following the current user

```typescript
interface Follower {
  id: string;
  name: string;
  profileImage?: string;
  followedAt: string; // ISO date string
}
```

### `window.__FOLLOWING_LIST__`
**Type:** `Following[]`  
**Description:** Users the current user is following

```typescript
interface Following {
  id: string;
  name: string;
  profileImage?: string;
  followedAt: string; // ISO date string
}
```

---

## Content & Posts

### `window.__USER_POSTS__`
**Type:** `Post[]`  
**Description:** Posts created by the user

```typescript
interface Post {
  id: string;
  userId: string;
  content: string;
  images?: string[];
  videos?: string[];
  createdAt: Date;
  likes: number;
  comments: number;
  shares: number;
  privacy?: "public" | "friends" | "private";
}
```

**Note:** Dates should be ISO strings in PHP, will be converted to Date objects in frontend

### `window.__FEED_POSTS__`
**Type:** `Post[]`  
**Description:** Posts for the user's feed (from friends, followed users, etc.)

### `window.__WALL_STATUS_POSTS__`
**Type:** `Post[]`  
**Description:** Status updates displayed on user's wall

---

## Albums & Media

### `window.__USER_ALBUMS__`
**Type:** `Album[]`  
**Description:** User's photo/video albums

```typescript
interface Album {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  itemCount: number;
  createdAt: string; // ISO date
  privacy?: "public" | "friends" | "private";
}
```

### `window.__PROFILE_IMAGE__`
**Type:** `string`  
**Description:** URL to current profile picture  
**Example:** `"https://cdn.mobigate.com/profiles/user123.jpg"`

### `window.__PROFILE_IMAGE_HISTORY__`
**Type:** `string[]`  
**Description:** Array of previous profile picture URLs

### `window.__BANNER_IMAGE__`
**Type:** `string`  
**Description:** URL to current banner/cover image

### `window.__BANNER_IMAGE_HISTORY__`
**Type:** `string[]`  
**Description:** Array of previous banner image URLs

---

## User Administration

### `window.__USER_MAP__`
**Type:** `Record<string, UserMapEntry>`  
**Description:** Mapping of user IDs to display information for admin interfaces

```typescript
interface UserMapEntry {
  name: string;
  email?: string;
  username?: string;
}
```

**Example:**
```javascript
window.__USER_MAP__ = {
  "user-123": {
    name: "John Doe",
    email: "john@example.com",
    username: "johndoe"
  },
  "user-456": {
    name: "Jane Smith",
    email: "jane@example.com"
  }
};
```

**Used in:**
- `src/pages/AdminManageAdverts.tsx` - Displays advertiser names in admin panel

---

## Gifts

### `window.__RECEIVED_GIFTS__`
**Type:** `ReceivedGift[]`  
**Description:** Gifts received by the user

```typescript
interface ReceivedGift {
  id: string;
  giftId: string;
  giftName: string;
  giftImage: string;
  fromUserId: string;
  fromUserName: string;
  receivedAt: string; // ISO date
  message?: string;
}
```

### `window.__SENT_GIFTS__`
**Type:** `SentGift[]`  
**Description:** Gifts sent by the user

```typescript
interface SentGift {
  id: string;
  giftId: string;
  giftName: string;
  giftImage: string;
  toUserId: string;
  toUserName: string;
  sentAt: string; // ISO date
  message?: string;
}
```

---

## Likes

### `window.__LIKES_LIST__`
**Type:** `LikeEntry[]`  
**Description:** Items the user has liked

```typescript
interface LikeEntry {
  id: string;
  type: "post" | "profile" | "comment";
  targetId: string;
  likedAt: string; // ISO date
}
```

---

## Messaging

### `window.__CONVERSATIONS__`
**Type:** `Conversation[]`  
**Description:** User's chat conversations

```typescript
interface Conversation {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  isOnline: boolean;
}
```

**Note:** `timestamp` should be ISO string in PHP, converted to Date in frontend

---

## Advertisements

### `window.__USER_ADVERTS__`
**Type:** `SavedAdvert[]`  
**Description:** User's submitted advertisements

```typescript
interface SavedAdvert {
  id: string;
  userId: string;
  category: "pictorial" | "video";
  type: string;
  size: string;
  dpdPackage: string;
  status: "draft" | "pending" | "approved" | "active" | "rejected" | "expired";
  createdAt: Date;
  updatedAt: Date;
  submittedAt?: Date;
  launchDate?: Date;
  expiresAt?: Date;
  rejectedReason?: string;
  pricing: {
    baseCost: number;
    totalCost: number;
    finalAmountPayable: number;
    subscriptionMonths: number;
    displayPerDay: number;
  };
  statistics?: {
    impressions: number;
    clicks: number;
    views: number;
    revenue: number;
    displayedToday: number;
    lastDisplayed?: Date;
  };
  // ... other advert fields
}
```

**Critical:** This is used by `advertSimulator.ts` to track advert performance. PHP data takes priority over localStorage.

---

## Profile Data

### `window.__PROFILE_DATA__`
**Type:** `ProfileData` object  
**Description:** Extended profile information for display

```typescript
interface ProfileData {
  about?: string;
  work?: string;
  education?: string;
  location?: string;
  relationship?: string;
  // ... additional profile sections
}
```

### `window.__ABOUT_DATA__`
**Type:** `AboutData` object  
**Description:** Detailed "About" section information

---

## Implementation Guidelines

### 1. Data Injection in PHP

Inject data in your main PHP template before loading the React app:

```php
<script>
  window.__CURRENT_USER_ID__ = <?php echo json_encode($user->id); ?>;
  window.__USER_PROFILE__ = <?php echo json_encode($userProfile); ?>;
  window.__FRIENDS_LIST__ = <?php echo json_encode($friendsList); ?>;
  // ... other data
</script>
<!-- React app loads after -->
<script src="/assets/index.js"></script>
```

### 2. Date Handling

**Important:** All dates should be ISO 8601 strings in PHP:

```php
'createdAt' => $date->format('c'), // ISO 8601
```

The frontend will convert them to JavaScript Date objects.

### 3. Fallback Behavior

The frontend gracefully falls back to:
1. **localStorage** (for previously cached data)
2. **Mock data** (for development/testing)

This means the app will work even without PHP data injection.

### 4. Type Safety

All interfaces are defined in `src/types/window.d.ts`. Ensure PHP output matches these TypeScript definitions.

---

## Testing Checklist

When implementing PHP integration:

- [ ] Verify all date fields are ISO 8601 strings
- [ ] Test with empty/null values
- [ ] Ensure arrays are never `null` (use empty arrays `[]`)
- [ ] Check that user IDs are consistent across all data
- [ ] Validate image URLs are absolute and accessible
- [ ] Test with large datasets (1000+ items)
- [ ] Verify privacy fields are correctly set
- [ ] Test authentication state changes
- [ ] Confirm data updates reflect in real-time

---

## Security Considerations

1. **XSS Prevention:** Always escape data in PHP before injecting:
   ```php
   htmlspecialchars(json_encode($data), ENT_QUOTES, 'UTF-8')
   ```

2. **Sensitive Data:** Never inject:
   - Password hashes
   - API keys/tokens
   - Internal system identifiers
   - Email verification codes

3. **Privacy Respect:** Only inject data the user has permission to see

---

## Performance Notes

- Keep injected data under 500KB total
- Use pagination for large lists (load more via API)
- Consider lazy-loading non-critical data
- Cache static data (gift lists, etc.) aggressively

---

## Migration Status

### ✅ Completed Integrations (Phase 1-6)

1. **FriendExceptionDialog** - Uses `useFriendsList()` hook
2. **advertSimulator.ts** - Checks `window.__USER_ADVERTS__` first
3. **slotPackStorage.ts** - Accepts dynamic `userId` parameter
4. **Profile.tsx** - Uses `useCurrentUserId()` for chat and posts
5. **SubmitAdvert.tsx** - Uses `useCurrentUserId()` for pack creation and saving adverts
6. **useComments.ts** - Uses `useCurrentUserId()` and `useUserProfile()` for comment authors
7. **ProfileContentsTab.tsx** - Uses `useUserPosts()` for user posts
8. **Index.tsx** - Uses `useCurrentUserId()` for wall status transformations
9. **WallStatusCarousel.tsx** - Uses `useCurrentUserId()` for post detail dialogs
10. **ProfileAboutTab.tsx** - Uses `useCurrentUserId()` for referer IDs
11. **AdminManageAdverts.tsx** - Uses `window.__USER_MAP__` for user display names
12. **MyAdverts.tsx** - Uses `useCurrentUserId()` to load user-specific adverts
13. **advertStorage.ts** - Removed hardcoded `MOCK_USER_ID`, requires `userId` parameter
14. **discountData.ts** - Checks `window.__USER_PROFILE__` for discount profile data

### 📋 All Data Access Points

- User profiles: `useUserProfile()` hook
- Friends lists: `useFriendsList()` hook
- Posts: `useUserPosts()`, `useFeedPosts()` hooks
- Albums: `useUserAlbums()` hook
- Conversations: `useConversations()` hook
- Adverts: `useUserAdverts()` hook + direct `window.__USER_ADVERTS__` access
- Gifts: `useReceivedGifts()`, `useSentGifts()` hooks

---

## Support & Contact

For questions about this integration:
- Check `src/hooks/useWindowData.ts` for all hook implementations
- Review `src/types/window.d.ts` for TypeScript definitions
- Test with console: `console.log(window.__USER_PROFILE__)`

**Last Updated:** 2025-01-01  
**Version:** 1.0.0
