/**
 * usePostActions.ts
 * Reusable hook that provides create, edit, and delete post actions
 * wired to the PHP API. Use this anywhere you need post CRUD operations.
 *
 * Usage:
 *   const { deletePost, saving } = usePostActions({ onSuccess: fetchFeed });
 */

import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth }  from "@/contexts/useAuth";
import { Post }     from "@/data/posts";

const API_BASE =
  (import.meta.env.VITE_API_URL as string) ||
  "https://angola-press.com/en/api";

interface UsePostActionsOptions {
  /** Called after a successful create, update, or delete */
  onSuccess?: () => void | Promise<void>;
}

export const usePostActions = ({ onSuccess }: UsePostActionsOptions = {}) => {
  const { toast }           = useToast();
  const { isAuthenticated } = useAuth();
  const [saving, setSaving] = useState(false);

  // ── Delete ────────────────────────────────────────────────────────────────
  const deletePost = useCallback(async (postId: string): Promise<boolean> => {
    if (!isAuthenticated) {
      toast({ title: "Please log in first", variant: "destructive" });
      return false;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/posts/delete.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: postId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast({ title: "Post deleted", variant: "destructive" });
        await onSuccess?.();
        return true;
      } else {
        toast({ title: "Error", description: data.error || "Could not delete post.", variant: "destructive" });
        return false;
      }
    } catch {
      toast({ title: "Error", description: "Network error — could not delete post.", variant: "destructive" });
      return false;
    } finally {
      setSaving(false);
    }
  }, [isAuthenticated, onSuccess, toast]);

  // ── Save (edit) ───────────────────────────────────────────────────────────
  const savePost = useCallback(async (updatedPost: Post, newMediaFile?: File | null): Promise<Post | null> => {
    if (!isAuthenticated) {
      toast({ title: "Please log in first", variant: "destructive" });
      return null;
    }
    setSaving(true);
    try {
      const form = new FormData();
      form.append("post_id",   updatedPost.id ?? "");
      form.append("title",     updatedPost.title);
      form.append("subtitle",  updatedPost.subtitle   ?? "");
      form.append("content",   updatedPost.description ?? "");
      form.append("post_type", updatedPost.type.toLowerCase());
      form.append("access_fee", String(updatedPost.fee ?? 0));
      if (newMediaFile) form.append("media", newMediaFile);

      const res = await fetch(`${API_BASE}/posts/update.php`, {
        method: "POST",
        credentials: "include",
        body: form,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const saved: Post = {
          ...updatedPost,
          imageUrl: data.thumbnail_url || data.media_url || updatedPost.imageUrl,
        };
        toast({ title: "Post saved ✓" });
        await onSuccess?.();
        return saved;
      } else {
        toast({ title: "Error", description: data.error || "Could not save post.", variant: "destructive" });
        return null;
      }
    } catch {
      toast({ title: "Error", description: "Network error — could not save post.", variant: "destructive" });
      return null;
    } finally {
      setSaving(false);
    }
  }, [isAuthenticated, onSuccess, toast]);

  return { deletePost, savePost, saving };
};
