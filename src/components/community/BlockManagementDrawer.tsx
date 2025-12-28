import { useState, useMemo } from "react";
import { 
  X, Search, Ban, Shield, ShieldOff, Clock, Calendar, 
  User, Users, Globe, Mail, Wifi, Hash, AlertTriangle,
  ChevronRight, MoreVertical, Edit2, Trash2, Plus,
  RefreshCw, Filter, CheckCircle2
} from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { 
  mockOnlineMembers, 
  mockBlockedUsers, 
  mockNonMembers,
  blockDurationOptions,
  commonBlockReasons,
  BlockedUser,
  UserType,
  BlockDuration
} from "@/data/membershipData";
import { useToast } from "@/hooks/use-toast";
import { format, formatDistanceToNow, addDays, addYears, isPast } from "date-fns";

interface BlockManagementDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// User type badge colors and labels
const userTypeBadgeConfig: Record<UserType, { label: string; className: string; icon: typeof User }> = {
  member: { label: "Member", className: "bg-blue-500/20 text-blue-600 dark:text-blue-400", icon: User },
  executive: { label: "Executive", className: "bg-purple-500/20 text-purple-600 dark:text-purple-400", icon: Shield },
  admin: { label: "Admin", className: "bg-amber-500/20 text-amber-600 dark:text-amber-400", icon: Shield },
  guest: { label: "Guest", className: "bg-green-500/20 text-green-600 dark:text-green-400", icon: Users },
  visitor: { label: "Visitor", className: "bg-gray-500/20 text-gray-600 dark:text-gray-400", icon: Globe },
  external: { label: "External", className: "bg-red-500/20 text-red-600 dark:text-red-400", icon: AlertTriangle },
};

