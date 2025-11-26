import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Search, Users, Shield, UserCog, User as UserIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Member {
  id: string;
  name: string;
  avatar: string;
  role: "Owner" | "Admin" | "Moderator" | "Member";
  joinDate: string;
  isOnline: boolean;
}

// Mock members data
const mockMembers: Member[] = [
  {
    id: "1",
    name: "Chief Emeka Okafor",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    role: "Owner",
    joinDate: "2015-03-10",
    isOnline: true,
  },
  {
    id: "2",
    name: "Dr. Ngozi Eze",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    role: "Admin",
    joinDate: "2015-05-20",
    isOnline: true,
  },
  {
    id: "3",
    name: "Barr. Chidi Nwosu",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    role: "Admin",
    joinDate: "2016-01-15",
    isOnline: false,
  },
  {
    id: "4",
    name: "Mrs. Amaka Johnson",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    role: "Moderator",
    joinDate: "2017-08-10",
    isOnline: true,
  },
  {
    id: "5",
    name: "Ifeanyi Mbah",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    role: "Member",
    joinDate: "2018-03-22",
    isOnline: false,
  },
];

export function CommunityMembershipTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const filteredMembers = mockMembers.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeVariant = (role: Member["role"]) => {
    switch (role) {
      case "Owner":
        return "default";
      case "Admin":
        return "secondary";
      case "Moderator":
        return "outline";
      default:
        return "outline";
    }
  };

  const getRoleIcon = (role: Member["role"]) => {
    switch (role) {
      case "Owner":
        return <Shield className="h-3 w-3" />;
      case "Admin":
        return <UserCog className="h-3 w-3" />;
      case "Moderator":
        return <Users className="h-3 w-3" />;
      default:
        return <UserIcon className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Stats Card */}
      <Card className="p-4 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Total Members</h3>
            <p className="text-3xl font-bold text-primary">2,847</p>
          </div>
          <Users className="h-12 w-12 text-primary/40" />
        </div>
      </Card>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={roleFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setRoleFilter("all")}
          >
            All
          </Button>
          <Button
            variant={roleFilter === "Owner" ? "default" : "outline"}
            size="sm"
            onClick={() => setRoleFilter("Owner")}
          >
            Owners
          </Button>
          <Button
            variant={roleFilter === "Admin" ? "default" : "outline"}
            size="sm"
            onClick={() => setRoleFilter("Admin")}
          >
            Admins
          </Button>
          <Button
            variant={roleFilter === "Moderator" ? "default" : "outline"}
            size="sm"
            onClick={() => setRoleFilter("Moderator")}
          >
            Moderators
          </Button>
          <Button
            variant={roleFilter === "Member" ? "default" : "outline"}
            size="sm"
            onClick={() => setRoleFilter("Member")}
          >
            Members
          </Button>
        </div>
      </div>

      {/* Members List */}
      <ScrollArea className="h-[600px]">
        <div className="space-y-3">
          {filteredMembers.map((member) => (
            <Card key={member.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {member.isOnline && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-background" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground truncate">{member.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    Member since {new Date(member.joinDate).getFullYear()}
                  </p>
                </div>

                <Badge variant={getRoleBadgeVariant(member.role)} className="flex items-center gap-1">
                  {getRoleIcon(member.role)}
                  {member.role}
                </Badge>
              </div>
            </Card>
          ))}

          {filteredMembers.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p>No members found</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
