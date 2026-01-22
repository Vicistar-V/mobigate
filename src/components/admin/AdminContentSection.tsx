import { useState } from "react";
import { FileText, Newspaper, Calendar, BookOpen, MessageSquare, Image, FolderOpen, Edit, Trash2, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AdminStats, RecentContent, formatRelativeTime } from "@/data/adminDashboardData";
import { useToast } from "@/hooks/use-toast";

const getContentTypeIcon = (type: RecentContent['type']) => {
  switch (type) {
    case 'news':
      return Newspaper;
    case 'event':
      return Calendar;
    case 'article':
      return BookOpen;
    case 'vibe':
      return MessageSquare;
    default:
      return FileText;
  }
};

const getStatusColor = (status: RecentContent['status']) => {
  switch (status) {
    case 'published':
      return 'bg-green-500/10 text-green-600';
    case 'pending':
      return 'bg-amber-500/10 text-amber-600';
    case 'draft':
      return 'bg-gray-500/10 text-gray-600';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

interface ContentItemProps {
  content: RecentContent;
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
}

const ContentItem = ({ content, onEdit, onRemove }: ContentItemProps) => {
  const Icon = getContentTypeIcon(content.type);
  
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="p-2 rounded-lg bg-muted shrink-0">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{content.title}</p>
        <div className="flex items-center gap-2 mt-1">
          <Avatar className="h-4 w-4">
            <AvatarImage src={content.authorAvatar} alt={content.author} />
            <AvatarFallback className="text-[8px]">{content.author[0]}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground truncate">{content.author}</span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground">{formatRelativeTime(content.createdAt)}</span>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Badge className={`text-[10px] px-1.5 ${getStatusColor(content.status)}`}>
          {content.status}
        </Badge>
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          onClick={() => onEdit(content.id)}
        >
          <Edit className="h-3 w-3" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7 text-destructive"
          onClick={() => onRemove(content.id)}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

interface StatBadgeProps {
  value: number;
  label: string;
  icon: React.ElementType;
}

const StatBadge = ({ value, label, icon: Icon }: StatBadgeProps) => (
  <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50">
    <Icon className="h-4 w-4 text-muted-foreground mb-1" />
    <span className="text-lg font-bold">{value}</span>
    <span className="text-[10px] text-muted-foreground">{label}</span>
  </div>
);

interface AdminContentSectionProps {
  stats: AdminStats;
  recentContent: RecentContent[];
  onManageNews: () => void;
  onManageEvents: () => void;
  onManageGallery: () => void;
  onManageResources: () => void;
}

export function AdminContentSection({
  stats,
  recentContent,
  onManageNews,
  onManageEvents,
  onManageGallery,
  onManageResources,
}: AdminContentSectionProps) {
  const [filter, setFilter] = useState<string>("all");
  const { toast } = useToast();

  const handleEdit = (id: string) => {
    toast({
      title: "Edit Content",
      description: "Opening content editor...",
    });
  };

  const handleRemove = (id: string) => {
    toast({
      title: "Content Removed",
      description: "The content has been removed.",
      variant: "destructive",
    });
  };

  const filteredContent = filter === "all" 
    ? recentContent 
    : recentContent.filter(c => c.type === filter);

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="content" className="border rounded-lg">
        <AccordionTrigger className="px-4 hover:no-underline">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <FileText className="h-4 w-4 text-purple-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Content Management</h3>
              <p className="text-xs text-muted-foreground">
                {stats.totalNews + stats.totalEvents + stats.totalArticles + stats.totalVibes} total posts
                {stats.pendingContent > 0 && ` • ${stats.pendingContent} pending`}
              </p>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          <div className="space-y-4">
            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-2">
              <StatBadge value={stats.totalNews} label="News" icon={Newspaper} />
              <StatBadge value={stats.totalEvents} label="Events" icon={Calendar} />
              <StatBadge value={stats.totalArticles} label="Articles" icon={BookOpen} />
              <StatBadge value={stats.totalVibes} label="Vibes" icon={MessageSquare} />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={onManageNews}>
                <Newspaper className="h-4 w-4 mr-2" />
                News
              </Button>
              <Button variant="outline" size="sm" onClick={onManageEvents}>
                <Calendar className="h-4 w-4 mr-2" />
                Events
              </Button>
              <Button variant="outline" size="sm" onClick={onManageGallery}>
                <Image className="h-4 w-4 mr-2" />
                Gallery
              </Button>
              <Button variant="outline" size="sm" onClick={onManageResources}>
                <FolderOpen className="h-4 w-4 mr-2" />
                Resources
              </Button>
            </div>

            {/* Content Filters */}
            <Tabs value={filter} onValueChange={setFilter}>
              <TabsList className="grid grid-cols-5 w-full h-8">
                <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                <TabsTrigger value="news" className="text-xs">News</TabsTrigger>
                <TabsTrigger value="event" className="text-xs">Events</TabsTrigger>
                <TabsTrigger value="article" className="text-xs">Articles</TabsTrigger>
                <TabsTrigger value="vibe" className="text-xs">Vibes</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Recent Content */}
            {filteredContent.length > 0 && (
              <Card>
                <CardHeader className="pb-2 pt-3 px-3">
                  <CardTitle className="text-sm flex items-center justify-between">
                    Recent Content
                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                      View All
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-3 pb-3 pt-0">
                  <div className="divide-y divide-border">
                    {filteredContent.slice(0, 3).map((content) => (
                      <ContentItem
                        key={content.id}
                        content={content}
                        onEdit={handleEdit}
                        onRemove={handleRemove}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
