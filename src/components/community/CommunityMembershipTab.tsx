import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Plus, 
  UserPlus, 
  MoreVertical, 
  UserCheck,
  Heart,
  MessageCircle,
  Phone,
  Gift,
  Users as UsersIcon,
  Ban,
  Flag
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { OurPeopleCarousel } from "@/components/community/OurPeopleCarousel";
import { WallStatusCarousel } from "@/components/WallStatusCarousel";
import { ELibrarySection } from "@/components/ELibrarySection";
import { communityPeople } from "@/data/communityPeopleData";
import { wallStatusPosts } from "@/data/posts";

// Profile images
import profile1 from "@/assets/profile-photo.jpg";
import profile2 from "@/assets/profile-sarah-johnson.jpg";
import profile3 from "@/assets/profile-michael-chen.jpg";
import profile4 from "@/assets/profile-emily-davis.jpg";
import profile5 from "@/assets/profile-david-martinez.jpg";
import profile6 from "@/assets/profile-james-wilson.jpg";
import profile7 from "@/assets/profile-lisa-anderson.jpg";
import profile8 from "@/assets/profile-jennifer-taylor.jpg";
import profile9 from "@/assets/profile-robert-brown.jpg";

interface CommunityMember {
  id: string;
  name: string;
  avatar: string;
  gender: "male" | "female";
  memberSince: string;
  mutualFriends?: number;
  isOnline?: boolean;
}

// Mock community members data
const communityMembers: CommunityMember[] = [
  { id: "1", name: "Chief Emeka Okafor", avatar: profile1, gender: "male", memberSince: "2015", mutualFriends: 45, isOnline: true },
  { id: "2", name: "Sarah Johnson", avatar: profile2, gender: "female", memberSince: "2016", mutualFriends: 32, isOnline: true },
  { id: "3", name: "Michael Chen", avatar: profile3, gender: "male", memberSince: "2017", mutualFriends: 28, isOnline: false },
  { id: "4", name: "Emily Davis", avatar: profile4, gender: "female", memberSince: "2018", mutualFriends: 56, isOnline: true },
  { id: "5", name: "David Martinez", avatar: profile5, gender: "male", memberSince: "2016", mutualFriends: 41, isOnline: false },
  { id: "6", name: "James Wilson", avatar: profile6, gender: "male", memberSince: "2019", mutualFriends: 23, isOnline: true },
  { id: "7", name: "Lisa Anderson", avatar: profile7, gender: "female", memberSince: "2017", mutualFriends: 38, isOnline: true },
  { id: "8", name: "Jennifer Taylor", avatar: profile8, gender: "female", memberSince: "2018", mutualFriends: 29, isOnline: false },
  { id: "9", name: "Robert Brown", avatar: profile9, gender: "male", memberSince: "2015", mutualFriends: 67, isOnline: true },
  { id: "10", name: "Dr. Ngozi Eze", avatar: profile2, gender: "female", memberSince: "2015", mutualFriends: 89, isOnline: true },
  { id: "11", name: "Barr. Chidi Nwosu", avatar: profile3, gender: "male", memberSince: "2016", mutualFriends: 52, isOnline: false },
  { id: "12", name: "Mrs. Amaka Johnson", avatar: profile4, gender: "female", memberSince: "2017", mutualFriends: 44, isOnline: true },
];