export function BlockManagementDrawer({ open, onOpenChange }: BlockManagementDrawerProps) {
  const [activeTab, setActiveTab] = useState("blocked");
  const [searchQuery, setSearchQuery] = useState("");
  const [blockReason, setBlockReason] = useState("");
  const [selectedDuration, setSelectedDuration] = useState<BlockDuration>("30d");
  const [blockType, setBlockType] = useState<"member" | "non-member">("member");
  const [nonMemberBlockType, setNonMemberBlockType] = useState<"email" | "ip" | "guest">("email");
  const [nonMemberInput, setNonMemberInput] = useState("");
  const [selectedReasonPreset, setSelectedReasonPreset] = useState("");
  const [filterUserType, setFilterUserType] = useState<string>("all");
  const [confirmUnblock, setConfirmUnblock] = useState<BlockedUser | null>(null);
  const [editingBlock, setEditingBlock] = useState<BlockedUser | null>(null);
  const { toast } = useToast();

  // Filter blocked users
  const filteredBlockedUsers = useMemo(() => {
    return mockBlockedUsers.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.ipAddress?.includes(searchQuery) ||
        user.guestId?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = filterUserType === "all" || user.userType === filterUserType;
      
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, filterUserType]);

  // Filter members for blocking
  const filteredMembers = useMemo(() => {
    return mockOnlineMembers.filter(member =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Filter non-members for blocking
  const filteredNonMembers = useMemo(() => {
    return mockNonMembers.filter(nm =>
      nm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nm.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nm.ipAddress?.includes(searchQuery) ||
      nm.guestId?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Calculate expiry date based on duration
  const calculateExpiryDate = (duration: BlockDuration): Date | undefined => {
    if (duration === "permanent") return undefined;
    const days = blockDurationOptions.find(d => d.value === duration)?.days;
    if (!days) return undefined;
    return duration === "1yr" ? addYears(new Date(), 1) : addDays(new Date(), days);
  };

  // Handle preset reason selection
  const handlePresetReasonChange = (value: string) => {
    setSelectedReasonPreset(value);
    if (value !== "Other") {
      setBlockReason(value);
    } else {
      setBlockReason("");
    }
  };

  // Handle blocking a member
  const handleBlockMember = (memberName: string, memberId: string) => {
    if (!blockReason.trim()) {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for blocking this user",
        variant: "destructive"
      });
      return;
    }

    const expiryDate = calculateExpiryDate(selectedDuration);
    
    toast({
      title: "User Blocked",
      description: (
        <div className="space-y-1">
          <p className="font-medium">{memberName} has been blocked</p>
          <p className="text-xs text-muted-foreground">
            Duration: {blockDurationOptions.find(d => d.value === selectedDuration)?.label}
            {expiryDate && ` (until ${format(expiryDate, "PPP")})`}
          </p>
        </div>
      ),
    });
    
    // Reset form
    setBlockReason("");
    setSelectedDuration("30d");
    setSelectedReasonPreset("");
  };

  // Handle blocking a non-member
  const handleBlockNonMember = () => {
    if (!nonMemberInput.trim()) {
      toast({
        title: "Input Required",
        description: `Please enter an ${nonMemberBlockType === "email" ? "email address" : nonMemberBlockType === "ip" ? "IP address" : "guest ID"}`,
        variant: "destructive"
      });
      return;
    }

    if (!blockReason.trim()) {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for blocking",
        variant: "destructive"
      });
      return;
    }

    const expiryDate = calculateExpiryDate(selectedDuration);

    toast({
      title: "Non-Member Blocked",
      description: (
        <div className="space-y-1">
          <p className="font-medium">
            {nonMemberBlockType === "email" ? "Email" : nonMemberBlockType === "ip" ? "IP" : "Guest"}: {nonMemberInput}
          </p>
          <p className="text-xs text-muted-foreground">
            Duration: {blockDurationOptions.find(d => d.value === selectedDuration)?.label}
          </p>
        </div>
      ),
    });

    // Reset form
    setNonMemberInput("");
    setBlockReason("");
    setSelectedDuration("30d");
    setSelectedReasonPreset("");
  };

  // Handle unblock confirmation
  const handleUnblockConfirm = () => {
    if (confirmUnblock) {
      toast({
        title: "User Unblocked",
        description: `${confirmUnblock.name} has been unblocked and can now access the community`,
      });
      setConfirmUnblock(null);
    }
  };

  // Handle extend block
  const handleExtendBlock = (user: BlockedUser) => {
    toast({
      title: "Block Extended",
      description: `Block for ${user.name} has been extended by 30 days`,
    });
  };

  // Get time remaining for temporary blocks
  const getTimeRemaining = (expiryDate?: Date): string => {
    if (!expiryDate) return "Permanent";
    if (isPast(expiryDate)) return "Expired";
    return formatDistanceToNow(expiryDate, { addSuffix: true });
  };

  // Render user type badge
  const renderUserTypeBadge = (userType: UserType) => {
    const config = userTypeBadgeConfig[userType];
    const Icon = config.icon;
    return (
      <Badge variant="secondary" className={`${config.className} text-xs gap-1`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh] flex flex-col touch-auto overflow-hidden">
          <DrawerHeader className="border-b pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-destructive/10">
                  <Ban className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <DrawerTitle className="text-lg font-bold">Block Management</DrawerTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Admin control for blocking users
                  </p>
                </div>
              </div>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden min-h-0">
            <div className="px-4 pt-3">
              <TabsList className="w-full grid grid-cols-3 h-auto p-1">
                <TabsTrigger 
                  value="blocked" 
                  className="text-xs py-2 data-[state=active]:bg-destructive/10 data-[state=active]:text-destructive"
                >
                  <ShieldOff className="h-3.5 w-3.5 mr-1.5" />
                  Blocked
                </TabsTrigger>
                <TabsTrigger 
                  value="block-member"
                  className="text-xs py-2 data-[state=active]:bg-destructive/10 data-[state=active]:text-destructive"
                >
                  <User className="h-3.5 w-3.5 mr-1.5" />
                  Member
                </TabsTrigger>
                <TabsTrigger 
                  value="block-nonmember"
                  className="text-xs py-2 data-[state=active]:bg-destructive/10 data-[state=active]:text-destructive"
                >
                  <Globe className="h-3.5 w-3.5 mr-1.5" />
                  Non-Member
                </TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="flex-1 min-h-0 touch-auto">
              <div className="p-4 space-y-4">
                {/* BLOCKED USERS TAB */}
                <TabsContent value="blocked" className="mt-0 space-y-4">
                  {/* Search and Filter */}
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name, email, IP..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-10"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-muted-foreground" />
                      <Select value={filterUserType} onValueChange={setFilterUserType}>
                        <SelectTrigger className="h-8 text-xs flex-1">
                          <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="member">Members</SelectItem>
                          <SelectItem value="executive">Executives</SelectItem>
                          <SelectItem value="admin">Admins</SelectItem>
                          <SelectItem value="guest">Guests</SelectItem>
                          <SelectItem value="visitor">Visitors</SelectItem>
                          <SelectItem value="external">External</SelectItem>
                        </SelectContent>
                      </Select>
                      <Badge variant="secondary" className="text-xs">
                        {filteredBlockedUsers.length} blocked
                      </Badge>
                    </div>
                  </div>

                  {/* Blocked Users List */}
                  {filteredBlockedUsers.length === 0 ? (
                    <div className="text-center py-12">
                      <ShieldOff className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-muted-foreground font-medium">No blocked users</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {searchQuery ? "Try a different search" : "All users have community access"}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredBlockedUsers.map((user, index) => (
                        <Card 
                          key={user.id} 
                          className="overflow-hidden animate-fade-in"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <CardContent className="p-0">
                            {/* User Header */}
                            <div className="p-4 space-y-3">
                              <div className="flex items-start gap-3">
                                <Avatar className="h-11 w-11 border-2 border-destructive/20">
                                  <AvatarImage src={user.avatar} alt={user.name} />
                                  <AvatarFallback className="bg-destructive/10 text-destructive text-sm">
                                    {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                  </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <p className="font-semibold text-sm truncate">{user.name}</p>
                                    {renderUserTypeBadge(user.userType)}
                                  </div>
                                  
                                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground">
                                    {user.email && (
                                      <span className="flex items-center gap-1">
                                        <Mail className="h-3 w-3" />
                                        {user.email}
                                      </span>
                                    )}
                                    {user.ipAddress && (
                                      <span className="flex items-center gap-1">
                                        <Wifi className="h-3 w-3" />
                                        {user.ipAddress}
                                      </span>
                                    )}
                                    {user.guestId && (
                                      <span className="flex items-center gap-1">
                                        <Hash className="h-3 w-3" />
                                        {user.guestId}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setEditingBlock(user)}>
                                      <Edit2 className="h-4 w-4 mr-2" />
                                      Edit Block
                                    </DropdownMenuItem>
                                    {!user.isPermaBan && (
                                      <DropdownMenuItem onClick={() => handleExtendBlock(user)}>
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Extend Block
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem 
                                      onClick={() => setConfirmUnblock(user)}
                                      className="text-destructive focus:text-destructive"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Unblock User
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>

                              {/* Block Details */}
                              <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-muted-foreground flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Blocked {format(user.blockedDate, "PPP")}
                                  </span>
                                  <span className="text-muted-foreground">
                                    By: {user.blockedBy}
                                  </span>
                                </div>
                                
                                <p className="text-xs leading-relaxed">
                                  <span className="font-medium">Reason:</span> {user.reason}
                                </p>

                                <div className="flex items-center justify-between pt-1">
                                  <div className="flex items-center gap-1.5">
                                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                    {user.isPermaBan ? (
                                      <Badge variant="destructive" className="text-xs">
                                        Permanent Ban
                                      </Badge>
                                    ) : (
                                      <span className="text-xs">
                                        Expires {getTimeRemaining(user.expiryDate)}
                                      </span>
                                    )}
                                  </div>
                                  {user.blockCount > 1 && (
                                    <Badge variant="secondary" className="text-xs bg-amber-500/10 text-amber-600">
                                      Blocked {user.blockCount}x
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="border-t bg-muted/30 px-4 py-2 flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="flex-1 h-8 text-xs"
                                onClick={() => setConfirmUnblock(user)}
                              >
                                <ShieldOff className="h-3.5 w-3.5 mr-1.5" />
                                Unblock
                              </Button>
                              {!user.isPermaBan && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="flex-1 h-8 text-xs"
                                  onClick={() => handleExtendBlock(user)}
                                >
                                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                                  Extend
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* BLOCK MEMBER TAB */}
                <TabsContent value="block-member" className="mt-0 space-y-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search members to block..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 h-10"
                    />
                  </div>

                  {/* Block Settings */}
                  <Card>
                    <CardContent className="p-4 space-y-4">
                      {/* Duration Selection */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          Block Duration
                        </Label>
                        <Select 
                          value={selectedDuration} 
                          onValueChange={(v) => setSelectedDuration(v as BlockDuration)}
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {blockDurationOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                <div className="flex items-center gap-2">
                                  {option.value === "permanent" ? (
                                    <Ban className="h-4 w-4 text-destructive" />
                                  ) : (
                                    <Clock className="h-4 w-4" />
                                  )}
                                  {option.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Reason Selection */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Quick Reason</Label>
                        <Select value={selectedReasonPreset} onValueChange={handlePresetReasonChange}>
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Select a reason..." />
                          </SelectTrigger>
                          <SelectContent>
                            {commonBlockReasons.map(reason => (
                              <SelectItem key={reason} value={reason}>
                                {reason}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Custom Reason */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Reason for Blocking <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                          placeholder="Provide detailed reason for blocking this member..."
                          value={blockReason}
                          onChange={(e) => setBlockReason(e.target.value)}
                          rows={3}
                          className="resize-none"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Members List */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Select Member to Block
                      </Label>
                      <Badge variant="secondary" className="text-xs">
                        {filteredMembers.length} members
                      </Badge>
                    </div>

                    <ScrollArea className="h-[40vh]">
                      <div className="space-y-2 pr-2">
                        {filteredMembers.map((member, index) => (
                          <div
                            key={member.id}
                            className="flex items-center gap-3 p-3 rounded-xl border bg-card hover:bg-muted/50 transition-all animate-fade-in"
                            style={{ animationDelay: `${index * 30}ms` }}
                          >
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback className="text-xs">
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-sm truncate">{member.name}</p>
                                {member.isOnline && (
                                  <span className="h-2 w-2 rounded-full bg-green-500" />
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <Badge variant="secondary" className="text-xs h-5">
                                  {member.role}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {member.lastSeen}
                                </span>
                              </div>
                            </div>

                            <Button
                              size="sm"
                              variant="destructive"
                              className="h-8 px-3"
                              onClick={() => handleBlockMember(member.name, member.id)}
                            >
                              <Ban className="h-3.5 w-3.5 mr-1.5" />
                              Block
                            </Button>
                          </div>
                        ))}

                        {filteredMembers.length === 0 && (
                          <div className="text-center py-8 text-muted-foreground">
                            <User className="h-10 w-10 mx-auto mb-2 opacity-30" />
                            <p className="text-sm">No members found</p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </TabsContent>

                {/* BLOCK NON-MEMBER TAB */}
                <TabsContent value="block-nonmember" className="mt-0 space-y-4">
                  {/* Block Type Selection */}
                  <Card>
                    <CardContent className="p-4 space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Block Type</Label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { value: "email", label: "Email", icon: Mail },
                            { value: "ip", label: "IP Address", icon: Wifi },
                            { value: "guest", label: "Guest ID", icon: Hash },
                          ].map(type => (
                            <Button
                              key={type.value}
                              variant={nonMemberBlockType === type.value ? "default" : "outline"}
                              size="sm"
                              className="h-10 flex-col gap-1"
                              onClick={() => {
                                setNonMemberBlockType(type.value as "email" | "ip" | "guest");
                                setNonMemberInput("");
                              }}
                            >
                              <type.icon className="h-4 w-4" />
                              <span className="text-xs">{type.label}</span>
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Input Field */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          {nonMemberBlockType === "email" ? "Email Address" : 
                           nonMemberBlockType === "ip" ? "IP Address" : "Guest ID"}
                          <span className="text-destructive ml-1">*</span>
                        </Label>
                        <Input
                          placeholder={
                            nonMemberBlockType === "email" ? "user@example.com" :
                            nonMemberBlockType === "ip" ? "192.168.1.1" : "GUEST-1234"
                          }
                          value={nonMemberInput}
                          onChange={(e) => setNonMemberInput(e.target.value)}
                          className="h-10"
                        />
                      </div>

                      {/* Duration */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          Block Duration
                        </Label>
                        <Select 
                          value={selectedDuration} 
                          onValueChange={(v) => setSelectedDuration(v as BlockDuration)}
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {blockDurationOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Reason */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Quick Reason</Label>
                        <Select value={selectedReasonPreset} onValueChange={handlePresetReasonChange}>
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Select a reason..." />
                          </SelectTrigger>
                          <SelectContent>
                            {commonBlockReasons.map(reason => (
                              <SelectItem key={reason} value={reason}>
                                {reason}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Reason for Blocking <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                          placeholder="Provide detailed reason..."
                          value={blockReason}
                          onChange={(e) => setBlockReason(e.target.value)}
                          rows={3}
                          className="resize-none"
                        />
                      </div>

                      <Button 
                        className="w-full h-10" 
                        variant="destructive"
                        onClick={handleBlockNonMember}
                      >
                        <Ban className="h-4 w-4 mr-2" />
                        Block {nonMemberBlockType === "email" ? "Email" : nonMemberBlockType === "ip" ? "IP Address" : "Guest"}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Recent Guests/Visitors */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Recent Guests & Visitors
                      </Label>
                      <Badge variant="secondary" className="text-xs">
                        {mockNonMembers.length} users
                      </Badge>
                    </div>

                    <ScrollArea className="h-[30vh]">
                      <div className="space-y-2 pr-2">
                        {filteredNonMembers.map((nm, index) => (
                          <div
                            key={nm.id}
                            className="flex items-center gap-3 p-3 rounded-xl border bg-card hover:bg-muted/50 transition-all animate-fade-in"
                            style={{ animationDelay: `${index * 30}ms` }}
                          >
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-muted text-xs">
                                {nm.userType === "guest" ? "G" : "V"}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-sm truncate">{nm.name}</p>
                                {renderUserTypeBadge(nm.userType)}
                              </div>
                              <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted-foreground">
                                {nm.email && (
                                  <span className="flex items-center gap-1">
                                    <Mail className="h-3 w-3" />
                                    {nm.email}
                                  </span>
                                )}
                                {nm.ipAddress && (
                                  <span className="flex items-center gap-1">
                                    <Wifi className="h-3 w-3" />
                                    {nm.ipAddress}
                                  </span>
                                )}
                                {nm.guestId && (
                                  <span className="flex items-center gap-1">
                                    <Hash className="h-3 w-3" />
                                    {nm.guestId}
                                  </span>
                                )}
                                <span>• {nm.lastActivity}</span>
                              </div>
                            </div>

                            <Button
                              size="sm"
                              variant="destructive"
                              className="h-8 px-3"
                              onClick={() => {
                                if (nm.email) {
                                  setNonMemberBlockType("email");
                                  setNonMemberInput(nm.email);
                                } else if (nm.ipAddress) {
                                  setNonMemberBlockType("ip");
                                  setNonMemberInput(nm.ipAddress);
                                } else if (nm.guestId) {
                                  setNonMemberBlockType("guest");
                                  setNonMemberInput(nm.guestId);
                                }
                              }}
                            >
                              <Ban className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </TabsContent>
              </div>
            </ScrollArea>
          </Tabs>
        </DrawerContent>
      </Drawer>

      {/* Unblock Confirmation Dialog */}
      <AlertDialog open={!!confirmUnblock} onOpenChange={(open) => !open && setConfirmUnblock(null)}>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <ShieldOff className="h-5 w-5 text-destructive" />
              Unblock User?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Are you sure you want to unblock <strong>{confirmUnblock?.name}</strong>?
              </p>
              <p className="text-xs">
                They will regain access to the community immediately.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleUnblockConfirm}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Unblock
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
