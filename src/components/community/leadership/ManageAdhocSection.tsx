import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { adHocMembers } from "@/data/communityExecutivesData";
import { AddMemberDialog } from "./AddMemberDialog";
import { EditMemberDialog } from "./EditMemberDialog";
import { MemberPreviewDialog } from "../MemberPreviewDialog";
import { LeadershipMemberActionsMenu } from "./LeadershipMemberActionsMenu";
import { Plus, UserCog } from "lucide-react";
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

export function ManageAdhocSection() {
  const { toast } = useToast();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showRemoveAlert, setShowRemoveAlert] = useState(false);
  const [selectedMember, setSelectedMember] = useState<typeof adHocMembers[0] | null>(null);
  const [committeeFilter, setCommitteeFilter] = useState<string>("all");
  const [showMemberPreview, setShowMemberPreview] = useState(false);
  const [previewMember, setPreviewMember] = useState<typeof adHocMembers[0] | null>(null);

  const uniqueDepartments = [...new Set(adHocMembers.map(m => m.adHocDepartment).filter(Boolean))];

  const filteredMembers = committeeFilter === "all" 
    ? adHocMembers 
    : adHocMembers.filter(m => m.adHocDepartment === committeeFilter);

  const handleMemberClick = (member: typeof adHocMembers[0]) => {
    setPreviewMember(member);
    setShowMemberPreview(true);
  };

  const handleEdit = (member: typeof adHocMembers[0]) => {
    setSelectedMember(member);
    setShowEditDialog(true);
  };

  const handleRemove = (member: typeof adHocMembers[0]) => {
    setSelectedMember(member);
    setShowRemoveAlert(true);
  };

  const confirmRemove = () => {
    if (selectedMember) {
      toast({
        title: "Member Removed",
        description: `${selectedMember.name} has been removed from ${selectedMember.committee}`,
      });
      setShowRemoveAlert(false);
      setSelectedMember(null);
    }
  };

  const handleTransfer = (member: typeof adHocMembers[0]) => {
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
          <UserCog className="h-5 w-5 text-primary" />
          <span className="font-semibold text-base">Ad-hoc Committees</span>
          <Badge variant="secondary" className="text-sm">{filteredMembers.length}</Badge>
        </div>
        <Button size="sm" onClick={() => setShowAddDialog(true)} className="h-9">
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>

      {/* Filter Dropdown */}
      <Select value={committeeFilter} onValueChange={setCommitteeFilter}>
        <SelectTrigger className="w-full h-11 text-sm">
          <SelectValue placeholder="Filter by committee" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Committees</SelectItem>
          {uniqueDepartments.map((dept) => (
            <SelectItem key={dept} value={dept}>
              {dept} Committee
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Members List */}
      <div className="space-y-3">
        {filteredMembers.map((member) => (
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
                      {member.committee}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {member.tenure}
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
        committee="adhoc"
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
            <AlertDialogTitle>Remove Committee Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {selectedMember?.name} from {selectedMember?.committee}? 
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