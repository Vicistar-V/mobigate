import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ExecutiveMember } from "@/data/communityExecutivesData";
import { AddToCircleDialog } from "@/components/AddToCircleDialog";
import { MemberContributionsSheet } from "./MemberContributionsSheet";
import { MemberManifestoSheet } from "./MemberManifestoSheet";
import { MemberCommentsSheet } from "./MemberCommentsSheet";
import { MemberReportSheet } from "./MemberReportSheet";
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

  // Action handlers
  const handleViewProfile = () => {
    navigate(`/profile/${member.id}`);
  };

  const handleViewContributions = () => {
    setShowContributions(true);
  };

  const handleViewManifesto = () => {
    setShowManifesto(true);
  };

  const handleAddFriend = () => {
    setIsFriend(true);
    toast({
      title: "Friend Request Sent",
      description: `Friend request sent to ${member.name}`,
    });
  };

  const handleUnfriend = () => {
    setIsFriend(false);
    toast({
      title: "Unfriended",
      description: `You have unfriended ${member.name}`,
    });
  };

  const handleAddToCircle = () => {
    setShowAddToCircle(true);
  };

  const handleSendMessage = () => {
    toast({
      title: "Opening Chat",
      description: `Starting conversation with ${member.name}`,
    });
    // Navigate to chat or open chat drawer
  };

  const handleAddComment = () => {
    setCommentsViewType("add");
    setShowComments(true);
  };

  const handleViewComments = () => {
    setCommentsViewType("view");
    setShowComments(true);
  };

  const handleNewReport = () => {
    setReportViewType("new");
    setShowReport(true);
  };

  const handleViewPendingReports = () => {
    setReportViewType("pending");
    setShowReport(true);
  };

  const handleViewResolvedReports = () => {
    setReportViewType("resolved");
    setShowReport(true);
  };

  const handleViewAbsolvedReports = () => {
    setReportViewType("absolved");
    setShowReport(true);
  };

  const handleBlock = () => {
    setIsBlocked(true);
    toast({
      title: "Member Blocked",
      description: `${member.name} has been blocked`,
    });
  };

  const handleUnblock = () => {
    setIsBlocked(false);
    toast({
      title: "Member Unblocked",
      description: `${member.name} has been unblocked`,
    });
  };

  return (
    <>
      <DropdownMenu modal={true}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-48 z-[100]"
          sideOffset={4}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          {/* View Profile */}
          <DropdownMenuItem onClick={handleViewProfile} className="py-2.5 text-sm">
            <User className="h-4 w-4 mr-2" />
            View Profile
          </DropdownMenuItem>

          {/* Contributions */}
          <DropdownMenuItem onClick={handleViewContributions} className="py-2.5 text-sm">
            <Coins className="h-4 w-4 mr-2" />
            Contributions
          </DropdownMenuItem>

          {/* Manifesto */}
          <DropdownMenuItem onClick={handleViewManifesto} className="py-2.5 text-sm">
            <FileText className="h-4 w-4 mr-2" />
            Manifesto
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Add Friend / Unfriend */}
          {isFriend ? (
            <DropdownMenuItem onClick={handleUnfriend} className="py-2.5 text-sm">
              <UserMinus className="h-4 w-4 mr-2" />
              Unfriend
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={handleAddFriend} className="py-2.5 text-sm">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Friend
            </DropdownMenuItem>
          )}

          {/* Add to Circle */}
          <DropdownMenuItem onClick={handleAddToCircle} className="py-2.5 text-sm">
            <Users className="h-4 w-4 mr-2" />
            Add to Circle
          </DropdownMenuItem>

          {/* Send Message/Chat */}
          <DropdownMenuItem onClick={handleSendMessage} className="py-2.5 text-sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            Message
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Comment Sub-menu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="py-2.5 text-sm">
              <MessageCircle className="h-4 w-4 mr-2" />
              Comment
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-40 z-[110]">
              <DropdownMenuItem onClick={handleAddComment} className="py-2 text-sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                Add
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleViewComments} className="py-2 text-sm">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Report Sub-menu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="py-2.5 text-sm">
              <Flag className="h-4 w-4 mr-2" />
              Report
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-40 z-[110]">
              <DropdownMenuItem onClick={handleNewReport} className="py-2 text-sm text-destructive focus:text-destructive">
                <AlertTriangle className="h-4 w-4 mr-2" />
                New Report
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleViewPendingReports} className="py-2 text-sm">
                <Clock className="h-4 w-4 mr-2 text-yellow-500" />
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleViewResolvedReports} className="py-2 text-sm">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                Resolved
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleViewAbsolvedReports} className="py-2 text-sm">
                <ShieldCheck className="h-4 w-4 mr-2 text-blue-500" />
                Absolved
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          {/* Block / Unblock */}
          {isBlocked ? (
            <DropdownMenuItem onClick={handleUnblock} className="py-2.5 text-sm">
              <ShieldCheck className="h-4 w-4 mr-2 text-green-500" />
              Unblock
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={handleBlock} className="py-2.5 text-sm text-destructive focus:text-destructive">
              <Ban className="h-4 w-4 mr-2" />
              Block
            </DropdownMenuItem>
          )}

          {/* Admin Actions (if enabled) */}
          {showAdminActions && (
            <>
              <DropdownMenuSeparator />
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(member)} className="py-2.5 text-sm">
                  Edit Member
                </DropdownMenuItem>
              )}
              {onTransfer && (
                <DropdownMenuItem onClick={() => onTransfer(member)} className="py-2.5 text-sm">
                  Transfer
                </DropdownMenuItem>
              )}
              {onRemove && (
                <DropdownMenuItem onClick={() => onRemove(member)} className="py-2.5 text-sm text-destructive focus:text-destructive">
                  Remove
                </DropdownMenuItem>
              )}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

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
