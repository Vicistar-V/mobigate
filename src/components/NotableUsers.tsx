import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sparkles,
  Activity,
  Heart,
  Crown,
  Flame,
  Users,
  ThumbsUp,
  Play,
  Image as ImageIcon,
  UserPlus,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

import sarahJohnson from "@/assets/profile-sarah-johnson.jpg";
import michaelChen from "@/assets/profile-michael-chen.jpg";
import emilyDavis from "@/assets/profile-emily-davis.jpg";
import jamesWilson from "@/assets/profile-james-wilson.jpg";
import lisaAnderson from "@/assets/profile-lisa-anderson.jpg";
import davidMartinez from "@/assets/profile-david-martinez.jpg";
import jenniferTaylor from "@/assets/profile-jennifer-taylor.jpg";
import robertBrown from "@/assets/profile-robert-brown.jpg";

type NotableTag = "most-online" | "most-active" | "most-celebrated";

interface NotableUser {
  id: string;
  name: string;
  handle: string;
  profileImage: string;
  flagged: boolean;
  followers: number;
  likes: number;
  online: boolean;
  engagementScore: number;
  celebrityScore: number;
  photos: string[];
  videos: { id: string; thumbnail: string; duration: string }[];
  tags: NotableTag[];
}

const NOTABLE_USERS: NotableUser[] = [
  {
    id: "n1",
    name: "Sarah Johnson",
    handle: "sarah_j",
    profileImage: sarahJohnson,
    flagged: true,
    followers: 248_500,
    likes: 1_240_000,
    online: true,
    engagementScore: 98,
    celebrityScore: 99,
    photos: [sarahJohnson, emilyDavis, jenniferTaylor, lisaAnderson],
    videos: [
      { id: "v1", thumbnail: sarahJohnson, duration: "0:42" },
      { id: "v2", thumbnail: emilyDavis, duration: "1:18" },
    ],
    tags: ["most-online", "most-active", "most-celebrated"],
  },
  {
    id: "n2",
    name: "Michael Chen",
    handle: "michael_c",
    profileImage: michaelChen,
    flagged: true,
    followers: 89_300,
    likes: 412_700,
    online: true,
    engagementScore: 94,
    celebrityScore: 88,
    photos: [michaelChen, davidMartinez, robertBrown],
    videos: [{ id: "v3", thumbnail: michaelChen, duration: "0:55" }],
    tags: ["most-online", "most-active"],
  },
  {
    id: "n3",
    name: "Emily Davis",
    handle: "emily_d",
    profileImage: emilyDavis,
    flagged: true,
    followers: 312_900,
    likes: 1_802_400,
    online: false,
    engagementScore: 91,
    celebrityScore: 96,
    photos: [emilyDavis, sarahJohnson, jenniferTaylor],
    videos: [
      { id: "v4", thumbnail: emilyDavis, duration: "2:05" },
      { id: "v5", thumbnail: sarahJohnson, duration: "0:38" },
    ],
    tags: ["most-celebrated", "most-active"],
  },
  {
    id: "n4",
    name: "James Wilson",
    handle: "james_w",
    profileImage: jamesWilson,
    flagged: false,
    followers: 56_120,
    likes: 198_400,
    online: true,
    engagementScore: 87,
    celebrityScore: 72,
    photos: [jamesWilson, davidMartinez],
    videos: [],
    tags: ["most-online", "most-active"],
  },
  {
    id: "n5",
    name: "Lisa Anderson",
    handle: "lisa_a",
    profileImage: lisaAnderson,
    flagged: true,
    followers: 412_300,
    likes: 2_104_800,
    online: false,
    engagementScore: 84,
    celebrityScore: 97,
    photos: [lisaAnderson, jenniferTaylor, emilyDavis, sarahJohnson],
    videos: [{ id: "v6", thumbnail: lisaAnderson, duration: "1:42" }],
    tags: ["most-celebrated"],
  },
  {
    id: "n6",
    name: "David Martinez",
    handle: "david_m",
    profileImage: davidMartinez,
    flagged: false,
    followers: 78_600,
    likes: 305_900,
    online: true,
    engagementScore: 90,
    celebrityScore: 78,
    photos: [davidMartinez, robertBrown, jamesWilson],
    videos: [{ id: "v7", thumbnail: davidMartinez, duration: "0:48" }],
    tags: ["most-online", "most-active"],
  },
  {
    id: "n7",
    name: "Jennifer Taylor",
    handle: "jennifer_t",
    profileImage: jenniferTaylor,
    flagged: true,
    followers: 188_700,
    likes: 902_300,
    online: false,
    engagementScore: 89,
    celebrityScore: 92,
    photos: [jenniferTaylor, sarahJohnson, emilyDavis],
    videos: [{ id: "v8", thumbnail: jenniferTaylor, duration: "1:12" }],
    tags: ["most-celebrated", "most-active"],
  },
  {
    id: "n8",
    name: "Robert Brown",
    handle: "robert_b",
    profileImage: robertBrown,
    flagged: false,
    followers: 42_800,
    likes: 156_200,
    online: true,
    engagementScore: 82,
    celebrityScore: 68,
    photos: [robertBrown, davidMartinez],
    videos: [],
    tags: ["most-online"],
  },
];

