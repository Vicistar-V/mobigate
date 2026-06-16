import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

const API = "/api";

export interface ContentItem {
  id:              string;
  type:            "news" | "event" | "article" | "vibe" | "gallery" | string;
  title:           string;
  description?:    string;
  content?:        string;
  thumbnail?:      string;
  mediaUrl?:       string;
  mediaType?:      string;
  category?:       string;
  tags?:           string[];
  status:          "active" | "published" | "pending" | "draft" | "rejected";
  featured?:       boolean;
  spotlight?:      boolean;
  authorId:        string;
  authorName:      string;
  authorAvatar?:   string;
  submittedAt?:    string;
  publishedAt?:    string;
  rejectionReason?: string;
  readTime?:       string;
  views:           number;
  likes:           number;
  comments:        number;
  isLiked:         boolean;
  isOwner:         boolean;
  // Event
  eventDate?:      string;
  eventEndDate?:   string;
  venue?:          string;
  venueType?:      "physical" | "online" | "hybrid";
  capacity?:       number;
  rsvpCount?:      number;
}

interface FetchOptions {
  type?:   string;
  status?: string;
  search?: string;
  limit?:  number;
}

export function useCommunityContent(communityId: string | undefined, opts: FetchOptions = {}) {
  const [items,   setItems]   = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [total,   setTotal]   = useState(0);
  const [pending, setPending] = useState(0);
  const [offset,  setOffset]  = useState(0);

  const buildUrl = useCallback((off = 0) => {
    const params = new URLSearchParams({ community_id: communityId || "", limit: String(opts.limit ?? 20), offset: String(off) });
    if (opts.type)   params.set("type",   opts.type);
    if (opts.status) params.set("status", opts.status);
    if (opts.search) params.set("search", opts.search);
    return `${API}/community/content.php?${params}`;
  }, [communityId, opts.type, opts.status, opts.search, opts.limit]);

  const fetchItems = useCallback(async (reset = true) => {
    if (!communityId) return;
    setLoading(true);
    const off = reset ? 0 : offset;
    try {
      const res  = await fetch(buildUrl(off), { credentials: "include" });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setItems(prev => reset ? data.items : [...prev, ...data.items]);
      setHasMore(data.hasMore);
      setTotal(data.total);
      setPending(data.pendingCount ?? 0);
      setOffset(reset ? data.items.length : off + data.items.length);
    } catch { if (reset) setItems([]); }
    finally  { setLoading(false); }
  }, [communityId, buildUrl, offset]);

  useEffect(() => { fetchItems(true); }, [communityId, opts.type, opts.status, opts.search]);

  // ── Actions ────────────────────────────────────────────────────────────
  const post = async (action: string, body: object) => {
    const res  = await fetch(`${API}/community/content.php`, {
      method: "POST", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, community_id: communityId, ...body }),
    });
    return res.ok ? await res.json() : null;
  };

  const createItem = async (data: Partial<ContentItem>) => {
    const ok = await post("create", data);
    if (ok) { fetchItems(true); toast.success("Content created"); }
    else toast.error("Could not create content");
    return ok;
  };

  const updateItem = async (data: Partial<ContentItem> & { id: string }) => {
    const ok = await post("update", data);
    if (ok) { fetchItems(true); toast.success("Content updated"); }
    return ok;
  };

  const approveItem = async (id: string) => {
    const ok = await post("approve", { id });
    if (ok) {
      setItems(prev => prev.map(i => i.id === id ? { ...i, status: "active" as const } : i));
      setPending(p => Math.max(0, p - 1));
      toast.success("Content approved and published");
    } else toast.error("Could not approve");
    return !!ok;
  };

  const rejectItem = async (id: string, reason: string) => {
    const ok = await post("reject", { id, reason });
    if (ok) {
      setItems(prev => prev.map(i => i.id === id ? { ...i, status: "rejected" as const, rejectionReason: reason } : i));
      setPending(p => Math.max(0, p - 1));
      toast.success("Content rejected");
    } else toast.error("Could not reject");
    return !!ok;
  };

  const deleteItem = async (id: string) => {
    const ok = await post("delete", { id });
    if (ok) { setItems(prev => prev.filter(i => i.id !== id)); toast.success("Deleted"); }
    return !!ok;
  };

  const toggleFeatured  = async (id: string) => {
    await post("toggle_featured",  { id });
    setItems(prev => prev.map(i => i.id === id ? { ...i, featured:  !i.featured  } : i));
  };
  const toggleSpotlight = async (id: string) => {
    await post("toggle_spotlight", { id });
    setItems(prev => prev.map(i => i.id === id ? { ...i, spotlight: !i.spotlight } : i));
  };

  const rsvpEvent = async (postId: string) => {
    const ok = await post("rsvp", { post_id: postId });
    if (ok) setItems(prev => prev.map(i => i.id === postId ? { ...i, rsvpCount: ok.rsvpCount } : i));
    return ok;
  };

  return {
    items, loading, hasMore, total, pending,
    refresh:        () => fetchItems(true),
    loadMore:       () => fetchItems(false),
    createItem, updateItem, approveItem, rejectItem,
    deleteItem, toggleFeatured, toggleSpotlight, rsvpEvent,
  };
}
