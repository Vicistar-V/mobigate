import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Heart, Smile, Quote, Camera, MessageSquare } from "lucide-react";
import { mockLighterMoods, mockMeetings } from "@/data/meetingsData";
import { format } from "date-fns";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { useState } from "react";

export const MeetingLighterMoodsTab = () => {
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [likedMoods, setLikedMoods] = useState<Set<string>>(new Set());

  // Combine lighter moods with meeting data
  const moodsWithMeetings = mockLighterMoods.map((mood) => {
    const meeting = mockMeetings.find((m) => m.id === mood.meetingId);
    return { ...mood, meeting };
  });

  // Filter by type
  const filteredMoods =
    typeFilter === "all"
      ? moodsWithMeetings
      : moodsWithMeetings.filter((m) => m.type === typeFilter);

  const totalPages = Math.ceil(filteredMoods.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedMoods = filteredMoods.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const premiumAdSlots = [
    {
      slotId: "moods-ad-1",
      ads: [
        {
          id: "moods-ad-1",
          advertiser: {
            name: "Team Building Express",
            verified: true,
          },
          content: {
            headline: "Build Stronger Team Connections",
            description: "Fun activities and ice-breakers for your next meeting.",
            ctaText: "Explore Ideas",
            ctaUrl: "https://example.com",
          },
          media: {
            type: "image" as const,
            items: [
              {
                url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
              },
            ],
          },
          layout: "standard" as const,
          duration: 15,
        },
      ],
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "joke":
        return <Smile className="h-4 w-4" />;
      case "quote":
        return <Quote className="h-4 w-4" />;
      case "anecdote":
        return <MessageSquare className="h-4 w-4" />;
      case "photo":
        return <Camera className="h-4 w-4" />;
      default:
        return <Smile className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      joke: "bg-yellow-500/10 text-yellow-500",
      quote: "bg-blue-500/10 text-blue-500",
      anecdote: "bg-purple-500/10 text-purple-500",
      photo: "bg-pink-500/10 text-pink-500",
    };

    return (
      <Badge className={colors[type as keyof typeof colors] || ""}>
        {getTypeIcon(type)}
        <span className="ml-1 capitalize">{type}</span>
      </Badge>
    );
  };

  const handleLike = (moodId: string) => {
    setLikedMoods((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(moodId)) {
        newSet.delete(moodId);
      } else {
        newSet.add(moodId);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Lighter Moods</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Fun moments, jokes, and memorable quotes from meetings
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <Calendar className="h-4 w-4 mr-2" />
            Filter by Date [Day, Month, Year]
          </Button>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={typeFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setTypeFilter("all")}
            >
              All
            </Button>
            <Button
              variant={typeFilter === "joke" ? "default" : "outline"}
              size="sm"
              onClick={() => setTypeFilter("joke")}
            >
              <Smile className="h-3 w-3 mr-1" />
              Jokes
            </Button>
            <Button
              variant={typeFilter === "quote" ? "default" : "outline"}
              size="sm"
              onClick={() => setTypeFilter("quote")}
            >
              <Quote className="h-3 w-3 mr-1" />
              Quotes
            </Button>
            <Button
              variant={typeFilter === "anecdote" ? "default" : "outline"}
              size="sm"
              onClick={() => setTypeFilter("anecdote")}
            >
              <MessageSquare className="h-3 w-3 mr-1" />
              Anecdotes
            </Button>
            <Button
              variant={typeFilter === "photo" ? "default" : "outline"}
              size="sm"
              onClick={() => setTypeFilter("photo")}
            >
              <Camera className="h-3 w-3 mr-1" />
              Photos
            </Button>
          </div>
        </div>
      </Card>

      {/* Moods Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {displayedMoods.map((mood, index) => (
          <div key={mood.id}>
            {index === 3 && (
              <div className="sm:col-span-2 mb-4">
                <PremiumAdRotation 
                  slotId={premiumAdSlots[0].slotId}
                  ads={premiumAdSlots[0].ads}
                />
              </div>
            )}
            <Card className="p-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={mood.memberAvatar} alt={mood.memberName} />
                    <AvatarFallback>{mood.memberName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <h4 className="font-medium text-sm truncate">
                      {mood.memberName}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {format(mood.createdAt, "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
                {getTypeBadge(mood.type)}
              </div>

              {/* Meeting Reference */}
              <p className="text-xs text-muted-foreground mb-3">
                From: {mood.meeting?.name}
              </p>

              {/* Content */}
              <div className="mb-4">
                {mood.mediaUrl && (
                  <div className="mb-3 rounded-lg overflow-hidden">
                    <img
                      src={mood.mediaUrl}
                      alt="Mood content"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}
                <p className="text-sm">{mood.content}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-3 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(mood.id)}
                  className={
                    likedMoods.has(mood.id) ? "text-red-500" : ""
                  }
                >
                  <Heart
                    className={`h-4 w-4 mr-1 ${
                      likedMoods.has(mood.id) ? "fill-current" : ""
                    }`}
                  />
                  {mood.likes + (likedMoods.has(mood.id) ? 1 : 0)}
                </Button>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {displayedMoods.length === 0 && (
        <Card className="p-12 text-center">
          <Smile className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Lighter Moods Found</h3>
          <p className="text-sm text-muted-foreground">
            No lighter moments match your current filter criteria.
          </p>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="flex items-center px-4 text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
