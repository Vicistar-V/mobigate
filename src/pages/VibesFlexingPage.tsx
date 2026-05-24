import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Search,
  Sparkles,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Play,
  Plus,
} from "lucide-react";
import { feedPosts } from "@/data/posts";
import { CreatePostDialog } from "@/components/CreatePostDialog";

const VibesFlexingPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [composerOpen, setComposerOpen] = useState(false);

  // Treat photo / video posts as "vibes & flexing" content
  const vibes = useMemo(
    () =>
      feedPosts.filter(
        (p) => p.type === "Photo" || p.type === "Video"
      ),
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return vibes;
    return vibes.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q) ||
        (p.subtitle || "").toLowerCase().includes(q)
    );
  }, [vibes, query]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Page hero */}
      <div className="sticky top-[var(--header-height)] z-30 bg-card border-b">
        <div className="px-3 py-2 flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-bold leading-tight truncate">
                Vibes &amp; Flexing
              </h1>
              <p className="text-[11px] text-muted-foreground leading-tight truncate">
                Daily moments, flexes &amp; fun from the community
              </p>
            </div>
          </div>
          <Button
            size="sm"
            className="ml-auto h-8 px-2 bg-green-600 hover:bg-green-700 text-white text-[12px]"
            onClick={() => setComposerOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1" /> Post
          </Button>
        </div>

        <div className="px-3 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search vibes, flexes, creators…"
              className="pl-9 h-9 text-[13px] rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="px-3 py-3 space-y-3 max-w-2xl mx-auto">
        {filtered.length === 0 && (
          <Card className="p-6 text-center text-sm text-muted-foreground">
            No vibes match "{query}". Try a different word.
          </Card>
        )}

        {filtered.map((post) => (
          <Card
            key={post.id}
            className="overflow-hidden border border-border/60"
          >
            {/* Author row */}
            <div className="flex items-center gap-2 px-3 py-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={post.authorProfileImage} alt={post.author} />
                <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold leading-tight truncate">
                  {post.author}
                </p>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  {post.followers || "0"} followers · {post.type}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-3 text-[11px]"
                onClick={() => navigate(`/profile/${post.userId}`)}
              >
                View
              </Button>
            </div>

            {/* Media */}
            {post.imageUrl && (
              <div className="relative bg-muted">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-auto max-h-[60vh] object-cover"
                  loading="lazy"
                />
                {post.type === "Video" && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="h-12 w-12 rounded-full bg-black/55 flex items-center justify-center">
                      <Play className="h-6 w-6 text-white fill-white" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Caption */}
            <div className="px-3 py-2">
              <p className="text-[13px] font-semibold leading-snug line-clamp-2">
                {post.title}
              </p>
              {post.subtitle && (
                <p className="text-[12px] text-muted-foreground leading-snug line-clamp-2 mt-0.5">
                  {post.subtitle}
                </p>
              )}
            </div>

            {/* Action bar */}
            <div className="px-3 pb-3 flex items-center justify-between text-[11px] text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Heart className="h-4 w-4" /> {post.likes}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" /> {post.comments}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" /> {post.views}
                </span>
              </div>
              <Button variant="ghost" size="sm" className="h-7 px-2">
                <Share2 className="h-4 w-4 mr-1" /> Share
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <CreatePostDialog
        open={composerOpen}
        onOpenChange={setComposerOpen}
        hideTrigger
      />

    </div>
  );
};

export default VibesFlexingPage;
