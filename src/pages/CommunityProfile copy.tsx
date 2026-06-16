import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FeedPost } from "@/components/FeedPost";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  MessageCircle,
  Share2,
  Camera,
  UserPlus,
  UserMinus,
  DollarSign,
  ArrowLeft,
  Bell,
} from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { WallStatusCarousel } from "@/components/WallStatusCarousel";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { ELibrarySection } from "@/components/ELibrarySection";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { useToast } from "@/hooks/use-toast";
import { Post } from "@/data/posts";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { PremiumAdCardProps } from "@/components/PremiumAdCard";
import { getCommunityById, getCommunityPosts } from "@/data/communityProfileData";
import { useCommunityProfile } from "@/hooks/useCommunity";
import { useCommunityPosts, type CommunityPost } from "@/hooks/useCommunityPosts";
import { CommunityCreatePostDialog } from "@/components/community/CommunityCreatePostDialog";
import { CommunityPostCard } from "@/components/community/CommunityPostCard";
import { CommunityPostDetailSheet } from "@/components/community/CommunityPostDetailSheet";
import { communityPeople } from "@/data/communityPeopleData";
import { CommunityAboutTab } from "@/components/community/CommunityAboutTab";
import { CommunityMembershipTab } from "@/components/community/CommunityMembershipTab";
import { CommunityNewsSection } from "@/components/community/CommunityNewsSection";
import { CommunityEventsSection } from "@/components/community/CommunityEventsSection";
import { CommunityQuickLinks } from "@/components/community/CommunityQuickLinks";
import { CommunityMainMenu } from "@/components/community/CommunityMainMenu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CommunityStatusBanner } from "@/components/community/CommunityStatusBanner";
import { MediaGalleryViewer, MediaItem } from "@/components/MediaGalleryViewer";

import { OurPeopleCarousel } from "@/components/community/OurPeopleCarousel";
import { CommunityVibesSection } from "@/components/community/CommunityVibesSection";
import { CommunityExecutiveTab } from "@/components/community/CommunityExecutiveTab";
import { CommunityTenureTab } from "@/components/community/CommunityTenureTab";
import { CommunityAdhocTab } from "@/components/community/CommunityAdhocTab";
import { CommunityStaffTab } from "@/components/community/CommunityStaffTab";
import { ElectionCampaignsTab } from "@/components/community/elections/ElectionCampaignsTab";
import { ElectionVotingTab } from "@/components/community/elections/ElectionVotingTab";
import { ElectionResultsTab } from "@/components/community/elections/ElectionResultsTab";
import { ElectionWinnersTab } from "@/components/community/elections/ElectionWinnersTab";
import { ElectionOpinionsTab } from "@/components/community/elections/ElectionOpinionsTab";
import { ElectionAccreditationTab } from "@/components/community/elections/ElectionAccreditationTab";
import { ElectionClearancesTab } from "@/components/community/elections/ElectionClearancesTab";
import { ElectionPrimariesTab } from "@/components/community/elections/ElectionPrimariesTab";
import { CommunityMeetingsTab } from "@/components/community/CommunityMeetingsTab";
import { MeetingProceedingsTab } from "@/components/community/meetings/MeetingProceedingsTab";
import { MeetingHeadlineThemeTab } from "@/components/community/meetings/MeetingHeadlineThemeTab";
import { MeetingResolutionsTab } from "@/components/community/meetings/MeetingResolutionsTab";
import { MeetingConflictsTab } from "@/components/community/meetings/MeetingConflictsTab";
import { MeetingChatsTab } from "@/components/community/meetings/MeetingChatsTab";
import { MeetingVoteNotesTab } from "@/components/community/meetings/MeetingVoteNotesTab";
import { MeetingLighterMoodsTab } from "@/components/community/meetings/MeetingLighterMoodsTab";
import { MeetingAttendanceTab } from "@/components/community/meetings/MeetingAttendanceTab";
import { MeetingMinutesTab } from "@/components/community/meetings/MeetingMinutesTab";
import { FinancialSummaryTab } from "@/components/community/finance/FinancialSummaryTab";
import { FinancialClearancesTab } from "@/components/community/finance/FinancialClearancesTab";
import { FinancialAccreditationTab } from "@/components/community/finance/FinancialAccreditationTab";
import { CommunityAccountsTab } from "@/components/community/finance/CommunityAccountsTab";
import { FundRaiserRaiseCampaignTab } from "@/components/community/fundraiser/FundRaiserRaiseCampaignTab";
import { FundRaiserViewCampaignsTab } from "@/components/community/fundraiser/FundRaiserViewCampaignsTab";
import { FundRaiserViewDonorsTab } from "@/components/community/fundraiser/FundRaiserViewDonorsTab";
import { FundRaiserCelebrityDonorsTab } from "@/components/community/fundraiser/FundRaiserCelebrityDonorsTab";
import { DonationDialog } from "@/components/community/DonationDialog";
import { CommunityPostDialog } from "@/components/community/CommunityPostDialog";
import { RollCallsPage } from "@/pages/RollCallsPage";
import { CommunityResourcesDialog } from "@/components/community/CommunityResourcesDialog";
import { ArticlesPage } from "@/pages/ArticlesPage";
import { InsideCommunityPage } from "@/pages/InsideCommunityPage";
import { MembershipApplicationDrawer } from "@/components/community/MembershipApplicationDrawer";
import { ExitCommunityDialog } from "@/components/community/ExitCommunityDialog";
import { CreatePostTypeSelector, PostType } from "@/components/community/CreatePostTypeSelector";
import { CreateVibeDialog } from "@/components/community/CreateVibeDialog";
import { CreateCommunityContentDialog } from "@/components/community/CreateCommunityContentDialog";
import { RotatingCtaButton } from "@/components/community/RotatingCtaButton";
import { CreateSpecialEventDialog } from "@/components/community/CreateSpecialEventDialog";
import { ArticleEditorDialog } from "@/components/community/ArticleEditorDialog";
import { MediaUploadDialog } from "@/components/community/MediaUploadDialog";
import { CommunityGallerySection } from "@/components/community/CommunityGallerySection";
import { CommunityNotificationsSheet } from "@/components/community/CommunityNotificationsSheet";
import { QuizSelectionSheet } from "@/components/community/QuizSelectionSheet";
// communityNotificationsData import removed — count now fetched from API
import { CampaignBannerRotation } from "@/components/community/elections/CampaignBannerRotation";

