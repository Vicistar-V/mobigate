import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { adHocMembers } from "@/data/communityExecutivesData";
import { adhocCommittees } from "@/data/leadershipChangeHistory";
import { AddMemberDialog } from "./AddMemberDialog";
import { EditMemberDialog } from "./EditMemberDialog";
import { Plus, MoreVertical, Pencil, Trash2, ArrowRightLeft, UserCog } from "lucide-react";
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

  const filteredMembers = committeeFilter === "all" 
    ? adHocMembers 
    : adHocMembers.filter(m => m.committee === committeeFilter);

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
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <UserCog className="h-5 w-5 text-primary" />
          <span className="font-medium">Ad-hoc Committees</span>
          <Badge variant="secondary">{filteredMembers.length}</Badge>
        </div>
        <Button size="sm" onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Add Member
        </Button>
      </div>

      <Select value={committeeFilter} onValueChange={setCommitteeFilter}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Filter by committee" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Committees</SelectItem>
          {adhocCommittees.map((committee) => (
            <SelectItem key={committee} value={committee}>
              {committee}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <ScrollArea className="h-[350px]">
        <div className="space-y-2">
          {filteredMembers.map((member) => (
            <Card key={member.id} className="overflow-hidden">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.imageUrl} alt={member.name} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{member.name}</h4>
                    <p className="text-xs text-primary truncate">{member.position}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Badge variant="outline" className="text-xs">
                        {member.committee}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {member.tenure}
                      </Badge>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(member)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleTransfer(member)}>
                        <ArrowRightLeft className="h-4 w-4 mr-2" />
                        Transfer to Executive
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleRemove(member)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

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
