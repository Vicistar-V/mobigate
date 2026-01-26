import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { executiveMembers } from "@/data/communityExecutivesData";
import { AddMemberDialog } from "./AddMemberDialog";
import { EditMemberDialog } from "./EditMemberDialog";
import { MemberPreviewDialog } from "../MemberPreviewDialog";
import { LeadershipMemberActionsMenu } from "./LeadershipMemberActionsMenu";
import { Plus, Users } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function ManageExecutivesSection() {
  const { toast } = useToast();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showRemoveAlert, setShowRemoveAlert] = useState(false);
  const [selectedMember, setSelectedMember] = useState<typeof executiveMembers[0] | null>(null);
  const [showMemberPreview, setShowMemberPreview] = useState(false);
  const [previewMember, setPreviewMember] = useState<typeof executiveMembers[0] | null>(null);
  
  const executives = executiveMembers.filter(m => m.level === "topmost" || m.level === "deputy" || m.level === "officer");

  const handleMemberClick = (member: typeof executiveMembers[0]) => {
    setPreviewMember(member);
    setShowMemberPreview(true);
  };

  const handleEdit = (member: typeof executiveMembers[0]) => {
    setSelectedMember(member);
    setShowEditDialog(true);
  };

  const handleRemove = (member: typeof executiveMembers[0]) => {
    setSelectedMember(member);
    setShowRemoveAlert(true);
  };

  const confirmRemove = () => {
    if (selectedMember) {
      toast({
        title: "Member Removed",
        description: `${selectedMember.name} has been removed from ${selectedMember.position}`,
      });
      setShowRemoveAlert(false);
      setSelectedMember(null);
    }
  };

  const handleTransfer = (member: typeof executiveMembers[0]) => {
    toast({
      title: "Transfer Initiated",
      description: `Transfer process started for ${member.name}`,
    });
  };

  return (
    <div className="space-y-4 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <span className="font-semibold text-base">Executive Committee</span>
          <Badge variant="secondary" className="text-sm">{executives.length}</Badge>
        </div>
        <Button size="sm" onClick={() => setShowAddDialog(true)} className="h-9">
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>

      {/* Members List */}
      <div className="space-y-3">
        {executives.map((member) => (
          <Card key={member.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <Avatar 
                  className="h-14 w-14 cursor-pointer shrink-0" 
                  onClick={() => handleMemberClick(member)}
                >
                  <AvatarImage src={member.imageUrl} alt={member.name} />
                  <AvatarFallback className="text-lg">{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                {/* Info */}
                <div 
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => handleMemberClick(member)}
                >
                  <h4 className="font-semibold text-base leading-tight">{member.name}</h4>
                  <p className="text-sm text-primary mt-0.5">{member.position}</p>
                  
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {member.tenure}
                    </Badge>
                    <Badge 
                      variant={member.level === "topmost" ? "default" : "secondary"}
                      className="text-xs capitalize"
                    >
                      {member.level}
                    </Badge>
                  </div>
                </div>

                {/* Actions Menu - Comprehensive with all member actions */}
                <LeadershipMemberActionsMenu
                  member={member}
                  onEdit={handleEdit}
                  onRemove={handleRemove}
                  onTransfer={handleTransfer}
                  showAdminActions={true}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AddMemberDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
        committee="executive"
      />

      {selectedMember && (
        <EditMemberDialog 
          open={showEditDialog} 
          onOpenChange={setShowEditDialog}
          member={selectedMember}
        />
      )}

      <MemberPreviewDialog
        member={previewMember}
        open={showMemberPreview}
        onOpenChange={setShowMemberPreview}
      />

      <AlertDialog open={showRemoveAlert} onOpenChange={setShowRemoveAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Executive Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {selectedMember?.name} from {selectedMember?.position}? 
              This action will be logged in the change history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemove} className="bg-destructive text-destructive-foreground">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}