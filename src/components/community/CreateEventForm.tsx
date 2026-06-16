import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Switch } from "@/components/ui/switch";
import { ChevronDown, ChevronUp, Upload, X, Eye, Edit, Trash2, Send, Calendar, ImagePlus, Video, Image, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EventItem } from "@/data/eventsData";
import { MediaUploadDialog } from "./MediaUploadDialog";
import { LegalCopyrightAcceptance } from "@/components/common/LegalCopyrightAcceptance";
import { toast } from "sonner";

interface CreateEventFormProps {
  communityId?: string;
  onEventCreated?: (event: EventItem) => void;
  onRefresh?: () => void;
  canPost?: boolean;
  className?: string;
}

interface MediaFile {
  url: string;
  type: "image" | "video";
}

export const CreateEventForm = ({ communityId, onEventCreated, onRefresh, canPost = true, className }: CreateEventFormProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState<EventItem["eventType"]>("social");
  const [venue, setVenue] = useState("");
  const [venueType, setVenueType] = useState<EventItem["venueType"]>("indoor");
  const [platformVenue, setPlatformVenue] = useState<"mobi-meeting" | "zoom-meeting" | "other">("mobi-meeting");
  const [customPlatformVenue, setCustomPlatformVenue] = useState("");
  const [venueAddress, setVenueAddress] = useState("");
  const [audience, setAudience] = useState<EventItem["audience"]>("public");
  const [sponsorship, setSponsorship] = useState<EventItem["sponsorship"]>("free");
  const [spotlight, setSpotlight] = useState(false);
  const [eventDate, setEventDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [capacity, setCapacity] = useState("");
  const [thumbnail, setThumbnail] = useState<string>("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  
  // Additional media state
  const [additionalMedia, setAdditionalMedia] = useState<MediaFile[]>([]);
  const [showMediaUpload, setShowMediaUpload] = useState(false);

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

  const handleMediaUploadComplete = (files: Array<{ url: string; type: "image" | "video" }>) => {
    setAdditionalMedia(prev => [...prev, ...files]);
    setShowMediaUpload(false);
  };

  const handleRemoveAdditionalMedia = (index: number) => {
    setAdditionalMedia(prev => prev.filter((_, i) => i !== index));
  };

  const handlePreview = () => {
    if (!title || !description || !venue || !eventDate) {
      toast.error("Please fill in all required fields");
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
    setPlatformVenue("mobi-meeting");
    setCustomPlatformVenue("");
    setVenueAddress("");
    setAudience("public");
    setSponsorship("free");
    setSpotlight(false);
    setEventDate("");
    setEventEndDate("");
    setCapacity("");
    setThumbnail("");
    setThumbnailFile(null);
    setAdditionalMedia([]);
    setIsPreviewMode(false);
  };

  const handlePublish = async () => {
    if (!title || !description || !venue || !eventDate) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!legalAccepted) {
      toast.error("Please accept the legal & copyright terms to continue");
      return;
    }
    if (!communityId) { toast.error("Community not found"); return; }
    setIsSubmitting(true);
    try {
      // Upload thumbnail if file selected
      let uploadedThumbUrl = thumbnail;
      if (thumbnailFile) {
        const fd = new FormData();
        fd.append("file", thumbnailFile);
        fd.append("community_id", communityId);
        const upRes = await fetch("/api/community/upload_post_media.php", {
          method: "POST", credentials: "include", body: fd,
        });
        if (upRes.ok) {
          const upData = await upRes.json();
          uploadedThumbUrl = upData.url || thumbnail;
        }
      }

      const res = await fetch("/api/community/content.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action:       "create",
          community_id: communityId,
          type:         "event",
          title,
          content:      description,
          thumbnail:    uploadedThumbUrl || "",
          status:       "pending",
          eventDate,
          eventEndDate: eventEndDate || "",
          venue,
          venueType,
          capacity:     parseInt(capacity) || 100,
          spotlight:    spotlight ? 1 : 0,
        }),
      });

      if (!res.ok) throw new Error("Failed");
      const data = await res.json();

      const newEvent: EventItem = {
        id:                 data.id || `event-${Date.now()}`,
        title, description, eventType, venue, venueType,
        audience, sponsorship, spotlight,
        date:               eventDate,
        endDate:            eventEndDate || undefined,
        views: 0, likes: 0, comments: 0, shares: 0,
        rsvpCount:          0,
        capacity:           parseInt(capacity) || 100,
        thumbnail:          uploadedThumbUrl || undefined,
        author:             "You",
        authorProfileImage: "/placeholder.svg",
        authorId:           "me",
      };

      onEventCreated?.(newEvent);
      onRefresh?.();
      toast.success("Event submitted! Pending admin approval.");
      handleDelete();
      setIsExpanded(false);
    } catch {
      toast.error("Failed to post event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
    <>
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

                  {/* Meeting Mode */}
                  <div className="space-y-2">
                    <Label htmlFor="meeting-mode" className="text-sm font-semibold">
                      Meeting Mode
                    </Label>
                    <Select value={venueType} onValueChange={(val) => setVenueType(val as EventItem["venueType"])}>
                      <SelectTrigger id="meeting-mode" className="text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="outdoor">Outdoor</SelectItem>
                        <SelectItem value="indoor">Indoor</SelectItem>
                        <SelectItem value="virtual">Virtual</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Platform/Venue */}
                  <div className="space-y-2">
                    <Label htmlFor="platform-venue" className="text-sm font-semibold">
                      Platform/Venue <span className="text-destructive">*</span>
                    </Label>
                    <Select 
                      value={platformVenue} 
                      onValueChange={(val) => {
                        const v = val as "mobi-meeting" | "zoom-meeting" | "other";
                        setPlatformVenue(v);
                        if (v === "mobi-meeting") {
                          setVenue("Mobi-Meeting");
                        } else if (v === "zoom-meeting") {
                          setVenue("Zoom Meeting");
                        } else {
                          setVenue(customPlatformVenue);
                        }
                      }}
                    >
                      <SelectTrigger id="platform-venue" className="text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mobi-meeting">Mobi-Meeting</SelectItem>
                        <SelectItem value="zoom-meeting">Zoom Meeting</SelectItem>
                        <SelectItem value="other">Other - Specify</SelectItem>
                      </SelectContent>
                    </Select>
                    {platformVenue === "other" && (
                      <Input
                        value={customPlatformVenue}
                        onChange={(e) => {
                          setCustomPlatformVenue(e.target.value);
                          setVenue(e.target.value);
                        }}
                        placeholder="Enter platform or venue name..."
                        className="text-base mt-2"
                      />
                    )}
                  </div>

                  {/* Conditional Venue Address - Only for Indoor or Outdoor */}
                  {(venueType === "indoor" || venueType === "outdoor") && (
                    <div className="space-y-2">
                      <Label htmlFor="venue-address" className="text-sm font-semibold">
                        Venue Address
                      </Label>
                      <Input
                        id="venue-address"
                        value={venueAddress}
                        onChange={(e) => setVenueAddress(e.target.value)}
                        placeholder="Enter venue address..."
                        className="text-base"
                      />
                    </div>
                  )}

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

                  {/* Additional Media Gallery */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">
                      Additional Event Media (Optional)
                    </Label>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowMediaUpload(true)}
                      className="w-full gap-2"
                    >
                      <ImagePlus className="w-4 h-4" />
                      Add More Photos/Videos
                    </Button>

                    {/* Additional Media Preview Grid */}
                    {additionalMedia.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {additionalMedia.map((media, index) => (
                          <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted group">
                            {media.type === "video" ? (
                              <>
                                <video
                                  src={media.url}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                  <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                                    <Play className="h-4 w-4 text-primary fill-primary" />
                                  </div>
                                </div>
                              </>
                            ) : (
                              <img
                                src={media.url}
                                alt={`Media ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            )}
                            <button
                              onClick={() => handleRemoveAdditionalMedia(index)}
                              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                            <div className="absolute bottom-1 left-1">
                              <span className="px-1 py-0.5 rounded text-[9px] font-medium bg-black/60 text-white flex items-center gap-0.5">
                                {media.type === "video" ? <Video className="h-2.5 w-2.5" /> : <Image className="h-2.5 w-2.5" />}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
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
                    
                    <LegalCopyrightAcceptance accepted={legalAccepted} onAcceptedChange={setLegalAccepted} />
                    <Button
                      type="button"
                      onClick={handlePublish}
                      disabled={!title || !description || !venue || !eventDate || isSubmitting}
                      className="w-full gap-2"
                    >
                      {isSubmitting
                        ? <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                        : <Send className="w-4 h-4" />}
                      {isSubmitting ? "Posting..." : "PUBLISH NOW"}
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

                      {/* Additional Media Gallery in Preview */}
                      {additionalMedia.length > 0 && (
                        <div className="pt-3 border-t">
                          <p className="text-xs text-muted-foreground mb-2">Event Gallery ({additionalMedia.length})</p>
                          <div className="grid grid-cols-4 gap-1">
                            {additionalMedia.slice(0, 4).map((media, index) => (
                              <div key={index} className="relative aspect-square rounded overflow-hidden bg-muted">
                                {media.type === "video" ? (
                                  <>
                                    <video src={media.url} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                      <Play className="h-3 w-3 text-white" />
                                    </div>
                                  </>
                                ) : (
                                  <img src={media.url} alt="" className="w-full h-full object-cover" />
                                )}
                                {index === 3 && additionalMedia.length > 4 && (
                                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">+{additionalMedia.length - 4}</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
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
                    
                    <LegalCopyrightAcceptance accepted={legalAccepted} onAcceptedChange={setLegalAccepted} />
                    <Button
                      type="button"
                      onClick={handlePublish}
                      disabled={isSubmitting}
                      className="w-full gap-2"
                    >
                      {isSubmitting
                        ? <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                        : <Send className="w-4 h-4" />}
                      {isSubmitting ? "Posting..." : "PUBLISH NOW"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <MediaUploadDialog
        open={showMediaUpload}
        onOpenChange={setShowMediaUpload}
        onUploadComplete={handleMediaUploadComplete}
      />
    </>
  );
};