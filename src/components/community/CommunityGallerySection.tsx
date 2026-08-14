import React from "react";
import { useCommunityContent } from "@/hooks/useCommunityContent";
import { useCommunityPostInteraction, type ApiComment } from "@/hooks/useCommunityPostInteraction";
import { useState, useEffect, useMemo } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Play,
  Image as ImageIcon,
  Video,
  Grid3X3,
  FolderOpen,
  X,
  ChevronLeft,
  ChevronRight,
  Send,
  Plus,
  Loader2,
  Bookmark,
  MoveHorizontal,
  MoveVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useToast } from "@/hooks/use-toast";
import {
  mockGalleryAlbums,
  mockGalleryItems,
  mockGalleryComments,
  GalleryItem,
  GalleryAlbum,
  GalleryComment
} from "@/data/communityGalleryData";

interface CommunityGallerySectionProps {
  communityId?: string;
  isOwner?: boolean;
  isGalleryManager?: boolean;
  isMember?: boolean;
  isExecutive?: boolean;
}

function commentTimeAgo(dateStr?: string): string {
  if (!dateStr) return "";
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  } catch { return ""; }
}

export function CommunityGallerySection({
  communityId,
  isOwner = false,
  isGalleryManager = false,
  isMember = true,
  isExecutive = false
}: CommunityGallerySectionProps) {
  const { toast } = useToast();
  const [activeView, setActiveView] = useState<"all" | "photos" | "videos" | "albums">("all");
  const [selectedAlbum, setSelectedAlbum] = useState<string>("all");
  // ── Real gallery items from API ──────────────────────────────────────
  const { items: apiGallery, loading: galleryLoading, refresh: refreshGallery } = useCommunityContent(communityId, {
    type: "gallery", status: "active", limit: 100,
  });

  const apiMappedGallery = useMemo<GalleryItem[]>(() => apiGallery.map(g => ({
    id:              g.id,
    type:            (g.mediaType === "video" ? "video" : "photo") as any,
    mediaType:       (g.mediaType === "video" ? "video" : "photo") as any,
    url:             g.mediaUrl || g.thumbnail || "",
    mediaUrl:        g.mediaUrl || g.thumbnail || "",
    thumbnailUrl:    g.thumbnail || g.mediaUrl || "",
    thumbnail:       g.thumbnail || g.mediaUrl || "",
    title:           g.title || "",
    description:     g.description || "",
    uploadedBy:      g.authorName,
    uploadedByAvatar:g.authorAvatar,
    uploadedAt:      g.publishedAt || g.submittedAt || "",
    albumId:         "all",
    likes:           g.likes,
    comments:        g.comments,
    views:           g.views,
    isLiked:         g.isLiked || false,
    isFollowed:      false,
    privacy:         "public" as const,
    isHidden:        false,
    tags:            g.tags || [],
  })), [apiGallery]);

  // Start empty — no mock data
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [albums] = useState<GalleryAlbum[]>(mockGalleryAlbums);

  // Sync API data into galleryItems, preserving local interaction state (likes/follows)
  useEffect(() => {
    setGalleryItems(prev => {
      // Merge: API items + any locally-added items not yet in API
      const apiIds  = new Set(apiMappedGallery.map(i => i.id));
      const localNew = prev.filter(i => !apiIds.has(i.id)); // items user just uploaded (optimistic)
      // Carry over local interaction state (likes, follows)
      const merged  = apiMappedGallery.map(apiItem => {
        const existing = prev.find(p => p.id === apiItem.id);
        return existing
          ? { ...apiItem, isLiked: existing.isLiked, isFollowed: existing.isFollowed, likes: existing.likes }
          : apiItem;
      });
      return [...merged, ...localNew];
    });
  }, [apiMappedGallery]);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [showDetailDialog,  setShowDetailDialog]  = useState(false);
  const [showUploadDialog,  setShowUploadDialog]  = useState(false);
  const [detailComments,    setDetailComments]    = useState<ApiComment[]>([]);
  const { fetchComments, toggleLike: apiToggleLike, submitComment, recordView } =
    useCommunityPostInteraction(communityId);
  const [newComment, setNewComment] = useState("");
  const [visibleCount, setVisibleCount] = useState(9);
  const [viewOrientation, setViewOrientation] = useState<"horizontal" | "vertical">("horizontal");

  // Filter items based on privacy
  const canViewItem = (item: GalleryItem) => {
    if (item.isHidden && !isOwner && !isGalleryManager) return false;
    if (item.privacy === "public") return true;
    if (item.privacy === "members-only" && isMember) return true;
    if (item.privacy === "executives-only" && (isExecutive || isOwner)) return true;
    return false;
  };

  const canViewAlbum = (album: GalleryAlbum) => {
    if (album.isHidden && !isOwner && !isGalleryManager) return false;
    if (album.privacy === "public") return true;
    if (album.privacy === "members-only" && isMember) return true;
    if (album.privacy === "executives-only" && (isExecutive || isOwner)) return true;
    return false;
  };

  const filteredAlbums = albums.filter(canViewAlbum);

  const filteredItems = galleryItems.filter(item => {
    if (!canViewItem(item)) return false;
    if (activeView === "photos" && item.mediaType !== "photo") return false;
    if (activeView === "videos" && item.mediaType !== "video") return false;
    if (selectedAlbum !== "all" && item.albumId !== selectedAlbum) return false;
    return true;
  });

  const handleLike = (itemId: string) => {
    const item = galleryItems.find(i => i.id === itemId);
    const wasLiked = item?.isLiked ?? false;
    setGalleryItems(prev => prev.map(item =>
      item.id === itemId
        ? { ...item, likes: item.isLiked ? item.likes - 1 : item.likes + 1, isLiked: !item.isLiked }
        : item
    ));
    if (selectedItem?.id === itemId) {
      setSelectedItem(prev => prev ? {
        ...prev,
        likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
        isLiked: !prev.isLiked
      } : null);
    }
    apiToggleLike(itemId, wasLiked);
  };

  const handleFollow = (itemId: string) => {
    setGalleryItems(prev => prev.map(item =>
      item.id === itemId
        ? { ...item, isFollowed: !item.isFollowed }
        : item
    ));
    if (selectedItem?.id === itemId) {
      setSelectedItem(prev => prev ? { ...prev, isFollowed: !prev.isFollowed } : null);
    }
    toast({
      title: "Notifications Updated",
      description: "You'll be notified of updates to this item.",
    });
  };

  const handleShare = (item: GalleryItem) => {
    toast({
      title: "Share Options",
      description: "Share functionality coming soon!",
    });
  };

  const handleComment = async () => {
    if (!newComment.trim() || !selectedItem?.id) return;
    const text = newComment.trim();
    setNewComment("");
    const result = await submitComment(selectedItem.id, text);
    const newC: ApiComment = result ?? {
      id: `tmp-${Date.now()}`, content: text,
      author_name: "You", profile_photo: null,
      created_at: new Date().toISOString(), replies: [],
    };
    setDetailComments(prev => [...prev, newC]);
    setGalleryItems(prev => prev.map(item =>
      item.id === selectedItem.id ? { ...item, comments: (item.comments || 0) + 1 } : item
    ));
    setSelectedItem(prev => prev ? { ...prev, comments: (prev.comments || 0) + 1 } : null);
  };

  const openItemDetail = (item: GalleryItem) => {
    setSelectedItem(item);
    setShowDetailDialog(true);
  };

  // Load real comments + record a view whenever the detail dialog opens on a new item
  useEffect(() => {
    if (showDetailDialog && selectedItem?.id) {
      recordView(selectedItem.id);
      fetchComments(selectedItem.id).then(setDetailComments);
    } else if (!showDetailDialog) {
      setDetailComments([]);
    }
  }, [showDetailDialog, selectedItem?.id]);

  const navigateItem = (direction: "prev" | "next") => {
    if (!selectedItem) return;
    const currentIndex = filteredItems.findIndex(item => item.id === selectedItem.id);
    let newIndex = direction === "prev" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0) newIndex = filteredItems.length - 1;
    if (newIndex >= filteredItems.length) newIndex = 0;
    setSelectedItem(filteredItems[newIndex]);
  };

  const getAlbumName = (albumId: string) => {
    const album = albums.find(a => a.id === albumId);
    return album?.name || "Unknown Album";
  };

  const getItemComments = (itemId: string): GalleryComment[] => {
    return mockGalleryComments.filter(c => c.itemId === itemId);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const GalleryItemCard = ({ item }: { item: GalleryItem }) => (
    <Card 
      className="overflow-hidden cursor-pointer group hover:shadow-lg transition-shadow"
      onClick={() => openItemDetail(item)}
    >
      <div className="relative aspect-square bg-muted">
        <img
          src={item.thumbnailUrl || item.mediaUrl}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        {item.mediaType === "video" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
              <Play className="h-6 w-6 text-foreground fill-foreground ml-1" />
            </div>
          </div>
        )}
        {item.isHidden && (
          <Badge variant="secondary" className="absolute top-2 right-2 text-xs">
            Hidden
          </Badge>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-white text-sm font-medium line-clamp-1">{item.title}</p>
          <p className="text-white/80 text-xs line-clamp-1">{item.caption}</p>
        </div>
      </div>
      <CardContent className="p-3">
        <p className="text-sm font-medium line-clamp-1">{item.title}</p>
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Heart className={`h-3.5 w-3.5 ${item.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              {formatNumber(item.likes)}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="h-3.5 w-3.5" />
              {item.comments}
            </span>
          </div>
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            {formatNumber(item.views)}
          </span>
        </div>
      </CardContent>
    </Card>
  );

  const AlbumCard = ({ album }: { album: GalleryAlbum }) => (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => {
        setSelectedAlbum(album.id);
        setActiveView("all");
      }}
    >
      <div className="relative aspect-video bg-muted">
        <img
          src={album.coverImage}
          alt={album.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="text-white font-medium">{album.name}</p>
          <div className="flex items-center gap-2 text-white/80 text-xs mt-1">
            <span>{album.itemCount} items</span>
            {album.privacy !== "public" && (
              <Badge variant="secondary" className="text-xs">
                {album.privacy === "members-only" ? "Members" : "Executives"}
              </Badge>
            )}
          </div>
        </div>
        {album.isHidden && (
          <Badge variant="secondary" className="absolute top-2 right-2 text-xs">
            Hidden
          </Badge>
        )}
      </div>
    </Card>
  );

  const ItemDetailDialog = () => {
    if (!selectedItem) return null;
    const comments = detailComments;

    return (
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-4xl w-full p-0 gap-0 rounded-2xl flex flex-col" style={{ maxHeight: "92vh" }}>
          <DialogTitle className="sr-only">Gallery Item</DialogTitle>
          <div className="flex flex-col md:flex-row h-full max-h-[95vh]">
            {/* Media Section */}
            <div className="relative flex-1 bg-black flex items-center justify-center min-h-[300px] md:min-h-[500px]">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-white hover:bg-white/20 z-10"
                onClick={() => setShowDetailDialog(false)}
              >
                <X className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                onClick={() => navigateItem("prev")}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                onClick={() => navigateItem("next")}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>

              {selectedItem.mediaType === "video" ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    src={selectedItem.mediaUrl}
                    alt={selectedItem.title}
                    className="max-w-full max-h-full object-contain"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center cursor-pointer hover:bg-white transition-colors">
                      <Play className="h-10 w-10 text-foreground fill-foreground ml-1" />
                    </div>
                  </div>
                </div>
              ) : (
                <img
                  src={selectedItem.mediaUrl}
                  alt={selectedItem.title}
                  className="max-w-full max-h-full object-contain"
                />
              )}
            </div>

            {/* Details Section */}
            <div className="w-full md:w-[350px] flex flex-col bg-card">
              {/* Header */}
              <div className="p-4 border-b">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedItem.uploadedByPhoto} />
                    <AvatarFallback>{selectedItem.uploadedBy[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{selectedItem.uploadedBy}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(selectedItem.uploadedAt)}
                    </p>
                  </div>
                  <Button
                    variant={selectedItem.isFollowed ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => handleFollow(selectedItem.id)}
                  >
                    <Bookmark className={`h-4 w-4 ${selectedItem.isFollowed ? 'fill-current' : ''}`} />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <ScrollArea className="flex-1 max-h-[300px] md:max-h-none">
                <div className="p-4 space-y-4">
                  <div>
                    <h3 className="font-semibold">{selectedItem.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{selectedItem.caption}</p>
                  </div>

                  <p className="text-sm">{selectedItem.description}</p>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline">{getAlbumName(selectedItem.albumId)}</Badge>
                    {selectedItem.privacy !== "public" && (
                      <Badge variant="secondary">
                        {selectedItem.privacy === "members-only" ? "Members" : "Executives"}
                      </Badge>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground py-2 border-y">
                    <span>{formatNumber(selectedItem.views)} views</span>
                    <span>{formatNumber(selectedItem.likes)} likes</span>
                    <span>{selectedItem.comments} comments</span>
                    <span>{selectedItem.shares} shares</span>
                  </div>

                  {/* Comments */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Comments</h4>
                    {comments.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No comments yet. Be the first!</p>
                    ) : (
                      comments.map(comment => (
                        <div key={comment.id} className="flex gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={comment.profile_photo || undefined} />
                            <AvatarFallback>{(comment.author_name || "U")[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 bg-muted/50 rounded-lg p-2">
                            <p className="text-xs font-medium">{comment.author_name}</p>
                            <p className="text-sm">{comment.content}</p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                              <span>{commentTimeAgo(comment.created_at)}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </ScrollArea>

              {/* Actions */}
              <div className="p-4 border-t space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(selectedItem.id)}
                    >
                      <Heart className={`h-5 w-5 ${selectedItem.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageCircle className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShare(selectedItem)}
                    >
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                  <span className="text-sm font-medium">{formatNumber(selectedItem.likes)} likes</span>
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1"
                    onKeyDown={(e) => e.key === "Enter" && handleComment()}
                  />
                  <Button size="icon" onClick={handleComment} disabled={!newComment.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-lg">Community Gallery</h2>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{filteredItems.length} items</Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewOrientation(viewOrientation === "horizontal" ? "vertical" : "horizontal")}
            className="gap-1.5 transition-all duration-200"
            title={viewOrientation === "horizontal" ? "Switch to Vertical View" : "Switch to Horizontal View"}
          >
            {viewOrientation === "horizontal" ? (
              <>
                <MoveHorizontal className="h-4 w-4" />
                <span className="text-xs hidden sm:inline">Horizontal</span>
              </>
            ) : (
              <>
                <MoveVertical className="h-4 w-4" />
                <span className="text-xs hidden sm:inline">Vertical</span>
              </>
            )}
          </Button>
          {(isOwner || isGalleryManager || isMember) && (
            <Button size="sm" className="gap-1.5" onClick={() => setShowUploadDialog(true)}>
              <Plus className="h-4 w-4" /> Upload
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Tabs value={activeView} onValueChange={(v) => setActiveView(v as typeof activeView)} className="flex-1">
          <TabsList className="w-full grid grid-cols-4 h-10">
            <TabsTrigger value="all" className="text-xs">
              <Grid3X3 className="h-4 w-4 mr-1" />
              All
            </TabsTrigger>
            <TabsTrigger value="photos" className="text-xs">
              <ImageIcon className="h-4 w-4 mr-1" />
              Photos
            </TabsTrigger>
            <TabsTrigger value="videos" className="text-xs">
              <Video className="h-4 w-4 mr-1" />
              Videos
            </TabsTrigger>
            <TabsTrigger value="albums" className="text-xs">
              <FolderOpen className="h-4 w-4 mr-1" />
              Albums
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {activeView !== "albums" && (
          <Select value={selectedAlbum} onValueChange={setSelectedAlbum}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by album" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Albums</SelectItem>
              {filteredAlbums.map(album => (
                <SelectItem key={album.id} value={album.id}>
                  {album.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Selected Album Banner */}
      {selectedAlbum !== "all" && activeView !== "albums" && (
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FolderOpen className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">
                  {albums.find(a => a.id === selectedAlbum)?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {filteredItems.length} items
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSelectedAlbum("all")}
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </div>
        </Card>
      )}

      {/* Content */}
      {activeView === "albums" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAlbums.map(album => (
            <AlbumCard key={album.id} album={album} />
          ))}
          {filteredAlbums.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              <FolderOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No albums available</p>
            </div>
          )}
        </div>
      ) : (
        <>
          {viewOrientation === "horizontal" ? (
            <Carousel
              opts={{
                align: "start",
                loop: false,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {filteredItems.slice(0, visibleCount).map(item => (
                  <CarouselItem key={item.id} className="pl-2 md:pl-4 basis-[75%] sm:basis-[50%] md:basis-[35%] lg:basis-[25%]">
                    <GalleryItemCard item={item} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-4" />
              <CarouselNext className="hidden md:flex -right-4" />
            </Carousel>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredItems.slice(0, visibleCount).map(item => (
                <GalleryItemCard key={item.id} item={item} />
              ))}
            </div>
          )}

          {filteredItems.length === 0 && (
            <div className="col-span-3 text-center py-12">
              {galleryLoading ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Loading gallery…</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
                  <p className="text-sm font-medium text-muted-foreground">No photos or videos yet</p>
                  {(isOwner || isGalleryManager || isMember) && (
                    <Button size="sm" onClick={() => setShowUploadDialog(true)} className="gap-1.5">
                      <Plus className="h-4 w-4" /> Upload the first photo
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}

          {filteredItems.length > visibleCount && (
            <div className="text-center pt-4">
              <Button 
                variant="outline"
                onClick={() => setVisibleCount(prev => prev + 9)}
              >
                Load More ({filteredItems.length - visibleCount} remaining)
              </Button>
            </div>
          )}
        </>
      )}

      {/* Detail Dialog */}
      <ItemDetailDialog />

      {/* ── Upload Dialog ─────────────────────────────────────────── */}
      <GalleryUploadDialog
        communityId={communityId}
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
        onUploaded={() => { setShowUploadDialog(false); refreshGallery(); }}
      />
    </div>
  );
}

/* ── Inline Upload Dialog component ──────────────────────────────────────── */
function GalleryUploadDialog({ communityId, open, onOpenChange, onUploaded }: {
  communityId?: string; open: boolean; onOpenChange: (v: boolean) => void; onUploaded: () => void;
}) {
  const [files,       setFiles]       = useState<File[]>([]);
  const [previews,    setPreviews]    = useState<string[]>([]);
  const [caption,     setCaption]     = useState("");
  const [privacy,     setPrivacy]     = useState("public");
  const [submitting,  setSubmitting]  = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    const valid    = selected.filter(f => f.type.startsWith("image/") || f.type.startsWith("video/"));
    setFiles(prev => [...prev, ...valid]);
    setPreviews(prev => [...prev, ...valid.map(f => URL.createObjectURL(f))]);
    if (e.target) e.target.value = "";
  };

  const removeFile = (i: number) => {
    setFiles(prev => prev.filter((_, idx) => idx !== i));
    setPreviews(prev => prev.filter((_, idx) => idx !== i));
  };

  const handleUpload = async () => {
    if (!files.length) { toast("Please select at least one file"); return; }
    if (!communityId)  { toast.error("Community not found"); return; }
    setSubmitting(true);
    try {
      for (const file of files) {
        // Upload file
        const fd = new FormData();
        fd.append("file", file);
        fd.append("community_id", communityId);
        const upRes = await fetch("/api/community/upload_post_media.php", { method: "POST", credentials: "include", body: fd });
        if (!upRes.ok) continue;
        const upData = await upRes.json();

        // Create gallery post
        await fetch("/api/community/content.php", {
          method: "POST", credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "create", community_id: communityId,
            type:    file.type.startsWith("video/") ? "video" : "photo",
            title:   caption || file.name.replace(/\.[^.]+$/, ""),
            content: caption,
            mediaUrl:  upData.url,
            mediaType: file.type.startsWith("video/") ? "video" : "photo",
            thumbnail: upData.thumbnail || upData.url,
            status: "pending",
          }),
        });
      }
      toast.success(`${files.length} item${files.length > 1 ? "s" : ""} uploaded! Pending approval.`);
      setFiles([]); setPreviews([]); setCaption(""); setPrivacy("public");
      onUploaded();
    } catch { toast.error("Upload failed. Please try again."); }
    finally { setSubmitting(false); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-full p-0 gap-0 rounded-2xl flex flex-col" style={{ maxHeight: "85vh" }}>
        <DialogTitle className="sr-only">Upload to Gallery</DialogTitle>
        <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
          <h2 className="font-bold text-lg">Upload to Gallery</h2>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}><X className="h-4 w-4" /></Button>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 py-4 space-y-4" style={{ WebkitOverflowScrolling: "touch" }}>
          {/* Drop zone */}
          <div
            className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => inputRef.current?.click()}
          >
            <input ref={inputRef} type="file" multiple accept="image/*,video/*" className="hidden" onChange={handleFileSelect} />
            <ImageIcon className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
            <p className="text-sm font-medium">Click to upload photos or videos</p>
            <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF, MP4 up to 50MB each</p>
          </div>

          {/* Previews */}
          {previews.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {previews.map((src, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-muted group">
                  {files[i]?.type.startsWith("video/")
                    ? <video src={src} className="w-full h-full object-cover" />
                    : <img src={src} className="w-full h-full object-cover" />}
                  <button
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeFile(i)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <button
                className="aspect-square rounded-lg border-2 border-dashed border-border flex items-center justify-center hover:border-primary/50"
                onClick={() => inputRef.current?.click()}
              >
                <Plus className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium">Caption (optional)</label>
            <Textarea placeholder="Add a caption…" value={caption} rows={3} onChange={e => setCaption(e.target.value)} className="resize-none" />
          </div>
        </div>
        <div className="border-t px-4 py-3 shrink-0 flex gap-2">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="flex-1" disabled={!files.length || submitting} onClick={handleUpload}>
            {submitting
              ? <><Loader2 className="h-4 w-4 animate-spin mr-1" />Uploading…</>
              : <><Send className="h-4 w-4 mr-1" />Upload {files.length > 0 ? `(${files.length})` : ""}</>}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}