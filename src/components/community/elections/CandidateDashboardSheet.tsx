import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Vote,
  Plus,
  Eye,
  MousePointerClick,
  MessageSquare,
  TrendingUp,
  Receipt,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Megaphone,
} from "lucide-react";
import { MobiCurrencyDisplay, MobiCompactDisplay } from "@/components/common/MobiCurrencyDisplay";
import { mockCandidateDashboard, mockDeclarations } from "@/data/nominationFeesData";
import { CampaignSettingsDialog } from "./CampaignSettingsDialog";
import { format } from "date-fns";

interface CandidateDashboardSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidateName?: string;
  candidateAvatar?: string;
}

export function CandidateDashboardSheet({
  open,
  onOpenChange,
  candidateName = "Chief Adebayo Okonkwo",
  candidateAvatar = "https://randomuser.me/api/portraits/men/32.jpg",
}: CandidateDashboardSheetProps) {
  const [showCampaignSettings, setShowCampaignSettings] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const dashboard = mockCandidateDashboard;
  const declaration = dashboard.declaration;
  const analytics = dashboard.analytics;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-600";
      case "pending_payment":
        return "bg-amber-500/10 text-amber-600";
      case "cleared":
        return "bg-blue-500/10 text-blue-600";
      default:
        return "bg-muted";
    }
  };

  const getCampaignStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-600";
      case "pending_payment":
        return "bg-amber-500/10 text-amber-600";
      case "not_created":
        return "bg-muted text-muted-foreground";
      case "draft":
        return "bg-blue-500/10 text-blue-600";
      default:
        return "bg-muted";
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-[92vh] rounded-t-2xl">
          <SheetHeader className="pb-2">
            <SheetTitle className="flex items-center gap-2">
              <Vote className="h-5 w-5 text-primary" />
              Candidate Dashboard
            </SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-[calc(100%-60px)] mt-2">
            <div className="pr-2 pb-4 space-y-4">
              {/* Candidate Header */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={candidateAvatar} alt={candidateName} />
                      <AvatarFallback className="text-lg">
                        {candidateName.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg truncate">{candidateName}</h3>
                      <p className="text-sm text-muted-foreground">
                        Candidate for {declaration.officeName}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getStatusColor(declaration.status)}>
                          {declaration.status === "active" ? "Declared" : declaration.status.replace("_", " ")}
                        </Badge>
                        <Badge className={getStatusColor(declaration.clearanceStatus)}>
                          {declaration.clearanceStatus === "cleared" ? (
                            <>
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Cleared
                            </>
                          ) : (
                            <>
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </>
                          )}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Create Campaign CTA - Prominently displayed */}
              {dashboard.canCreateCampaign && dashboard.campaignStatus === "not_created" && (
                <Card className="border-primary border-2 bg-primary/5">
                  <CardContent className="p-4 text-center space-y-3">
                    <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto">
                      <Megaphone className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Your Campaign Dashboard is Ready!</h4>
                      <p className="text-sm text-muted-foreground">
                        Create your campaign to reach voters and share your manifesto.
                      </p>
                    </div>
                    <Button 
                      size="lg" 
                      className="w-full"
                      onClick={() => setShowCampaignSettings(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Campaign
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Campaign Active Banner */}
              {dashboard.campaignStatus === "active" && (
                <Card className="border-green-500/30 bg-green-500/5">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-green-500/10">
                        <Megaphone className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">Campaign Active</p>
                        <p className="text-xs text-muted-foreground">
                          Running until Feb 22, 2025
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        View Campaign
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  <TabsTrigger value="receipts">Receipts</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4 mt-4">
                  {/* Declaration Details */}
                  <Card>
                    <CardHeader className="pb-2 pt-3 px-4">
                      <CardTitle className="text-sm">Declaration Details</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 pt-0 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Office Position</span>
                        <span className="font-medium">{declaration.officeName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Declaration Date</span>
                        <span>{format(declaration.declarationDate, "MMM d, yyyy")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fees Paid</span>
                        <MobiCompactDisplay amount={declaration.totalFeesPaid} />
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Transaction Ref</span>
                        <span className="font-mono text-xs">
                          {declaration.paymentTransactionId}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Clearance Status</span>
                        <Badge className={getStatusColor(declaration.clearanceStatus)}>
                          {declaration.clearanceStatus}
                        </Badge>
                      </div>
                      {declaration.clearanceDate && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Cleared On</span>
                          <span>{format(declaration.clearanceDate, "MMM d, yyyy")}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Campaign Status */}
                  <Card>
                    <CardHeader className="pb-2 pt-3 px-4">
                      <CardTitle className="text-sm">Campaign Status</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 pt-0">
                      <div className="flex items-center justify-between">
                        <Badge className={getCampaignStatusColor(dashboard.campaignStatus)}>
                          {dashboard.campaignStatus === "not_created" 
                            ? "Not Created" 
                            : dashboard.campaignStatus.replace("_", " ")}
                        </Badge>
                        {dashboard.canCreateCampaign && dashboard.campaignStatus === "not_created" && (
                          <Button 
                            size="sm"
                            onClick={() => setShowCampaignSettings(true)}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Create
                          </Button>
                        )}
                        {dashboard.campaignStatus === "active" && (
                          <Button variant="outline" size="sm">
                            Manage
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-4 mt-4">
                  {analytics ? (
                    <>
                      {/* Analytics Overview */}
                      <div className="grid grid-cols-2 gap-3">
                        <Card>
                          <CardContent className="p-4 text-center">
                            <Eye className="h-5 w-5 mx-auto text-muted-foreground" />
                            <p className="text-2xl font-bold mt-2">
                              {analytics.totalViews.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground">Total Views</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <MousePointerClick className="h-5 w-5 mx-auto text-muted-foreground" />
                            <p className="text-2xl font-bold mt-2">
                              {analytics.totalClicks.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground">Clicks</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <MessageSquare className="h-5 w-5 mx-auto text-muted-foreground" />
                            <p className="text-2xl font-bold mt-2">
                              {analytics.feedbackCount}
                            </p>
                            <p className="text-xs text-muted-foreground">Feedback</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <TrendingUp className="h-5 w-5 mx-auto text-green-600" />
                            <p className="text-2xl font-bold mt-2">
                              {analytics.engagementRate.toFixed(1)}%
                            </p>
                            <p className="text-xs text-muted-foreground">Engagement</p>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Engagement Progress */}
                      <Card>
                        <CardHeader className="pb-2 pt-3 px-4">
                          <CardTitle className="text-sm">Engagement Progress</CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pb-4 pt-0 space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Click-through Rate</span>
                              <span className="font-medium">{analytics.engagementRate.toFixed(1)}%</span>
                            </div>
                            <Progress value={analytics.engagementRate} className="h-2" />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Last updated: {format(analytics.lastUpdated, "MMM d, yyyy 'at' h:mm a")}
                          </p>
                        </CardContent>
                      </Card>
                    </>
                  ) : (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground/30" />
                        <h4 className="font-medium mt-4">No Analytics Yet</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Create a campaign to start tracking engagement
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="receipts" className="space-y-4 mt-4">
                  {dashboard.receipts.length > 0 ? (
                    <div className="space-y-3">
                      {dashboard.receipts.map((receipt) => (
                        <Card key={receipt.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="p-2 rounded-lg bg-muted">
                                <Receipt className="h-4 w-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">
                                  {receipt.description}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {format(receipt.date, "MMM d, yyyy")} • {receipt.reference}
                                </p>
                              </div>
                              <MobiCompactDisplay 
                                amount={receipt.amount} 
                                type="expense"
                                showSign
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Receipt className="h-12 w-12 mx-auto text-muted-foreground/30" />
                        <h4 className="font-medium mt-4">No Receipts</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Your transaction receipts will appear here
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Campaign Settings Dialog */}
      <CampaignSettingsDialog
        open={showCampaignSettings}
        onOpenChange={setShowCampaignSettings}
        candidateName={candidateName}
        office={declaration.officeName}
      />
    </>
  );
}
