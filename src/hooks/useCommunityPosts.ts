import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

const API = "/api";

export interface CommunityPost {
  id: string;
  title: string;
  description?: string;
  type: string;
  imageUrl?: string;
  videoUrl?: string;
  mediaUrl?: string;
  mediaType?: string;
  author: string;
  authorId: string;
  authorImage?: string;
  userId: string;
  timestamp: string;
  likes: number;
  comments: number;
  views: number;
  isPinned: boolean;
  isLiked: boolean;
  isOwner: boolean;
  latestComments?: any[];
}

export function useCommunityPosts(communityId: string | undefined) {
  const [posts,   setPosts]   = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [total,   setTotal]   = useState(0);
  const [offset,  setOffset]  = useState(0);

  const fetchPosts = useCallback(async (reset = true) => {
    if (!communityId) return;
    setLoading(true);
    try {
      const off = reset ? 0 : offset;
      const res = await fetch(
        `${API}/community/posts.php?community_id=${communityId}&limit=20&offset=${off}`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error("Failed to load posts");
      const data = await res.json();
      setPosts(prev => reset ? data.posts : [...prev, ...data.posts]);
      setHasMore(data.hasMore);
      setTotal(data.total);
      setOffset(reset ? data.posts.length : off + data.posts.length);
    } catch (e: any) {
      if (reset) setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [communityId, offset]);

  useEffect(() => { fetchPosts(true); }, [communityId]);

  const createPost = async (payload: {
    content: string; title?: string; type?: string;
    mediaUrl?: string; mediaType?: string;
  }) => {
    try {
      const res = await fetch(`${API}/community/posts.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", community_id: communityId, ...payload }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to post");
      await fetchPosts(true);
      return true;
    } catch (e: any) {
      toast.error(e.message);
      return false;
    }
  };

  const likePost = async (postId: string, currentlyLiked: boolean) => {
    // Optimistic update
    setPosts(prev => prev.map(p => p.id === postId
      ? { ...p, isLiked: !currentlyLiked, likes: p.likes + (currentlyLiked ? -1 : 1) }
      : p
    ));
    try {
      await fetch(`${API}/community/posts.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: currentlyLiked ? "unlike" : "like", post_id: postId }),
      });
    } catch {
      // Revert on failure
      setPosts(prev => prev.map(p => p.id === postId
        ? { ...p, isLiked: currentlyLiked, likes: p.likes + (currentlyLiked ? 1 : -1) }
        : p
      ));
    }
  };

  const deletePost = async (postId: string) => {
    try {
      await fetch(`${API}/community/posts.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", post_id: postId }),
      });
      setPosts(prev => prev.filter(p => p.id !== postId));
      toast.success("Post deleted");
    } catch {
      toast.error("Could not delete post");
    }
  };

  const commentOnPost = async (postId: string, content: string, parentId?: string) => {
    try {
      const res = await fetch(`${API}/community/posts.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "comment", post_id: postId, content, parent_id: parentId || "" }),
      });
      if (res.ok) {
        if (!parentId) {
          // Only increment top-level count
          setPosts(prev => prev.map(p => p.id === postId
            ? { ...p, comments: p.comments + 1 } : p
          ));
        }
        return true;
      }
      return false;
    } catch { return false; }
  };

  const viewPost = async (postId: string) => {
    // Client-side guard: only call API once per post per browser session
    const key = `viewed_post_${postId}`;
    if (sessionStorage.getItem(key)) return; // already viewed this session
    sessionStorage.setItem(key, "1");
    try {
      const res = await fetch(`${API}/community/posts.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "view", post_id: postId }),
      });
      if (res.ok) {
        const data = await res.json();
        // Only update count in UI if server actually counted it
        if (data.counted) {
          setPosts(prev => prev.map(p => p.id === postId
            ? { ...p, views: p.views + 1 } : p
          ));
        }
      }
    } catch {}
  };

  const getPostComments = async (postId: string) => {
    try {
      const res = await fetch(`${API}/community/posts.php?community_id=${communityId}&post_id=${postId}`, { credentials: "include" });
      if (res.ok) { const data = await res.json(); return data.comments || []; }
    } catch {}
    return [];
  };

  const uploadMedia = async (file: File): Promise<{ url: string; type: string } | null> => {
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res  = await fetch(`${API}/community/upload_post_media.php`, {
        method: "POST", credentials: "include", body: fd,
      });
      const data = await res.json();
      return res.ok ? { url: data.url, type: data.type } : null;
    } catch { return null; }
  };

  return {
    posts, loading, hasMore, total,
    refresh: () => fetchPosts(true),
    loadMore: () => fetchPosts(false),
    createPost, likePost, deletePost, commentOnPost, viewPost, getPostComments, uploadMedia,
  };
}
