import React, { useState } from "react";
import { Search, Eye, Check, X, Newspaper, Calendar, BookOpen, MessageSquare, FileText, CheckSquare, Square, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AdminContentItem, ContentType } from "@/data/adminContentData";
import { format } from "date-fns";

interface PendingApprovalsTabProps {
  pendingItems: AdminContentItem[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onPreview: (item: AdminContentItem) => void;
  onBulkApprove: (ids: string[]) => void;
  onBulkReject: (ids: string[]) => void;
}

const getTypeIcon = (type: ContentType) => {
  switch (type) {
    case 'news': return Newspaper;
    case 'event': return Calendar;
    case 'article': return BookOpen;
    case 'vibe': return MessageSquare;
    default: return FileText;
  }
};

const getTypeColor = (type: ContentType) => {
  switch (type) {
    case 'news': return 'bg-blue-500/10 text-blue-600';
    case 'event': return 'bg-green-500/10 text-green-600';
    case 'article': return 'bg-purple-500/10 text-purple-600';
    case 'vibe': return 'bg-pink-500/10 text-pink-600';
    default: return 'bg-muted text-muted-foreground';
  }
};

export function PendingApprovalsTab({
  pendingItems,
  onApprove,
  onReject,
  onPreview,
  onBulkApprove,
  onBulkReject
}: PendingApprovalsTabProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<ContentType | "all">("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filtered = pendingItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const typeCounts = {
    all: pendingItems.length,
    news: pendingItems.filter(i => i.type === 'news').length,
    event: pendingItems.filter(i => i.type === 'event').length,
    article: pendingItems.filter(i => i.type === 'article').length,
    vibe: pendingItems.filter(i => i.type === 'vibe').length,
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(i => i.id));
    }
  };

  const handleBulkApprove = () => {
    onBulkApprove(selectedIds);
    setSelectedIds([]);
  };

  const handleBulkReject = () => {
    onBulkReject(selectedIds);
    setSelectedIds([]);
  };

  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <Card className="bg-amber-500/5 border-amber-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-amber-500/10">
              <AlertCircle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold">{pendingItems.length} Items Pending Approval</h3>
              <p className="text-xs text-muted-foreground">
                Review and approve or reject submitted content
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Type Filters */}
      <ScrollArea className="w-full" style={{ overflowX: 'auto' }}>
        <div className="flex gap-2 pb-2">
          {(['all', 'news', 'event', 'article', 'vibe'] as const).map(type => (
            <Badge
              key={type}
              variant={typeFilter === type ? "default" : "outline"}
              className="cursor-pointer shrink-0 gap-1 capitalize"
              onClick={() => setTypeFilter(type)}
            >
              {type === 'all' ? 'All' : type}
              <span className="ml-1 text-[10px] opacity-70">({typeCounts[type]})</span>
            </Badge>
          ))}
        </div>
      </ScrollArea>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search pending items..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="pl-9" 
        />
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <Card className="bg-muted/50">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{selectedIds.length} selected</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-green-600" onClick={handleBulkApprove}>
                  <Check className="h-4 w-4 mr-1" /> Approve All
                </Button>
                <Button size="sm" variant="outline" className="h-8 text-red-600" onClick={handleBulkReject}>
                  <X className="h-4 w-4 mr-1" /> Reject All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Select All */}
      {filtered.length > 0 && (
        <div className="flex items-center gap-2">
          <Checkbox
            checked={selectedIds.length === filtered.length && filtered.length > 0}
            onCheckedChange={toggleSelectAll}
          />
          <span className="text-sm text-muted-foreground">Select all</span>
        </div>
      )}

      {/* Pending Items List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Check className="h-12 w-12 mx-auto text-green-500 mb-3" />
              <h3 className="font-semibold mb-1">All Caught Up!</h3>
              <p className="text-sm text-muted-foreground">
                No pending content to review right now
              </p>
            </CardContent>
          </Card>
        ) : (
          filtered.map(item => {
            const TypeIcon = getTypeIcon(item.type);
            const isSelected = selectedIds.includes(item.id);
            
            return (
              <Card 
                key={item.id} 
                className={`transition-colors ${isSelected ? 'ring-2 ring-primary' : ''}`}
              >
                <CardContent className="p-3">
                  <div className="flex gap-3">
                    {/* Checkbox */}
                    <div className="flex items-start pt-1">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleSelect(item.id)}
                      />
                    </div>

                    {/* Type Icon */}
                    <div 
                      className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${getTypeColor(item.type)}`}
                    >
                      <TypeIcon className="h-5 w-5" />
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
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Badge variant="outline" className={`text-[9px] capitalize ${getTypeColor(item.type)}`}>
                              {item.type}
                            </Badge>
                            {item.category && (
                              <Badge variant="secondary" className="text-[9px] capitalize">
                                {item.category}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <Avatar className="h-4 w-4">
                          <AvatarImage src={item.authorAvatar} />
                          <AvatarFallback className="text-[8px]">{item.authorName[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">{item.authorName}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          Submitted {item.submittedAt ? format(item.submittedAt, "MMM d, h:mm a") : "recently"}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-1 mt-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-7 text-[10px] gap-1 text-green-600 flex-1"
                          onClick={() => onApprove(item.id)}
                        >
                          <Check className="h-3 w-3" /> Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-7 text-[10px] gap-1 text-red-600 flex-1"
                          onClick={() => onReject(item.id)}
                        >
                          <X className="h-3 w-3" /> Reject
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-7 text-[10px]"
                          onClick={() => onPreview(item)}
                        >
                          <Eye className="h-3 w-3" />
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
