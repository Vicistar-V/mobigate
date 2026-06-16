import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useCommunityContent, ContentItem } from "@/hooks/useCommunityContent";
import { useToast } from "@/hooks/use-toast";
import { NewsManagementTab }     from "@/components/admin/content/NewsManagementTab";
import { EventsManagementTab }   from "@/components/admin/content/EventsManagementTab";
import { ArticlesManagementTab } from "@/components/admin/content/ArticlesManagementTab";
import { VibesManagementTab }    from "@/components/admin/content/VibesManagementTab";
import { PendingApprovalsTab }   from "@/components/admin/content/PendingApprovalsTab";
import { ContentFormDialog }     from "@/components/admin/content/ContentFormDialog";
import { ContentPreviewSheet }   from "@/components/admin/content/ContentPreviewSheet";
import { RejectionReasonDialog } from "@/components/admin/content/RejectionReasonDialog";

type ContentType = "news" | "event" | "article" | "vibe";

export default function ContentModerationPage() {
  const { communityId } = useParams<{ communityId: string }>();
  const navigate  = useNavigate();
  const { toast } = useToast();

  // Fetch all content (status=all for admin view)
  const {
    items, loading, pending, refresh,
    approveItem, rejectItem, deleteItem,
    toggleFeatured, toggleSpotlight, createItem, updateItem,
  } = useCommunityContent(communityId, { status: "all", limit: 100 });

  const [formOpen,        setFormOpen]        = useState(false);
  const [formType,        setFormType]        = useState<ContentType>("news");
  const [editingItem,     setEditingItem]     = useState<ContentItem | null>(null);
  const [previewOpen,     setPreviewOpen]     = useState(false);
  const [previewItem,     setPreviewItem]     = useState<ContentItem | null>(null);
  const [rejectionOpen,   setRejectionOpen]   = useState(false);
  const [rejectingItem,   setRejectingItem]   = useState<ContentItem | null>(null);

  // Filtered by type
  const news     = items.filter(i => i.type === "news");
  const events   = items.filter(i => i.type === "event");
  const articles = items.filter(i => i.type === "article");
  const vibes    = items.filter(i => i.type === "vibe");
  const pendingItems = items.filter(i => i.status === "pending");

  const handleApprove = async (id: string) => {
    await approveItem(id);
    setPreviewOpen(false);
  };

  const handleReject = (id: string) => {
    const item = items.find(i => i.id === id);
    if (item) { setRejectingItem(item); setRejectionOpen(true); }
  };

  const confirmReject = async (reason: string, notifyAuthor: boolean) => {
    if (!rejectingItem) return;
    await rejectItem(rejectingItem.id, reason);
    setPreviewOpen(false);
    setRejectingItem(null);
    if (notifyAuthor) toast({ title: "Author notified of rejection" });
  };

  const handleEdit = (item: ContentItem) => {
    setEditingItem(item);
    setFormType(item.type as ContentType);
    setFormOpen(true);
  };

  const handlePreview = (item: ContentItem) => { setPreviewItem(item); setPreviewOpen(true); };
  const handleDelete  = async (id: string) => { await deleteItem(id); setPreviewOpen(false); };
  const handleToggleFeatured  = (id: string) => toggleFeatured(id);
  const handleToggleSpotlight = (id: string) => toggleSpotlight(id);

  const handleCreateNew = (type: ContentType) => {
    setEditingItem(null);
    setFormType(type);
    setFormOpen(true);
  };

  const handleFormSubmit = async (data: Partial<ContentItem>) => {
    if (editingItem) await updateItem({ ...data, id: editingItem.id });
    else             await createItem({ ...data, type: formType });
    setFormOpen(false);
  };

  const handleBulkApprove = async (ids: string[]) => {
    for (const id of ids) await approveItem(id);
    toast({ title: `${ids.length} items approved` });
  };

  if (loading && items.length === 0) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/community/${communityId}`)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <FileText className="h-5 w-5 text-purple-600" />
          <h1 className="font-bold text-lg">Content Moderation</h1>
          {loading && <Loader2 className="h-4 w-4 animate-spin ml-auto text-muted-foreground" />}
        </div>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <div className="border-b px-4 overflow-x-auto">
          <div className="w-max min-w-full">
            <TabsList className="h-11 bg-transparent w-max">
              <TabsTrigger value="pending" className="gap-1">
                Pending
                {pending > 0 && <Badge variant="destructive" className="text-xs px-1">{pending}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="news">News <Badge variant="secondary" className="ml-1 text-xs">{news.length}</Badge></TabsTrigger>
              <TabsTrigger value="events">Events <Badge variant="secondary" className="ml-1 text-xs">{events.length}</Badge></TabsTrigger>
              <TabsTrigger value="articles">Articles <Badge variant="secondary" className="ml-1 text-xs">{articles.length}</Badge></TabsTrigger>
              <TabsTrigger value="vibes">Vibes <Badge variant="secondary" className="ml-1 text-xs">{vibes.length}</Badge></TabsTrigger>
            </TabsList>
          </div>
        </div>

        <div className="p-4">
          <TabsContent value="pending" className="mt-0">
            <PendingApprovalsTab
              pendingItems={pendingItems as any}
              onApprove={handleApprove}
              onReject={handleReject}
              onPreview={handlePreview as any}
              onBulkApprove={handleBulkApprove}
              onBulkReject={(ids) => toast({ title: "Please reject individually to add reasons" })}
            />
          </TabsContent>
          <TabsContent value="news" className="mt-0">
            <NewsManagementTab news={news as any} onCreateNew={() => handleCreateNew("news")}
              onEdit={handleEdit as any} onPreview={handlePreview as any} onDelete={handleDelete}
              onApprove={handleApprove} onReject={handleReject} onToggleFeatured={handleToggleFeatured} />
          </TabsContent>
          <TabsContent value="events" className="mt-0">
            <EventsManagementTab events={events as any} onCreateNew={() => handleCreateNew("event")}
              onEdit={handleEdit as any} onPreview={handlePreview as any} onDelete={handleDelete}
              onApprove={handleApprove} onReject={handleReject}
              onViewRSVPs={(id) => toast({ title: "RSVPs", description: `${events.find(e => e.id === id)?.rsvpCount ?? 0} attendees` })} />
          </TabsContent>
          <TabsContent value="articles" className="mt-0">
            <ArticlesManagementTab articles={articles as any} onCreateNew={() => handleCreateNew("article")}
              onEdit={handleEdit as any} onPreview={handlePreview as any} onDelete={handleDelete}
              onApprove={handleApprove} onReject={handleReject} onToggleFeatured={handleToggleFeatured} />
          </TabsContent>
          <TabsContent value="vibes" className="mt-0">
            <VibesManagementTab vibes={vibes as any} onCreateNew={() => handleCreateNew("vibe")}
              onEdit={handleEdit as any} onPreview={handlePreview as any} onDelete={handleDelete}
              onApprove={handleApprove} onReject={handleReject} onToggleSpotlight={handleToggleSpotlight} />
          </TabsContent>
        </div>
      </Tabs>

      <ContentFormDialog open={formOpen} onOpenChange={setFormOpen}
        contentType={formType} editingItem={editingItem as any} onSubmit={handleFormSubmit as any} />

      <ContentPreviewSheet open={previewOpen} onOpenChange={setPreviewOpen} content={previewItem as any}
        onApprove={handleApprove} onReject={handleReject}
        onEdit={(id) => { const item = items.find(i => i.id === id); if (item) handleEdit(item); }} />

      <RejectionReasonDialog open={rejectionOpen} onOpenChange={setRejectionOpen}
        contentTitle={rejectingItem?.title || ""} onConfirm={confirmReject} />
    </div>
  );
}
