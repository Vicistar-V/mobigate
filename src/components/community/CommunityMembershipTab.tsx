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
import { FeedPost } from "@/components/FeedPost";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { PremiumAdCardProps } from "@/components/PremiumAdCard";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { communityPeople } from "@/data/communityPeopleData";
import { wallStatusPosts, feedPosts } from "@/data/posts";

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
import communityPerson1 from "@/assets/community-person-1.jpg";
import communityPerson2 from "@/assets/community-person-2.jpg";
import communityPerson3 from "@/assets/community-person-3.jpg";
import communityPerson4 from "@/assets/community-person-4.jpg";
import communityPerson5 from "@/assets/community-person-5.jpg";
import communityPerson6 from "@/assets/community-person-6.jpg";
import communityPerson7 from "@/assets/community-person-7.jpg";
import communityPerson8 from "@/assets/community-person-8.jpg";
import banner from "@/assets/profile-banner.jpg";

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
  { id: "1", name: "Chief Emeka Okafor", avatar: communityPerson1, gender: "male", memberSince: "2015", mutualFriends: 45, isOnline: true },
  { id: "2", name: "Sarah Johnson", avatar: profile2, gender: "female", memberSince: "2016", mutualFriends: 32, isOnline: true },
  { id: "3", name: "Michael Chen", avatar: profile3, gender: "male", memberSince: "2017", mutualFriends: 28, isOnline: false },
  { id: "4", name: "Emily Davis", avatar: profile4, gender: "female", memberSince: "2018", mutualFriends: 56, isOnline: true },
  { id: "5", name: "David Martinez", avatar: profile5, gender: "male", memberSince: "2016", mutualFriends: 41, isOnline: false },
  { id: "6", name: "James Wilson", avatar: profile6, gender: "male", memberSince: "2019", mutualFriends: 23, isOnline: true },
  { id: "7", name: "Lisa Anderson", avatar: profile7, gender: "female", memberSince: "2017", mutualFriends: 38, isOnline: true },
  { id: "8", name: "Jennifer Taylor", avatar: profile8, gender: "female", memberSince: "2018", mutualFriends: 29, isOnline: false },
  { id: "9", name: "Robert Brown", avatar: profile9, gender: "male", memberSince: "2015", mutualFriends: 67, isOnline: true },
  { id: "10", name: "Dr. Ngozi Eze", avatar: communityPerson2, gender: "female", memberSince: "2015", mutualFriends: 89, isOnline: true },
  { id: "11", name: "Barr. Chidi Nwosu", avatar: communityPerson3, gender: "male", memberSince: "2016", mutualFriends: 52, isOnline: false },
  { id: "12", name: "Mrs. Amaka Johnson", avatar: communityPerson4, gender: "female", memberSince: "2017", mutualFriends: 44, isOnline: true },
];

