import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, MessageCircle, Share2, Eye, UserPlus, Video, Image as ImageIcon, Music, Grid3x3 } from "lucide-react";
import { toast } from "sonner";
import { CreateVibeForm } from "@/components/community/CreateVibeForm";
import { VibeDetailDialog } from "@/components/community/VibeDetailDialog";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { PremiumAdCardProps } from "@/components/PremiumAdCard";
import { mockVibesData, VibeItem } from "@/data/communityVibesData";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { ViewToggleButton, ViewMode } from "@/components/ui/ViewToggleButton";

// Mock community members for invite carousel
import profile1 from "@/assets/community-person-1.jpg";
import profile2 from "@/assets/community-person-2.jpg";
import profile3 from "@/assets/community-person-3.jpg";
import profile4 from "@/assets/community-person-4.jpg";
import profile5 from "@/assets/community-person-5.jpg";
import profile6 from "@/assets/community-person-6.jpg";
import profile7 from "@/assets/community-person-7.jpg";
import profile8 from "@/assets/community-person-8.jpg";

interface CommunityMember {
  id: string;
  name: string;
  avatar: string;
  mutualFriends: number;
}

const membersToInvite: CommunityMember[] = [
  { id: "1", name: "Chief Emeka Okafor", avatar: profile1, mutualFriends: 45 },
  { id: "2", name: "Dr. Ngozi Eze", avatar: profile2, mutualFriends: 38 },
  { id: "3", name: "Barr. Chidi Nwosu", avatar: profile3, mutualFriends: 52 },
  { id: "4", name: "Mrs. Amaka Johnson", avatar: profile4, mutualFriends: 44 },
  { id: "5", name: "Princess Adaeze", avatar: profile5, mutualFriends: 67 },
  { id: "6", name: "Alhaji Musa Ibrahim", avatar: profile6, mutualFriends: 41 },
  { id: "7", name: "Pastor Grace Okonkwo", avatar: profile7, mutualFriends: 56 },
  { id: "8", name: "Engr. Chinedu Okeke", avatar: profile8, mutualFriends: 33 },
];

