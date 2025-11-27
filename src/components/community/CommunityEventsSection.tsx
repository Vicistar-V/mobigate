import { useState, useMemo, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { ChevronDown, Eye, MessageSquare, Share2, Heart, Calendar, MapPin, Users, TrendingUp } from "lucide-react";
import { mockEventsData, EventItem } from "@/data/eventsData";
import { formatDistanceToNow } from "date-fns";
import { EventDetailDialog } from "./EventDetailDialog";
import { CreateEventForm } from "./CreateEventForm";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { PremiumAdCardProps } from "@/components/PremiumAdCard";
import React from "react";

const eventTypeFilters = [
  { value: "all", label: "All Events" },
  { value: "conference", label: "Conference" },
  { value: "workshop", label: "Workshop" },
  { value: "meetup", label: "Meetup" },
  { value: "celebration", label: "Celebration" },
  { value: "fundraiser", label: "Fundraiser" },
  { value: "social", label: "Social" },
];

const dateTimeFilters = [
  { value: "all", label: "All Dates" },
  { value: "today", label: "Today" },
  { value: "this-week", label: "This Week" },
  { value: "this-month", label: "This Month" },
  { value: "upcoming", label: "Upcoming" },
  { value: "past", label: "Past Events" },
];

const venueFilters = [
  { value: "all", label: "All Venues" },
  { value: "indoor", label: "Indoor" },
  { value: "outdoor", label: "Outdoor" },
  { value: "virtual", label: "Virtual" },
  { value: "hybrid", label: "Hybrid" },
];

const audienceFilters = [
  { value: "all", label: "All Audiences" },
  { value: "members-only", label: "Members Only" },
  { value: "public", label: "Public" },
  { value: "vip", label: "VIP" },
  { value: "families", label: "Families" },
  { value: "youth", label: "Youth" },
  { value: "seniors", label: "Seniors" },
];

const sponsorshipFilters = [
  { value: "all", label: "All Sponsorship" },
  { value: "sponsored", label: "Sponsored" },
  { value: "community-funded", label: "Community Funded" },
  { value: "free", label: "Free Entry" },
  { value: "paid", label: "Paid" },
];

const spotlightFilters = [
  { value: "all", label: "All" },
  { value: "spotlight", label: "Spotlight Only" },
  { value: "trending", label: "Trending" },
  { value: "most-rsvp", label: "Most RSVP'd" },
  { value: "latest", label: "Latest" },
];

interface CommunityEventsSectionProps {
  className?: string;
  premiumAdSlots?: PremiumAdCardProps[];
  showPeopleYouMayKnow?: boolean;
  canPostEvents?: boolean;
}

export function CommunityEventsSection({ 
  className,
  premiumAdSlots = [],
  showPeopleYouMayKnow = false,
  canPostEvents = true
}: CommunityEventsSectionProps) {
  const [eventTypeFilter, setEventTypeFilter] = useState("all");
  const [dateTimeFilter, setDateTimeFilter] = useState("all");
  const [venueFilter, setVenueFilter] = useState("all");
  const [audienceFilter, setAudienceFilter] = useState("all");
  const [sponsorshipFilter, setSponsorshipFilter] = useState("all");
  const [spotlightFilter, setSpotlightFilter] = useState("all");
  
  // State for event detail dialog
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  
  // State for likes
  const [likedEvents, setLikedEvents] = useState<Set<string>>(new Set());
  const [eventLikes, setEventLikes] = useState<Record<string, number>>({});
  
  // State for pagination
  const [visibleEventsCount, setVisibleEventsCount] = useState(10);
  
  // State for user-created events
  const [userEvents, setUserEvents] = useState<EventItem[]>([]);
  
  // Reset visible count when filters change
  useEffect(() => {
    setVisibleEventsCount(10);
  }, [eventTypeFilter, dateTimeFilter, venueFilter, audienceFilter, sponsorshipFilter, spotlightFilter]);

  // Filter and sort event items
  const filteredEvents = useMemo(() => {
    // Combine user-created events with existing events data
    let filtered = [...userEvents, ...mockEventsData];

    // Event Type filter
    if (eventTypeFilter !== "all") {
      filtered = filtered.filter((item) => item.eventType === eventTypeFilter);
    }

    // Date/Time filter
    if (dateTimeFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const monthEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.date);
        
        switch (dateTimeFilter) {
          case "today":
            return itemDate >= today && itemDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
          case "this-week":
            return itemDate >= now && itemDate <= weekEnd;
          case "this-month":
            return itemDate >= now && itemDate <= monthEnd;
          case "upcoming":
            return itemDate >= now;
          case "past":
            return itemDate < now;
          default:
            return true;
        }
      });
    }

    // Venue Type filter
    if (venueFilter !== "all") {
      filtered = filtered.filter((item) => item.venueType === venueFilter);
    }

    // Audience filter
    if (audienceFilter !== "all") {
      filtered = filtered.filter((item) => item.audience === audienceFilter);
    }

    // Sponsorship filter
    if (sponsorshipFilter !== "all") {
      filtered = filtered.filter((item) => item.sponsorship === sponsorshipFilter);
    }

    // Spotlight filter
    if (spotlightFilter !== "all") {
      switch (spotlightFilter) {
        case "spotlight":
          filtered = filtered.filter((item) => item.spotlight);
          break;
        case "trending":
          filtered = filtered.filter((item) => item.spotlight || item.views > 5000);
          break;
        case "most-rsvp":
          filtered.sort((a, b) => b.rsvpCount - a.rsvpCount);
          break;
        case "latest":
          filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          break;
      }
    }

    return filtered;
  }, [eventTypeFilter, dateTimeFilter, venueFilter, audienceFilter, sponsorshipFilter, spotlightFilter, userEvents]);
  
  // Pagination logic
  const displayedEvents = filteredEvents.slice(0, visibleEventsCount);
  const hasMoreEvents = visibleEventsCount < filteredEvents.length;
  const canCollapseEvents = visibleEventsCount > 10;

  const handleLoadMore = () => {
    setVisibleEventsCount((prev) => Math.min(prev + 10, filteredEvents.length));
  };

  const handleShowLess = () => {
    setVisibleEventsCount(10);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getEventTypeColor = (type: EventItem["eventType"]) => {
    switch (type) {
      case "conference":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
      case "workshop":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400";
      case "meetup":
        return "bg-green-500/10 text-green-600 dark:text-green-400";
      case "celebration":
        return "bg-orange-500/10 text-orange-600 dark:text-orange-400";
      case "fundraiser":
        return "bg-red-500/10 text-red-600 dark:text-red-400";
      case "social":
        return "bg-pink-500/10 text-pink-600 dark:text-pink-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getVenueTypeColor = (type: EventItem["venueType"]) => {
    switch (type) {
      case "indoor":
        return "bg-slate-500/10 text-slate-600 dark:text-slate-400";
      case "outdoor":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
      case "virtual":
        return "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400";
      case "hybrid":
        return "bg-violet-500/10 text-violet-600 dark:text-violet-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // Handler to open event detail dialog
  const handleEventClick = (event: EventItem) => {
    setSelectedEvent(event);
    setDetailOpen(true);
  };

  // Handler for like toggle
  const handleLike = (eventId: string, e?: React.MouseEvent) => {
    e?.stopPropagation(); // Prevent card click
    setLikedEvents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
        setEventLikes(p => ({ ...p, [eventId]: (p[eventId] || mockEventsData.find(n => n.id === eventId)?.likes || 0) - 1 }));
      } else {
        newSet.add(eventId);
        setEventLikes(p => ({ ...p, [eventId]: (p[eventId] || mockEventsData.find(n => n.id === eventId)?.likes || 0) + 1 }));
      }
      return newSet;
    });
  };

  // Handler for share
  const handleShare = async (event: EventItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled or error occurred
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast({ description: "Link copied to clipboard" });
    }
  };

  const handleEventCreated = (event: EventItem) => {
    setUserEvents(prev => [event, ...prev]);
    toast({
      title: "Success!",
      description: "Your event has been published successfully.",
    });
  };

  return (
    <div className={className}>
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Notable Events</h2>
      </div>

      {/* Create Event Form */}
      {canPostEvents && (
        <CreateEventForm 
          onEventCreated={handleEventCreated}
          canPost={canPostEvents}
        />
      )}

      {/* Filter Tabs */}
      <div className="mb-6 space-y-3">
        <div className="flex flex-wrap gap-2">
          {/* Event Type Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <span className="text-sm">
                  {eventTypeFilters.find((f) => f.value === eventTypeFilter)?.label || "Events"}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 bg-background">
              {eventTypeFilters.map((filter) => (
                <DropdownMenuItem
                  key={filter.value}
                  onClick={() => setEventTypeFilter(filter.value)}
                  className={eventTypeFilter === filter.value ? "bg-accent" : ""}
                >
                  {filter.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Date/Time Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <span className="text-sm">
                  {dateTimeFilters.find((f) => f.value === dateTimeFilter)?.label || "Dates/Time"}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 bg-background">
              {dateTimeFilters.map((filter) => (
                <DropdownMenuItem
                  key={filter.value}
                  onClick={() => setDateTimeFilter(filter.value)}
                  className={dateTimeFilter === filter.value ? "bg-accent" : ""}
                >
                  {filter.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Venue Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <span className="text-sm">
                  {venueFilters.find((f) => f.value === venueFilter)?.label || "Venues"}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 bg-background">
              {venueFilters.map((filter) => (
                <DropdownMenuItem
                  key={filter.value}
                  onClick={() => setVenueFilter(filter.value)}
                  className={venueFilter === filter.value ? "bg-accent" : ""}
                >
                  {filter.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Audience Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <span className="text-sm">
                  {audienceFilters.find((f) => f.value === audienceFilter)?.label || "Audience"}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 bg-background">
              {audienceFilters.map((filter) => (
                <DropdownMenuItem
                  key={filter.value}
                  onClick={() => setAudienceFilter(filter.value)}
                  className={audienceFilter === filter.value ? "bg-accent" : ""}
                >
                  {filter.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sponsorship Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <span className="text-sm">
                  {sponsorshipFilters.find((f) => f.value === sponsorshipFilter)?.label || "Sponsorship"}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 bg-background">
              {sponsorshipFilters.map((filter) => (
                <DropdownMenuItem
                  key={filter.value}
                  onClick={() => setSponsorshipFilter(filter.value)}
                  className={sponsorshipFilter === filter.value ? "bg-accent" : ""}
                >
                  {filter.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Spotlight Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <span className="text-sm">
                  {spotlightFilters.find((f) => f.value === spotlightFilter)?.label || "Spotlights"}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 bg-background">
              {spotlightFilters.map((filter) => (
                <DropdownMenuItem
                  key={filter.value}
                  onClick={() => setSpotlightFilter(filter.value)}
                  className={spotlightFilter === filter.value ? "bg-accent" : ""}
                >
                  {filter.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Active Filters Display */}
        {(eventTypeFilter !== "all" || dateTimeFilter !== "all" || venueFilter !== "all" || 
          audienceFilter !== "all" || sponsorshipFilter !== "all" || spotlightFilter !== "all") && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {eventTypeFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {eventTypeFilters.find((f) => f.value === eventTypeFilter)?.label}
              </Badge>
            )}
            {dateTimeFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {dateTimeFilters.find((f) => f.value === dateTimeFilter)?.label}
              </Badge>
            )}
            {venueFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {venueFilters.find((f) => f.value === venueFilter)?.label}
              </Badge>
            )}
            {audienceFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {audienceFilters.find((f) => f.value === audienceFilter)?.label}
              </Badge>
            )}
            {sponsorshipFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {sponsorshipFilters.find((f) => f.value === sponsorshipFilter)?.label}
              </Badge>
            )}
            {spotlightFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {spotlightFilters.find((f) => f.value === spotlightFilter)?.label}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setEventTypeFilter("all");
                setDateTimeFilter("all");
                setVenueFilter("all");
                setAudienceFilter("all");
                setSponsorshipFilter("all");
                setSpotlightFilter("all");
              }}
              className="h-6 text-xs"
            >
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Event Items */}
      <div className="space-y-4">
        {displayedEvents.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No events match your filters.</p>
          </Card>
        ) : (
          displayedEvents.map((event, index) => (
            <React.Fragment key={event.id}>
              <Card 
                className="p-4 sm:p-6 hover:shadow-lg transition-all cursor-pointer active:scale-[0.99]"
                onClick={() => handleEventClick(event)}
              >
                <div className="space-y-3">
                  {/* Header with badges */}
                  <div className="flex flex-wrap items-start gap-2">
                    <Badge className={getEventTypeColor(event.eventType)}>
                      {eventTypeFilters.find((f) => f.value === event.eventType)?.label}
                    </Badge>
                    <Badge className={getVenueTypeColor(event.venueType)}>
                      {event.venueType.charAt(0).toUpperCase() + event.venueType.slice(1)}
                    </Badge>
                    {event.spotlight && (
                      <Badge variant="default" className="gap-1 bg-primary">
                        <TrendingUp className="h-3 w-3" />
                        SPOTLIGHT
                      </Badge>
                    )}
                    <span className="ml-auto text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(event.date), { addSuffix: true })}
                    </span>
                  </div>

                  {/* Title and Description */}
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg text-foreground mb-2">
                      {event.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {event.description}
                    </p>
                  </div>

                  {/* Event Details */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      <span className="line-clamp-1">{event.venue}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      <span>{event.rsvpCount}/{event.capacity} RSVPs</span>
                    </div>
                  </div>

                  {/* Thumbnail for events with images */}
                  {event.thumbnail && (
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                      <img
                        src={event.thumbnail}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Interactive Engagement Bar */}
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleLike(event.id, e)}
                      className={cn(
                        "gap-1.5 hover:bg-accent",
                        likedEvents.has(event.id) && "text-red-500"
                      )}
                    >
                      <Heart className={cn("h-4 w-4", likedEvents.has(event.id) && "fill-current")} />
                      <span>{(eventLikes[event.id] ?? event.likes).toLocaleString()}</span>
                    </Button>
                    
                    <Button variant="ghost" size="sm" className="gap-1.5 hover:bg-accent">
                      <MessageSquare className="h-4 w-4" />
                      <span>{event.comments.toLocaleString()}</span>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleShare(event, e)}
                      className="gap-1.5 hover:bg-accent"
                    >
                      <Share2 className="h-4 w-4" />
                      <span>{event.shares.toLocaleString()}</span>
                    </Button>
                    
                    <div className="ml-auto flex items-center gap-1.5 text-muted-foreground text-sm">
                      <Eye className="h-4 w-4" />
                      <span>{event.views.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Insert premium ad after every 4 event items */}
              {(index + 1) % 4 === 0 && 
               index < displayedEvents.length - 1 && 
               premiumAdSlots.length > 0 && (
                <div className="my-6">
                  <PremiumAdRotation
                    slotId={`events-premium-${Math.floor((index + 1) / 4)}`}
                    ads={[premiumAdSlots[Math.floor((index + 1) / 4) % premiumAdSlots.length]]}
                    context="feed"
                  />
                </div>
              )}

              {/* Insert People You May Know after every 10 event items */}
              {showPeopleYouMayKnow &&
               (index + 1) % 10 === 0 &&
               index < displayedEvents.length - 1 && (
                <div className="my-6">
                  <PeopleYouMayKnow />
                </div>
              )}
            </React.Fragment>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {(hasMoreEvents || canCollapseEvents) && (
        <div className="flex justify-center items-center gap-6 mt-8 mb-4">
          {hasMoreEvents && (
            <Button
              onClick={handleLoadMore}
              variant="outline"
              size="lg"
              className="text-3xl font-bold text-destructive hover:text-destructive hover:bg-destructive/10 border-2 border-destructive/20 px-8 py-6 rounded-xl transition-all active:scale-95"
            >
              ...more
            </Button>
          )}
          {canCollapseEvents && (
            <Button
              onClick={handleShowLess}
              variant="outline"
              size="lg"
              className="text-3xl font-bold text-destructive hover:text-destructive hover:bg-destructive/10 border-2 border-destructive/20 px-8 py-6 rounded-xl transition-all active:scale-95"
            >
              Less...
            </Button>
          )}
        </div>
      )}

      {/* Results count */}
      {displayedEvents.length > 0 && (
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Showing {displayedEvents.length} of {filteredEvents.length} events
          {filteredEvents.length < mockEventsData.length && 
            ` (filtered from ${mockEventsData.length} total)`
          }
        </div>
      )}

      {/* Event Detail Dialog */}
      {selectedEvent && (
        <EventDetailDialog
          open={detailOpen}
          onOpenChange={setDetailOpen}
          event={selectedEvent}
          onLike={handleLike}
          isLiked={likedEvents.has(selectedEvent.id)}
          likeCount={eventLikes[selectedEvent.id] ?? selectedEvent.likes}
        />
      )}
    </div>
  );
}
