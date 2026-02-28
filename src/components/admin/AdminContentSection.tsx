import { useState } from "react";
import { FileText, Newspaper, Calendar, BookOpen, MessageSquare, Image, FolderOpen, Edit, Trash2, ChevronRight, Shield } from "lucide-react";
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
import { ModuleAuthorizationDrawer } from "./authorization/ModuleAuthorizationDrawer";
import { getActionConfig, renderActionDetails } from "./authorization/authorizationActionConfigs";

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
    <div className="py-3 space-y-1.5">
      {/* Row 1: Icon + Title + Status */}
      <div className="flex items-start gap-2.5">
        <div className="p-1.5 rounded-md bg-muted/50 shrink-0 mt-0.5">
          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm leading-snug line-clamp-1">{content.title}</p>
          <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
            <Avatar className="h-4 w-4">
              <AvatarImage src={content.authorAvatar} alt={content.author} />
              <AvatarFallback className="text-[10px]">{content.author[0]}</AvatarFallback>
            </Avatar>
            <span className="truncate max-w-[100px]">{content.author}</span>
            <span>•</span>
            <span>{formatRelativeTime(content.createdAt)}</span>
          </div>
        </div>
        <Badge className={`text-xs px-1.5 shrink-0 ${getStatusColor(content.status)}`}>
          {content.status}
        </Badge>
      </div>
      {/* Row 2: Action links */}
      <div className="flex items-center gap-3 pl-8 text-xs">
        <button 
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => onEdit(content.id)}
        >
          <Edit className="h-3.5 w-3.5" />
          Edit
        </button>
        <button 
          className="flex items-center gap-1 text-destructive/70 hover:text-destructive transition-colors"
          onClick={() => onRemove(content.id)}
        >
          <Trash2 className="h-3.5 w-3.5" />
          Remove
        </button>
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
  <div className="flex flex-col items-center justify-center py-2">
    <span className="text-base font-bold leading-none">{value}</span>
    <span className="text-xs text-muted-foreground mt-0.5">{label}</span>
  </div>
);

