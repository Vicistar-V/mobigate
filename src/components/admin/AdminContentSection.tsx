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
    <div className="flex items-start gap-2 py-2">
      <div className="p-1.5 rounded-lg bg-muted shrink-0">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-xs truncate">{content.title}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <Avatar className="h-3.5 w-3.5">
            <AvatarImage src={content.authorAvatar} alt={content.author} />
            <AvatarFallback className="text-[6px]">{content.author[0]}</AvatarFallback>
          </Avatar>
          <span className="text-[10px] text-muted-foreground truncate">{content.author}</span>
          <span className="text-[10px] text-muted-foreground">•</span>
          <span className="text-[10px] text-muted-foreground">{formatRelativeTime(content.createdAt)}</span>
        </div>
      </div>
      <div className="flex items-center gap-0.5 shrink-0">
        <Badge className={`text-[9px] px-1 ${getStatusColor(content.status)}`}>
          {content.status}
        </Badge>
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6"
          onClick={() => onEdit(content.id)}
        >
          <Edit className="h-3 w-3" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6 text-destructive"
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
  <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50 min-w-0">
    <Icon className="h-3.5 w-3.5 text-muted-foreground mb-0.5" />
    <span className="text-base sm:text-lg font-bold">{value}</span>
    <span className="text-[9px] sm:text-[10px] text-muted-foreground truncate">{label}</span>
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
      <AccordionItem value="content" className="border rounded-lg overflow-hidden">
        <AccordionTrigger className="px-3 hover:no-underline">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 sm:p-2 rounded-lg bg-purple-500/10 shrink-0">
              <FileText className="h-4 w-4 text-purple-600" />
            </div>
            <div className="text-left min-w-0">
              <h3 className="font-semibold text-sm sm:text-base truncate">Content</h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                {stats.totalNews + stats.totalEvents + stats.totalArticles + stats.totalVibes} posts
                {stats.pendingContent > 0 && ` • ${stats.pendingContent} pending`}
              </p>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-3 pb-3">
          <div className="space-y-3 w-full overflow-hidden">
            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-1.5 w-full">
              <StatBadge value={stats.totalNews} label="News" icon={Newspaper} />
              <StatBadge value={stats.totalEvents} label="Events" icon={Calendar} />
              <StatBadge value={stats.totalArticles} label="Articles" icon={BookOpen} />
              <StatBadge value={stats.totalVibes} label="Vibes" icon={MessageSquare} />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-1.5">
              <Button variant="outline" size="sm" className="h-8 text-[10px]" onClick={onManageNews}>
                <Newspaper className="h-3 w-3 mr-1" />
                News
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-[10px]" onClick={onManageEvents}>
                <Calendar className="h-3 w-3 mr-1" />
                Events
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-[10px]" onClick={onManageGallery}>
                <Image className="h-3 w-3 mr-1" />
                Gallery
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-[10px]" onClick={onManageResources}>
                <FolderOpen className="h-3 w-3 mr-1" />
                Resources
              </Button>
            </div>

            {/* Content Filters */}
            <ScrollArea className="w-full touch-auto">
              <Tabs value={filter} onValueChange={setFilter}>
                <TabsList className="flex w-max h-7 bg-muted/50">
                  <TabsTrigger value="all" className="text-[10px] px-2 h-6">All</TabsTrigger>
                  <TabsTrigger value="news" className="text-[10px] px-2 h-6">News</TabsTrigger>
                  <TabsTrigger value="event" className="text-[10px] px-2 h-6">Events</TabsTrigger>
                  <TabsTrigger value="article" className="text-[10px] px-2 h-6">Articles</TabsTrigger>
                  <TabsTrigger value="vibe" className="text-[10px] px-2 h-6">Vibes</TabsTrigger>
                </TabsList>
              </Tabs>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>

            {/* Recent Content */}
            {filteredContent.length > 0 && (
              <Card className="overflow-hidden">
                <CardHeader className="pb-1.5 pt-2.5 px-2.5">
                  <CardTitle className="text-xs flex items-center justify-between">
                    Recent Content
                    <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2">
                      View All
                      <ChevronRight className="h-3 w-3 ml-0.5" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-2.5 pb-2.5 pt-0">
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