// Birthday posts with properly mapped imageUrl and local profile images
  // Premium ad slots for community content feed
  const premiumAdSlots: PremiumAdCardProps[] = [
    {
      id: "premium-membership-feed-1",
      advertiser: {
        name: "Kerex Group Co.,Ltd",
        verified: true,
      },
      content: {
        headline: "Professional Leading Manufacturer of Heavy Equipment",
        description: "Drilling Rig | Air Compressor | Generator - Quality You Can Trust.",
        ctaText: "Get in touch",
        ctaUrl: "https://example.com/kerex",
      },
      media: {
        type: "image" as const,
        items: [{ url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200&q=80" }],
      },
      layout: "standard" as const,
      duration: 15,
    },
    {
      id: "premium-membership-feed-2",
      advertiser: {
        name: "TechStart Business Solutions",
        verified: true,
      },
      content: {
        headline: "Scale Your Business with Cloud Solutions",
        description: "Enterprise-grade tools at startup prices. Get 50% off your first 3 months.",
        ctaText: "Start Free Trial",
        ctaUrl: "https://example.com/techstart",
      },
      media: {
        type: "image" as const,
        items: [{ url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80" }],
      },
      layout: "standard" as const,
      duration: 15,
    },
    {
      id: "premium-membership-feed-3",
      advertiser: {
        name: "Elite Fitness Center",
        verified: true,
      },
      content: {
        headline: "Get Fit, Stay Healthy",
        description: "Join Nigeria's premier fitness destination. First month 50% off!",
        ctaText: "Join Now",
        ctaUrl: "https://example.com/fitness",
      },
      media: {
        type: "carousel" as const,
        items: [
          { url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80", caption: "State-of-the-art equipment" },
          { url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80", caption: "Personal training" },
        ],
      },
      layout: "standard" as const,
      duration: 15,
    },
  ];

  const birthdayPosts = [
  {
    id: "birthday_1",
    title: "Happy Birthday Chief Emeka Okafor! 🎉",
    imageUrl: communityPerson1,
    author: "Chief Emeka Okafor",
    type: "Photo",
    authorImage: communityPerson1,
    timestamp: "Today",
    description: "Celebrating another blessed year of life, wisdom, and leadership!",
    likes: 245,
    comments: 89,
  },
  {
    id: "birthday_2",
    title: "Birthday Celebration - Princess Adaeze 🎂",
    imageUrl: communityPerson2,
    author: "Princess Adaeze",
    type: "Photo",
    authorImage: communityPerson2,
    timestamp: "Today",
    description: "Grateful for another year of God's blessings and grace!",
    likes: 189,
    comments: 67,
  },
  {
    id: "birthday_3",
    title: "Alhaji Musa's Birthday Wishes 🎈",
    imageUrl: communityPerson3,
    author: "Alhaji Musa Ibrahim",
    type: "Photo",
    authorImage: communityPerson3,
    timestamp: "Tomorrow",
    description: "Join me in celebrating another year of Allah's blessings!",
    likes: 156,
    comments: 45,
  },
  {
    id: "birthday_4",
    title: "Pastor Grace Birthday Thanksgiving 🙏",
    imageUrl: communityPerson4,
    author: "Pastor Grace Okonkwo",
    type: "Photo",
    authorImage: communityPerson4,
    timestamp: "This Week",
    description: "Thanksgiving service for another year of ministry and service!",
    likes: 203,
    comments: 78,
  },
  {
    id: "birthday_5",
    title: "Sarah Johnson's Birthday Party 🎊",
    imageUrl: profile2,
    author: "Sarah Johnson",
    type: "Photo",
    authorImage: profile2,
    timestamp: "This Week",
    description: "Join me for a birthday celebration filled with joy and laughter!",
    likes: 167,
    comments: 54,
  },
  {
    id: "birthday_6",
    title: "Michael Chen Birthday Celebration 🎉",
    imageUrl: profile3,
    author: "Michael Chen",
    type: "Photo",
    authorImage: profile3,
    timestamp: "Next Week",
    description: "Celebrating another year around the sun with friends and family!",
    likes: 142,
    comments: 39,
  },
  {
    id: "birthday_7",
    title: "Emily Davis Birthday Wishes 🎂",
    imageUrl: profile4,
    author: "Emily Davis",
    type: "Photo",
    authorImage: profile4,
    timestamp: "Next Week",
    description: "Grateful for all the love and blessings on my special day!",
    likes: 198,
    comments: 71,
  },
  {
    id: "birthday_8",
    title: "James Wilson's Birthday Bash 🎈",
    imageUrl: profile6,
    author: "James Wilson",
    type: "Photo",
    authorImage: profile6,
    timestamp: "Next Week",
    description: "Come celebrate with me as I turn another year older and wiser!",
    likes: 221,
    comments: 92,
  },
  {
    id: "birthday_9",
    title: "Lisa Anderson Birthday Celebration 🎊",
    imageUrl: profile7,
    author: "Lisa Anderson",
    type: "Photo",
    authorImage: profile7,
    timestamp: "Last Week",
    description: "Thank you all for the wonderful birthday wishes and love!",
    likes: 134,
    comments: 48,
  },
  {
    id: "birthday_10",
    title: "Robert Brown's Birthday Celebration 🎉",
    imageUrl: profile9,
    author: "Robert Brown",
    type: "Photo",
    authorImage: profile9,
    timestamp: "Last Month",
    description: "Had an amazing birthday celebration with loved ones!",
    likes: 178,
    comments: 63,
  },
];

// Special events posts with venue/building images from Unsplash
const specialEventPosts = [
  {
    id: "event_1",
    title: "Annual Community Fundraising Gala 2024",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop",
    author: "Community Events Team",
    type: "Photo",
    authorImage: communityPerson5,
    timestamp: "2 days ago",
    description: "Join us for our biggest fundraising event of the year!",
    likes: 342,
    comments: 156,
  },
  {
    id: "event_2",
    title: "Youth Leadership Summit",
    imageUrl: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&auto=format&fit=crop",
    author: "Youth Development Committee",
    type: "Photo",
    authorImage: communityPerson2,
    timestamp: "5 days ago",
    description: "Empowering the next generation of community leaders",
    likes: 289,
    comments: 98,
  },
  {
    id: "event_3",
    title: "Cultural Heritage Festival",
    imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop",
    author: "Cultural Affairs Department",
    type: "Photo",
    authorImage: communityPerson3,
    timestamp: "1 week ago",
    description: "Celebrating our rich cultural diversity and traditions",
    likes: 567,
    comments: 234,
  },
  {
    id: "event_4",
    title: "Community Health & Wellness Fair",
    imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop",
    author: "Health Committee",
    type: "Photo",
    authorImage: communityPerson4,
    timestamp: "1 week ago",
    description: "Free health screenings and wellness resources for all",
    likes: 423,
    comments: 187,
  },
  {
    id: "event_5",
    title: "Annual General Meeting",
    imageUrl: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop",
    author: "Executive Board",
    type: "Photo",
    authorImage: communityPerson1,
    timestamp: "2 weeks ago",
    description: "Review of achievements and planning for the year ahead",
    likes: 198,
    comments: 76,
  },
  {
    id: "event_6",
    title: "Community Sports Day",
    imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop",
    author: "Sports & Recreation Team",
    type: "Photo",
    authorImage: communityPerson6,
    timestamp: "2 weeks ago",
    description: "Friendly competitions and family fun activities",
    likes: 512,
    comments: 203,
  },
  {
    id: "event_7",
    title: "Business Networking Event",
    imageUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop",
    author: "Economic Development Committee",
    type: "Photo",
    authorImage: communityPerson7,
    timestamp: "3 weeks ago",
    description: "Connect with local entrepreneurs and business leaders",
    likes: 367,
    comments: 145,
  },
  {
    id: "event_8",
    title: "Educational Workshop Series",
    imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop",
    author: "Education Committee",
    type: "Photo",
    authorImage: communityPerson8,
    timestamp: "3 weeks ago",
    description: "Skills development and continuing education opportunities",
    likes: 445,
    comments: 167,
  },
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
  const [visibleContentCount, setVisibleContentCount] = useState(4);

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

  // Filter content based on active filter
  const filteredContent = eLibraryFilter === "all" 
    ? feedPosts 
    : feedPosts.filter(post => post.type.toLowerCase() === eLibraryFilter);

  const displayedContent = filteredContent.slice(0, visibleContentCount);

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
                <div className="flex gap-1 w-full overflow-hidden">
                  {friendRequestStatus[member.id] ? (
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      className="flex-1 text-xs min-w-0 overflow-hidden"
                      disabled
                    >
                      <UserCheck className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">Sent</span>
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="flex-1 text-xs min-w-0 overflow-hidden"
                      onClick={() => handleAddFriend(member.id, member.name)}
                    >
                      <UserPlus className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">Add</span>
                    </Button>
                  )}
                  
                  {/* Do More Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="outline" className="px-1.5 flex-shrink-0">
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
          items={specialEventPosts as any}
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
          items={birthdayPosts as any}
          title=""
          view={birthdayView}
          filter="all"
          onViewChange={setBirthdayView}
          onFilterChange={() => {}}
          showViewToggle={false}
          showFilterCounts={false}
          showFilters={false}
        />
      </section>

        {/* 6. Community Content */}
        <ELibrarySection
          activeFilter={eLibraryFilter}
          onFilterChange={setELibraryFilter}
          title="Community Content"
        />

        {/* Community Content Items */}
        <div className="space-y-6">
          {displayedContent.map((post, index) => (
            <div key={post.id}>
              <FeedPost
                id={post.id}
                title={post.title}
                subtitle={post.subtitle}
                description={post.description}
                author={post.author}
                authorProfileImage={post.authorProfileImage}
                userId={post.userId}
                status={post.status}
                views={post.views}
                comments={post.comments}
                likes={post.likes}
                type={post.type}
                imageUrl={post.imageUrl}
              />
              {/* Insert premium ad after every 4 posts */}
              {(index + 1) % 4 === 0 && index < displayedContent.length - 1 && (
                <div className="my-8">
                  <PremiumAdRotation
                    slotId={`membership-feed-premium-${Math.floor((index + 1) / 4)}`}
                    ads={[premiumAdSlots[Math.floor((index + 1) / 4) % premiumAdSlots.length]]}
                    context="feed"
                  />
                </div>
              )}
              {/* Insert People You May Know after every 10 posts */}
              {(index + 1) % 10 === 0 && index < displayedContent.length - 1 && (
                <div className="my-6">
                  <PeopleYouMayKnow />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Load More / Less buttons */}
        {filteredContent.length > visibleContentCount && (
          <div className="flex justify-center mt-4">
            <Button
              variant="link"
              onClick={() => setVisibleContentCount(prev => prev + 4)}
            >
              ...more
            </Button>
          </div>
        )}
        {visibleContentCount > 4 && filteredContent.length > 4 && (
          <div className="flex justify-center">
            <Button 
              variant="link" 
              onClick={() => setVisibleContentCount(4)}
            >
              Less...
            </Button>
          </div>
        )}
    </div>
  );
}
