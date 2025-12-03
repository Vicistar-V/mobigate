import { useState } from "react";
import { 
  X, 
  Search, 
  Eye, 
  Check, 
  XCircle, 
  Clock, 
  UserPlus,
  UserMinus,
  RefreshCw,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  FileText,
  Users,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  mockMembershipApplications, 
  mockMembershipManagers,
  mockOnlineMembers,
  MembershipApplication,
  MembershipManager 
} from "@/data/membershipData";

interface ManageMembershipRequestsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isOwner?: boolean;
}

export function ManageMembershipRequestsDialog({ 
  open, 
  onOpenChange,
  isOwner = false
}: ManageMembershipRequestsDialogProps) {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [applications, setApplications] = useState<MembershipApplication[]>(mockMembershipApplications);
  const [managers, setManagers] = useState<MembershipManager[]>(mockMembershipManagers);
  const [selectedApplication, setSelectedApplication] = useState<MembershipApplication | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showAssignManagerDialog, setShowAssignManagerDialog] = useState(false);
  const [selectedNewManager, setSelectedNewManager] = useState("");

  const pendingApplications = applications.filter(app => app.status === "pending");
  const underReviewApplications = applications.filter(app => app.status === "under-review");
  const approvedApplications = applications.filter(app => app.status === "approved");
  const rejectedApplications = applications.filter(app => app.status === "rejected");

  const filterApplications = (apps: MembershipApplication[]) => {
    if (!searchQuery) return apps;
    const query = searchQuery.toLowerCase();
    return apps.filter(app => 
      app.fullName.toLowerCase().includes(query) ||
      app.referenceNumber.toLowerCase().includes(query) ||
      app.email.toLowerCase().includes(query)
    );
  };

  const handleApprove = (applicationId: string) => {
    setApplications(prev => prev.map(app => 
      app.id === applicationId 
        ? { 
            ...app, 
            status: "approved" as const, 
            reviewedAt: new Date(), 
            reviewedBy: "Membership Manager" 
          }
        : app
    ));
    toast({
      title: "Application Approved",
      description: "The membership application has been approved successfully.",
    });
    setShowDetailDialog(false);
  };

  const handleReject = () => {
    if (!selectedApplication || !rejectionReason.trim()) {
      toast({
        title: "Rejection Reason Required",
        description: "Please provide a reason for rejecting this application.",
        variant: "destructive"
      });
      return;
    }

    setApplications(prev => prev.map(app => 
      app.id === selectedApplication.id 
        ? { 
            ...app, 
            status: "rejected" as const, 
            reviewedAt: new Date(), 
            reviewedBy: "Membership Manager",
            rejectionReason: rejectionReason
          }
        : app
    ));
    toast({
      title: "Application Rejected",
      description: "The membership application has been rejected.",
    });
    setShowRejectDialog(false);
    setShowDetailDialog(false);
    setRejectionReason("");
  };

  const handleMarkUnderReview = (applicationId: string) => {
    setApplications(prev => prev.map(app => 
      app.id === applicationId 
        ? { ...app, status: "under-review" as const }
        : app
    ));
    toast({
      title: "Marked Under Review",
      description: "The application has been marked for further review.",
    });
  };

  const handleReconsider = (applicationId: string) => {
    setApplications(prev => prev.map(app => 
      app.id === applicationId 
        ? { 
            ...app, 
            status: "pending" as const, 
            reviewedAt: undefined, 
            reviewedBy: undefined,
            rejectionReason: undefined 
          }
        : app
    ));
    toast({
      title: "Application Reconsidered",
      description: "The application has been reopened for review.",
    });
  };

  const handleRevokeApproval = (applicationId: string) => {
    setApplications(prev => prev.map(app => 
      app.id === applicationId 
        ? { 
            ...app, 
            status: "pending" as const, 
            reviewedAt: undefined, 
            reviewedBy: undefined 
          }
        : app
    ));
    toast({
      title: "Approval Revoked",
      description: "The membership approval has been revoked.",
    });
  };

  const handleAssignManager = () => {
    if (!selectedNewManager) {
      toast({
        title: "Select a Member",
        description: "Please select a member to assign as manager.",
        variant: "destructive"
      });
      return;
    }

    const member = mockOnlineMembers.find(m => m.id === selectedNewManager);
    if (member) {
      const newManager: MembershipManager = {
        id: `mm-${Date.now()}`,
        name: member.name,
        photo: member.avatar,
        assignedDate: new Date(),
        assignedBy: "Community Owner"
      };
      setManagers(prev => [...prev, newManager]);
      toast({
        title: "Manager Assigned",
        description: `${member.name} has been assigned as a Membership Manager.`,
      });
    }
    setShowAssignManagerDialog(false);
    setSelectedNewManager("");
  };

  const handleRemoveManager = (managerId: string) => {
    setManagers(prev => prev.filter(m => m.id !== managerId));
    toast({
      title: "Manager Removed",
      description: "The Membership Manager has been removed.",
    });
  };

  const getStatusBadge = (status: MembershipApplication["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="bg-amber-500/20 text-amber-600">Pending</Badge>;
      case "under-review":
        return <Badge variant="secondary" className="bg-blue-500/20 text-blue-600">Under Review</Badge>;
      case "approved":
        return <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-600">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const ApplicationCard = ({ application }: { application: MembershipApplication }) => (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12 border">
            <AvatarImage src={application.photo} alt={application.fullName} />
            <AvatarFallback>{application.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h4 className="font-semibold text-sm truncate">{application.fullName}</h4>
              {getStatusBadge(application.status)}
            </div>
            
            <p className="text-xs text-muted-foreground font-mono mb-1">
              {application.referenceNumber}
            </p>
            
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(application.submittedAt)}
              </span>
              {application.sponsorName && (
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {application.sponsorName}
                </span>
              )}
              {application.invitationCode && (
                <Badge variant="outline" className="text-xs">Invited</Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => {
              setSelectedApplication(application);
              setShowDetailDialog(true);
            }}
          >
            <Eye className="h-3.5 w-3.5 mr-1" />
            View
          </Button>
          
          {application.status === "pending" && (
            <>
              <Button 
                variant="default" 
                size="sm" 
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                onClick={() => handleApprove(application.id)}
              >
                <Check className="h-3.5 w-3.5 mr-1" />
                Approve
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                className="flex-1"
                onClick={() => {
                  setSelectedApplication(application);
                  setShowRejectDialog(true);
                }}
              >
                <XCircle className="h-3.5 w-3.5 mr-1" />
                Reject
              </Button>
            </>
          )}
          
          {application.status === "pending" && (
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => handleMarkUnderReview(application.id)}
            >
              <Clock className="h-3.5 w-3.5 mr-1" />
              Review
            </Button>
          )}

          {application.status === "under-review" && (
            <>
              <Button 
                variant="default" 
                size="sm" 
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                onClick={() => handleApprove(application.id)}
              >
                <Check className="h-3.5 w-3.5 mr-1" />
                Approve
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                className="flex-1"
                onClick={() => {
                  setSelectedApplication(application);
                  setShowRejectDialog(true);
                }}
              >
                <XCircle className="h-3.5 w-3.5 mr-1" />
                Reject
              </Button>
            </>
          )}

          {application.status === "approved" && (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-destructive border-destructive hover:bg-destructive/10"
              onClick={() => handleRevokeApproval(application.id)}
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              Revoke
            </Button>
          )}

          {application.status === "rejected" && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleReconsider(application.id)}
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              Reconsider
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const ApplicationDetailDialog = () => {
    if (!selectedApplication) return null;

    return (
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] p-0">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>Application Details</DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="max-h-[70vh] px-4 pb-4">
            <div className="space-y-4">
              {/* Applicant Header */}
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <Avatar className="h-16 w-16 border-2">
                  <AvatarImage src={selectedApplication.photo} />
                  <AvatarFallback className="text-lg">
                    {selectedApplication.fullName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{selectedApplication.fullName}</h3>
                  <p className="text-sm font-mono text-muted-foreground">
                    {selectedApplication.referenceNumber}
                  </p>
                  {getStatusBadge(selectedApplication.status)}
                </div>
              </div>

              {/* Contact Information */}
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedApplication.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedApplication.phone}</span>
                  </div>
                  {selectedApplication.cityOfResidence && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedApplication.cityOfResidence}, {selectedApplication.stateOfOrigin}</span>
                    </div>
                  )}
                  {selectedApplication.occupation && (
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedApplication.occupation}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Application Details */}
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">Application Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <div>
                    <Label className="text-xs text-muted-foreground">Date of Birth</Label>
                    <p className="text-sm">{selectedApplication.dateOfBirth || "Not provided"}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Gender</Label>
                    <p className="text-sm capitalize">{selectedApplication.gender}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">How they heard about us</Label>
                    <p className="text-sm capitalize">{selectedApplication.howHeard.replace('-', ' ')}</p>
                  </div>
                  {selectedApplication.sponsorName && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Sponsor/Guarantor</Label>
                      <p className="text-sm">{selectedApplication.sponsorName}</p>
                    </div>
                  )}
                  {selectedApplication.invitationCode && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Invitation Code</Label>
                      <p className="text-sm font-mono">{selectedApplication.invitationCode}</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-xs text-muted-foreground">Submitted</Label>
                    <p className="text-sm">{formatDate(selectedApplication.submittedAt)}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Motivation */}
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Motivation Statement
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedApplication.motivation}
                  </p>
                </CardContent>
              </Card>

              {/* Review Information (if reviewed) */}
              {selectedApplication.reviewedAt && (
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm">Review Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-0">
                    <div>
                      <Label className="text-xs text-muted-foreground">Reviewed By</Label>
                      <p className="text-sm">{selectedApplication.reviewedBy}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Review Date</Label>
                      <p className="text-sm">{formatDate(selectedApplication.reviewedAt)}</p>
                    </div>
                    {selectedApplication.rejectionReason && (
                      <div>
                        <Label className="text-xs text-muted-foreground">Rejection Reason</Label>
                        <p className="text-sm text-destructive">{selectedApplication.rejectionReason}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>

          {/* Action Buttons */}
          {(selectedApplication.status === "pending" || selectedApplication.status === "under-review") && (
            <DialogFooter className="p-4 pt-0 flex-row gap-2">
              <Button 
                variant="default" 
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                onClick={() => handleApprove(selectedApplication.id)}
              >
                <Check className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button 
                variant="destructive" 
                className="flex-1"
                onClick={() => setShowRejectDialog(true)}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    );
  };

  const RejectDialog = () => (
    <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Reject Application</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Please provide a reason for rejecting this application. The applicant will be notified.
          </p>
          <div>
            <Label>Rejection Reason *</Label>
            <Textarea
              placeholder="Enter the reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
              className="mt-2"
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleReject}>
            Confirm Rejection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const AssignManagerDialog = () => (
    <Dialog open={showAssignManagerDialog} onOpenChange={setShowAssignManagerDialog}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Membership Manager</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Select a community member to assign as a Membership Manager.
          </p>
          <div>
            <Label>Select Member</Label>
            <Select value={selectedNewManager} onValueChange={setSelectedNewManager}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Choose a member" />
              </SelectTrigger>
              <SelectContent>
                {mockOnlineMembers
                  .filter(m => !managers.find(mgr => mgr.name === m.name))
                  .map(member => (
                    <SelectItem key={member.id} value={member.id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.name[0]}</AvatarFallback>
                        </Avatar>
                        {member.name}
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setShowAssignManagerDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleAssignManager}>
            Assign Manager
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const Content = () => (
    <>
      <div className="p-4 border-b space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Manage Membership Requests</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onOpenChange(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, reference, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="px-4 pt-2">
          <TabsList className="w-full grid grid-cols-4 h-auto">
            <TabsTrigger value="pending" className="text-xs px-2 py-2 flex-col gap-1">
              <span>Pending</span>
              <Badge variant="secondary" className="text-xs">{pendingApplications.length + underReviewApplications.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="approved" className="text-xs px-2 py-2 flex-col gap-1">
              <span>Approved</span>
              <Badge variant="secondary" className="text-xs">{approvedApplications.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="rejected" className="text-xs px-2 py-2 flex-col gap-1">
              <span>Rejected</span>
              <Badge variant="secondary" className="text-xs">{rejectedApplications.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="managers" className="text-xs px-2 py-2 flex-col gap-1">
              <span>Managers</span>
              <Badge variant="secondary" className="text-xs">{managers.length}</Badge>
            </TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4">
            {/* Pending Tab */}
            <TabsContent value="pending" className="mt-0 space-y-2">
              {filterApplications([...pendingApplications, ...underReviewApplications]).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No pending applications</p>
                </div>
              ) : (
                filterApplications([...pendingApplications, ...underReviewApplications]).map(app => (
                  <ApplicationCard key={app.id} application={app} />
                ))
              )}
            </TabsContent>

            {/* Approved Tab */}
            <TabsContent value="approved" className="mt-0 space-y-2">
              {filterApplications(approvedApplications).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Check className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No approved applications</p>
                </div>
              ) : (
                filterApplications(approvedApplications).map(app => (
                  <ApplicationCard key={app.id} application={app} />
                ))
              )}
            </TabsContent>

            {/* Rejected Tab */}
            <TabsContent value="rejected" className="mt-0 space-y-2">
              {filterApplications(rejectedApplications).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <XCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No rejected applications</p>
                </div>
              ) : (
                filterApplications(rejectedApplications).map(app => (
                  <ApplicationCard key={app.id} application={app} />
                ))
              )}
            </TabsContent>

            {/* Managers Tab */}
            <TabsContent value="managers" className="mt-0 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Membership Managers</h3>
                  <p className="text-xs text-muted-foreground">
                    Users who can approve or reject membership applications
                  </p>
                </div>
                {isOwner && (
                  <Button 
                    size="sm" 
                    onClick={() => setShowAssignManagerDialog(true)}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Assign
                  </Button>
                )}
              </div>

              <Separator />

              {managers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Settings className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No managers assigned</p>
                  {isOwner && (
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setShowAssignManagerDialog(true)}
                    >
                      Assign First Manager
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {managers.map(manager => (
                    <Card key={manager.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12 border">
                              <AvatarImage src={manager.photo} />
                              <AvatarFallback>{manager.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium">{manager.name}</h4>
                              <p className="text-xs text-muted-foreground">
                                Assigned: {formatDate(manager.assignedDate)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                By: {manager.assignedBy}
                              </p>
                            </div>
                          </div>
                          {isOwner && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleRemoveManager(manager.id)}
                            >
                              <UserMinus className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {!isOwner && (
                <p className="text-xs text-center text-muted-foreground italic">
                  Only the Community Owner can assign or remove Membership Managers
                </p>
              )}
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>

      {/* Sub-dialogs */}
      <ApplicationDetailDialog />
      <RejectDialog />
      <AssignManagerDialog />
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[95vh] flex flex-col">
          <Content />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 flex flex-col">
        <Content />
      </DialogContent>
    </Dialog>
  );
}