// src/hooks/useCommunityPostInteraction.ts
// Shared hook for likes, comments, views on any community post (content or feed)
import { useState, useCallback } from "react";

const API = "/api";

export interface ApiComment {
  id:            string;
  content:       string;
  author_name:   string;
  profile_photo: string | null;
  author_id?:    string;
  created_at:    string;
  parent_id?:    string | null;
  replies?:      ApiComment[];
}

export function useCommunityPostInteraction(communityId: string | undefined) {
  const [loadingComments, setLoadingComments] = useState(false);

  // ── Load comments from API ─────────────────────────────────────────────
  const fetchComments = useCallback(async (postId: string): Promise<ApiComment[]> => {
    if (!postId || !communityId) return [];
    setLoadingComments(true);
    try {
      const res = await fetch(
        `${API}/community/posts.php?community_id=${communityId}&post_id=${postId}`,
        { credentials: "include" }
      );
      if (res.ok) {
        const d = await res.json();
        return d.comments || [];
      }
    } catch {}
    finally { setLoadingComments(false); }
    return [];
  }, [communityId]);

  // ── Like / Unlike ─────────────────────────────────────────────────────
  const toggleLike = useCallback(async (postId: string, currentlyLiked: boolean): Promise<boolean> => {
    try {
      const res = await fetch(`${API}/community/posts.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action:   currentlyLiked ? "unlike" : "like",
          post_id:  postId,
        }),
      });
      return res.ok;
    } catch { return false; }
  }, []);

  // ── Submit comment (or reply) ─────────────────────────────────────────
  const submitComment = useCallback(async (
    postId: string, content: string, parentId?: string
  ): Promise<ApiComment | null> => {
    try {
      const res = await fetch(`${API}/community/posts.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action:    "comment",
          post_id:   postId,
          content,
          parent_id: parentId || "",
        }),
      });
      if (res.ok) {
        const d = await res.json();
        return d.comment || null;
      }
    } catch {}
    return null;
  }, []);

  // ── Record view (once per post per session) ───────────────────────────
  const recordView = useCallback(async (postId: string): Promise<void> => {
    const key = `viewed_post_${postId}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    try {
      await fetch(`${API}/community/posts.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "view", post_id: postId }),
      });
    } catch {}
  }, []);

  return { fetchComments, toggleLike, submitComment, recordView, loadingComments };
}
