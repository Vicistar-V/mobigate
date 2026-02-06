import React, { useState } from "react";
import { Plus, Search, Eye, Edit, Trash2, Check, X, Sparkles, Video, Image, Music, Images, Play, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminContentItem } from "@/data/adminContentData";
import { format } from "date-fns";

interface VibesManagementTabProps {
  vibes: AdminContentItem[];
  onCreateNew: () => void;
  onEdit: (item: AdminContentItem) => void;
  onPreview: (item: AdminContentItem) => void;
  onDelete: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onToggleSpotlight: (id: string) => void;
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

const getMediaIcon = (mediaType?: string) => {
  switch (mediaType) {
    case 'video': return Video;
    case 'photo': return Image;
    case 'audio': return Music;
    case 'gallery': return Images;
    default: return MessageSquare;
  }
};

export function VibesManagementTab({
  vibes,
  onCreateNew,
  onEdit,
  onPreview,
  onDelete,
  onApprove,
  onReject,
  onToggleSpotlight
}: VibesManagementTabProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [mediaFilter, setMediaFilter] = useState("all");

  const stats = {
    total: vibes.length,
    spotlight: vibes.filter(v => v.spotlight).length,
    videos: vibes.filter(v => v.mediaType === 'video').length,
    photos: vibes.filter(v => v.mediaType === 'photo').length,
    audio: vibes.filter(v => v.mediaType === 'audio').length,
    galleries: vibes.filter(v => v.mediaType === 'gallery').length,
  };

  const filtered = vibes.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesMedia = mediaFilter === "all" || item.mediaType === mediaFilter;
    return matchesSearch && matchesStatus && matchesMedia;
  });

  return (
    <div className="space-y-4">
      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center p-3 rounded-lg bg-muted/50">
          <p className="text-lg font-bold">{stats.total}</p>
          <p className="text-[10px] text-muted-foreground">Total</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-amber-500/10">
          <p className="text-lg font-bold text-amber-600">{stats.spotlight}</p>
          <p className="text-[10px] text-muted-foreground">Spotlight</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-purple-500/10">
          <p className="text-lg font-bold text-purple-600">{stats.videos}</p>
          <p className="text-[10px] text-muted-foreground">Videos</p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex gap-2">
        <Button className="gap-2 bg-purple-600 hover:bg-purple-700" onClick={onCreateNew}>
          <Plus className="h-4 w-4" />
          Create Vibe
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search vibes..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="pl-9" 
          />
        </div>
        <Select value={mediaFilter} onValueChange={setMediaFilter}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="video">Video</SelectItem>
            <SelectItem value="photo">Photo</SelectItem>
            <SelectItem value="audio">Audio</SelectItem>
            <SelectItem value="gallery">Gallery</SelectItem>
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

      {/* Vibes Grid */}
      <div className="grid grid-cols-2 gap-3">
        {filtered.length === 0 ? (
          <Card className="col-span-2">
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <h3 className="font-semibold mb-1">No Vibes Found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {search ? "Try adjusting your search" : "Create your first vibe"}
              </p>
              <Button onClick={onCreateNew}>
                <Plus className="h-4 w-4 mr-2" />
                Create Vibe
              </Button>
            </CardContent>
          </Card>
        ) : (
          filtered.map(item => {
            const MediaIcon = getMediaIcon(item.mediaType);
            
            return (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-0">
                  {/* Media Preview */}
                  <div 
                    className="aspect-square bg-muted relative cursor-pointer"
                    onClick={() => onPreview(item)}
                  >
                    {item.thumbnail ? (
                      <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <MediaIcon className="h-10 w-10 text-muted-foreground" />
                      </div>
                    )}
                    
                    {/* Overlay badges */}
                    <div className="absolute top-2 left-2 flex gap-1">
                      <Badge className={`text-[9px] ${getStatusColor(item.status)}`}>
                        {item.status}
                      </Badge>
                    </div>
                    
                    {item.spotlight && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-amber-500 text-white text-[9px] gap-0.5">
                          <Sparkles className="h-2.5 w-2.5" /> Spotlight
                        </Badge>
                      </div>
                    )}
                    
                    {/* Media type + duration */}
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                      <Badge variant="secondary" className="text-[9px] gap-0.5 capitalize">
                        <MediaIcon className="h-2.5 w-2.5" />
                        {item.mediaType}
                      </Badge>
                      {item.duration && (
                        <Badge variant="secondary" className="text-[9px]">
                          {item.duration}
                        </Badge>
                      )}
                    </div>
                    
                    {/* Play button overlay for video/audio */}
                    {(item.mediaType === 'video' || item.mediaType === 'audio') && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
                          <Play className="h-5 w-5 text-white fill-white" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-2">
                    <h4 className="font-medium text-xs line-clamp-1">{item.title}</h4>
                    
                    <div className="flex items-center gap-1.5 mt-1">
                      <Avatar className="h-4 w-4">
                        <AvatarImage src={item.authorAvatar} />
                        <AvatarFallback className="text-[6px]">{item.authorName[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-[10px] text-muted-foreground truncate">{item.authorName}</span>
                    </div>

                    {/* Stats */}
                    {item.status === "published" && (
                      <div className="flex gap-2 mt-1.5 text-[10px] text-muted-foreground">
                        <span>{item.views.toLocaleString()} views</span>
                        <span>{item.likes} ❤️</span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-1 mt-2">
                      {item.status === 'published' && (
                        <Button size="sm" variant="outline" className="h-6 w-6 p-0 text-green-600 bg-green-50 border-green-200" disabled>
                          <Check className="h-3 w-3" />
                        </Button>
                      )}
                      {item.status === 'rejected' && (
                        <Button size="sm" variant="outline" className="h-6 w-6 p-0 text-red-600 bg-red-50 border-red-200" disabled>
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                      {item.status === 'pending' && (
                        <>
                          <Button size="sm" variant="outline" className="h-6 w-6 p-0 text-green-600" onClick={() => onApprove(item.id)}>
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-6 w-6 p-0 text-red-600" onClick={() => onReject(item.id)}>
                            <X className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="outline" className="h-6 w-6 p-0" onClick={() => onEdit(item)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="h-6 w-6 p-0" onClick={() => onToggleSpotlight(item.id)}>
                        <Sparkles className={`h-3 w-3 ${item.spotlight ? "text-amber-500" : ""}`} />
                      </Button>
                      <Button size="sm" variant="outline" className="h-6 w-6 p-0 text-destructive" onClick={() => onDelete(item.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
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
