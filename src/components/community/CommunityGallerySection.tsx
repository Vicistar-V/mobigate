import { useState } from "react";
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
  Bookmark
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  isOwner?: boolean;
  isGalleryManager?: boolean;
  isMember?: boolean;
  isExecutive?: boolean;
}

export function CommunityGallerySection({
  isOwner = false,
  isGalleryManager = false,
  isMember = true,
  isExecutive = false
}: CommunityGallerySectionProps) {
  const { toast } = useToast();
  const [activeView, setActiveView] = useState<"all" | "photos" | "videos" | "albums">("all");
  const [selectedAlbum, setSelectedAlbum] = useState<string>("all");
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(mockGalleryItems);
  const [albums] = useState<GalleryAlbum[]>(mockGalleryAlbums);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [visibleCount, setVisibleCount] = useState(9);

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

  const handleComment = () => {
    if (!newComment.trim()) return;
    toast({
      title: "Comment Added",
      description: "Your comment has been posted.",
    });
    setNewComment("");
  };

  const openItemDetail = (item: GalleryItem) => {
    setSelectedItem(item);
    setShowDetailDialog(true);
  };

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
    const comments = getItemComments(selectedItem.id);

    return (
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-4xl max-h-[95vh] p-0 gap-0 overflow-hidden">
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
                            <AvatarImage src={comment.authorPhoto} />
                            <AvatarFallback>{comment.authorName[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 bg-muted/50 rounded-lg p-2">
                            <p className="text-xs font-medium">{comment.authorName}</p>
                            <p className="text-sm">{comment.content}</p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                              <span>{formatDate(comment.createdAt)}</span>
                              <button className="hover:text-foreground">
                                {comment.likes} likes
                              </button>
                              <button className="hover:text-foreground">Reply</button>
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
        <Badge variant="secondary">{filteredItems.length} items</Badge>
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredItems.slice(0, visibleCount).map(item => (
              <GalleryItemCard key={item.id} item={item} />
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No gallery items found</p>
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
    </div>
  );
}
