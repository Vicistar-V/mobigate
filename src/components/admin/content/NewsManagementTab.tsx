import React, { useState } from "react";
import { Plus, Search, Eye, Edit, Trash2, Check, X, Star, Newspaper, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AdminContentItem } from "@/data/adminContentData";
import { format } from "date-fns";

interface NewsManagementTabProps {
  news: AdminContentItem[];
  onCreateNew: () => void;
  onEdit: (item: AdminContentItem) => void;
  onPreview: (item: AdminContentItem) => void;
  onDelete: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onToggleFeatured: (id: string) => void;
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

export function NewsManagementTab({
  news,
  onCreateNew,
  onEdit,
  onPreview,
  onDelete,
  onApprove,
  onReject,
  onToggleFeatured
}: NewsManagementTabProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const stats = {
    total: news.length,
    published: news.filter(n => n.status === 'published').length,
    pending: news.filter(n => n.status === 'pending').length,
    draft: news.filter(n => n.status === 'draft').length,
  };

  const categories = [...new Set(news.map(n => n.category).filter(Boolean))];

  const filtered = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-4">
      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-2">
        <div className="text-center p-3 rounded-lg bg-muted/50">
          <p className="text-lg font-bold">{stats.total}</p>
          <p className="text-[10px] text-muted-foreground">Total</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-green-500/10">
          <p className="text-lg font-bold text-green-600">{stats.published}</p>
          <p className="text-[10px] text-muted-foreground">Published</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-amber-500/10">
          <p className="text-lg font-bold text-amber-600">{stats.pending}</p>
          <p className="text-[10px] text-muted-foreground">Pending</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-gray-500/10">
          <p className="text-lg font-bold text-gray-600">{stats.draft}</p>
          <p className="text-[10px] text-muted-foreground">Draft</p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex gap-2">
        <Button className="gap-2 bg-purple-600 hover:bg-purple-700" onClick={onCreateNew}>
          <Plus className="h-4 w-4" />
          Create News
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search news..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="pl-9" 
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[110px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <ScrollArea className="w-full" style={{ overflowX: 'auto' }}>
          <div className="flex gap-2 pb-2">
            <Badge
              variant={categoryFilter === "all" ? "default" : "outline"}
              className="cursor-pointer shrink-0"
              onClick={() => setCategoryFilter("all")}
            >
              All
            </Badge>
            {categories.map(cat => (
              <Badge
                key={cat}
                variant={categoryFilter === cat ? "default" : "outline"}
                className="cursor-pointer shrink-0 capitalize"
                onClick={() => setCategoryFilter(cat!)}
              >
                {cat}
              </Badge>
            ))}
          </div>
        </ScrollArea>
      )}

      {/* News List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Newspaper className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <h3 className="font-semibold mb-1">No News Found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {search ? "Try adjusting your search" : "Create your first news post"}
              </p>
              <Button onClick={onCreateNew}>
                <Plus className="h-4 w-4 mr-2" />
                Create News
              </Button>
            </CardContent>
          </Card>
        ) : (
          filtered.map(item => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-4">
                {/* Top Row - Thumbnail + Status Badge */}
                <div className="flex items-start gap-3">
                  <div 
                    className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center shrink-0 cursor-pointer"
                    onClick={() => onPreview(item)}
                  >
                    {item.thumbnail ? (
                      <img src={item.thumbnail} alt="" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Newspaper className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <Badge className={`text-xs px-2 py-0.5 ${getStatusColor(item.status)}`}>
                        {item.status}
                      </Badge>
                      {item.featured && (
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500 shrink-0" />
                      )}
                    </div>
                    {item.category && (
                      <Badge variant="outline" className="text-xs px-2 py-0.5 mt-1.5 capitalize">
                        {item.category}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Title - Full Width */}
                <h4 
                  className="font-semibold text-base mt-3 line-clamp-2 cursor-pointer hover:text-primary leading-snug"
                  onClick={() => onPreview(item)}
                >
                  {item.title}
                </h4>

                {/* Author Row */}
                <div className="flex items-center gap-2 mt-2">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={item.authorAvatar} />
                    <AvatarFallback className="text-[10px]">{item.authorName[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">{item.authorName}</span>
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">
                    {item.publishedAt ? format(item.publishedAt, "MMM d") : "Draft"}
                  </span>
                </div>

                {/* Stats Row */}
                {item.status === "published" && (
                  <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                    <span>{item.views.toLocaleString()} views</span>
                    <span>{item.likes} likes</span>
                    <span>{item.comments} comments</span>
                  </div>
                )}

                {/* Actions Row */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {item.status === 'pending' && (
                    <>
                      <Button size="sm" variant="outline" className="h-9 text-sm gap-1.5 text-green-600" onClick={() => onApprove(item.id)}>
                        <Check className="h-4 w-4" /> Approve
                      </Button>
                      <Button size="sm" variant="outline" className="h-9 text-sm gap-1.5 text-red-600" onClick={() => onReject(item.id)}>
                        <X className="h-4 w-4" /> Reject
                      </Button>
                    </>
                  )}
                  <div className="flex gap-1 ml-auto">
                    <Button size="sm" variant="ghost" className="h-9 w-9 p-0" onClick={() => onPreview(item)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-9 w-9 p-0" onClick={() => onEdit(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-9 w-9 p-0" onClick={() => onToggleFeatured(item.id)}>
                      <Star className={`h-4 w-4 ${item.featured ? "fill-amber-500 text-amber-500" : ""}`} />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-9 w-9 p-0 text-destructive" onClick={() => onDelete(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
