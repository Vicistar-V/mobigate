import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ExecutiveMember } from "@/data/communityExecutivesData";
import { AddToCircleDialog } from "@/components/AddToCircleDialog";
import { MemberContributionsSheet } from "./MemberContributionsSheet";
import { MemberManifestoSheet } from "./MemberManifestoSheet";
import { MemberCommentsSheet } from "./MemberCommentsSheet";
import { MemberReportSheet } from "./MemberReportSheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MoreVertical,
  User,
  Coins,
  FileText,
  UserPlus,
  UserMinus,
  Users,
  MessageSquare,
  MessageCircle,
  Flag,
  Ban,
  ShieldCheck,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronRight,
  Edit,
  ArrowLeftRight,
  Trash2,
} from "lucide-react";

interface LeadershipMemberActionsMenuProps {
  member: ExecutiveMember;
  onEdit?: (member: ExecutiveMember) => void;
  onRemove?: (member: ExecutiveMember) => void;
  onTransfer?: (member: ExecutiveMember) => void;
  showAdminActions?: boolean;
}

export function LeadershipMemberActionsMenu({
  member,
  onEdit,
  onRemove,
  onTransfer,
  showAdminActions = false,
}: LeadershipMemberActionsMenuProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Drawer state
  const [isOpen, setIsOpen] = useState(false);
  
  // Dialog states
  const [showAddToCircle, setShowAddToCircle] = useState(false);
  const [showContributions, setShowContributions] = useState(false);
  const [showManifesto, setShowManifesto] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportViewType, setReportViewType] = useState<"new" | "pending" | "resolved" | "absolved">("new");
  const [commentsViewType, setCommentsViewType] = useState<"add" | "view">("view");
  
  // Mock states for friend and block status
  const [isFriend, setIsFriend] = useState(member.isFriend ?? false);
  const [isBlocked, setIsBlocked] = useState(false);

  // Close drawer helper
  const closeDrawer = () => setIsOpen(false);

  // Action handlers
  const handleViewProfile = () => {
    closeDrawer();
    navigate(`/profile/${member.id}`);
  };

  const handleViewContributions = () => {
    closeDrawer();
    setShowContributions(true);
  };

  const handleViewManifesto = () => {
    closeDrawer();
    setShowManifesto(true);
  };

  const handleAddFriend = () => {
    setIsFriend(true);
    closeDrawer();
    toast({
      title: "Friend Request Sent",
      description: `Friend request sent to ${member.name}`,
    });
  };

  const handleUnfriend = () => {
    setIsFriend(false);
    closeDrawer();
    toast({
      title: "Unfriended",
      description: `You have unfriended ${member.name}`,
    });
  };

  const handleAddToCircle = () => {
    closeDrawer();
    setShowAddToCircle(true);
  };

  const handleSendMessage = () => {
    closeDrawer();
    // Dispatch custom event to open Mobi-Chat with this member
    window.dispatchEvent(
      new CustomEvent('openChatWithUser', {
        detail: {
          userId: member.id,
          userName: member.name,
        },
      })
    );
    
    toast({
      title: "Opening Chat",
      description: `Starting conversation with ${member.name}`,
    });
  };

  const handleAddComment = () => {
    closeDrawer();
    setCommentsViewType("add");
    setShowComments(true);
  };

  const handleViewComments = () => {
    closeDrawer();
    setCommentsViewType("view");
    setShowComments(true);
  };

  const handleNewReport = () => {
    closeDrawer();
    setReportViewType("new");
    setShowReport(true);
  };

  const handleViewPendingReports = () => {
    closeDrawer();
    setReportViewType("pending");
    setShowReport(true);
  };

  const handleViewResolvedReports = () => {
    closeDrawer();
    setReportViewType("resolved");
    setShowReport(true);
  };

  const handleViewAbsolvedReports = () => {
    closeDrawer();
    setReportViewType("absolved");
    setShowReport(true);
  };

  const handleBlock = () => {
    setIsBlocked(true);
    closeDrawer();
    toast({
      title: "Member Blocked",
      description: `${member.name} has been blocked`,
    });
  };

  const handleUnblock = () => {
    setIsBlocked(false);
    closeDrawer();
    toast({
      title: "Member Unblocked",
      description: `${member.name} has been unblocked`,
    });
  };

  // Admin action handlers
  const handleEdit = () => {
    closeDrawer();
    onEdit?.(member);
  };

  const handleTransfer = () => {
    closeDrawer();
    onTransfer?.(member);
  };

  const handleRemove = () => {
    closeDrawer();
    onRemove?.(member);
  };

  // Action button component for consistent styling
  const ActionButton = ({ 
    icon: Icon, 
    label, 
    onClick, 
    variant = "default",
    iconClassName = ""
  }: { 
    icon: React.ElementType; 
    label: string; 
    onClick: () => void;
    variant?: "default" | "destructive" | "success";
    iconClassName?: string;
  }) => (
    <button
      onClick={onClick}
      className={`flex items-center h-12 w-full gap-3 px-3 text-sm rounded-lg active:bg-muted/80 transition-colors ${
        variant === "destructive" 
          ? "text-destructive hover:bg-destructive/10" 
          : variant === "success"
          ? "text-green-600 hover:bg-green-500/10"
          : "hover:bg-muted/50"
      }`}
    >
      <Icon className={`h-5 w-5 shrink-0 ${iconClassName}`} />
      <span className="flex-1 text-left">{label}</span>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </button>
  );

  // Sub-action button for accordion content
  const SubActionButton = ({ 
    icon: Icon, 
    label, 
    onClick,
    variant = "default",
    iconClassName = ""
  }: { 
    icon: React.ElementType; 
    label: string; 
    onClick: () => void;
    variant?: "default" | "destructive";
    iconClassName?: string;
  }) => (
    <button
      onClick={onClick}
      className={`flex items-center h-11 w-full gap-3 pl-10 pr-3 text-sm rounded-lg active:bg-muted/80 transition-colors ${
        variant === "destructive" 
          ? "text-destructive hover:bg-destructive/10" 
          : "hover:bg-muted/50"
      }`}
    >
      <Icon className={`h-4 w-4 shrink-0 ${iconClassName}`} />
      <span className="flex-1 text-left">{label}</span>
    </button>
  );

  return (
    <>
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="pb-2 border-b">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 shrink-0">
                <AvatarImage src={member.imageUrl} alt={member.name} />
                <AvatarFallback className="text-sm font-medium">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 text-left">
                <DrawerTitle className="text-base truncate">{member.name}</DrawerTitle>
                <p className="text-sm text-muted-foreground truncate">{member.position}</p>
              </div>
            </div>
          </DrawerHeader>

          <ScrollArea className="flex-1 overflow-y-auto touch-auto">
            <div className="p-3 space-y-1">
              {/* Primary Actions */}
              <ActionButton icon={User} label="View Profile" onClick={handleViewProfile} />
              <ActionButton icon={Coins} label="Contributions" onClick={handleViewContributions} />
              <ActionButton icon={FileText} label="Manifesto" onClick={handleViewManifesto} />

              {/* Separator */}
              <div className="h-px bg-border my-2" />

              {/* Social Actions */}
              {isFriend ? (
                <ActionButton icon={UserMinus} label="Unfriend" onClick={handleUnfriend} />
              ) : (
                <ActionButton icon={UserPlus} label="Add Friend" onClick={handleAddFriend} />
              )}
              <ActionButton icon={Users} label="Add to Circle" onClick={handleAddToCircle} />
              <ActionButton icon={MessageSquare} label="Message" onClick={handleSendMessage} />

              {/* Separator */}
              <div className="h-px bg-border my-2" />

              {/* Feedback Accordions */}
              <Accordion type="single" collapsible className="w-full">
                {/* Comment Section */}
                <AccordionItem value="comment" className="border-none">
                  <AccordionTrigger className="flex items-center h-12 w-full gap-3 px-3 text-sm rounded-lg hover:bg-muted/50 hover:no-underline py-0">
                    <MessageCircle className="h-5 w-5 shrink-0 text-foreground" />
                    <span className="flex-1 text-left font-normal">Comment</span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-1 pt-0">
                    <SubActionButton icon={MessageCircle} label="Add Comment" onClick={handleAddComment} />
                    <SubActionButton icon={Eye} label="View All Comments" onClick={handleViewComments} />
                  </AccordionContent>
                </AccordionItem>

                {/* Report Section */}
                <AccordionItem value="report" className="border-none">
                  <AccordionTrigger className="flex items-center h-12 w-full gap-3 px-3 text-sm rounded-lg hover:bg-muted/50 hover:no-underline py-0">
                    <Flag className="h-5 w-5 shrink-0 text-foreground" />
                    <span className="flex-1 text-left font-normal">Report</span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-1 pt-0">
                    <SubActionButton 
                      icon={AlertTriangle} 
                      label="New Report" 
                      onClick={handleNewReport}
                      variant="destructive"
                    />
                    <SubActionButton 
                      icon={Clock} 
                      label="Pending Reports" 
                      onClick={handleViewPendingReports}
                      iconClassName="text-yellow-500"
                    />
                    <SubActionButton 
                      icon={CheckCircle} 
                      label="Resolved Reports" 
                      onClick={handleViewResolvedReports}
                      iconClassName="text-green-500"
                    />
                    <SubActionButton 
                      icon={ShieldCheck} 
                      label="Absolved Reports" 
                      onClick={handleViewAbsolvedReports}
                      iconClassName="text-blue-500"
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Separator */}
              <div className="h-px bg-border my-2" />

              {/* Block / Unblock */}
              {isBlocked ? (
                <ActionButton 
                  icon={ShieldCheck} 
                  label="Unblock" 
                  onClick={handleUnblock}
                  variant="success"
                  iconClassName="text-green-500"
                />
              ) : (
                <ActionButton 
                  icon={Ban} 
                  label="Block" 
                  onClick={handleBlock}
                  variant="destructive"
                />
              )}

              {/* Admin Actions */}
              {showAdminActions && (onEdit || onTransfer || onRemove) && (
                <>
                  <div className="h-px bg-border my-2" />
                  <p className="text-xs font-medium text-muted-foreground px-3 py-1.5">Admin Actions</p>
                  {onEdit && (
                    <ActionButton icon={Edit} label="Edit Member" onClick={handleEdit} />
                  )}
                  {onTransfer && (
                    <ActionButton icon={ArrowLeftRight} label="Transfer" onClick={handleTransfer} />
                  )}
                  {onRemove && (
                    <ActionButton 
                      icon={Trash2} 
                      label="Remove Member" 
                      onClick={handleRemove}
                      variant="destructive"
                    />
                  )}
                </>
              )}

              {/* Bottom padding for safe area */}
              <div className="h-6" />
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>

      {/* Dialogs and Sheets */}
      <AddToCircleDialog
        open={showAddToCircle}
        onOpenChange={setShowAddToCircle}
        userName={member.name}
      />

      <MemberContributionsSheet
        open={showContributions}
        onOpenChange={setShowContributions}
        member={member}
      />

      <MemberManifestoSheet
        open={showManifesto}
        onOpenChange={setShowManifesto}
        member={member}
      />

      <MemberCommentsSheet
        open={showComments}
        onOpenChange={setShowComments}
        member={member}
        viewType={commentsViewType}
      />

      <MemberReportSheet
        open={showReport}
        onOpenChange={setShowReport}
        member={member}
        viewType={reportViewType}
      />
    </>
  );
}