const TAG_META: Record<NotableTag, { label: string; icon: typeof Flame; color: string }> = {
  "most-online": { label: "Most Online", icon: Activity, color: "text-emerald-600" },
  "most-active": { label: "Most Active", icon: Flame, color: "text-orange-600" },
  "most-celebrated": { label: "Most Celebrated", icon: Crown, color: "text-amber-600" },
};

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export const NotableUsers = () => {
  const { toast } = useToast();
  // All three filters auto-activated per spec
  const [activeFilters, setActiveFilters] = useState<NotableTag[]>([
    "most-online",
    "most-active",
    "most-celebrated",
  ]);
  const [selected, setSelected] = useState<NotableUser | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleFilter = (tag: NotableTag) => {
    setActiveFilters((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filtered = useMemo(() => {
    if (activeFilters.length === 0) return NOTABLE_USERS;
    return NOTABLE_USERS.filter((u) => u.tags.some((t) => activeFilters.includes(t)));
  }, [activeFilters]);

  const openUser = (user: NotableUser) => {
    setSelected(user);
    setDrawerOpen(true);
  };

  return (
    <>
      <Card className="p-4 space-y-3 hover:shadow-md transition-shadow overflow-hidden">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-lg flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-primary" />
            Notable Users
          </h3>
          <Badge variant="secondary" className="text-[10px]">
            Auto-curated
          </Badge>
        </div>

        {/* Auto-active filter chips */}
        <div className="flex gap-2 overflow-x-auto -mx-1 px-1 pb-1 snap-x">
          {(Object.keys(TAG_META) as NotableTag[]).map((tag) => {
            const meta = TAG_META[tag];
            const Icon = meta.icon;
            const active = activeFilters.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleFilter(tag)}
                className={`snap-start shrink-0 inline-flex items-center gap-1 h-8 px-3 rounded-full border text-xs font-semibold transition-colors touch-manipulation ${
                  active
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-card text-foreground border-border hover:bg-muted/60"
                }`}
              >
                <Icon className={`h-3 w-3 ${active ? "" : meta.color}`} />
                {meta.label}
              </button>
            );
          })}
        </div>

        {/* Horizontal carousel */}
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory -mx-1 px-1">
          {filtered.map((user) => (
            <div
              key={user.id}
              className="flex-shrink-0 w-[140px] space-y-2 snap-start cursor-pointer active:scale-[0.98] transition-transform"
              onClick={() => openUser(user)}
            >
              <div className="relative">
                <Avatar className="h-32 w-full aspect-[3/4] rounded-lg border-2 border-primary/20">
                  <AvatarImage src={user.profileImage} alt={user.name} className="object-cover" />
                  <AvatarFallback className="rounded-lg">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {user.flagged && (
                  <span className="absolute top-1.5 right-1.5 text-base drop-shadow" title="Flagged Profile">
                    🏳️
                  </span>
                )}
                {user.online && (
                  <span className="absolute bottom-1.5 left-1.5 inline-flex items-center gap-1 bg-emerald-600 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-full">
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                    Online
                  </span>
                )}
              </div>

              <div className="text-center">
                <p className="font-medium text-sm line-clamp-1">{user.name}</p>
                <div className="flex items-center justify-center gap-2 mt-0.5 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-0.5">
                    <Users className="h-2.5 w-2.5" />
                    {formatCount(user.followers)}
                  </span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-0.5">
                    <Heart className="h-2.5 w-2.5" />
                    {formatCount(user.likes)}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-xs text-muted-foreground py-6 text-center w-full">
              No notable users match the selected filters.
            </p>
          )}
        </div>
      </Card>

      {/* Detail Drawer */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="max-h-[92dvh]">
          {selected && (
            <>
              <DrawerHeader>
                <DrawerTitle className="text-base flex items-center gap-2">
                  Notable User
                  {selected.flagged && <span title="Flagged Profile">🏳️</span>}
                </DrawerTitle>
              </DrawerHeader>
              <DrawerBody>
                <ScrollArea className="h-[72vh]">
                  <div className="space-y-4 pb-6">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                      <Avatar className="h-16 w-16 border-2 border-primary/30">
                        <AvatarImage src={selected.profileImage} alt={selected.name} />
                        <AvatarFallback>{selected.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-base flex items-center gap-1.5">
                          {selected.name}
                          {selected.flagged && <span className="text-base">🏳️</span>}
                        </p>
                        <p className="text-xs text-muted-foreground">@{selected.handle}</p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {selected.tags.map((t) => {
                            const meta = TAG_META[t];
                            const Icon = meta.icon;
                            return (
                              <Badge key={t} variant="outline" className="text-[9px] gap-0.5">
                                <Icon className={`h-2.5 w-2.5 ${meta.color}`} />
                                {meta.label}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-lg border p-3 bg-card">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                          <Users className="h-3 w-3" /> Followers
                        </p>
                        <p className="text-lg font-bold mt-0.5">
                          {selected.followers.toLocaleString()}
                        </p>
                      </div>
                      <div className="rounded-lg border p-3 bg-card">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3" /> Likes
                        </p>
                        <p className="text-lg font-bold mt-0.5">
                          {selected.likes.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Photos */}
                    {selected.photos.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
                          <ImageIcon className="h-3 w-3" /> Photos ({selected.photos.length})
                        </p>
                        <div className="grid grid-cols-3 gap-1.5">
                          {selected.photos.map((p, i) => (
                            <div
                              key={i}
                              className="aspect-square rounded-md overflow-hidden bg-muted"
                            >
                              <img src={p} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Videos */}
                    {selected.videos.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
                          <Play className="h-3 w-3" /> Videos ({selected.videos.length})
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {selected.videos.map((v) => (
                            <div
                              key={v.id}
                              className="relative aspect-video rounded-md overflow-hidden bg-muted"
                            >
                              <img
                                src={v.thumbnail}
                                alt="Video"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                <Play className="h-7 w-7 text-white fill-white" />
                              </div>
                              <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1 rounded">
                                {v.duration}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="grid grid-cols-3 gap-2 pt-2">
                      <Button
                        size="sm"
                        className="h-9 text-xs"
                        onClick={() => {
                          toast({
                            title: "Following",
                            description: `You are now following ${selected.name}`,
                          });
                        }}
                      >
                        <UserPlus className="h-3.5 w-3.5 mr-1" />
                        Follow
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-9 text-xs"
                        onClick={() => {
                          toast({
                            title: "Liked",
                            description: `You liked ${selected.name}'s profile`,
                          });
                        }}
                      >
                        <Heart className="h-3.5 w-3.5 mr-1" />
                        Like
                      </Button>
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="h-9 text-xs"
                      >
                        <Link to={`/profile/${selected.id}`} onClick={() => setDrawerOpen(false)}>
                          <MessageCircle className="h-3.5 w-3.5 mr-1" />
                          Profile
                        </Link>
                      </Button>
                    </div>
                  </div>
                </ScrollArea>
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default NotableUsers;