// Action types for content module
type ContentActionType = "publish" | "remove" | "publish_news" | "publish_event" | "publish_announcement" | "remove_content";

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

  // Authorization state
  const [authDrawerOpen, setAuthDrawerOpen] = useState(false);
  const [authAction, setAuthAction] = useState<{
    type: ContentActionType;
    contentId: string;
    contentTitle: string;
  } | null>(null);

  const handleEdit = (id: string) => {
    toast({
      title: "Edit Content",
      description: "Opening content editor...",
    });
  };

  const handleRemove = (id: string) => {
    const content = recentContent.find(c => c.id === id);
    setAuthAction({
      type: "remove_content",
      contentId: id,
      contentTitle: content?.title || "Content",
    });
    setAuthDrawerOpen(true);
  };

  const handlePublish = (id: string) => {
    const content = recentContent.find(c => c.id === id);
    setAuthAction({
      type: "publish",
      contentId: id,
      contentTitle: content?.title || "Content",
    });
    setAuthDrawerOpen(true);
  };

  const handleAuthorizationComplete = () => {
    if (authAction) {
      const config = getActionConfig("content", authAction.type);
      toast({
        title: config?.title || "Content Action Complete",
        description: `"${authAction.contentTitle}" has been processed successfully.`,
      });
    }
    setAuthAction(null);
  };

  // Get action config using centralized templates
  const actionConfig = authAction ? getActionConfig("content", authAction.type) : null;

  const getAuthActionDetails = () => {
    if (!authAction || !actionConfig) return null;
    
    return renderActionDetails({
      config: actionConfig,
      primaryText: authAction.contentTitle,
      secondaryText: "Content Action",
      module: "content",
    });
  };

  const filteredContent = filter === "all" 
    ? recentContent 
    : recentContent.filter(c => c.type === filter);

  return (
    <>
      {/* Authorization Drawer - Now using centralized config */}
      <ModuleAuthorizationDrawer
        open={authDrawerOpen}
        onOpenChange={setAuthDrawerOpen}
        module="content"
        actionTitle={actionConfig?.title || "Content Action"}
        actionDescription={actionConfig?.description || "Multi-signature authorization required for content actions"}
        actionDetails={getAuthActionDetails()}
        initiatorRole="secretary"
        onAuthorized={handleAuthorizationComplete}
      />

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="content" className="border rounded-lg overflow-hidden">
          <AccordionTrigger className="px-3 hover:no-underline">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="p-1.5 rounded-lg bg-purple-500/10 shrink-0">
                <FileText className="h-4 w-4 text-purple-600" />
              </div>
              <div className="text-left min-w-0 flex-1">
                <h3 className="font-semibold text-sm">Content</h3>
                <p className="text-xs text-muted-foreground">
                  {stats.totalNews + stats.totalEvents + stats.totalArticles + stats.totalVibes} posts
                  {stats.pendingContent > 0 && ` • ${stats.pendingContent} Pending`}
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-3 pb-3">
            <div className="space-y-3">
              {/* Stats - inline row */}
              <div className="flex items-center justify-start gap-6 py-1">
                <StatBadge value={stats.totalNews} label="News" icon={Newspaper} />
                <StatBadge value={stats.totalEvents} label="Events" icon={Calendar} />
                <StatBadge value={stats.totalArticles} label="Articles" icon={BookOpen} />
                <StatBadge value={stats.totalVibes} label="Vibes" icon={MessageSquare} />
              </div>

              {/* Action Buttons - list style with dividers */}
              <div className="flex flex-col gap-0 divide-y divide-border">
                <button className="flex items-center gap-3 py-2.5 text-sm hover:bg-muted/50 -mx-1 px-1 rounded" onClick={onManageNews}>
                  <Newspaper className="h-4 w-4 text-muted-foreground" />
                  Manage News
                </button>
                <button className="flex items-center gap-3 py-2.5 text-sm hover:bg-muted/50 -mx-1 px-1 rounded" onClick={onManageEvents}>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Manage Events
                </button>
                <button className="flex items-center gap-3 py-2.5 text-sm hover:bg-muted/50 -mx-1 px-1 rounded" onClick={onManageGallery}>
                  <Image className="h-4 w-4 text-muted-foreground" />
                  Manage Gallery
                </button>
                <button className="flex items-center gap-3 py-2.5 text-sm hover:bg-muted/50 -mx-1 px-1 rounded" onClick={onManageResources}>
                  <FolderOpen className="h-4 w-4 text-muted-foreground" />
                  Manage Resources
                </button>
              </div>

              {/* Content Filters */}
              <ScrollArea className="w-full touch-auto">
                <Tabs value={filter} onValueChange={setFilter}>
                  <TabsList className="flex w-max h-8 bg-muted/50 p-0.5">
                    <TabsTrigger value="all" className="text-xs px-2.5 h-7">All</TabsTrigger>
                    <TabsTrigger value="news" className="text-xs px-2.5 h-7">News</TabsTrigger>
                    <TabsTrigger value="event" className="text-xs px-2.5 h-7">Events</TabsTrigger>
                    <TabsTrigger value="article" className="text-xs px-2.5 h-7">Articles</TabsTrigger>
                    <TabsTrigger value="vibe" className="text-xs px-2.5 h-7">Vibes</TabsTrigger>
                  </TabsList>
                </Tabs>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>

              {/* Recent Content */}
              {filteredContent.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Recent Content</p>
                  <div className="divide-y divide-border/50">
                    {filteredContent.slice(0, 3).map((content) => (
                      <ContentItem
                        key={content.id}
                        content={content}
                        onEdit={handleEdit}
                        onRemove={handleRemove}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Authorization Info */}
              <div className="flex items-start gap-2 pt-2 border-t border-border/50">
                <Shield className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" />
                <span className="text-xs text-muted-foreground leading-snug">
                  Content actions require Secretary + PRO authorization
                </span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}