/**
 * pages/PostPage.tsx
 * Route: /post/:id
 * Fetches a single post and renders it full-screen.
 */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header }  from "@/components/Header";
import { Footer }  from "@/components/Footer";
import { FeedPost } from "@/components/FeedPost";
import { MetaTags } from "@/components/MetaTags";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card }   from "@/components/ui/card";

const API_BASE = (import.meta.env.VITE_API_URL as string) || "/api";

interface PostData {
  id: string; title: string; subtitle?: string; content?: string;
  post_type: string; thumbnail_url?: string; media_url?: string;
  like_count: number; view_count: number; comment_count: number;
  access_fee: number; is_monetized: boolean; is_liked: boolean;
  author_name: string; author_username: string; author_profile_photo?: string;
  user_id: string; created_at: string;
  copyright_marked?: boolean | number; has_copyright_docs?: boolean | number;
}

const PostPage = () => {
  const { id }     = useParams<{ id: string }>();
  const navigate   = useNavigate();
  const [post,     setPost]    = useState<PostData | null>(null);
  const [loading,  setLoading] = useState(true);
  const [notFound, setNotFound]= useState(false);

  useEffect(() => {
    if (!id) { setNotFound(true); setLoading(false); return; }
    fetch(`${API_BASE}/posts/get.php?id=${id}`, { credentials: "include" })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.id) {
          setPost(data);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const strip = (html: string) => html.replace(/<[^>]*>/g, "").substring(0, 180);
  const ucfirst = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  if (loading) return (
    <div className="flex flex-col min-h-screen">
      <MetaTags />
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </main>
      <Footer />
    </div>
  );

  if (notFound || !post) return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="p-8 text-center max-w-sm">
          <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <h2 className="text-xl font-bold mb-2">Post not found</h2>
          <p className="text-muted-foreground text-sm mb-4">
            This post may have been deleted or the link is invalid.
          </p>
          <Button onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />Back to Feed
          </Button>
        </Card>
      </main>
      <Footer />
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="container max-w-2xl mx-auto px-4 py-6 flex-1">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="h-4 w-4" />Back
        </button>
        <FeedPost
          id={post.id}
          title={post.title}
          subtitle={post.subtitle}
          description={post.content}
          author={post.author_name}
          authorProfileImage={post.author_profile_photo}
          userId={post.user_id}
          type={ucfirst(post.post_type) as any}
          imageUrl={post.thumbnail_url || post.media_url}
          views={String(post.view_count)}
          likes={String(post.like_count)}
          comments={String(post.comment_count)}
          fee={String(post.access_fee || 0)}
          status="Online"
          isOwner={false}
          followers="0"
          copyrightMarked={post.copyright_marked === true || post.copyright_marked === 1}
        />
      </main>
      <Footer />
    </div>
  );
};

export default PostPage;
