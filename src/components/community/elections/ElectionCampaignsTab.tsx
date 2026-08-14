import { useState, useEffect } from "react";
import { Menu, MessageSquare, Eye, Users, Loader2 } from "lucide-react";
import { CampaignsView } from "./CampaignsView";
import { LaunchCampaignDialog } from "./LaunchCampaignDialog";
import { CandidateFeedbackSheet } from "./CandidateFeedbackSheet";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { CampaignBannerRotation } from "./CampaignBannerRotation";
import { getContentsAdsWithUserAdverts } from "@/data/profileAds";
import { EnhancedCampaign } from "@/types/campaignSystem";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface RealCampaignPost {
  id: string;
  content: string;
  image?: string;
  created_at: string;
  candidate_name: string;
}

interface ElectionCampaignsTabProps {
  communityId?: string;
}

export const ElectionCampaignsTab = ({ communityId }: ElectionCampaignsTabProps) => {
  const [showLaunchDialog, setShowLaunchDialog] = useState(false);
  const [selectedCampaignForFeedback, setSelectedCampaignForFeedback] = useState<EnhancedCampaign | null>(null);
  const [showFeedbackSheet, setShowFeedbackSheet] = useState(false);
  const [myPosts, setMyPosts] = useState<RealCampaignPost[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!communityId) return;
    setLoading(true);
    fetch(`/api/community/elections.php?action=campaigns&community_id=${communityId}`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setMyPosts(d.posts ?? []))
      .catch(() => setMyPosts([]))
      .finally(() => setLoading(false));
  }, [communityId]);

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Menu className="w-5 h-5" />
          <h1 className="text-2xl font-bold">Election Campaigns</h1>
        </div>
      </div>

      {/* Campaign Banners for Community Interface */}
      <CampaignBannerRotation 
        audienceType="community_interface" 
        compact={false}
        maxBanners={3}
      />

      {/* My Campaign Updates (real candidate posts) */}
      {loading ? (
        <div className="flex justify-center py-6"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : myPosts.length > 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Campaign Updates
            </h3>
            <div className="space-y-2">
              {myPosts.slice(0, 5).map((post) => (
                <div 
                  key={post.id} 
                  className="bg-background rounded-lg p-3 border"
                >
                  <p className="font-medium text-sm">{post.candidate_name}</p>
                  <p className="text-sm text-muted-foreground mt-1">{post.content}</p>
                  <p className="text-xs text-muted-foreground mt-1.5">{new Date(post.created_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Campaigns Content */}
      <CampaignsView 
        onLaunchCampaign={() => setShowLaunchDialog(true)} 
        communityId={communityId}
      />
      
      {/* Launch Campaign Dialog */}
      <LaunchCampaignDialog 
        open={showLaunchDialog} 
        onOpenChange={(v) => { setShowLaunchDialog(v); if (!v) { setLoading(true); fetch(`/api/community/elections.php?action=campaigns&community_id=${communityId}`, { credentials: "include" }).then((r) => r.json()).then((d) => setMyPosts(d.posts ?? [])).catch(() => {}).finally(() => setLoading(false)); } }} 
        communityId={communityId}
      />

      {/* Candidate Feedback Sheet */}
      <CandidateFeedbackSheet
        open={showFeedbackSheet}
        onOpenChange={setShowFeedbackSheet}
        campaign={selectedCampaignForFeedback}
      />
      
      {/* Ads & Suggestions */}
      <PremiumAdRotation ads={getContentsAdsWithUserAdverts().flat()} slotId="election-campaigns" />
      <PeopleYouMayKnow />
    </div>
  );
};
