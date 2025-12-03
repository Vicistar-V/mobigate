import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Switch } from "@/components/ui/switch";
import { ChevronDown, ChevronUp, Upload, X, Eye, Edit, Trash2, Send, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EventItem } from "@/data/eventsData";

interface CreateEventFormProps {
  onEventCreated?: (event: EventItem) => void;
  canPost?: boolean;
  className?: string;
}

export const CreateEventForm = ({ onEventCreated, canPost = true, className }: CreateEventFormProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState<EventItem["eventType"]>("social");
  const [venue, setVenue] = useState("");
  const [venueType, setVenueType] = useState<EventItem["venueType"]>("indoor");
  const [audience, setAudience] = useState<EventItem["audience"]>("public");
  const [sponsorship, setSponsorship] = useState<EventItem["sponsorship"]>("free");
  const [spotlight, setSpotlight] = useState(false);
  const [eventDate, setEventDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [capacity, setCapacity] = useState("");
  const [thumbnail, setThumbnail] = useState<string>("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  if (!canPost) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeThumbnail = () => {
    setThumbnail("");
    setThumbnailFile(null);
  };

  const handlePreview = () => {
    if (!title || !description || !venue || !eventDate) {
      return;
    }
    setIsPreviewMode(true);
  };

  const handleDelete = () => {
    setTitle("");
    setDescription("");
    setEventType("social");
    setVenue("");
    setVenueType("indoor");
    setAudience("public");
    setSponsorship("free");
    setSpotlight(false);
    setEventDate("");
    setEventEndDate("");
    setCapacity("");
    setThumbnail("");
    setThumbnailFile(null);
    setIsPreviewMode(false);
  };

  const handlePublish = () => {
    if (!title || !description || !venue || !eventDate) {
      return;
    }

    const newEvent: EventItem = {
      id: `event-${Date.now()}`,
      title,
      description,
      eventType,
      venue,
      venueType,
      audience,
      sponsorship,
      spotlight,
      date: eventDate,
      endDate: eventEndDate || undefined,
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      rsvpCount: 0,
      capacity: parseInt(capacity) || 100,
      thumbnail: thumbnail || undefined,
      author: "Current User",
      authorProfileImage: "/placeholder.svg",
      authorId: "current-user"
    };

    onEventCreated?.(newEvent);
    handleDelete();
    setIsExpanded(false);
  };

  const getEventTypeDisplay = (type: EventItem["eventType"]) => {
    const map = {
      conference: "Conference",
      workshop: "Workshop",
      meetup: "Meetup",
      celebration: "Celebration",
      fundraiser: "Fundraiser",
      social: "Social"
    };
    return map[type];
  };

  return (
    <Card className={cn("mb-6 border-2 border-primary/30 hover:border-primary/50 transition-all overflow-hidden", className)}>
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <button className="w-full p-4 sm:p-6 text-center hover:bg-accent/50 transition-colors">
            <div className="flex items-center justify-center gap-2">
              <h3 className="text-lg sm:text-xl font-bold text-primary">
                Post Notable Events & Articles Here
              </h3>
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              [Only Admins could Create or Post Events]
            </p>
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="border-t">
            {/* Form Content */}
            {!isPreviewMode ? (
              <div className="p-4 sm:p-6 space-y-4">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="event-title" className="text-sm font-semibold">
                    Event Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="event-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter event title..."
                    className="text-base"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="event-description" className="text-sm font-semibold">
                    Description <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="event-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Write your event description here..."
                    className="min-h-[120px] resize-none text-base"
                  />
                </div>

                {/* Event Type */}
                <div className="space-y-2">
                  <Label htmlFor="event-type" className="text-sm font-semibold">
                    Event Type
                  </Label>
                  <Select value={eventType} onValueChange={(val) => setEventType(val as EventItem["eventType"])}>
                    <SelectTrigger id="event-type" className="text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conference">Conference</SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                      <SelectItem value="meetup">Meetup</SelectItem>
                      <SelectItem value="celebration">Celebration</SelectItem>
                      <SelectItem value="fundraiser">Fundraiser</SelectItem>
                      <SelectItem value="social">Social</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Venue Name */}
                <div className="space-y-2">
                  <Label htmlFor="event-venue" className="text-sm font-semibold">
                    Venue Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="event-venue"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="Enter venue name..."
                    className="text-base"
                  />
                </div>

                {/* Venue Type */}
                <div className="space-y-2">
                  <Label htmlFor="venue-type" className="text-sm font-semibold">
                    Venue Type
                  </Label>
                  <Select value={venueType} onValueChange={(val) => setVenueType(val as EventItem["venueType"])}>
                    <SelectTrigger id="venue-type" className="text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="indoor">Indoor</SelectItem>
                      <SelectItem value="outdoor">Outdoor</SelectItem>
                      <SelectItem value="virtual">Virtual</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Audience */}
                <div className="space-y-2">
                  <Label htmlFor="event-audience" className="text-sm font-semibold">
                    Audience
                  </Label>
                  <Select value={audience} onValueChange={(val) => setAudience(val as EventItem["audience"])}>
                    <SelectTrigger id="event-audience" className="text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="members-only">Members Only</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                      <SelectItem value="families">Families</SelectItem>
                      <SelectItem value="youth">Youth</SelectItem>
                      <SelectItem value="seniors">Seniors</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sponsorship Type */}
                <div className="space-y-2">
                  <Label htmlFor="event-sponsorship" className="text-sm font-semibold">
                    Sponsorship Type
                  </Label>
                  <Select value={sponsorship} onValueChange={(val) => setSponsorship(val as EventItem["sponsorship"])}>
                    <SelectTrigger id="event-sponsorship" className="text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sponsored">Sponsored</SelectItem>
                      <SelectItem value="community-funded">Community Funded</SelectItem>
                      <SelectItem value="free">Free Entry</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Spotlight Toggle */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label htmlFor="event-spotlight" className="text-sm font-semibold">
                      Spotlight Event
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Feature this event prominently
                    </p>
                  </div>
                  <Switch
                    id="event-spotlight"
                    checked={spotlight}
                    onCheckedChange={setSpotlight}
                  />
                </div>

                {/* Event Date */}
                <div className="space-y-2">
                  <Label htmlFor="event-date" className="text-sm font-semibold">
                    Event Date & Time <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="event-date"
                    type="datetime-local"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="text-base"
                  />
                </div>

                {/* Event End Date (Optional) */}
                <div className="space-y-2">
                  <Label htmlFor="event-end-date" className="text-sm font-semibold">
                    End Date & Time (Optional)
                  </Label>
                  <Input
                    id="event-end-date"
                    type="datetime-local"
                    value={eventEndDate}
                    onChange={(e) => setEventEndDate(e.target.value)}
                    className="text-base"
                  />
                </div>

                {/* Capacity */}
                <div className="space-y-2">
                  <Label htmlFor="event-capacity" className="text-sm font-semibold">
                    Capacity
                  </Label>
                  <Input
                    id="event-capacity"
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    placeholder="100"
                    className="text-base"
                  />
                </div>

                {/* Thumbnail Upload */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    Event Thumbnail (Optional)
                  </Label>
                  
                  {thumbnail ? (
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                      <img src={thumbnail} alt="Preview" className="w-full h-full object-cover" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={removeThumbnail}
                        className="absolute top-2 right-2 h-8 w-8"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors bg-muted/30">
                      <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">
                        Click to upload event thumbnail
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 mt-6 pt-4 border-t">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePreview}
                      disabled={!title || !description || !venue || !eventDate}
                      className="gap-1 text-xs sm:text-sm"
                    >
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="truncate">PREVIEW</span>
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleDelete}
                      className="gap-1 text-xs sm:text-sm"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="truncate">DELETE</span>
                    </Button>
                  </div>
                  
                  <Button
                    type="button"
                    onClick={handlePublish}
                    disabled={!title || !description || !venue || !eventDate}
                    className="w-full gap-2"
                  >
                    <Send className="w-4 h-4" />
                    PUBLISH NOW
                  </Button>
                </div>
              </div>
            ) : (
              /* Preview Mode */
              <div className="p-4 sm:p-6 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Preview</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPreviewMode(false)}
                    className="gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    EDIT PREVIEW
                  </Button>
                </div>

                {/* Preview Card */}
                <Card className="border-2 overflow-hidden">
                  {thumbnail && (
                    <div className="aspect-video relative bg-muted">
                      <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
                      {spotlight && (
                        <div className="absolute top-2 left-2">
                          <span className="px-2 py-1 rounded-md bg-primary text-primary-foreground text-xs font-medium">
                            SPOTLIGHT
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-lg leading-tight">{title}</h4>
                      <span className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary whitespace-nowrap capitalize">
                        {getEventTypeDisplay(eventType)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {description}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(eventDate).toLocaleString()}</span>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      📍 {venue} • {venueType}
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
                      <span>0 RSVPs</span>
                      <span>0 views</span>
                      <span>0 likes</span>
                      <span>0 comments</span>
                    </div>
                  </div>
                </Card>

                {/* Action Buttons in Preview */}
                <div className="flex flex-col gap-2 pt-4 border-t">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsPreviewMode(false)}
                      className="gap-1 text-xs sm:text-sm"
                    >
                      <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="truncate">EDIT</span>
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleDelete}
                      className="gap-1 text-xs sm:text-sm"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="truncate">DELETE</span>
                    </Button>
                  </div>
                  
                  <Button
                    type="button"
                    onClick={handlePublish}
                    className="w-full gap-2"
                  >
                    <Send className="w-4 h-4" />
                    PUBLISH NOW
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};