// Premium ad for the banner
const premiumAdBanner: PremiumAdCardProps = {
  id: "premium-vibes-banner",
  advertiser: {
    name: "Kerex Group Co.,Ltd",
    verified: true,
  },
  content: {
    headline: "Professional Leading Manufacturer of Heavy Equipment",
    description: "Drilling Rig | Air Compressor | Generator - Quality You Can Trust.",
    ctaText: "Get in touch",
    ctaUrl: "https://example.com/kerex",
  },
  media: {
    type: "image" as const,
    items: [{ url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200&q=80" }],
  },
  layout: "standard" as const,
  duration: 15,
};

interface CommunityVibesSectionProps {
  isOwner?: boolean;
  isAdmin?: boolean;
  className?: string;
}

export const CommunityVibesSection = ({ 
  isOwner = false, 
  isAdmin = false,
  className 
}: CommunityVibesSectionProps) => {
  const [vibes, setVibes] = useState<VibeItem[]>(mockVibesData);
  const [mediaFilter, setMediaFilter] = useState<string>("all");
  const [visibleVibeCount, setVisibleVibeCount] = useState(12);
  const [likedVibes, setLikedVibes] = useState<Record<string, boolean>>({});
  const [selectedVibe, setSelectedVibe] = useState<VibeItem | null>(null);
  const [isVibeDialogOpen, setIsVibeDialogOpen] = useState(false);
  const [inviteStatus, setInviteStatus] = useState<Record<string, boolean>>({});
  const [inviteViewMode, setInviteViewMode] = useState<ViewMode>("carousel");

  const canPost = isOwner || isAdmin;

  const handleVibeCreated = (newVibe: VibeItem) => {
    setVibes(prev => [newVibe, ...prev]);
  };

  const handleLike = (vibeId: string) => {
    setLikedVibes(prev => ({
      ...prev,
      [vibeId]: !prev[vibeId]
    }));
  };

  const handleVibeClick = (vibe: VibeItem) => {
    setSelectedVibe(vibe);
    setIsVibeDialogOpen(true);
  };

  const handleInvite = (memberId: string, memberName: string) => {
    setInviteStatus(prev => ({ ...prev, [memberId]: true }));
    toast.success(`Invitation sent to ${memberName}`);
  };

  // Filter vibes by media type
  const filteredVibes = mediaFilter === "all"
    ? vibes
    : vibes.filter(vibe => vibe.mediaType === mediaFilter);

  const displayedVibes = filteredVibes.slice(0, visibleVibeCount);

  const loadMore = () => {
    setVisibleVibeCount(prev => Math.min(prev + 12, filteredVibes.length));
  };

  const loadLess = () => {
    setVisibleVibeCount(12);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={cn("space-y-6 pb-6", className)}>
      {/* 1. Create Vibe Form */}
      <CreateVibeForm 
        onVibeCreated={handleVibeCreated}
        canPost={canPost}
      />

      {/* 2. Invite Someone to Community */}
      <section className="space-y-4">
        <div className="flex flex-col items-center sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="text-lg sm:text-xl font-semibold text-center sm:text-left">Invite Someone to Community</h2>
          <div className="sm:self-auto">
            <ViewToggleButton view={inviteViewMode} onViewChange={setInviteViewMode} />
          </div>
        </div>
        <div className="relative">
          {inviteViewMode === "carousel" ? (
            <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
              {membersToInvite.map((member) => (
                <Card 
                  key={member.id} 
                  className="flex-shrink-0 w-[160px] sm:w-[180px] p-3 space-y-3 hover:shadow-lg transition-shadow"
                >
                  <div className="relative mx-auto w-20 h-20 sm:w-24 sm:h-24">
                    <Avatar className="w-full h-full border-2 border-primary/20">
                      <AvatarImage src={member.avatar} alt={member.name} className="object-cover" />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <h3 className="text-sm font-semibold text-center line-clamp-2 min-h-[2.5rem]">
                    {member.name}
                  </h3>
                  <p className="text-xs text-muted-foreground text-center">
                    {member.mutualFriends} mutual friends
                  </p>
                  <Button
                    size="sm"
                    onClick={() => handleInvite(member.id, member.name)}
                    disabled={inviteStatus[member.id]}
                    className={cn(
                      "w-full gap-2 transition-all",
                      inviteStatus[member.id] && "bg-green-600 hover:bg-green-700"
                    )}
                  >
                    <UserPlus className="w-4 h-4" />
                    {inviteStatus[member.id] ? "INVITED" : "INVITE"}
                  </Button>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {membersToInvite.map((member) => (
                <Card 
                  key={member.id} 
                  className="p-3 space-y-3 hover:shadow-lg transition-shadow"
                >
                  <div className="relative mx-auto w-20 h-20 sm:w-24 sm:h-24">
                    <Avatar className="w-full h-full border-2 border-primary/20">
                      <AvatarImage src={member.avatar} alt={member.name} className="object-cover" />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <h3 className="text-sm font-semibold text-center line-clamp-2 min-h-[2.5rem]">
                    {member.name}
                  </h3>
                  <p className="text-xs text-muted-foreground text-center">
                    {member.mutualFriends} mutual friends
                  </p>
                  <Button
                    size="sm"
                    onClick={() => handleInvite(member.id, member.name)}
                    disabled={inviteStatus[member.id]}
                    className={cn(
                      "w-full gap-2 transition-all",
                      inviteStatus[member.id] && "bg-green-600 hover:bg-green-700"
                    )}
                  >
                    <UserPlus className="w-4 h-4" />
                    {inviteStatus[member.id] ? "INVITED" : "INVITE"}
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. Single Premium Ad Banner */}
      <div className="w-full">
        <PremiumAdRotation
          slotId="vibes-banner-slot"
          ads={[premiumAdBanner]}
          context="profile"
          className="w-full"
        />
      </div>

      {/* 4. People You May Know Carousel */}
      <PeopleYouMayKnow />

      {/* 5. Media Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Select value={mediaFilter} onValueChange={setMediaFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Vibes</SelectItem>
            <SelectItem value="video">
              <span className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                Videos
              </span>
            </SelectItem>
            <SelectItem value="photo">
              <span className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Photos
              </span>
            </SelectItem>
            <SelectItem value="audio">
              <span className="flex items-center gap-2">
                <Music className="w-4 h-4" />
                Audio/Sound
              </span>
            </SelectItem>
            <SelectItem value="gallery">
              <span className="flex items-center gap-2">
                <Grid3x3 className="w-4 h-4" />
                Community Gallery
              </span>
            </SelectItem>
          </SelectContent>
        </Select>

        {mediaFilter !== "all" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMediaFilter("all")}
          >
            Clear Filter
          </Button>
        )}
      </div>

      {/* 6. Vibes Content Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedVibes.map((vibe) => {
          const isLiked = likedVibes[vibe.id] || false;
          const likeCount = vibe.likes + (isLiked ? 1 : 0);

          return (
            <Card 
              key={vibe.id}
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => handleVibeClick(vibe)}
            >
              {/* Media Preview */}
              <div className="relative aspect-video bg-muted overflow-hidden">
                {vibe.mediaType === "audio" ? (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-500/20 to-green-600/10">
                    <Music className="w-16 h-16 text-green-600/40" />
                  </div>
                ) : (
                  <img
                    src={vibe.thumbnail || vibe.mediaUrl || vibe.galleryImages?.[0]}
                    alt={vibe.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}

                {/* Media Type Badge */}
                <div className="absolute top-2 right-2">
                  <Badge className="bg-background/80 backdrop-blur-sm">
                    {vibe.mediaType === "video" && <Video className="w-3 h-3 mr-1" />}
                    {vibe.mediaType === "photo" && <ImageIcon className="w-3 h-3 mr-1" />}
                    {vibe.mediaType === "audio" && <Music className="w-3 h-3 mr-1" />}
                    {vibe.mediaType === "gallery" && <Grid3x3 className="w-3 h-3 mr-1" />}
                    {vibe.mediaType.charAt(0).toUpperCase() + vibe.mediaType.slice(1)}
                  </Badge>
                </div>

                {/* Spotlight Badge */}
                {vibe.spotlight && (
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-primary text-primary-foreground">
                      SPOTLIGHT
                    </Badge>
                  </div>
                )}

                {/* Duration for video/audio */}
                {vibe.duration && (
                  <div className="absolute bottom-2 right-2">
                    <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm text-xs">
                      {vibe.duration}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                {/* Author */}
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 border">
                    <AvatarImage src={vibe.authorProfileImage} alt={vibe.author} />
                    <AvatarFallback className="text-xs">
                      {vibe.author.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate">{vibe.author}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(vibe.date), { addSuffix: true })}
                    </p>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-semibold text-sm line-clamp-2 leading-snug">
                  {vibe.title}
                </h3>

                {/* Stats */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{vibe.views.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className={cn("w-3 h-3", isLiked && "fill-red-500 text-red-500")} />
                    <span>{likeCount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    <span>{vibe.comments.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Share2 className="w-3 h-3" />
                    <span>{vibe.shares.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* 7. Pagination */}
      {filteredVibes.length > visibleVibeCount && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={loadMore}
            className="min-w-[200px]"
          >
            ...more
          </Button>
        </div>
      )}

      {visibleVibeCount > 12 && visibleVibeCount >= filteredVibes.length && (
        <div className="flex justify-center pt-2">
          <Button
            variant="ghost"
            onClick={loadLess}
            className="min-w-[200px]"
          >
            Less...
          </Button>
        </div>
      )}

      {/* Vibe Detail Dialog */}
      {selectedVibe && (
        <VibeDetailDialog
          open={isVibeDialogOpen}
          onOpenChange={setIsVibeDialogOpen}
          vibe={selectedVibe}
          onLike={handleLike}
          isLiked={likedVibes[selectedVibe.id] || false}
          likeCount={selectedVibe.likes + (likedVibes[selectedVibe.id] ? 1 : 0)}
        />
      )}
    </div>
  );
};