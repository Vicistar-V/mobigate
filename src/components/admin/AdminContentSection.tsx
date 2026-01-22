import { useState } from "react";
import { FileText, Newspaper, Calendar, BookOpen, MessageSquare, Image, FolderOpen, Edit, Trash2, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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
          <Avatar className="h-5 w-5">
            <AvatarImage src={content.authorAvatar} alt={content.author} />
            <AvatarFallback className="text-xs">{content.author[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground truncate">{content.author}</span>
          <span className="text-sm text-muted-foreground">•</span>
          <span className="text-sm text-muted-foreground">{formatRelativeTime(content.createdAt)}</span>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Badge className={`text-xs px-1.5 ${getStatusColor(content.status)}`}>
          {content.status}
        </Badge>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          onClick={() => onEdit(content.id)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-destructive"
          onClick={() => onRemove(content.id)}
        >
          <Trash2 className="h-4 w-4" />
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
  <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50 min-w-0 overflow-hidden">
    <Icon className="h-3.5 w-3.5 text-muted-foreground mb-0.5" />
    <span className="text-base font-bold">{value}</span>
    <span className="text-xs text-muted-foreground truncate w-full text-center">{label}</span>
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
    <Accordion type="single" collapsible className="w-full max-w-full">
      <AccordionItem value="content" className="border rounded-lg overflow-hidden">
        <AccordionTrigger className="px-4 hover:no-underline max-w-full">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-lg bg-purple-500/10 shrink-0">
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-left min-w-0">
              <h3 className="font-semibold text-base truncate">Content</h3>
              <p className="text-sm text-muted-foreground truncate">
                {stats.totalNews + stats.totalEvents + stats.totalArticles + stats.totalVibes} posts
                {stats.pendingContent > 0 && ` • ${stats.pendingContent} pending`}
              </p>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          <div className="space-y-4 w-full max-w-full overflow-hidden">
            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-1.5 w-full">
              <StatBadge value={stats.totalNews} label="News" icon={Newspaper} />
              <StatBadge value={stats.totalEvents} label="Events" icon={Calendar} />
              <StatBadge value={stats.totalArticles} label="Articles" icon={BookOpen} />
              <StatBadge value={stats.totalVibes} label="Vibes" icon={MessageSquare} />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="h-10 text-sm" onClick={onManageNews}>
                <Newspaper className="h-4 w-4 mr-2" />
                News
              </Button>
              <Button variant="outline" size="sm" className="h-10 text-sm" onClick={onManageEvents}>
                <Calendar className="h-4 w-4 mr-2" />
                Events
              </Button>
              <Button variant="outline" size="sm" className="h-10 text-sm" onClick={onManageGallery}>
                <Image className="h-4 w-4 mr-2" />
                Gallery
              </Button>
              <Button variant="outline" size="sm" className="h-10 text-sm" onClick={onManageResources}>
                <FolderOpen className="h-4 w-4 mr-2" />
                Resources
              </Button>
            </div>

            {/* Content Filters */}
            <ScrollArea className="w-full touch-auto">
              <Tabs value={filter} onValueChange={setFilter}>
                <TabsList className="flex w-max h-9 bg-muted/50">
                  <TabsTrigger value="all" className="text-sm px-3 h-7">All</TabsTrigger>
                  <TabsTrigger value="news" className="text-sm px-3 h-7">News</TabsTrigger>
                  <TabsTrigger value="event" className="text-sm px-3 h-7">Events</TabsTrigger>
                  <TabsTrigger value="article" className="text-sm px-3 h-7">Articles</TabsTrigger>
                  <TabsTrigger value="vibe" className="text-sm px-3 h-7">Vibes</TabsTrigger>
                </TabsList>
              </Tabs>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>

            {/* Recent Content */}
            {filteredContent.length > 0 && (
              <Card className="overflow-hidden">
                <CardHeader className="pb-2 pt-3 px-4">
                  <CardTitle className="text-sm flex items-center justify-between">
                    Recent Content
                    <Button variant="ghost" size="sm" className="h-8 text-sm px-2">
                      View All
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 pt-0">
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