import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users, FileText, Settings, ChevronRight, Check, X, Clock, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  mockSubMerchants, mockSubMerchantApplications, subMerchantSettings,
  setApplicationFee, formatNum, SubMerchantApplication,
} from "@/data/subMerchantData";

export default function ManageSubMerchants() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [applications, setApplications] = useState(mockSubMerchantApplications);
  const [appFee, setAppFee] = useState(subMerchantSettings.applicationFee);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmAction, setConfirmAction] = useState<{ app: SubMerchantApplication; action: "approve" | "decline" } | null>(null);

  const filteredMerchants = useMemo(() => {
    if (!searchQuery) return mockSubMerchants;
    const q = searchQuery.toLowerCase();
    return mockSubMerchants.filter(m => m.name.toLowerCase().includes(q) || m.city.toLowerCase().includes(q));
  }, [searchQuery]);

  const pendingApps = applications.filter(a => a.status === "pending");
  const processedApps = applications.filter(a => a.status !== "pending");

  const handleAppAction = () => {
    if (!confirmAction) return;
    setApplications(prev => prev.map(a =>
      a.id === confirmAction.app.id
        ? { ...a, status: confirmAction.action === "approve" ? "approved" as const : "rejected" as const }
        : a
    ));
    toast({
      title: confirmAction.action === "approve" ? "Application Approved" : "Application Declined",
      description: `${confirmAction.app.applicantName}'s application has been ${confirmAction.action === "approve" ? "approved" : "declined"}.`,
    });
    setConfirmAction(null);
  };

  const handleSaveFee = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setApplicationFee(appFee);
    setIsSaving(false);
    toast({ title: "Fee Updated", description: `Application fee set to ₦${formatNum(appFee)}` });
  };

  return (
    <div className="bg-background min-h-screen pb-8">
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="h-9 w-9 rounded-full bg-muted flex items-center justify-center active:scale-90 touch-manipulation">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div className="flex-1">
          <h1 className="text-base font-bold text-foreground">Manage Sub-Merchants</h1>
          <p className="text-xs text-muted-foreground">{mockSubMerchants.length} sub-merchants registered</p>
        </div>
      </div>

      <div className="px-4 pt-4">
        <Tabs defaultValue="list">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="list" className="flex-1 text-xs">
              <Users className="h-3.5 w-3.5 mr-1.5" /> List
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex-1 text-xs">
              <FileText className="h-3.5 w-3.5 mr-1.5" /> Requests
              {pendingApps.length > 0 && (
                <Badge className="ml-1.5 bg-destructive text-destructive-foreground text-xs h-5 w-5 p-0 flex items-center justify-center">{pendingApps.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex-1 text-xs">
              <Settings className="h-3.5 w-3.5 mr-1.5" /> Settings
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: Sub-Merchant List */}
          <TabsContent value="list">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search sub-merchants..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-9 rounded-xl bg-muted/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>
            <div className="space-y-2.5">
              {filteredMerchants.map(sm => (
                <div
                  key={sm.id}
                  onClick={() => navigate(`/merchant-sub-merchant/${sm.id}`)}
                  className="rounded-xl border border-border/50 bg-card p-4 active:scale-[0.97] transition-transform touch-manipulation cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-foreground truncate">{sm.name}</p>
                        <Badge className={`text-xs h-5 px-2 ${sm.status === "active" ? "bg-emerald-500/15 text-emerald-600" : "bg-destructive/15 text-destructive"}`}>
                          {sm.status === "active" ? "Active" : "Suspended"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{sm.city}, {sm.state}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Joined {sm.joinDate.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</span>
                    <span>₦{formatNum(sm.totalSpend)} spent</span>
                  </div>
                </div>
              ))}
              {filteredMerchants.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-sm text-muted-foreground">No sub-merchants found</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* TAB 2: Requests */}
          <TabsContent value="requests">
            {pendingApps.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 px-1">Pending ({pendingApps.length})</p>
                <div className="space-y-2.5">
                  {pendingApps.map(app => (
                    <div key={app.id} className="rounded-xl border-2 border-amber-500/30 bg-amber-500/5 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm font-bold text-foreground">{app.applicantName}</p>
                          <p className="text-xs text-muted-foreground">{app.city}, {app.state}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Submitted {app.dateSubmitted.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                          <p className="text-xs text-muted-foreground">Fee: ₦{formatNum(app.feePaid)}</p>
                        </div>
                        <Badge className="bg-amber-500/15 text-amber-600 text-xs">
                          <Clock className="h-3 w-3 mr-1" /> Pending
                        </Badge>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button
                          onClick={() => setConfirmAction({ app, action: "approve" })}
                          size="sm"
                          className="flex-1 h-10 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 touch-manipulation"
                        >
                          <Check className="h-3.5 w-3.5 mr-1" /> Approve
                        </Button>
                        <Button
                          onClick={() => setConfirmAction({ app, action: "decline" })}
                          size="sm"
                          variant="outline"
                          className="flex-1 h-10 rounded-xl text-xs font-semibold border-destructive/30 text-destructive hover:bg-destructive/5 touch-manipulation"
                        >
                          <X className="h-3.5 w-3.5 mr-1" /> Decline
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {processedApps.length > 0 && (
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 px-1">Processed</p>
                <div className="space-y-2">
                  {processedApps.map(app => (
                    <div key={app.id} className="rounded-xl border border-border/50 bg-card p-3.5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-foreground">{app.applicantName}</p>
                          <p className="text-xs text-muted-foreground">{app.city}, {app.state} • {app.dateSubmitted.toLocaleDateString("en-NG", { day: "numeric", month: "short" })}</p>
                        </div>
                        <Badge className={`text-xs h-5 px-2 ${app.status === "approved" ? "bg-emerald-500/15 text-emerald-600" : "bg-destructive/15 text-destructive"}`}>
                          {app.status === "approved" ? "Approved" : "Rejected"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {applications.length === 0 && (
              <div className="text-center py-12">
                <p className="text-sm text-muted-foreground">No applications yet</p>
              </div>
            )}
          </TabsContent>

          {/* TAB 3: Settings */}
          <TabsContent value="settings">
            <div className="rounded-xl border border-border/50 bg-card p-4 space-y-4">
              <div>
                <p className="text-sm font-bold text-foreground mb-1">Application Fee</p>
                <p className="text-xs text-muted-foreground mb-3">Set the fee sub-merchants pay to apply for your network (in Naira)</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground">₦</span>
                  <Input
                    type="number"
                    value={appFee}
                    onChange={e => setAppFee(parseInt(e.target.value) || 0)}
                    className="h-12 text-lg font-bold rounded-xl"
                    min={0}
                  />
                </div>
              </div>
              <Button
                onClick={handleSaveFee}
                disabled={isSaving || appFee === subMerchantSettings.applicationFee}
                className="w-full h-11 rounded-xl text-sm font-semibold touch-manipulation active:scale-[0.97]"
              >
                {isSaving ? "Saving..." : "Save Application Fee"}
              </Button>
              {appFee === subMerchantSettings.applicationFee && (
                <p className="text-xs text-muted-foreground text-center">Fee is up to date</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!confirmAction} onOpenChange={(open) => !open && setConfirmAction(null)}>
        <AlertDialogContent className="max-w-[340px] rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base">
              {confirmAction?.action === "approve" ? "Approve Application?" : "Decline Application?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              {confirmAction?.action === "approve"
                ? `${confirmAction?.app.applicantName} will be added as a sub-merchant in your network.`
                : `${confirmAction?.app.applicantName}'s application will be rejected.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-10 rounded-xl text-sm">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAppAction}
              className={`h-10 rounded-xl text-sm ${confirmAction?.action === "approve" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-destructive hover:bg-destructive/90"}`}
            >
              {confirmAction?.action === "approve" ? "Approve" : "Decline"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
