import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Users, Clock, Check, X, UserMinus, Loader2,
  UserCheck, Mail, Phone, MapPin, Briefcase, Calendar,
  MessageSquare, User2, Info, ChevronDown, ChevronUp,
} from "lucide-react";
import { useCommunityMembers } from "@/hooks/useCommunity";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  communityId: string;
  communityName: string;
}

function Field({ icon: Icon, label, value }: { icon: any; label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex gap-3">
      <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">{label}</p>
        <p className="text-sm text-foreground">{value}</p>
      </div>
    </div>
  );
}

export function CommunityManagePanel({ communityId, communityName }: Props) {
  const { data, loading, approveApplication, rejectApplication, removeMember } = useCommunityMembers(communityId);
  const [selectedApp, setSelectedApp]   = useState<any | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [expandedMember, setExpandedMember] = useState<string | null>(null);

  const handleApprove = async (appId: string, name: string) => {
    setActionLoading(appId);
    await approveApplication(appId);
    setActionLoading(null);
    setSelectedApp(null);
    toast.success(`${name} approved and added as member`);
  };

  const handleReject = async (appId: string, name: string) => {
    setActionLoading(appId + "_reject");
    await rejectApplication(appId);
    setActionLoading(null);
    setSelectedApp(null);
    toast.success(`${name}'s application rejected`);
  };

  const handleRemove = async (userId: string, name: string) => {
    if (!confirm(`Remove ${name} from the community?`)) return;
    setActionLoading(userId + "_remove");
    await removeMember(userId);
    setActionLoading(null);
    toast.success(`${name} removed`);
  };

  return (
    <>
      {/* Application full-detail dialog */}
      <Dialog open={!!selectedApp} onOpenChange={v => !v && setSelectedApp(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 pt-5 pb-4 border-b">
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User2 className="h-4 w-4 text-primary" />
              </div>
              Membership Application
            </DialogTitle>
            {selectedApp && (
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                Ref: <span className="font-mono text-primary font-medium">{selectedApp.reference_number}</span>
                <span className="text-muted-foreground/50">·</span>
                {new Date(selectedApp.applied_at).toLocaleDateString("en-NG", { dateStyle: "medium" })}
              </p>
            )}
          </DialogHeader>

          {selectedApp && (
            <ScrollArea className="flex-1 overflow-auto">
              <div className="px-6 py-5 space-y-5">
                {/* Avatar + name */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={selectedApp.profile_photo} />
                    <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
                      {(selectedApp.full_name || "U")[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-lg leading-tight">{selectedApp.full_name}</h3>
                    {selectedApp.username && <p className="text-sm text-muted-foreground">@{selectedApp.username}</p>}
                  </div>
                </div>

                <Separator />

                {/* Contact info */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contact Information</p>
                  <div className="grid grid-cols-1 gap-3">
                    <Field icon={Mail}     label="Email"           value={selectedApp.email} />
                    <Field icon={Phone}    label="Phone"           value={selectedApp.phone} />
                    <Field icon={Calendar} label="Date of Birth"   value={selectedApp.date_of_birth ? new Date(selectedApp.date_of_birth).toLocaleDateString("en-NG") : null} />
                    <Field icon={User2}    label="Gender"          value={selectedApp.gender} />
                  </div>
                </div>

                <Separator />

                {/* Location */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Location</p>
                  <div className="grid grid-cols-1 gap-3">
                    <Field icon={MapPin}    label="State of Origin"    value={selectedApp.state_of_origin} />
                    <Field icon={MapPin}    label="City of Residence"  value={selectedApp.city_of_residence} />
                  </div>
                </div>

                <Separator />

                {/* Background */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Background</p>
                  <div className="grid grid-cols-1 gap-3">
                    <Field icon={Briefcase} label="Occupation"     value={selectedApp.occupation} />
                    <Field icon={Info}      label="How Heard"      value={selectedApp.how_heard} />
                    <Field icon={User2}     label="Sponsor/Referrer" value={selectedApp.sponsor_name} />
                    {selectedApp.invite_code && (
                      <Field icon={Info}   label="Invite Code"    value={selectedApp.invite_code} />
                    )}
                  </div>
                </div>

                {/* Motivation */}
                {selectedApp.motivation && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        <MessageSquare className="h-3.5 w-3.5" /> Motivation / Why they want to join
                      </p>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-sm leading-relaxed text-foreground">{selectedApp.motivation}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </ScrollArea>
          )}

          {selectedApp && (
            <DialogFooter className="px-6 py-4 border-t gap-2 flex-row">
              <Button variant="outline" className="flex-1" onClick={() => setSelectedApp(null)} disabled={!!actionLoading}>
                Close
              </Button>
              <Button variant="outline"
                className="flex-1 text-destructive border-destructive/30 hover:bg-destructive/10"
                disabled={!!actionLoading}
                onClick={() => handleReject(selectedApp.id, selectedApp.full_name)}>
                {actionLoading === selectedApp.id + "_reject"
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : <><X className="h-4 w-4 mr-1" /> Reject</>}
              </Button>
              <Button className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={!!actionLoading}
                onClick={() => handleApprove(selectedApp.id, selectedApp.full_name)}>
                {actionLoading === selectedApp.id
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : <><Check className="h-4 w-4 mr-1" /> Approve</>}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* Main panel */}
      <Card className="overflow-hidden border-0 shadow-sm bg-gradient-to-b from-background to-muted/10">
        <CardHeader className="pb-0 pt-5 px-5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-4 w-4 text-primary" />
              </div>
              {communityName}
            </CardTitle>
            <div className="flex gap-2">
              {data && (
                <>
                  <Badge variant="secondary" className="text-xs">
                    <UserCheck className="h-3 w-3 mr-1" />{data.totalMembers} Members
                  </Badge>
                  {data.totalPending > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />{data.totalPending} Pending
                    </Badge>
                  )}
                </>
              )}
            </div>
          </div>
        </CardHeader>

        <Tabs defaultValue={data?.totalPending ? "requests" : "members"}>
          <div className="px-5 mt-3">
            <TabsList className="w-full h-9 bg-muted/60 p-0.5">
              <TabsTrigger value="members"
                className="flex-1 h-8 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <UserCheck className="h-3.5 w-3.5 mr-1.5" /> Members
                {data && <span className="ml-1 opacity-60">({data.totalMembers})</span>}
              </TabsTrigger>
              <TabsTrigger value="requests"
                className="flex-1 h-8 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Clock className="h-3.5 w-3.5 mr-1.5" /> Requests
                {data?.totalPending ? (
                  <span className="ml-1.5 bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 rounded-full">
                    {data.totalPending}
                  </span>
                ) : <span className="ml-1 opacity-60">(0)</span>}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Members */}
          <TabsContent value="members" className="m-0 mt-0">
            {loading ? (
              <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : !data?.members.length ? (
              <div className="text-center py-10">
                <Users className="h-8 w-8 mx-auto text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">No members yet</p>
              </div>
            ) : (
              <ScrollArea className="max-h-72">
                <div className="px-2 py-2 space-y-1">
                  {data.members.map(m => (
                    <div key={m.user_id}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors">
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarImage src={m.profile_photo} />
                        <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">
                          {(m.name || "U")[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate leading-tight">{m.name || m.username}</p>
                        <p className="text-[11px] text-muted-foreground">@{m.username}</p>
                      </div>
                      <Badge
                        className={cn("text-[10px] shrink-0 border-0",
                          m.role === "owner"     ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" :
                          m.role === "admin"     ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" :
                          m.role === "moderator" ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" :
                          "bg-muted text-muted-foreground"
                        )}>
                        {m.role}
                      </Badge>
                      {m.role !== "owner" && (
                        <Button size="icon" variant="ghost"
                          className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive hover:bg-destructive/10"
                          disabled={actionLoading === m.user_id + "_remove"}
                          onClick={() => handleRemove(m.user_id, m.name)}>
                          {actionLoading === m.user_id + "_remove"
                            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            : <UserMinus className="h-3.5 w-3.5" />}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>

          {/* Requests */}
          <TabsContent value="requests" className="m-0 mt-0">
            {loading ? (
              <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : !data?.applications.length ? (
              <div className="text-center py-10">
                <Clock className="h-8 w-8 mx-auto text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">No pending requests</p>
              </div>
            ) : (
              <ScrollArea className="max-h-80">
                <div className="px-2 py-2 space-y-2">
                  {data.applications.map(a => (
                    <div key={a.id}
                      className="rounded-xl border border-border bg-background hover:border-primary/30 hover:shadow-sm transition-all overflow-hidden">
                      <div className="flex items-center gap-3 px-4 py-3">
                        <Avatar className="h-10 w-10 shrink-0">
                          <AvatarImage src={a.profile_photo} />
                          <AvatarFallback className="text-sm font-bold bg-primary/10 text-primary">
                            {(a.full_name || "U")[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{a.full_name}</p>
                          <p className="text-[11px] text-muted-foreground">{a.occupation || a.email}</p>
                          <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                            Applied {new Date(a.applied_at).toLocaleDateString("en-NG", { dateStyle: "medium" })}
                            {a.state_of_origin && <> · {a.state_of_origin}</>}
                          </p>
                        </div>
                        <div className="flex gap-1.5 shrink-0">
                          <Button size="sm" variant="outline"
                            className="h-8 text-xs px-3 text-muted-foreground hover:text-foreground"
                            onClick={() => setSelectedApp(a)}>
                            View
                          </Button>
                        </div>
                      </div>
                      {/* Quick action row */}
                      <div className="px-4 pb-3 flex gap-2">
                        <Button size="sm"
                          className="flex-1 h-7 text-xs bg-green-600 hover:bg-green-700 text-white"
                          disabled={actionLoading === a.id}
                          onClick={() => handleApprove(a.id, a.full_name)}>
                          {actionLoading === a.id
                            ? <Loader2 className="h-3 w-3 animate-spin" />
                            : <><Check className="h-3 w-3 mr-1" /> Approve</>}
                        </Button>
                        <Button size="sm" variant="outline"
                          className="flex-1 h-7 text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
                          disabled={actionLoading === a.id + "_reject"}
                          onClick={() => handleReject(a.id, a.full_name)}>
                          {actionLoading === a.id + "_reject"
                            ? <Loader2 className="h-3 w-3 animate-spin" />
                            : <><X className="h-3 w-3 mr-1" /> Reject</>}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </>
  );
}
