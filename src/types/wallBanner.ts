// Wall Banner Slideshow — data model
// A user-managed rotating banner of mixed photos/videos with per-slide
// link actions, display intervals, schedule (start/end), and optional
// "Sponsored" tag. Used on Profile pages and the homepage GreetingCard.

export type WallBannerMediaType = "photo" | "video";

export type WallBannerLinkAction =
  | "none"      // no click action (or open in viewer)
  | "url"       // navigate to URL
  | "email"     // open mail client
  | "whatsapp"  // open WhatsApp deep link
  | "viewer"    // open big viewer / play video
  | "play";     // alias kept for clarity

export interface WallBannerSlide {
  id: string;
  ownerId: string;             // user id who owns this slide
  scope: "profile" | "home";   // where the slide appears
  mediaType: WallBannerMediaType;
  mediaUrl: string;            // image/video URL or data URL
  posterUrl?: string;          // video poster fallback

  caption?: string;

  // Click behaviour
  linkAction: WallBannerLinkAction;
  linkValue?: string;          // url / email / phone — depending on linkAction

  // Per-slide display duration in seconds (how long it sits on screen)
  displaySeconds: number;

  // Schedule (ISO date strings, inclusive). Empty = run indefinitely.
  startDate?: string;
  endDate?: string;

  // Optional Sponsored tag
  sponsored?: boolean;
  sponsorLabel?: string;       // e.g. "Sponsored by Acme"

  // Owner controls
  paused?: boolean;            // suspended by owner

  createdAt: string;
  updatedAt: string;
}

export const WALL_BANNER_STORAGE_KEY = "wallBannerSlides:v1";
