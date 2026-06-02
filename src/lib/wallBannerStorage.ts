// Wall Banner — localStorage-backed CRUD + visibility helpers.
// Frontend-only template; the PHP backend will swap this for API calls later.

import {
  WallBannerSlide,
  WALL_BANNER_STORAGE_KEY,
} from "@/types/wallBanner";

const EVENT_NAME = "wall-banner:changed";

function read(): WallBannerSlide[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WALL_BANNER_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as WallBannerSlide[]) : [];
  } catch {
    return [];
  }
}

function write(slides: WallBannerSlide[]): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(WALL_BANNER_STORAGE_KEY, JSON.stringify(slides));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
    return true;
  } catch (err) {
    // Most commonly a QuotaExceededError when a large base64 media payload is
    // persisted. We surface this to the caller so the UI can warn the user
    // instead of silently failing (which made the "Add slide" button look dead).
    console.error("[wallBannerStorage] write failed", err);
    return false;
  }
}

export function getAllSlides(): WallBannerSlide[] {
  return read();
}

export function getSlidesFor(
  ownerId: string,
  scope: "profile" | "home",
): WallBannerSlide[] {
  return read().filter((s) => s.ownerId === ownerId && s.scope === scope);
}

/**
 * Filters slides that are currently active (not paused and within schedule).
 * If a slide has no schedule it is considered always-on.
 */
export function getActiveSlidesFor(
  ownerId: string,
  scope: "profile" | "home",
  now: Date = new Date(),
): WallBannerSlide[] {
  const t = now.getTime();
  return getSlidesFor(ownerId, scope).filter((s) => {
    if (s.paused) return false;
    if (s.startDate && new Date(s.startDate).getTime() > t) return false;
    if (s.endDate) {
      // end date inclusive — extend to end of that day
      const end = new Date(s.endDate);
      end.setHours(23, 59, 59, 999);
      if (end.getTime() < t) return false;
    }
    return true;
  });
}

export function upsertSlide(slide: WallBannerSlide) {
  const list = read();
  const idx = list.findIndex((s) => s.id === slide.id);
  const next = { ...slide, updatedAt: new Date().toISOString() };
  if (idx >= 0) list[idx] = next;
  else list.unshift(next);
  write(list);
}

/** Insert many slides at once (used for bulk upload). */
export function bulkInsertSlides(slides: WallBannerSlide[]) {
  if (!slides.length) return;
  const now = new Date().toISOString();
  const stamped = slides.map((s) => ({ ...s, updatedAt: now }));
  write([...stamped, ...read()]);
}

export function deleteSlide(id: string) {
  write(read().filter((s) => s.id !== id));
}

/** Delete many slides at once. */
export function bulkDeleteSlides(ids: string[]) {
  if (!ids.length) return;
  const set = new Set(ids);
  write(read().filter((s) => !set.has(s.id)));
}

export function togglePauseSlide(id: string) {
  const list = read().map((s) =>
    s.id === id
      ? { ...s, paused: !s.paused, updatedAt: new Date().toISOString() }
      : s,
  );
  write(list);
}

/** Set paused=true/false on many slides at once. */
export function bulkSetPaused(ids: string[], paused: boolean) {
  if (!ids.length) return;
  const set = new Set(ids);
  const now = new Date().toISOString();
  const list = read().map((s) =>
    set.has(s.id) ? { ...s, paused, updatedAt: now } : s,
  );
  write(list);
}

export function newSlideId(): string {
  return `wb_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

/** Subscribe to changes to the slide store (cross-component sync). */
export function onSlidesChanged(handler: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const listener = () => handler();
  window.addEventListener(EVENT_NAME, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(EVENT_NAME, listener);
    window.removeEventListener("storage", listener);
  };
}

export function resolveClickHref(slide: WallBannerSlide): string | null {
  const v = (slide.linkValue || "").trim();
  switch (slide.linkAction) {
    case "url":
      return v || null;
    case "email":
      return v ? `mailto:${v}` : null;
    case "whatsapp": {
      // accept either phone or full wa.me link
      if (!v) return null;
      if (/^https?:\/\//i.test(v)) return v;
      const digits = v.replace(/[^\d]/g, "");
      return digits ? `https://wa.me/${digits}` : null;
    }
    default:
      return null;
  }
}