export function CommunityMembershipTab() {
  // Member filter states
  const [memberGenderFilter, setMemberGenderFilter] = useState<"all" | "men" | "women">("all");
  const [friendRequestStatus, setFriendRequestStatus] = useState<Record<string, boolean>>({});

  // Special Events states
  const [specialEventsFilter, setSpecialEventsFilter] = useState<string>("all");
  const [specialEventsView, setSpecialEventsView] = useState<"normal" | "large">("normal");

  // Birthday states
  const [birthdayFilter, setBirthdayFilter] = useState<string>("today");
  const [birthdayView, setBirthdayView] = useState<"normal" | "large">("normal");

  // E-Library states
  const [eLibraryFilter, setELibraryFilter] = useState<string>("all");

  // Filter members by gender
  const filteredMembers = communityMembers.filter((member) => {
    if (memberGenderFilter === "all") return true;
    if (memberGenderFilter === "men") return member.gender === "male";
    if (memberGenderFilter === "women") return member.gender === "female";
    return true;
  });

  // Handle add friend
  const handleAddFriend = (memberId: string, memberName: string) => {
    setFriendRequestStatus(prev => ({ ...prev, [memberId]: true }));
    toast.success(`Friend request sent to ${memberName}`);
  };

  // Handle member actions
  const handleMemberAction = (action: string, memberName: string) => {
    toast.success(`${action} ${memberName}`);
  };

  // Birthday filter options
  const birthdayFilters = [
    { value: "today", label: "Today", count: 3 },
    { value: "this-week", label: "This Week", count: 20 },
    { value: "next-week", label: "Next Week", count: 26 },
    { value: "last-week", label: "Last Week", count: 18 },
    { value: "last-month", label: "Last Month", count: 82 },
    { value: "this-month", label: "This Month", count: 95 },
    { value: "next-month", label: "Next Month", count: 88 },
  ];

  return (
    <div className="space-y-6 pb-6">
      {/* 1. Our People, Our Strength */}
      <OurPeopleCarousel items={communityPeople} />

      {/* 2. View All Members Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-semibold">View All Members</h2>
        </div>

        {/* Gender Filter Tabs */}
        <div className="flex items-center gap-3">
          <Button
            variant={memberGenderFilter === "men" ? "default" : "outline"}
            size="sm"
            onClick={() => setMemberGenderFilter("men")}
            className="rounded-full"
          >
            Men
          </Button>
          <span className="text-muted-foreground font-medium">|</span>
          <Button
            variant={memberGenderFilter === "women" ? "default" : "outline"}
            size="sm"
            onClick={() => setMemberGenderFilter("women")}
            className="rounded-full"
          >
            Women
          </Button>
          {memberGenderFilter !== "all" && (
            <>
              <span className="text-muted-foreground font-medium">|</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMemberGenderFilter("all")}
                className="text-xs"
              >
                Clear Filter
              </Button>
            </>
          )}
        </div>

        {/* Members Carousel */}
        <div className="relative">
          <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
            {filteredMembers.map((member) => (
              <Card 
                key={member.id} 
                className="flex-shrink-0 w-[140px] sm:w-[160px] p-3 space-y-3 hover:shadow-lg transition-shadow"
              >
                {/* Avatar */}
                <div className="relative mx-auto w-20 h-20 sm:w-24 sm:h-24">
                  <Avatar className="w-full h-full border-2 border-primary/20">
                    <AvatarImage src={member.avatar} alt={member.name} className="object-cover" />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {member.isOnline && (
                    <div className="absolute bottom-1 right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-background" />
                  )}
                </div>

                {/* Name & Info */}
                <div className="text-center space-y-1">
                  <h4 className="font-semibold text-sm truncate" title={member.name}>
                    {member.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Member since {member.memberSince}
                  </p>
                  {member.mutualFriends && (
                    <p className="text-xs text-primary">
                      {member.mutualFriends} mutual friends
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {friendRequestStatus[member.id] ? (
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      className="flex-1 text-xs"
                      disabled
                    >
                      <UserCheck className="h-3 w-3 mr-1" />
                      Sent
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() => handleAddFriend(member.id, member.name)}
                    >
                      <UserPlus className="h-3 w-3 mr-1" />
                      Add Friend
                    </Button>
                  )}
                  
                  {/* Do More Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="outline" className="px-2">
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem onClick={() => handleMemberAction("Following", member.name)}>
                        <UserCheck className="h-4 w-4 mr-2" />
                        Follow
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleMemberAction("Liked", member.name)}>
                        <Heart className="h-4 w-4 mr-2" />
                        Like
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleMemberAction("Chatting with", member.name)}>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Chat
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleMemberAction("Calling", member.name)}>
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleMemberAction("Sending gift to", member.name)}>
                        <Gift className="h-4 w-4 mr-2" />
                        Send Gift
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleMemberAction("Adding to circle", member.name)}>
                        <UsersIcon className="h-4 w-4 mr-2" />
                        Add to Circle
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleMemberAction("Blocked", member.name)}
                        className="text-destructive"
                      >
                        <Ban className="h-4 w-4 mr-2" />
                        Block
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleMemberAction("Reported", member.name)}
                        className="text-destructive"
                      >
                        <Flag className="h-4 w-4 mr-2" />
                        Report
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Create Special Event Posts Button */}
      <button
        onClick={() => toast.info("Special Event Posts feature coming soon!")}
        className="w-full p-4 sm:p-5 bg-card border-2 border-success/30 rounded-lg hover:border-success/50 hover:shadow-md transition-all group"
      >
        <div className="flex items-center justify-center gap-2 text-foreground">
          <span className="font-medium text-sm sm:text-base">Create Special Event Posts</span>
          <Plus className="h-5 w-5 group-hover:scale-110 transition-transform" />
        </div>
      </button>

      {/* 4. Special Events Section */}
      <WallStatusCarousel
        items={wallStatusPosts.slice(0, 8) as any}
        title="Special Events"
        view={specialEventsView}
        filter={specialEventsFilter}
        onViewChange={setSpecialEventsView}
        onFilterChange={setSpecialEventsFilter}
        showViewToggle={true}
        showFilterCounts={true}
      />

      {/* 5. Members' Birthdays Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-semibold">Members' Birthdays</h2>
        </div>

        {/* Birthday Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {birthdayFilters.slice(0, 4).map((filter) => (
            <Button
              key={filter.value}
              variant={birthdayFilter === filter.value ? "default" : "outline"}
              size="sm"
              onClick={() => setBirthdayFilter(filter.value)}
              className="text-xs sm:text-sm"
            >
              {filter.label}
              {filter.count > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {filter.count}
                </Badge>
              )}
            </Button>
          ))}
          
          {/* More Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                ...More
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {birthdayFilters.slice(4).map((filter) => (
                <DropdownMenuItem
                  key={filter.value}
                  onClick={() => setBirthdayFilter(filter.value)}
                >
                  {filter.label} ({filter.count})
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Birthday Posts Carousel */}
        <WallStatusCarousel
          items={wallStatusPosts.slice(8, 16) as any}
          title=""
          view={birthdayView}
          filter="all"
          onViewChange={setBirthdayView}
          onFilterChange={() => {}}
          showViewToggle={false}
          showFilterCounts={false}
        />
      </section>

      {/* 6. Recommended E-Library Contents */}
      <ELibrarySection
        activeFilter={eLibraryFilter}
        onFilterChange={setELibraryFilter}
        title="Recommended E-Library Contents"
      />
    </div>
  );
}
