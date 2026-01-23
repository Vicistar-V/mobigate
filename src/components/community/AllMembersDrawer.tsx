import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Users, MessageCircle, UserPlus, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import communityPerson1 from "@/assets/community-person-1.jpg";
import communityPerson2 from "@/assets/community-person-2.jpg";
import communityPerson3 from "@/assets/community-person-3.jpg";
import communityPerson4 from "@/assets/community-person-4.jpg";
import communityPerson5 from "@/assets/community-person-5.jpg";
import communityPerson6 from "@/assets/community-person-6.jpg";
import profile2 from "@/assets/profile-sarah-johnson.jpg";
import profile3 from "@/assets/profile-michael-chen.jpg";
import profile4 from "@/assets/profile-emily-davis.jpg";

interface Member {
  id: string;
  name: string;
  avatar: string;
  role?: string;
  memberSince: string;
  isOnline?: boolean;
  status?: "active" | "inactive" | "suspended";
}

const mockMembers: Member[] = [
  { id: "1", name: "Chief Emeka Okafor", avatar: communityPerson1, role: "President", memberSince: "2015", isOnline: true, status: "active" },
  { id: "2", name: "Dr. Ngozi Eze", avatar: communityPerson2, role: "Vice President", memberSince: "2015", isOnline: true, status: "active" },
  { id: "3", name: "Barr. Chidi Nwosu", avatar: communityPerson3, role: "Secretary", memberSince: "2016", isOnline: false, status: "active" },
  { id: "4", name: "Mrs. Amaka Johnson", avatar: communityPerson4, role: "Treasurer", memberSince: "2017", isOnline: true, status: "active" },
  { id: "5", name: "Engr. Obinna Ibe", avatar: communityPerson5, memberSince: "2018", isOnline: false, status: "active" },
  { id: "6", name: "Ada Okonkwo", avatar: communityPerson6, memberSince: "2019", isOnline: true, status: "active" },
  { id: "7", name: "Sarah Johnson", avatar: profile2, memberSince: "2020", isOnline: true, status: "active" },
  { id: "8", name: "Michael Chen", avatar: profile3, memberSince: "2021", isOnline: false, status: "inactive" },
  { id: "9", name: "Emily Davis", avatar: profile4, memberSince: "2022", isOnline: true, status: "active" },
  { id: "10", name: "James Wilson", avatar: communityPerson1, memberSince: "2023", isOnline: false, status: "active" },
  { id: "11", name: "Lisa Anderson", avatar: communityPerson2, memberSince: "2023", isOnline: true, status: "active" },
  { id: "12", name: "Robert Brown", avatar: communityPerson3, memberSince: "2024", isOnline: true, status: "active" },
];

interface AllMembersDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AllMembersDrawer({ open, onOpenChange }: AllMembersDrawerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  const filteredMembers = mockMembers.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || member.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "active":
        return <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-emerald-50 text-emerald-700 border-emerald-200">Active</Badge>;
      case "inactive":
        return <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-amber-50 text-amber-700 border-amber-200">Inactive</Badge>;
      case "suspended":
        return <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-red-50 text-red-700 border-red-200">Suspended</Badge>;
      default:
        return null;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] p-0 rounded-t-2xl">
        <SheetHeader className="px-4 pt-4 pb-2 border-b sticky top-0 bg-background z-10">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              All Members
              <Badge variant="secondary" className="ml-1">{mockMembers.length}</Badge>
            </SheetTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <Filter className="h-4 w-4 mr-1" />
                  {statusFilter === "all" ? "All" : statusFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Members</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("active")}>Active Only</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>Inactive</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Search */}
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10"
            />
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(85vh-120px)]">
          <div className="p-3 space-y-2">
            {filteredMembers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-10 w-10 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No members found</p>
              </div>
            ) : (
              filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-card border hover:bg-accent/50 transition-colors active:scale-[0.99]"
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {member.isOnline && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-background" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm truncate">{member.name}</p>
                      {getStatusBadge(member.status)}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {member.role ? `${member.role} • ` : ""}Member since {member.memberSince}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
