import React, { useState } from "react";
import { Plus, Search, Eye, Edit, Trash2, Check, X, Star, BookOpen, Clock, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { AdminContentItem } from "@/data/adminContentData";
import { format } from "date-fns";

interface ArticlesManagementTabProps {
  articles: AdminContentItem[];
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

export function ArticlesManagementTab({
  articles,
  onCreateNew,
  onEdit,
  onPreview,
  onDelete,
  onApprove,
  onReject,
  onToggleFeatured
}: ArticlesManagementTabProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const stats = {
    total: articles.length,
    published: articles.filter(a => a.status === 'published').length,
    pending: articles.filter(a => a.status === 'pending').length,
    featured: articles.filter(a => a.featured).length,
  };

  const categories = [...new Set(articles.map(a => a.category).filter(Boolean))];

  const filtered = articles.filter(item => {
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
        <div className="text-center p-3 rounded-lg bg-purple-500/10">
          <p className="text-lg font-bold text-purple-600">{stats.featured}</p>
          <p className="text-[10px] text-muted-foreground">Featured</p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex gap-2">
        <Button className="gap-2 bg-purple-600 hover:bg-purple-700" onClick={onCreateNew}>
          <Plus className="h-4 w-4" />
          Create Article
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search articles..." 
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
        <div className="overflow-x-auto -mx-4 px-4">
          <div className="flex gap-2 pb-2 w-max">
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
        </div>
      )}

      {/* Articles List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <h3 className="font-semibold mb-1">No Articles Found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {search ? "Try adjusting your search" : "Create your first article"}
              </p>
              <Button onClick={onCreateNew}>
                <Plus className="h-4 w-4 mr-2" />
                Create Article
              </Button>
            </CardContent>
          </Card>
        ) : (
          filtered.map(item => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-0">
                {/* Cover Image */}
                <div 
                  className="h-32 bg-muted relative cursor-pointer"
                  onClick={() => onPreview(item)}
                >
                  {item.thumbnail ? (
                    <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  {item.featured && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-amber-500 text-white gap-1">
                        <Star className="h-3 w-3 fill-white" /> Featured
                      </Badge>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 right-2 flex gap-1">
                    <Badge className={`text-[10px] ${getStatusColor(item.status)}`}>
                      {item.status}
                    </Badge>
                    {item.category && (
                      <Badge variant="secondary" className="text-[10px] capitalize">
                        {item.category}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-3">
                  <h4 
                    className="font-semibold text-sm line-clamp-2 cursor-pointer hover:text-primary"
                    onClick={() => onPreview(item)}
                  >
                    {item.title}
                  </h4>
                  
                  {item.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {item.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 mt-2">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={item.authorAvatar} />
                      <AvatarFallback className="text-[8px]">{item.authorName[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">{item.authorName}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    {item.readTime && (
                      <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                        <Clock className="h-3 w-3" /> {item.readTime}
                      </span>
                    )}
                  </div>

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="outline" className="text-[10px]">
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 3 && (
                        <Badge variant="outline" className="text-[10px]">+{item.tags.length - 3}</Badge>
                      )}
                    </div>
                  )}

                  {/* Stats */}
                  {item.status === "published" && (
                    <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                      <span>{item.views.toLocaleString()} views</span>
                      <span>{item.likes} likes</span>
                      <span>{item.comments} comments</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-1 mt-3">
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
                    <Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={() => onToggleFeatured(item.id)}>
                      <Star className={`h-3 w-3 ${item.featured ? "fill-amber-500 text-amber-500" : ""}`} />
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-[10px] text-destructive" onClick={() => onDelete(item.id)}>
                      <Trash2 className="h-3 w-3" />
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
