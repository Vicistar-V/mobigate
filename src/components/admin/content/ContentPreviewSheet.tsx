import React from "react";
import { format } from "date-fns";
import { X, Eye, Edit, Check, MessageSquare, Calendar, MapPin, Clock, Users, Heart, Newspaper, BookOpen, Video, Image, Music, Images } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AdminContentItem } from "@/data/adminContentData";
interface ContentPreviewSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: AdminContentItem | null;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onEdit?: (id: string) => void;
}

const getStatusColor = (status: AdminContentItem['status']) => {
  switch (status) {
    case 'published': return 'bg-green-500/10 text-green-600 border-green-200';
    case 'pending': return 'bg-amber-500/10 text-amber-600 border-amber-200';
    case 'draft': return 'bg-gray-500/10 text-gray-600 border-gray-200';
    case 'rejected': return 'bg-red-500/10 text-red-600 border-red-200';
    default: return 'bg-muted text-muted-foreground';
  }
};

const getTypeIcon = (type: AdminContentItem['type']) => {
  switch (type) {
    case 'news': return Newspaper;
    case 'event': return Calendar;
    case 'article': return BookOpen;
    case 'vibe': return MessageSquare;
    default: return Eye;
  }
};

const getMediaIcon = (mediaType?: string) => {
  switch (mediaType) {
    case 'video': return Video;
    case 'photo': return Image;
    case 'audio': return Music;
    case 'gallery': return Images;
    default: return Image;
  }
};

export function ContentPreviewSheet({
  open,
  onOpenChange,
  content,
  onApprove,
  onReject,
  onEdit
}: ContentPreviewSheetProps) {
  if (!content) return null;

  const TypeIcon = getTypeIcon(content.type);
  const MediaIcon = content.mediaType ? getMediaIcon(content.mediaType) : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[92vh]">
        {/* Fixed Header */}
        <SheetHeader className="shrink-0 pb-3">
          <div className="flex items-center justify-between pr-8">
            <SheetTitle className="flex items-center gap-2">
              <TypeIcon className="h-5 w-5 text-purple-600" />
              Content Preview
            </SheetTitle>
            <Badge className={`${getStatusColor(content.status)}`}>
              {content.status}
            </Badge>
          </div>
        </SheetHeader>

        {/* Scrollable Body - Native scrolling for mobile */}
        <div className="flex-1 overflow-y-auto touch-auto overscroll-contain px-4 pb-4">
          <div className="space-y-4">
            {/* Thumbnail/Media */}
            <div className="aspect-video rounded-lg bg-muted flex items-center justify-center overflow-hidden">
              {content.thumbnail ? (
                <img src={content.thumbnail} alt={content.title} className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  {MediaIcon ? <MediaIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" /> : <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-2" />}
                  <p className="text-sm text-muted-foreground">No media</p>
                </div>
              )}
            </div>

            {/* Title & Category */}
            <div>
              <h2 className="text-xl font-bold">{content.title}</h2>
              {content.category && (
                <Badge variant="outline" className="mt-2 capitalize">{content.category}</Badge>
              )}
            </div>

            {/* Author Info */}
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage src={content.authorAvatar} />
                <AvatarFallback>{content.authorName[0]}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-medium text-sm">{content.authorName}</p>
                <p className="text-xs text-muted-foreground">
                  {content.publishedAt 
                    ? `Published ${format(content.publishedAt, "MMM d, yyyy")}`
                    : content.submittedAt 
                      ? `Submitted ${format(content.submittedAt, "MMM d, yyyy")}`
                      : "Draft"
                  }
                </p>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h4 className="font-semibold text-sm mb-2">Description</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {content.description || "No description provided."}
              </p>
            </div>

            {/* Event Specific */}
            {content.type === "event" && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Event Details</h4>
                  {content.eventDate && (
                    <div className="flex items-start gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <span className="break-words">{format(content.eventDate, "EEEE, MMMM d, yyyy 'at' h:mm a")}</span>
                    </div>
                  )}
                  {content.venue && (
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                        <span className="break-words">{content.venue}</span>
                        {content.venueType && (
                          <Badge variant="secondary" className="text-xs capitalize shrink-0">{content.venueType}</Badge>
                        )}
                      </div>
                    </div>
                  )}
                  {content.capacity && (
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span>{content.rsvpCount || 0} / {content.capacity} attending</span>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Article Content */}
            {content.type === "article" && content.content && (
              <>
                <Separator />
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h4 className="font-semibold text-sm">Full Content</h4>
                    {content.readTime && (
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {content.readTime} read
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap break-words">
                    {content.content}
                  </p>
                </div>
                {content.tags && content.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {content.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Vibe Specific */}
            {content.type === "vibe" && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Media Info</h4>
                  <div className="flex flex-wrap items-center gap-2">
                    {MediaIcon && <MediaIcon className="h-4 w-4 text-muted-foreground shrink-0" />}
                    <span className="text-sm capitalize">{content.mediaType}</span>
                    {content.duration && (
                      <Badge variant="secondary" className="text-xs">{content.duration}</Badge>
                    )}
                    {content.spotlight && (
                      <Badge className="bg-amber-500/10 text-amber-600 text-xs">Spotlight</Badge>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Engagement Stats */}
            <Separator />
            <div>
              <h4 className="font-semibold text-sm mb-2">Engagement</h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <Eye className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                  <p className="font-bold text-sm">{content.views.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Views</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <Heart className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                  <p className="font-bold text-sm">{content.likes.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Likes</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <MessageSquare className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                  <p className="font-bold text-sm">{content.comments.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Comments</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Footer Actions */}
        <div className="shrink-0 flex gap-2 px-4 py-3 border-t bg-background">
          {content.status === "pending" && onApprove && onReject && (
            <>
              <Button 
                variant="outline" 
                className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => onReject(content.id)}
              >
                <X className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button 
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={() => onApprove(content.id)}
              >
                <Check className="h-4 w-4 mr-2" />
                Approve
              </Button>
            </>
          )}
          {content.status !== "pending" && onEdit && (
            <Button 
              className="w-full"
              onClick={() => onEdit(content.id)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Content
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