const CommunityProfile = () => {
  const { communityId } = useParams<{ communityId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get active tab from URL or default to "status"
  const activeTab = searchParams.get("tab") || "status";
  
  // Get active subtab from URL (for nested tabs like Finance)
  const activeSubtab = searchParams.get("subtab") || "summary";
  
  // Function to change tab via URL parameter (clears subtab when changing main tab)
  const handleTabChange = useCallback((newTab: string) => {
    setSearchParams({ tab: newTab }, { replace: true });
  }, [setSearchParams]);
  
  // Function to change subtab while keeping main tab
  const handleSubtabChange = useCallback((newSubtab: string) => {
    setSearchParams({ tab: activeTab, subtab: newSubtab }, { replace: true });
  }, [setSearchParams, activeTab]);
  const [contentFilter, setContentFilter] = useState<string>("all");
  // Load cached state from sessionStorage so it survives page refreshes
  const interactKey = `community_interact_${communityId}`;
  const cachedInteract = (() => { try { return JSON.parse(sessionStorage.getItem(interactKey) || '{}'); } catch { return {}; } })();
  const [isLiked,      setIsLiked]      = useState<boolean>(cachedInteract.isLiked      ?? false);
  const [isFollowing,  setIsFollowing]  = useState<boolean>(cachedInteract.isFollowing  ?? false);
  // Get community data — real API first, mock fallback
  const { profile: apiProfile, loading: apiLoading, error: apiError } = useCommunityProfile(communityId);
  const { posts, loading: postsLoading, hasMore: postsHasMore, refresh: refreshPosts,
          loadMore: loadMorePosts, createPost, likePost, deletePost,
          commentOnPost, viewPost, uploadMedia } = useCommunityPosts(communityId);
  // Ad slots — empty arrays (no paid ads in community feed)
  const adSlots: any[] = [];
  const wallStatusPremiumAdSlots: any[] = [];
  const premiumAdSlots: any[] = [];
  const mockCommunity = getCommunityById(communityId || "");
  const communityPosts = [] as any[]; // replaced by real API posts

  const [isMember, setIsMember] = useState(false);

  // Sync isMember, isFollowing, isLiked when real community data loads
  useEffect(() => {
    if (apiProfile?.isMember || mockCommunity?.isMember) setIsMember(true);
    // Only overwrite local state if the API actually read the user session
    // (userContextLoaded = true means get.php found the userId from the session)
    if (apiProfile?.userContextLoaded) {
      setIsFollowing(apiProfile.isFollowing ?? false);
      setIsLiked(apiProfile.isLiked ?? false);
      // Cache the confirmed server state
      try { sessionStorage.setItem(interactKey, JSON.stringify({ isFollowing: apiProfile.isFollowing, isLiked: apiProfile.isLiked })); } catch {}
    }
  }, [apiProfile?.isMember, mockCommunity?.isMember, apiProfile?.userContextLoaded]);
  const [visiblePostCount, setVisiblePostCount] = useState(20);
  const [selectedPost,    setSelectedPost]    = useState<CommunityPost | null>(null);
  const [selectedPostIdx, setSelectedPostIdx] = useState(0);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);
  const [wallStatusFilter, setWallStatusFilter] = useState<string>("all");
  const [wallStatusView, setWallStatusView] = useState<"normal" | "large">("normal");
  const [galleryFilter, setGalleryFilter] = useState<string>("all");
  const [galleryView, setGalleryView] = useState<"normal" | "large">("normal");
  const [showDonationDialog, setShowDonationDialog] = useState(false);
  const [showPostTypeSelector, setShowPostTypeSelector] = useState(false);
  const [showWallStatusDialog, setShowWallStatusDialog] = useState(false);
  const [showLogoViewer, setShowLogoViewer] = useState(false);
  const [showGalleryUploadDialog, setShowGalleryUploadDialog] = useState(false);
  const [showContentDialog, setShowContentDialog] = useState(false);
  const [showArticleEditorDialog, setShowArticleEditorDialog] = useState(false);
  const [showVibeDialog, setShowVibeDialog] = useState(false);
  const [showSpecialEventDialog, setShowSpecialEventDialog] = useState(false);
  const [showMembershipApplication, setShowMembershipApplication] = useState(false);
  const [showExitCommunity, setShowExitCommunity] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuizSelection, setShowQuizSelection] = useState(false);
  const { toast } = useToast();
  
  // Fetch real unread notification count from API
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  useEffect(() => {
    if (!communityId) return;
    fetch(`/api/community/notifications.php?community_id=${communityId}&limit=50`, {
      credentials: "include",
    })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setUnreadNotificationsCount(d.unread ?? 0); })
      .catch(() => {});
  }, [communityId]);
  const tabsSectionRef = useRef<HTMLDivElement>(null);

  // Map API response to CommunityProfile shape
  const community = apiProfile
    ? {
        ...mockCommunity, // keep any mock fields as fallback
        id:            apiProfile.id,
        name:          apiProfile.name,
        description:   apiProfile.description ?? mockCommunity?.description,
        motto:         apiProfile.motto ?? mockCommunity?.motto,
        coverImage:    apiProfile.coverImage ?? mockCommunity?.coverImage,
        bannerImage:   apiProfile.bannerImage ?? mockCommunity?.bannerImage,
        logoImage:     apiProfile.logoImage ?? mockCommunity?.logoImage,
        bannerMedia:   apiProfile.bannerMedia?.length ? apiProfile.bannerMedia : mockCommunity?.bannerMedia,
        type:          apiProfile.type ?? mockCommunity?.type ?? "Community",
        classification:apiProfile.classification ?? mockCommunity?.classification,
        category:      apiProfile.category ?? mockCommunity?.category,
        designation:   apiProfile.designation ?? mockCommunity?.designation,
        interest:      apiProfile.interest ?? mockCommunity?.interest,
        status:        apiProfile.status ?? "Active",
        location:      apiProfile.location ?? mockCommunity?.location,
        memberCount:   apiProfile.memberCount ?? 0,
        followers:     apiProfile.followers ?? 0,
        likes:         apiProfile.likes ?? 0,
        createdAt:     apiProfile.createdAt ? new Date(apiProfile.createdAt) : mockCommunity?.createdAt,
        foundedDate:   apiProfile.foundedDate ? new Date(apiProfile.foundedDate) : mockCommunity?.foundedDate,
        isOwner:       apiProfile.isOwner ?? false,
        isMember:      apiProfile.isMember ?? false,
        role:          apiProfile.role ?? "Member",
        visionStatement: apiProfile.visionStatement ?? mockCommunity?.visionStatement,
        originCountry: apiProfile.originCountry ?? mockCommunity?.originCountry ?? "Nigeria",
        originState:   apiProfile.originState ?? mockCommunity?.originState,
        originCity:    apiProfile.originCity ?? mockCommunity?.originCity,
        officeAddress: apiProfile.officeAddress ?? mockCommunity?.officeAddress,
        telephone:     apiProfile.telephone ?? mockCommunity?.telephone,
        telephone2:    apiProfile.telephone2 ?? mockCommunity?.telephone2,
        emailAddress:  apiProfile.emailAddress ?? mockCommunity?.emailAddress,
        defaultCurrency: apiProfile.defaultCurrency ?? "NGN",
        parentBody:    apiProfile.parentBody ?? mockCommunity?.parentBody,
        foundedLocation: apiProfile.foundedLocation ?? mockCommunity?.foundedLocation,
        leadershipStyle: apiProfile.leadershipStyle ?? mockCommunity?.leadershipStyle,
        topmostOffice: apiProfile.topmostOffice ?? mockCommunity?.topmostOffice,
        deputyOffice:  apiProfile.deputyOffice ?? mockCommunity?.deputyOffice,
        officeTenure:  apiProfile.officeTenure ?? mockCommunity?.officeTenure ?? 2,
        gender:        apiProfile.gender ?? mockCommunity?.gender ?? "both",
        membershipChoice: apiProfile.membershipChoice ?? mockCommunity?.membershipChoice,
        populationStrength: apiProfile.populationStrength ?? mockCommunity?.populationStrength ?? 0,
        maleMembers:   apiProfile.maleMembers ?? mockCommunity?.maleMembers ?? 0,
        femaleMembers: apiProfile.femaleMembers ?? mockCommunity?.femaleMembers ?? 0,
        fundRaiserEnabled: apiProfile.fundRaiserEnabled ?? mockCommunity?.fundRaiserEnabled ?? false,
        mobiStoreEnabled:  apiProfile.mobiStoreEnabled ?? mockCommunity?.mobiStoreEnabled ?? false,
        quizGameEnabled:   apiProfile.quizGameEnabled ?? mockCommunity?.quizGameEnabled ?? false,
        donationEnabled:   apiProfile.donationEnabled ?? mockCommunity?.donationEnabled ?? false,
        generalMeetingSchedule:   apiProfile.generalMeetingSchedule ?? mockCommunity?.generalMeetingSchedule,
        executiveMeetingSchedule: apiProfile.executiveMeetingSchedule ?? mockCommunity?.executiveMeetingSchedule,
        meetingAttendance:        mockCommunity?.meetingAttendance ?? "voluntary",
        staffCount:    mockCommunity?.staffCount ?? 0,
        hasManagementCommittee: mockCommunity?.hasManagementCommittee ?? false,
        pendingProposalsCount: apiProfile.pendingProposalsCount ?? 0,
      } as any
    : mockCommunity;

  // Convert real API posts to WallStatusCarousel Post format
  const wallStatusPostsForCarousel = posts.map(post => ({
    id:          post.id,
    title:       post.title || post.description || "Post",
    description: post.description,
    author:      post.author,
    authorImage: post.authorImage,
    authorProfileImage: post.authorImage,
    type:        post.type || "status",
    imageUrl:    post.imageUrl,
    videoUrl:    post.videoUrl,
    timestamp:   post.timestamp,
    likes:       post.likes,
    comments:    post.comments,
    views:       String(post.views || 0),
    userId:      post.userId,
    isOwner:     post.isOwner,
  }));

  // Show loading while API fetches — but only briefly; fall through to not-found on error
  if (apiLoading && !mockCommunity && !apiError) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Loading community...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!community) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Community not found</p>
        </main>
        <Footer />
      </div>
    );
  }

  const handleLike = async () => {
    const newState = !isLiked;
    setIsLiked(newState); // optimistic
    try {
      const res  = await fetch('/api/community/interact.php', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ community_id: communityId, action: newState ? 'like' : 'unlike' }),
      });
      const data = await res.json();
      if (!res.ok) {
        setIsLiked(!newState); // revert
        toast({ title: "Could not update", description: data?.error || "Please try again.", variant: "destructive" });
        return;
      }
      // Server confirms final state — use it and cache it
      const confirmedLike = data.isLiked ?? newState;
      setIsLiked(confirmedLike);
      try { const c = JSON.parse(sessionStorage.getItem(interactKey) || '{}'); c.isLiked = confirmedLike; sessionStorage.setItem(interactKey, JSON.stringify(c)); } catch {}
      toast({ title: confirmedLike ? "Liked ❤️" : "Unliked", description: confirmedLike ? `You liked ${community.name}` : `You unliked ${community.name}` });
    } catch {
      setIsLiked(!newState);
      toast({ title: "Error", description: "Network error. Please try again.", variant: "destructive" });
    }
  };

  const handleFollow = async () => {
    const newState = !isFollowing;
    setIsFollowing(newState); // optimistic
    try {
      const res  = await fetch('/api/community/interact.php', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ community_id: communityId, action: newState ? 'follow' : 'unfollow' }),
      });
      const data = await res.json();
      if (!res.ok) {
        setIsFollowing(!newState); // revert
        toast({ title: "Could not update", description: data?.error || "Please try again.", variant: "destructive" });
        return;
      }
      // Server confirms final state — use it and cache it
      const confirmedFollow = data.isFollowing ?? newState;
      setIsFollowing(confirmedFollow);
      try { const c = JSON.parse(sessionStorage.getItem(interactKey) || '{}'); c.isFollowing = confirmedFollow; sessionStorage.setItem(interactKey, JSON.stringify(c)); } catch {}
      toast({ title: confirmedFollow ? "Following ✓" : "Unfollowed", description: confirmedFollow ? `You are now following ${community.name}` : `You unfollowed ${community.name}` });
    } catch {
      setIsFollowing(!newState);
      toast({ title: "Error", description: "Network error. Please try again.", variant: "destructive" });
    }
  };

  const handleJoinLeave = () => {
    if (isMember) {
      setShowExitCommunity(true);
    } else {
      setShowMembershipApplication(true);
    }
  };

  const handleExitConfirm = () => {
    // Handled by ExitCommunityDialog — called via onLeft callback
    setIsMember(false);
    setShowExitCommunity(false);
  };

  const handleShare = () => {
    const profileUrl = window.location.href;
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "Link Copied",
      description: "Community link has been copied to clipboard",
    });
  };

  const handleDonate = () => {
    setShowDonationDialog(true);
  };

  const handleFundRaiser = () => {
    handleTabChange("fundraiser-campaigns");
  };


  const handleQuizGame = () => {
    setShowQuizSelection(true);
  };

  const handleMobiCircle = () => {
    toast({
      title: "Create Mobi-Circle",
      description: "Opening Mobi-Circle creation...",
    });
  };

  const handlePostTypeSelect = (type: PostType) => {
    switch (type) {
      case "gallery":
        setShowGalleryUploadDialog(true);
        break;
      case "wall-status":
        setShowWallStatusDialog(true);
        break;
      case "contents":
        setShowContentDialog(true);
        break;
      case "articles":
        setShowArticleEditorDialog(true);
        break;
      case "vibes":
        setShowVibeDialog(true);
        break;
      case "special-events":
        setShowSpecialEventDialog(true);
        break;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-2 sm:px-4 py-4 sm:py-6 max-w-5xl">
        {/* Banner and Logo Section */}
        <Card className="overflow-hidden mb-4">
          {/* Banner — multi-media carousel (photos + videos) */}
          <CommunityStatusBanner community={community} />

          {/* Logo and Info */}
          <div className="px-4 sm:px-6 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 sm:-mt-16">
              {/* Logo — tap to open in full-screen viewer */}
              <button
                type="button"
                onClick={() => setShowLogoViewer(true)}
                className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary touch-manipulation active:scale-95 transition-transform self-start"
                aria-label={`Open ${community.name} profile picture`}
              >
                <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-background cursor-zoom-in shadow-lg">
                  <AvatarImage src={community.logoImage || community.coverImage} alt={community.name} />
                  <AvatarFallback className="text-2xl sm:text-3xl">
                    {community.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </button>


              {/* Name and Stats */}
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2">
                  {community.name}
                </h1>
                <p className="text-xs sm:text-sm md:text-base font-semibold text-muted-foreground mb-3 whitespace-nowrap">
                  {community.memberCount.toLocaleString()} Members | {(community.followers + (isFollowing && !apiProfile?.isFollowing ? 1 : 0)).toLocaleString()} Followers | {(community.likes + (isLiked && !apiProfile?.isLiked ? 1 : 0)).toLocaleString()} Likes
                </p>
              </div>

              {/* Rotating CTA Button and Notifications */}
              <div className="flex items-start gap-2 self-start sm:self-end">
                <RotatingCtaButton
                  onDonate={handleDonate}
                  onFundRaiser={handleFundRaiser}
                  onQuizGame={handleQuizGame}
                  onMobiCircle={handleMobiCircle}
                  donationEnabled={community.donationEnabled}
                  interval={15000}
                />
                
                {/* Notification Bell */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => { setShowNotifications(true); setUnreadNotificationsCount(0); }}
                  className="relative"
                >
                  <Bell className="h-4 w-4" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium animate-pulse">
                      {unreadNotificationsCount > 9 ? "9+" : unreadNotificationsCount}
                    </span>
                  )}
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Button
                variant={isMember ? "secondary" : "default"}
                size="sm"
                onClick={handleJoinLeave}
              >
                {isMember ? (
                  <>
                    <UserMinus className="h-4 w-4 mr-2" />
                    Leave
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Join
                  </>
                )}
              </Button>

              {/* Follow button — changes appearance when following */}
              <Button
                variant={isFollowing ? "default" : "outline"}
                size="sm"
                onClick={handleFollow}
                className={isFollowing
                  ? "bg-primary text-primary-foreground hover:bg-destructive hover:text-white transition-colors"
                  : ""}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>

              {/* Like button — highlighted red when liked */}
              <Button
                variant={isLiked ? "default" : "outline"}
                size="sm"
                onClick={handleLike}
                className={isLiked
                  ? "bg-red-500 hover:bg-red-600 text-white border-red-500"
                  : "hover:text-red-500 hover:border-red-400"}
              >
                <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
                {isLiked ? "Liked" : "Like"}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPostTypeSelector(true)}
              >
                Create Post
              </Button>

              <CommunityMainMenu
                isOwner={community.isOwner}
                isAdmin={community.role === "Admin"}
                isMember={community.isMember || isMember}
                onNavigate={(section) => handleTabChange(section)}
              />
            </div>
          </div>
        </Card>

        {/* Tabs Section */}
        <div ref={tabsSectionRef}>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-4">
            <TabsList className="w-full grid grid-cols-3 h-auto">
              <TabsTrigger value="status" className="text-sm sm:text-base py-2.5 px-4">
                Status
              </TabsTrigger>
              <TabsTrigger value="about" className="text-sm sm:text-base py-2.5 px-4">
                About
              </TabsTrigger>
              <TabsTrigger value="membership" className="text-sm sm:text-base py-2.5 px-4">
                Membership
              </TabsTrigger>
            </TabsList>

            {/* Status Tab */}
            <TabsContent value="status" className="space-y-6 mt-6">
              {postsLoading && posts.length === 0 && (
                <div className="flex justify-center py-8">
                  <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {/* Campaign Banners for Community Interface */}
              <CampaignBannerRotation 
                audienceType="community_interface" 
                compact={false}
                maxBanners={3}
              />
              
              {/* 1. Our People, Our Strength - Images only, no filters */}
              <OurPeopleCarousel items={communityPeople} />

              {/* 2. Recommended Community Gallery - Filters without counts, with grid toggle */}
              <WallStatusCarousel
                items={wallStatusPostsForCarousel}
                title="Recommended Community Gallery"
                view={galleryView}
                filter={galleryFilter}
                onViewChange={setGalleryView}
                onFilterChange={setGalleryFilter}
                showViewToggle={true}
                showFilterCounts={false}
                onDelete={deletePost}
                onItemClick={(item) => {
                  const idx = posts.findIndex(p => p.id === item.id);
                  if (idx >= 0) { setSelectedPost(posts[idx]); setSelectedPostIdx(idx); setDetailSheetOpen(true); }
                }}
              />

              {/* 3. Create Post Button */}
              <div className="space-y-2">
                <Button
                  onClick={() => setShowPostTypeSelector(true)}
                  className="w-full"
                  variant="outline"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Create Post on Community's Status
                </Button>
                <p className="text-xs text-center text-muted-foreground italic">
                  [Admin could turn off this in Privacy Setting]
                </p>
              </div>

              {/* 4. Wall Status - Full features */}
              <WallStatusCarousel
                items={wallStatusPostsForCarousel}
                adSlots={adSlots}
                premiumAdSlots={wallStatusPremiumAdSlots}
                view={wallStatusView}
                filter={wallStatusFilter}
                onViewChange={setWallStatusView}
                onFilterChange={setWallStatusFilter}
                showFriendsSuggestions={true}
                showViewToggle={true}
                showFilterCounts={true}
                onDelete={deletePost}
                onItemClick={(item) => {
                  const idx = posts.findIndex(p => p.id === item.id);
                  if (idx >= 0) { setSelectedPost(posts[idx]); setSelectedPostIdx(idx); setDetailSheetOpen(true); }
                }}
              />

              {/* 5. Community Contents */}
              <ELibrarySection
                activeFilter={contentFilter}
                onFilterChange={setContentFilter}
                title="Community Contents"
              />

              {/* Community Posts — real data from API */}
              {posts.length > 0 && (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <CommunityPostCard
                      key={post.id}
                      post={post}
                      onLike={likePost}
                      onDelete={deletePost}
                      onComment={commentOnPost}
                      onView={viewPost}
                      onOpenDetail={(p) => {
                        const idx = posts.findIndex(x => x.id === p.id);
                        setSelectedPost(p);
                        setSelectedPostIdx(idx >= 0 ? idx : 0);
                        setDetailSheetOpen(true);
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Load More */}
              {postsHasMore && (
                <div className="flex justify-center mt-4">
                  <Button
                    variant="outline"
                    onClick={loadMorePosts}
                    disabled={postsLoading}
                  >
                    {postsLoading ? <span className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2 inline-block" /> : null}
                    Load more posts
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* About Tab */}
            <TabsContent value="about" className="mt-6">
              <CommunityAboutTab community={community} />
            </TabsContent>

            {/* Membership Tab */}
            <TabsContent value="membership" className="mt-6">
              <CommunityMembershipTab
                communityId={communityId}
                memberCount={community?.memberCount}
                onPostClick={(post) => {
                  const idx = posts.findIndex(p => p.id === post.id);
                  setSelectedPost(post);
                  setSelectedPostIdx(idx >= 0 ? idx : 0);
                  setDetailSheetOpen(true);
                }}
              />
            </TabsContent>
          </Tabs>

          {/* Hidden Tabs Content - Not in TabsList but still accessible */}
          {activeTab === "finance" && (
            <div className="mt-6">
              <Tabs value={activeSubtab} onValueChange={handleSubtabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-4">
                  <TabsTrigger value="summary" className="text-sm sm:text-base py-2.5">Summary</TabsTrigger>
                  <TabsTrigger value="clearances" className="text-sm sm:text-base py-2.5">Clearances</TabsTrigger>
                  <TabsTrigger value="accreditation" className="text-sm sm:text-base py-2.5">Accreditation</TabsTrigger>
                  <TabsTrigger value="accounts" className="text-sm sm:text-base py-2.5">Accounts</TabsTrigger>
                </TabsList>
                
                <TabsContent value="summary">
                  <FinancialSummaryTab onClose={() => handleTabChange("status")} />
                </TabsContent>
                
                <TabsContent value="clearances">
                  <FinancialClearancesTab />
                </TabsContent>
                
                <TabsContent value="accreditation">
                  <FinancialAccreditationTab />
                </TabsContent>
                
                <TabsContent value="accounts">
                  <CommunityAccountsTab />
                </TabsContent>
              </Tabs>
            </div>
          )}

          {activeTab === "meetings" && (
            <div className="mt-6">
              <CommunityMeetingsTab />
            </div>
          )}

          {activeTab === "meeting-proceedings" && (
            <div className="mt-6">
              <MeetingProceedingsTab />
            </div>
          )}

          {activeTab === "meeting-headline" && (
            <div className="mt-6">
              <MeetingHeadlineThemeTab />
            </div>
          )}

          {activeTab === "meeting-resolutions" && (
            <div className="mt-6">
              <MeetingResolutionsTab />
            </div>
          )}

          {activeTab === "meeting-conflicts" && (
            <div className="mt-6">
              <MeetingConflictsTab />
            </div>
          )}

          {activeTab === "meeting-chats" && (
            <div className="mt-6">
              <MeetingChatsTab />
            </div>
          )}

          {activeTab === "meeting-vote-notes" && (
            <div className="mt-6">
              <MeetingVoteNotesTab />
            </div>
          )}

          {activeTab === "meeting-lighter-moods" && (
            <div className="mt-6">
              <MeetingLighterMoodsTab />
            </div>
          )}

          {activeTab === "meeting-attendance" && (
            <div className="mt-6">
              <MeetingAttendanceTab />
            </div>
          )}

          {activeTab === "meeting-minutes" && (
            <div className="mt-6">
              <MeetingMinutesTab />
            </div>
          )}

          {activeTab === "rollcalls" && (
            <div className="mt-6">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleTabChange("status")}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Status
              </Button>
              <RollCallsPage />
            </div>
          )}

          {/* FundRaiser Tabs */}
          {activeTab === "fundraiser-raise" && (
            <div className="mt-6">
              <FundRaiserRaiseCampaignTab />
            </div>
          )}

          {activeTab === "fundraiser-campaigns" && (
            <div className="mt-6">
              <FundRaiserViewCampaignsTab onRaiseCampaign={() => handleTabChange("fundraiser-raise")} />
            </div>
          )}

          {activeTab === "fundraiser-donors" && (
            <div className="mt-6">
              <FundRaiserViewDonorsTab />
            </div>
          )}

          {activeTab === "fundraiser-celebrity" && (
            <div className="mt-6">
              <FundRaiserCelebrityDonorsTab />
            </div>
          )}

          {/* Elections & Voting Tabs - Separated */}
          {activeTab === "election-campaigns" && (
            <div className="mt-6">
              <ElectionCampaignsTab />
            </div>
          )}
          {activeTab === "election-voting" && (
            <div className="mt-6">
              <ElectionVotingTab />
            </div>
          )}
          {activeTab === "election-results" && (
            <div className="mt-6">
              <ElectionResultsTab />
            </div>
          )}
          {activeTab === "election-winners" && (
            <div className="mt-6">
              <ElectionWinnersTab />
            </div>
          )}
          {activeTab === "election-opinions" && (
            <div className="mt-6">
              <ElectionOpinionsTab />
            </div>
          )}
          {activeTab === "election-accreditation" && (
            <div className="mt-6">
              <ElectionAccreditationTab />
            </div>
          )}
          {activeTab === "election-accredited-voters" && (
            <div className="mt-6">
              <ElectionAccreditationTab initialSubTab="accredited" />
            </div>
          )}
          {activeTab === "election-clearances" && (
            <div className="mt-6">
              <ElectionClearancesTab />
            </div>
          )}
          {activeTab === "election-primaries" && (
            <div className="mt-6">
              <ElectionPrimariesTab />
            </div>
          )}

          {activeTab === "executive" && (
            <div className="mt-6">
              <CommunityExecutiveTab />
            </div>
          )}

          {activeTab === "tenure" && (
            <div className="mt-6">
              <CommunityTenureTab />
            </div>
          )}

          {activeTab === "adhoc" && (
            <div className="mt-6">
              <CommunityAdhocTab />
            </div>
          )}

          {activeTab === "staff" && (
            <div className="mt-6">
              <CommunityStaffTab />
            </div>
          )}

          {activeTab === "resources" && (
            <div className="mt-6">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6">Community Resources</h2>
                <Tabs defaultValue="id-cards" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="id-cards">ID Cards</TabsTrigger>
                    <TabsTrigger value="letters">Letters</TabsTrigger>
                    <TabsTrigger value="publications">Publications</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="id-cards" className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Access your community ID card and request new cards
                    </p>
                    <Button onClick={() => {
                      handleTabChange("resources");
                      toast({ title: "ID Card Feature", description: "View and manage your community ID card" });
                    }}>
                      View ID Card Resources
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="letters" className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Request official letters and view your request history
                    </p>
                    <Button onClick={() => {
                      toast({ title: "Official Letters", description: "Access letter templates and request official letters" });
                    }}>
                      Request Official Letter
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="publications" className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Browse and download community publications, journals, and constitution
                    </p>
                    <Button onClick={() => {
                      toast({ title: "Publications", description: "Access community publications and documents" });
                    }}>
                      Browse Publications
                    </Button>
                  </TabsContent>
                </Tabs>
              </Card>
            </div>
          )}

          {activeTab === "news" && (
            <div className="mt-6">
              <CommunityNewsSection 
                premiumAdSlots={premiumAdSlots}
                showPeopleYouMayKnow={true}
                canPostNews={true}
              />
            </div>
          )}

          {activeTab === "articles" && (
            <div className="mt-6">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleTabChange("status")}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Status
              </Button>
              <ArticlesPage />
            </div>
          )}

          {activeTab === "gallery" && (
            <div className="mt-6">
              <CommunityGallerySection 
                isOwner={community.isOwner}
                isGalleryManager={false}
                isMember={isMember}
                isExecutive={false}
              />
            </div>
          )}

          {activeTab === "inside-community" && (
            <div className="mt-6">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleTabChange("status")}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Status
              </Button>
              <InsideCommunityPage />
            </div>
          )}

          {activeTab === "events" && (
            <div className="mt-6">
              <CommunityEventsSection 
                premiumAdSlots={premiumAdSlots}
                showPeopleYouMayKnow={true}
                canPostEvents={true}
              />
            </div>
          )}

          {activeTab === "vibes" && (
            <div className="mt-6">
              <CommunityVibesSection 
                isOwner={community.isOwner}
                isAdmin={community.role === "Admin"}
              />
            </div>
          )}

          {/* Financial Tabs */}
          {activeTab === "finance-summary" && (
            <div className="mt-6">
              <FinancialSummaryTab onClose={() => handleTabChange("status")} />
            </div>
          )}
          {activeTab === "finance-clearances" && (
            <div className="mt-6">
              <FinancialClearancesTab />
            </div>
          )}
          {activeTab === "finance-accreditation" && (
            <div className="mt-6">
              <FinancialAccreditationTab />
            </div>
          )}
          {activeTab === "community-accounts" && (
            <div className="mt-6">
              <CommunityAccountsTab />
            </div>
          )}
        </div>
      </main>

      <Footer />
      
      {/* Donation Dialog */}
      <DonationDialog 
        open={showDonationDialog} 
        onOpenChange={setShowDonationDialog} 
      />
      
      {/* Post Type Selector */}
      <CreatePostTypeSelector
        open={showPostTypeSelector}
        onOpenChange={setShowPostTypeSelector}
        onSelectType={handlePostTypeSelect}
      />

      {/* Community Logo (Profile Picture) full-screen viewer */}
      <MediaGalleryViewer
        open={showLogoViewer}
        onOpenChange={setShowLogoViewer}
        items={[
          {
            id: `${community.id}-logo`,
            url: community.logoImage || community.coverImage || "",
            type: "photo",
            title: `${community.name} — Profile Picture`,
            author: community.name,
            authorImage: community.logoImage,
          } as MediaItem,
        ]}
        initialIndex={0}
        galleryType="profile-picture"
      />

      {/* Create Post Dialog */}
      <CommunityCreatePostDialog
        open={showWallStatusDialog}
        onOpenChange={setShowWallStatusDialog}
        communityName={community?.name}
        authorName={community?.name}
        onSubmit={createPost}
        uploadMedia={uploadMedia}
      />


      {/* Gallery Upload Dialog */}
      <MediaUploadDialog
        open={showGalleryUploadDialog}
        onOpenChange={setShowGalleryUploadDialog}
        onUploadComplete={(files) => {
          toast({
            title: "Gallery Updated",
            description: `${files.length} file(s) uploaded to community gallery`,
          });
        }}
      />

      {/* Monetized Content Dialog */}
      <CreateCommunityContentDialog
        open={showContentDialog}
        onOpenChange={setShowContentDialog}
        communityId={communityId}
        onPost={createPost}
        uploadMedia={uploadMedia}
      />

      {/* Article Editor Dialog */}
      <ArticleEditorDialog
        open={showArticleEditorDialog}
        onOpenChange={setShowArticleEditorDialog}
      />

      {/* Vibe Dialog */}
      <CreateVibeDialog
        open={showVibeDialog}
        onOpenChange={setShowVibeDialog}
        communityId={communityId}
        onPost={createPost}
        uploadMedia={uploadMedia}
      />

      {/* Special Event Dialog */}
      <CreateSpecialEventDialog
        open={showSpecialEventDialog}
        onOpenChange={setShowSpecialEventDialog}
        communityId={communityId}
        onPost={createPost}
        uploadMedia={uploadMedia}
      />

      {/* Membership Application Drawer */}
      <MembershipApplicationDrawer
        open={showMembershipApplication}
        onOpenChange={setShowMembershipApplication}
        communityId={communityId}
        communityName={community?.name}
        membershipChoice={community?.membershipChoice}
        onJoined={() => setIsMember(true)}
      />

      {/* Exit Community Dialog */}
      <ExitCommunityDialog
        open={showExitCommunity}
        onOpenChange={setShowExitCommunity}
        communityId={communityId}
        communityName={community?.name}
        onLeft={() => setIsMember(false)}
      />

      {/* Community Notifications Sheet */}
      <CommunityNotificationsSheet
        open={showNotifications}
        onOpenChange={setShowNotifications}
        communityId={communityId || "1"}
      />

      {/* Community Post Detail Sheet — like/comment/view routed to community API */}
      <CommunityPostDetailSheet
        post={selectedPost}
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
        onLike={(id, liked) => {
          likePost(id, liked);
          setSelectedPost(prev => prev ? { ...prev, isLiked: !liked, likes: prev.likes + (liked ? -1 : 1) } : null);
        }}
        onDelete={(id) => { deletePost(id); setDetailSheetOpen(false); }}
        onComment={commentOnPost}
        onView={viewPost}
        hasPrev={selectedPostIdx > 0}
        hasNext={selectedPostIdx < posts.length - 1}
        positionLabel={posts.length > 1 ? `${selectedPostIdx + 1} / ${posts.length}` : undefined}
        onPrev={() => {
          const idx = selectedPostIdx - 1;
          if (idx >= 0) { setSelectedPost(posts[idx]); setSelectedPostIdx(idx); }
        }}
        onNext={() => {
          const idx = selectedPostIdx + 1;
          if (idx < posts.length) { setSelectedPost(posts[idx]); setSelectedPostIdx(idx); }
        }}
      />

      {/* Quiz Selection Sheet */}
      <QuizSelectionSheet
        open={showQuizSelection}
        onOpenChange={setShowQuizSelection}
      />
    </div>
  );
};

export default CommunityProfile;