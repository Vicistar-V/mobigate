import React, { useState } from "react";
import { Plus, Search, Eye, Edit, Trash2, Calendar, MapPin, Users, Clock, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { AdminContentItem } from "@/data/adminContentData";
import { format, isPast, isFuture, isToday } from "date-fns";

interface EventsManagementTabProps {
  events: AdminContentItem[];
  onCreateNew: () => void;
  onEdit: (item: AdminContentItem) => void;
  onPreview: (item: AdminContentItem) => void;
  onDelete: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onViewRSVPs: (id: string) => void;
}

const getStatusColor = (status: AdminContentItem['status']) => {
  switch (status) {
    case 'published': return 'bg-green-500/10 text-green-600';
    case 'pending': return 'bg-amber-500/10 text-amber-600';
    case 'draft': return 'bg-gray-500/10 text-gray-600';
    case 'rejected': return 'bg-red-500/10 text-red-600';
    default: return 'bg-muted text-muted-foreground';
  }
};

const getEventTiming = (event: AdminContentItem) => {
  if (!event.eventDate) return { label: "No date", color: "text-muted-foreground" };
  
  const eventDate = new Date(event.eventDate);
  if (isToday(eventDate)) return { label: "Today", color: "text-green-600" };
  if (isFuture(eventDate)) return { label: "Upcoming", color: "text-blue-600" };
  if (isPast(eventDate)) return { label: "Past", color: "text-gray-500" };
  return { label: "Scheduled", color: "text-muted-foreground" };
};

export function EventsManagementTab({
  events,
  onCreateNew,
  onEdit,
  onPreview,
  onDelete,
  onApprove,
  onReject,
  onViewRSVPs
}: EventsManagementTabProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [timingFilter, setTimingFilter] = useState("all");

  const stats = {
    total: events.length,
    upcoming: events.filter(e => e.eventDate && isFuture(new Date(e.eventDate))).length,
    ongoing: events.filter(e => e.eventDate && isToday(new Date(e.eventDate))).length,
    past: events.filter(e => e.eventDate && isPast(new Date(e.eventDate)) && !isToday(new Date(e.eventDate))).length,
    draft: events.filter(e => e.status === 'draft').length,
  };

  const filtered = events.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    
    let matchesTiming = true;
    if (timingFilter !== "all" && item.eventDate) {
      const eventDate = new Date(item.eventDate);
      switch (timingFilter) {
        case "upcoming": matchesTiming = isFuture(eventDate); break;
        case "today": matchesTiming = isToday(eventDate); break;
        case "past": matchesTiming = isPast(eventDate) && !isToday(eventDate); break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesTiming;
  });

  return (
    <div className="space-y-4">
      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-2">
        <div className="text-center p-3 rounded-lg bg-blue-500/10">
          <p className="text-lg font-bold text-blue-600">{stats.upcoming}</p>
          <p className="text-[10px] text-muted-foreground">Upcoming</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-green-500/10">
          <p className="text-lg font-bold text-green-600">{stats.ongoing}</p>
          <p className="text-[10px] text-muted-foreground">Today</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-gray-500/10">
          <p className="text-lg font-bold text-gray-600">{stats.past}</p>
          <p className="text-[10px] text-muted-foreground">Past</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-amber-500/10">
          <p className="text-lg font-bold text-amber-600">{stats.draft}</p>
          <p className="text-[10px] text-muted-foreground">Draft</p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex gap-2">
        <Button className="gap-2 bg-purple-600 hover:bg-purple-700" onClick={onCreateNew}>
          <Plus className="h-4 w-4" />
          Create Event
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search events..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="pl-9" 
          />
        </div>
        <Select value={timingFilter} onValueChange={setTimingFilter}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="When" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="past">Past</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <h3 className="font-semibold mb-1">No Events Found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {search ? "Try adjusting your search" : "Create your first event"}
              </p>
              <Button onClick={onCreateNew}>
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </CardContent>
          </Card>
        ) : (
          filtered.map(item => {
            const timing = getEventTiming(item);
            const rsvpPercentage = item.capacity ? ((item.rsvpCount || 0) / item.capacity) * 100 : 0;
            
            return (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-3">
                  <div className="flex gap-3">
                    {/* Date Badge */}
                    <div 
                      className="w-16 h-16 rounded-lg bg-primary/10 flex flex-col items-center justify-center shrink-0 cursor-pointer"
                      onClick={() => onPreview(item)}
                    >
                      {item.eventDate ? (
                        <>
                          <span className="text-[10px] font-medium text-primary uppercase">
                            {format(new Date(item.eventDate), "MMM")}
                          </span>
                          <span className="text-xl font-bold text-primary">
                            {format(new Date(item.eventDate), "d")}
                          </span>
                        </>
                      ) : (
                        <Calendar className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 
                            className="font-medium text-sm line-clamp-1 cursor-pointer hover:text-primary"
                            onClick={() => onPreview(item)}
                          >
                            {item.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge variant="outline" className={`text-[10px] ${timing.color}`}>
                              {timing.label}
                            </Badge>
                            <Badge className={`text-[10px] ${getStatusColor(item.status)}`}>
                              {item.status}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Event Details */}
                      <div className="mt-2 space-y-1">
                        {item.eventDate && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{format(new Date(item.eventDate), "h:mm a")}</span>
                            {item.eventEndDate && (
                              <span>- {format(new Date(item.eventEndDate), "h:mm a")}</span>
                            )}
                          </div>
                        )}
                        {item.venue && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{item.venue}</span>
                            {item.venueType && (
                              <Badge variant="secondary" className="text-[8px] capitalize">{item.venueType}</Badge>
                            )}
                          </div>
                        )}
                      </div>

                      {/* RSVP Progress */}
                      {item.capacity && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {item.rsvpCount || 0} / {item.capacity}
                            </span>
                            <span className="text-muted-foreground">{Math.round(rsvpPercentage)}%</span>
                          </div>
                          <Progress value={rsvpPercentage} className="h-1.5" />
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-1 mt-2">
                        {item.status === 'published' && (
                          <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1 text-green-600 bg-green-50 border-green-200" disabled>
                            <Check className="h-3 w-3" /> Approved
                          </Button>
                        )}
                        {item.status === 'rejected' && (
                          <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1 text-red-600 bg-red-50 border-red-200" disabled>
                            <X className="h-3 w-3" /> Rejected
                          </Button>
                        )}
                        {item.status === 'pending' && (
                          <>
                            <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1 text-green-600" onClick={() => onApprove(item.id)}>
                              <Check className="h-3 w-3" /> Approve
                            </Button>
                            <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1 text-red-600" onClick={() => onReject(item.id)}>
                              <X className="h-3 w-3" /> Reject
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={() => onPreview(item)}>
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={() => onEdit(item)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        {item.status === "published" && (
                          <Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={() => onViewRSVPs(item.id)}>
                            <Users className="h-3 w-3" />
                          </Button>
                        )}
                        <Button size="sm" variant="outline" className="h-7 text-[10px] text-destructive" onClick={() => onDelete(item.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
