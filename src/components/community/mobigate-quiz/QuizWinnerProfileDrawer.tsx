import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerBody } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Crown, Medal, Star, UserPlus, MessageCircle, Eye, Shield, Share2, Heart, Users, MessageSquare, Send, MoreVertical, Trash2, Pencil, EyeOff, Plus, ImagePlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
import { format, formatDistanceToNow } from "date-fns";
import type { SeasonWinner, GalleryPhoto, VideoHighlight } from "@/data/mobigateInteractiveQuizData";
import { WinnerGallerySection } from "./WinnerGallerySection";
import { WinnerVideoHighlightsSection } from "./WinnerVideoHighlightsSection";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface InlineComment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: Date;
  likes: number;
  isLiked: boolean;
  isOwn: boolean;
  isHidden: boolean;
  replies: InlineComment[];
}

function formatCompact(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

interface QuizWinnerProfileDrawerProps {
  winner: SeasonWinner | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  merchantName?: string;
  seasonName?: string;
}

export function QuizWinnerProfileDrawer({ winner, open, onOpenChange, merchantName, seasonName }: QuizWinnerProfileDrawerProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [friendRequestSent, setFriendRequestSent] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isFan, setIsFan] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [showFanConfirm, setShowFanConfirm] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);
  const commentRef = useRef<HTMLDivElement>(null);
  const slideFileInputRef = useRef<HTMLInputElement>(null);
  const [comments, setComments] = useState<InlineComment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  // Owner edit state
  const isOwner = true; // Hardcoded for demo — gate with backend later
  const [editablePhotos, setEditablePhotos] = useState<string[]>([]);
  const [editableGallery, setEditableGallery] = useState<GalleryPhoto[]>([]);
  const [editableVideoHighlights, setEditableVideoHighlights] = useState<VideoHighlight[]>([]);
  const [slidesEditOpen, setSlidesEditOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      setFriendRequestSent(false);
      setIsFan(false);
      setIsLiked(false);
      setIsFollowing(false);
      setCurrentPhoto(0);
      setShowFanConfirm(false);
      setShowComments(false);
      setComments([]);
      setCommentText("");
      setReplyingTo(null);
      setReplyText("");
      setEditingId(null);
      setSlidesEditOpen(false);
    }
  }, [open]);

  // Initialize editable data when winner changes
  useEffect(() => {
    if (winner) {
      setEditablePhotos(winner.photos?.length ? [...winner.photos] : [winner.playerAvatar]);
      setEditableGallery(winner.gallery ? [...winner.gallery] : []);
      setEditableVideoHighlights(winner.videoHighlights ? [...winner.videoHighlights] : []);
    }
  }, [winner]);

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    const newComment: InlineComment = {
      id: `c_${Date.now()}`,
      author: "You",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=60",
      content: commentText.trim(),
      timestamp: new Date(),
      likes: 0,
      isLiked: false,
      isOwn: true,
      isHidden: false,
      replies: [],
    };
    setComments(prev => [newComment, ...prev]);
    setCommentText("");
    toast({ description: "Comment added" });
  };

  const handleAddReply = (parentId: string) => {
    if (!replyText.trim()) return;
    const reply: InlineComment = {
      id: `r_${Date.now()}`,
      author: "You",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=60",
      content: replyText.trim(),
      timestamp: new Date(),
      likes: 0,
      isLiked: false,
      isOwn: true,
      isHidden: false,
      replies: [],
    };
    setComments(prev => prev.map(c => c.id === parentId ? { ...c, replies: [...c.replies, reply] } : c));
    setReplyText("");
    setReplyingTo(null);
    toast({ description: "Reply added" });
  };

  const handleLikeComment = (id: string) => {
    setComments(prev => prev.map(c => {
      if (c.id === id) return { ...c, isLiked: !c.isLiked, likes: c.isLiked ? c.likes - 1 : c.likes + 1 };
      return { ...c, replies: c.replies.map(r => r.id === id ? { ...r, isLiked: !r.isLiked, likes: r.isLiked ? r.likes - 1 : r.likes + 1 } : r) };
    }));
  };

  const handleDeleteComment = (id: string) => {
    setComments(prev => prev.filter(c => c.id !== id).map(c => ({ ...c, replies: c.replies.filter(r => r.id !== id) })));
    toast({ description: "Comment deleted" });
  };

  const handleEditComment = (id: string) => {
    if (!editText.trim()) return;
    setComments(prev => prev.map(c => {
      if (c.id === id) return { ...c, content: editText.trim() };
      return { ...c, replies: c.replies.map(r => r.id === id ? { ...r, content: editText.trim() } : r) };
    }));
    setEditingId(null);
    setEditText("");
    toast({ description: "Comment updated" });
  };

  const handleHideComment = (id: string) => {
    setComments(prev => prev.map(c => {
      if (c.id === id) return { ...c, isHidden: !c.isHidden };
      return { ...c, replies: c.replies.map(r => r.id === id ? { ...r, isHidden: !r.isHidden } : r) };
    }));
    toast({ description: "Visibility updated" });
  };

  const handleShareComment = async (content: string) => {
    try {
      if (navigator.share) {
        await navigator.share({ title: "Comment", text: content, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(content);
        toast({ description: "Copied to clipboard" });
      }
    } catch {
      await navigator.clipboard.writeText(content);
      toast({ description: "Copied to clipboard" });
    }
  };

  const renderInlineComment = (c: InlineComment, isReply = false) => {
    if (c.isHidden && !c.isOwn) return null;
    const isEditing = editingId === c.id;
    return (
      <div key={c.id} className={`${isReply ? "ml-8" : ""} ${c.isHidden ? "opacity-50" : ""}`}>
        <div className="flex gap-2 py-2">
          <Avatar className={`${isReply ? "h-6 w-6" : "h-7 w-7"} shrink-0`}>
            <AvatarImage src={c.avatar} alt={c.author} />
            <AvatarFallback className="text-xs">{c.author[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-medium">{c.author}</span>
                <span className="text-xs text-muted-foreground">{formatDistanceToNow(c.timestamp, { addSuffix: true })}</span>
                {c.isHidden && <span className="text-xs italic text-muted-foreground">(Hidden)</span>}
              </div>
              {c.isOwn && !isEditing && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0 touch-manipulation">
                      <MoreVertical className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="z-[200]">
                    <DropdownMenuItem className="text-sm touch-manipulation" onClick={() => { setEditingId(c.id); setEditText(c.content); }}>
                      <Pencil className="h-3.5 w-3.5 mr-2" />Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-sm touch-manipulation" onClick={() => handleHideComment(c.id)}>
                      <EyeOff className="h-3.5 w-3.5 mr-2" />{c.isHidden ? "Unhide" : "Hide"}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-sm text-destructive touch-manipulation" onClick={() => handleDeleteComment(c.id)}>
                      <Trash2 className="h-3.5 w-3.5 mr-2" />Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            {isEditing ? (
              <div className="mt-1 space-y-2">
                <Textarea value={editText} onChange={e => setEditText(e.target.value)} className="min-h-[36px] text-sm resize-none" autoFocus />
                <div className="flex gap-2">
                  <Button size="sm" className="h-7 text-xs touch-manipulation" onClick={() => handleEditComment(c.id)}>Save</Button>
                  <Button size="sm" variant="ghost" className="h-7 text-xs touch-manipulation" onClick={() => setEditingId(null)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <p className="text-sm mt-0.5 break-words leading-relaxed">{c.content}</p>
            )}
            {!isEditing && (
              <div className="flex items-center gap-4 mt-1">
                <button className={`flex items-center gap-1 text-xs touch-manipulation ${c.isLiked ? "text-red-500" : "text-muted-foreground"}`} onClick={() => handleLikeComment(c.id)}>
                  <Heart className={`h-3.5 w-3.5 ${c.isLiked ? "fill-current" : ""}`} />{c.likes}
                </button>
                {!isReply && (
                  <button className="flex items-center gap-1 text-xs text-muted-foreground touch-manipulation" onClick={() => { setReplyingTo(replyingTo === c.id ? null : c.id); setReplyText(""); }}>
                    <MessageCircle className="h-3.5 w-3.5" />{c.replies.length}
                  </button>
                )}
                <button className="flex items-center gap-1 text-xs text-muted-foreground touch-manipulation" onClick={() => handleShareComment(c.content)}>
                  <Share2 className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Reply input */}
        {replyingTo === c.id && (
          <div className="ml-8 flex gap-2 items-start py-1">
            <Textarea value={replyText} onChange={e => setReplyText(e.target.value)} placeholder={`Reply to ${c.author}...`} className="min-h-[36px] text-sm resize-none flex-1" autoFocus />
            <Button size="sm" className="h-8 w-8 p-0 shrink-0 touch-manipulation" onClick={() => handleAddReply(c.id)} disabled={!replyText.trim()}>
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
        {/* Replies */}
        {c.replies.length > 0 && c.replies.map(r => renderInlineComment(r, true))}
      </div>
    );
  };

  if (!winner) return null;

  const photos = editablePhotos.length ? editablePhotos : (winner.photos?.length ? winner.photos : [winner.playerAvatar]);

  // Slide management handlers
  const handleDeleteSlide = (index: number) => {
    if (editablePhotos.length <= 1) {
      toast({ description: "Must keep at least one photo", variant: "destructive" });
      return;
    }
    setEditablePhotos(prev => prev.filter((_, i) => i !== index));
    toast({ description: "Slide removed" });
  };

  const handleAddSlide = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ description: "Please select an image", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ description: "Image must be under 5MB", variant: "destructive" });
      return;
    }
    const url = URL.createObjectURL(file);
    setEditablePhotos(prev => [...prev, url]);
    toast({ description: "Slide added" });
    e.target.value = "";
  };

  const getPositionIcon = () => {
    switch (winner.position) {
      case "1st": return <Crown className="h-5 w-5 text-amber-500" />;
      case "2nd": return <Medal className="h-5 w-5 text-slate-400" />;
      case "3rd": return <Medal className="h-5 w-5 text-amber-700" />;
      default: return <Trophy className="h-5 w-5 text-purple-500" />;
    }
  };

  const getPositionLabel = () => {
    switch (winner.position) {
      case "1st": return "1st Price";
      case "2nd": return "2nd Runner-Up";
      case "3rd": return "3rd Runner-Up";
      default: return "Consolation Winner";
    }
  };

  const getPayoutBadge = () => {
    switch (winner.payoutStatus) {
      case "paid": return <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30 text-xs">Paid</Badge>;
      case "processing": return <Badge className="bg-blue-500/15 text-blue-700 border-blue-500/30 text-xs">Processing</Badge>;
      default: return <Badge className="bg-amber-500/15 text-amber-700 border-amber-500/30 text-xs">Pending</Badge>;
    }
  };

  const getTierColor = (tier: number) => {
    if (tier >= 6) return "bg-purple-500/15 text-purple-700 border-purple-500/30";
    if (tier >= 4) return "bg-blue-500/15 text-blue-700 border-blue-500/30";
    if (tier >= 2) return "bg-emerald-500/15 text-emerald-700 border-emerald-500/30";
    return "bg-muted text-muted-foreground border-border";
  };

  const handleJoinFanClick = () => {
    if (isFan) return;
    setShowFanConfirm(true);
  };

  const confirmJoinFan = () => {
    setIsFan(true);
    setShowFanConfirm(false);
    toast({
      title: "⭐ You're now a fan!",
      description: `M200 debited. You're now following ${winner.playerName}'s quiz journey!`,
    });
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Like removed" : "❤️ Liked!",
      description: isLiked ? `You unliked ${winner.playerName}` : `You liked ${winner.playerName}'s profile`,
    });
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast({
      title: isFollowing ? "Unfollowed" : "✅ Following!",
      description: isFollowing ? `You unfollowed ${winner.playerName}` : `You're now following ${winner.playerName}`,
    });
  };

  const handleAddFriend = () => {
    setFriendRequestSent(true);
    toast({
      title: "Friend request sent!",
      description: `Request sent to ${winner.playerName}`,
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: `${winner.playerName} - Quiz Winner`,
      text: `Check out ${winner.playerName}'s ${winner.position} place win with a score of ${winner.score}%!`,
      url: window.location.origin + `/profile/${winner.id}`,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast({ title: "Link copied!", description: "Winner profile link copied to clipboard" });
      }
    } catch {
      await navigator.clipboard.writeText(shareData.url);
      toast({ title: "Link copied!", description: "Winner profile link copied to clipboard" });
    }
  };

  const handleGalleryScroll = () => {
    const el = galleryRef.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setCurrentPhoto(index);
  };

  const scrollToPhoto = (index: number) => {
    const el = galleryRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
  };

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh]" showClose>
          <DrawerHeader className="text-center pb-2">
            <DrawerTitle className="sr-only">Winner Profile</DrawerTitle>
          </DrawerHeader>
          <DrawerBody className="px-4 pb-6 space-y-4">
            {/* Slidable Photo Gallery */}
            <div className="relative">
              <div
                ref={galleryRef}
                className="flex overflow-x-auto snap-x snap-mandatory touch-pan-x"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
                onScroll={handleGalleryScroll}
              >
                {photos.map((photo, idx) => (
                  <div key={idx} className="snap-center shrink-0 w-full">
                    <div className="aspect-square mx-auto max-w-[280px] rounded-2xl overflow-hidden border-2 border-amber-300/30 shadow-lg">
                      <img src={photo} alt={`${winner.playerName} photo ${idx + 1}`} className="h-full w-full object-cover" />
                    </div>
                  </div>
                ))}
              </div>
              {/* Dots indicator */}
              {photos.length > 1 && (
                <div className="flex items-center justify-center gap-1.5 mt-2">
                  {photos.map((_, idx) => (
                    <button
                      key={idx}
                      className={`h-2 rounded-full transition-all touch-manipulation ${
                        idx === currentPhoto ? "w-5 bg-amber-500" : "w-2 bg-muted-foreground/30"
                      }`}
                      onClick={() => scrollToPhoto(idx)}
                    />
                  ))}
                </div>
              )}
              {/* Position badge overlay */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 ml-[-140px]">
                <div className="bg-background/80 backdrop-blur-sm rounded-full p-1.5 border shadow-sm">
                  {getPositionIcon()}
                </div>
              </div>
              {/* Owner edit slides button */}
              {isOwner && (
                <button
                  className="absolute bottom-3 right-[calc(50%-130px)] p-2 rounded-full bg-background/80 backdrop-blur-sm border shadow-sm touch-manipulation active:scale-[0.9] transition-transform"
                  onClick={() => setSlidesEditOpen(true)}
                >
                  <Pencil className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>

            {/* Name & Badges */}
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold">{winner.playerName}</h3>
              <p className="text-sm text-muted-foreground">{winner.state}, {winner.country}</p>
              <Badge className="bg-amber-500/15 text-amber-700 border-amber-500/30 text-xs">
                {getPositionLabel()}
              </Badge>
              {winner.tier >= 6 && (
                <div className="flex flex-col items-center gap-1">
                  <span className="text-sm font-semibold text-purple-700">Celebrity</span>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < 7 ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground/30'}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-muted/30 rounded-xl p-3 border">
                <p className="text-lg font-bold">{formatCompact(winner.followers)}</p>
                <p className="text-xs text-muted-foreground">Followers</p>
              </div>
              <div className="bg-muted/30 rounded-xl p-3 border">
                <p className="text-lg font-bold">{formatCompact(winner.fans)}</p>
                <p className="text-xs text-muted-foreground">Fans</p>
              </div>
              <div className="bg-muted/30 rounded-xl p-3 border">
                <p className="text-lg font-bold">{winner.tier >= 6 ? '7 Stars' : `${winner.tier} Stars`}</p>
                <p className="text-xs text-muted-foreground">Status</p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3 bg-muted/30 rounded-xl p-4 border">
              {merchantName && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Merchant</span>
                  <span className="font-semibold">{merchantName}</span>
                </div>
              )}
              {seasonName && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Season</span>
                  <span className="font-semibold">{seasonName}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Prize Won</span>
                <span className="font-bold text-primary">₦{formatLocalAmount(winner.prizeAmount, "NGN")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Score</span>
                <span className="font-semibold">{winner.score}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Completed</span>
                <span className="font-semibold">{format(new Date(winner.completionDate), "MMM dd, yyyy")}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Payout</span>
                {getPayoutBadge()}
              </div>
            </div>

            {/* Gallery Section */}
            {editableGallery.length > 0 && (
              <WinnerGallerySection
                gallery={editableGallery}
                isOwner={isOwner}
                onGalleryChange={setEditableGallery}
              />
            )}

            {/* Video Highlights Section */}
            {editableVideoHighlights.length > 0 && (
              <WinnerVideoHighlightsSection
                videoHighlights={editableVideoHighlights}
                isOwner={isOwner}
                onVideoHighlightsChange={setEditableVideoHighlights}
              />
            )}

            {/* Comments moved below action buttons */}

            {/* Actions - Row 1: Profile, Add Friend, Message, Comment */}
            <div className="grid grid-cols-4 gap-1.5">
              <Button
                variant="outline"
                className="h-16 text-[11px] touch-manipulation active:scale-[0.97] flex flex-col items-center justify-center gap-1 px-0.5 leading-tight text-center whitespace-normal"
                onClick={() => { navigate(`/profile/${winner.id}`); onOpenChange(false); }}
              >
                <Eye className="h-4 w-4 shrink-0" />
                <span>Profile</span>
              </Button>
              <Button
                className="h-16 text-[11px] touch-manipulation active:scale-[0.97] flex flex-col items-center justify-center gap-1 px-0.5 leading-tight text-center whitespace-normal bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={friendRequestSent}
                onClick={handleAddFriend}
              >
                <UserPlus className="h-4 w-4 shrink-0" />
                <span>{friendRequestSent ? "Sent" : "Add Friend"}</span>
              </Button>
              <Button
                variant="outline"
                className="h-16 text-[11px] touch-manipulation active:scale-[0.97] flex flex-col items-center justify-center gap-1 px-0.5 leading-tight text-center whitespace-normal"
                onClick={() => {
                  onOpenChange(false);
                  setTimeout(() => {
                    window.dispatchEvent(new CustomEvent('openChatWithUser', {
                      detail: {
                        odooUserId: winner.id,
                        userName: winner.playerName,
                        userAvatar: winner.playerAvatar
                      }
                    }));
                  }, 300);
                }}
              >
                <MessageCircle className="h-4 w-4 shrink-0" />
                <span>Message</span>
              </Button>
              <Button
                variant="outline"
                className={`h-16 text-[11px] touch-manipulation active:scale-[0.97] flex flex-col items-center justify-center gap-1 px-0.5 leading-tight text-center whitespace-normal ${
                  showComments ? "bg-primary/10 text-primary border-primary/30" : ""
                }`}
                onClick={() => {
                  const next = !showComments;
                  setShowComments(next);
                  if (next) {
                    setTimeout(() => commentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
                  }
                }}
              >
                <MessageSquare className="h-4 w-4 shrink-0" />
                <span>Comment</span>
              </Button>
            </div>

            {/* Actions - Row 2: Like, Follow, Join Fan, Share */}
            <div className="grid grid-cols-4 gap-1.5">
              <Button
                variant="outline"
                className={`h-16 text-[11px] touch-manipulation active:scale-[0.97] flex flex-col items-center justify-center gap-1 px-0.5 leading-tight text-center whitespace-normal ${
                  isLiked ? "bg-red-500/10 text-red-600 border-red-500/30" : ""
                }`}
                onClick={handleLike}
              >
                <Heart className="h-4 w-4 shrink-0" fill={isLiked ? "currentColor" : "none"} />
                <span>{isLiked ? "Liked" : "Like"}</span>
              </Button>
              <Button
                variant="outline"
                className={`h-16 text-[11px] touch-manipulation active:scale-[0.97] flex flex-col items-center justify-center gap-1 px-0.5 leading-tight text-center whitespace-normal ${
                  isFollowing ? "bg-blue-500/10 text-blue-600 border-blue-500/30" : ""
                }`}
                onClick={handleFollow}
              >
                <Users className="h-4 w-4 shrink-0" />
                <span>{isFollowing ? "Following" : "Follow"}</span>
              </Button>
              <Button
                className={`h-16 text-[11px] touch-manipulation active:scale-[0.97] flex flex-col items-center justify-center gap-1 px-0.5 leading-tight text-center whitespace-normal ${
                  isFan
                    ? "bg-amber-500/15 text-amber-700 border border-amber-500/30 hover:bg-amber-500/20"
                    : "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
                }`}
                disabled={isFan}
                onClick={handleJoinFanClick}
              >
                <span className="text-xs font-bold leading-tight">{isFan ? "Joined" : "Join Fans"}</span>
              </Button>
              <Button
                variant="outline"
                className="h-16 text-[11px] touch-manipulation active:scale-[0.97] flex flex-col items-center justify-center gap-1 px-0.5 leading-tight text-center whitespace-normal"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4 shrink-0" />
                <span>Share</span>
              </Button>
            </div>

            {/* Comments - below action buttons */}
            {showComments && (
              <div ref={commentRef} className="space-y-3 pb-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-semibold">Comments ({comments.length})</span>
                </div>

                {/* Comment input */}
                <div className="flex gap-2 items-start">
                  <Avatar className="h-7 w-7 shrink-0">
                    <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=60" />
                    <AvatarFallback>Y</AvatarFallback>
                  </Avatar>
                  <Textarea
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="min-h-[40px] text-sm resize-none flex-1"
                    onKeyDown={e => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); handleAddComment(); } }}
                  />
                  <Button size="sm" className="h-8 w-8 p-0 shrink-0 touch-manipulation" onClick={handleAddComment} disabled={!commentText.trim()}>
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {/* Comments list */}
                {comments.length === 0 ? (
                  <div className="text-center py-6">
                    <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
                    <p className="text-sm font-medium">No comments yet</p>
                    <p className="text-xs text-muted-foreground">Be the first to share your thoughts!</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {comments.map(c => renderInlineComment(c))}
                  </div>
                )}
              </div>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Join Fan Confirmation Dialog - same as carousel */}
      <AlertDialog open={showFanConfirm} onOpenChange={setShowFanConfirm}>
        <AlertDialogContent className="max-w-[340px] rounded-2xl z-[200]">
          <AlertDialogHeader className="text-center">
            <div className="flex justify-center mb-2">
              <div className="h-16 w-16 rounded-2xl overflow-hidden border-2 border-amber-300/40 shadow-md">
                <img
                  src={winner.playerAvatar}
                  alt={winner.playerName}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <AlertDialogTitle className="text-base">
              Become a fan of {winner.playerName}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              This will debit <span className="font-bold text-foreground">M200</span> from your wallet. You'll follow their quiz journey and get updates.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-2">
            <AlertDialogCancel className="flex-1 h-12 touch-manipulation active:scale-[0.97]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="flex-1 h-12 bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 touch-manipulation active:scale-[0.97]"
              onClick={confirmJoinFan}
            >
              Join Fans
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Profile Slides Edit Drawer */}
      <Drawer open={slidesEditOpen} onOpenChange={setSlidesEditOpen}>
        <DrawerContent className="max-h-[80vh]" showClose>
          <DrawerHeader className="pb-2">
            <DrawerTitle className="text-base font-semibold">Manage Profile Slides</DrawerTitle>
          </DrawerHeader>
          <DrawerBody className="px-4 pb-6 space-y-4">
            {/* Hidden file input */}
            <input
              ref={slideFileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAddSlide}
            />

            <div className="grid grid-cols-3 gap-2">
              {editablePhotos.map((photo, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-border">
                  <img src={photo} alt={`Slide ${idx + 1}`} className="h-full w-full object-cover" />
                  <button
                    className="absolute top-1 right-1 p-1 rounded-full bg-black/60 touch-manipulation active:scale-[0.9] transition-transform"
                    onClick={() => handleDeleteSlide(idx)}
                  >
                    <Trash2 className="h-3 w-3 text-white" />
                  </button>
                  <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                    {idx + 1}
                  </div>
                </div>
              ))}

              {/* Add slide card */}
              <button
                className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1.5 bg-muted/30 touch-manipulation active:scale-[0.95] transition-transform"
                onClick={() => slideFileInputRef.current?.click()}
              >
                <ImagePlus className="h-6 w-6 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground font-medium">Add</span>
              </button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Tap the ✕ to remove a slide. Must keep at least one.
            </p>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
