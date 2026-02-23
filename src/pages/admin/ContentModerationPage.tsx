import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Badge } from "@/components/ui/badge";
import { mockAdminNews, mockAdminEvents, mockAdminArticles, mockAdminVibes, getPendingApprovals, AdminContentItem, getContentAdminStats, ContentType } from "@/data/adminContentData";
import { useToast } from "@/hooks/use-toast";
import { NewsManagementTab } from "@/components/admin/content/NewsManagementTab";
import { EventsManagementTab } from "@/components/admin/content/EventsManagementTab";
import { ArticlesManagementTab } from "@/components/admin/content/ArticlesManagementTab";
import { VibesManagementTab } from "@/components/admin/content/VibesManagementTab";
import { PendingApprovalsTab } from "@/components/admin/content/PendingApprovalsTab";
import { ContentFormDialog } from "@/components/admin/content/ContentFormDialog";
import { ContentPreviewSheet } from "@/components/admin/content/ContentPreviewSheet";
import { RejectionReasonDialog } from "@/components/admin/content/RejectionReasonDialog";

export default function ContentModerationPage() {
  const { communityId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [news, setNews] = useState(mockAdminNews);
  const [events, setEvents] = useState(mockAdminEvents);
  const [articles, setArticles] = useState(mockAdminArticles);
  const [vibes, setVibes] = useState(mockAdminVibes);
  
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [formContentType, setFormContentType] = useState<ContentType>("news");
  const [editingItem, setEditingItem] = useState<AdminContentItem | null>(null);
  
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<AdminContentItem | null>(null);
  
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [rejectingItem, setRejectingItem] = useState<AdminContentItem | null>(null);
  
  const stats = getContentAdminStats();
  const pendingItems = getPendingApprovals();

  const handleApprove = (id: string) => {
    setNews(prev => prev.map(n => n.id === id ? { ...n, status: 'published' as const, publishedAt: new Date() } : n));
    setEvents(prev => prev.map(e => e.id === id ? { ...e, status: 'published' as const, publishedAt: new Date() } : e));
    setArticles(prev => prev.map(a => a.id === id ? { ...a, status: 'published' as const, publishedAt: new Date() } : a));
    setVibes(prev => prev.map(v => v.id === id ? { ...v, status: 'published' as const, publishedAt: new Date() } : v));
    toast({ title: "Content Approved", description: "The content has been published" });
    setPreviewOpen(false);
  };

  const handleReject = (id: string) => {
    const item = [...news, ...events, ...articles, ...vibes].find(i => i.id === id);
    if (item) {
      setRejectingItem(item);
      setRejectionDialogOpen(true);
    }
  };

  const confirmReject = (reason: string, notifyAuthor: boolean) => {
    if (!rejectingItem) return;
    const id = rejectingItem.id;
    
    setNews(prev => prev.map(n => n.id === id ? { ...n, status: 'rejected' as const, rejectionReason: reason } : n));
    setEvents(prev => prev.map(e => e.id === id ? { ...e, status: 'rejected' as const, rejectionReason: reason } : e));
    setArticles(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' as const, rejectionReason: reason } : a));
    setVibes(prev => prev.map(v => v.id === id ? { ...v, status: 'rejected' as const, rejectionReason: reason } : v));
    
    toast({ title: "Content Rejected", description: notifyAuthor ? "Author has been notified" : "Rejection recorded", variant: "destructive" });
    setPreviewOpen(false);
    setRejectingItem(null);
  };

  const handleEdit = (item: AdminContentItem) => {
    setEditingItem(item);
    setFormContentType(item.type);
    setFormDialogOpen(true);
  };

  const handlePreview = (item: AdminContentItem) => {
    setPreviewItem(item);
    setPreviewOpen(true);
  };

  const handleDelete = (id: string) => {
    setNews(prev => prev.filter(n => n.id !== id));
    setEvents(prev => prev.filter(e => e.id !== id));
    setArticles(prev => prev.filter(a => a.id !== id));
    setVibes(prev => prev.filter(v => v.id !== id));
    toast({ title: "Content Deleted", variant: "destructive" });
  };

  const handleToggleFeatured = (id: string) => {
    setNews(prev => prev.map(n => n.id === id ? { ...n, featured: !n.featured } : n));
    setArticles(prev => prev.map(a => a.id === id ? { ...a, featured: !a.featured } : a));
    toast({ title: "Featured status updated" });
  };

  const handleToggleSpotlight = (id: string) => {
    setVibes(prev => prev.map(v => v.id === id ? { ...v, spotlight: !v.spotlight } : v));
    toast({ title: "Spotlight status updated" });
  };

  const handleCreateNew = (type: ContentType) => {
    setEditingItem(null);
    setFormContentType(type);
    setFormDialogOpen(true);
  };

  const handleFormSubmit = (data: Partial<AdminContentItem>) => {
    toast({ title: editingItem ? "Content Updated" : "Content Created", description: `${data.title} has been saved` });
  };

  const handleBulkApprove = (ids: string[]) => {
    ids.forEach(id => handleApprove(id));
    toast({ title: "Bulk Approved", description: `${ids.length} items have been published` });
  };

  const handleBulkReject = (ids: string[]) => {
    toast({ title: "Bulk Reject", description: "Please reject items individually to provide reasons" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/community/${communityId}/admin`)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-600" />
            <h1 className="font-bold text-lg">Content Moderation</h1>
          </div>
        </div>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <div className="border-b px-4 overflow-x-auto">
          <div className="w-max min-w-full">
            <TabsList className="h-11 bg-transparent w-max">
              <TabsTrigger value="pending" className="gap-1">
                Pending <Badge variant="destructive" className="text-xs px-1">{stats.totalPending}</Badge>
              </TabsTrigger>
              <TabsTrigger value="news">News</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="articles">Articles</TabsTrigger>
              <TabsTrigger value="vibes">Vibes</TabsTrigger>
            </TabsList>
          </div>
        </div>

        <div className="p-4">
          <TabsContent value="pending" className="mt-0">
            <PendingApprovalsTab
              pendingItems={pendingItems}
              onApprove={handleApprove}
              onReject={handleReject}
              onPreview={handlePreview}
              onBulkApprove={handleBulkApprove}
              onBulkReject={handleBulkReject}
            />
          </TabsContent>
          <TabsContent value="news" className="mt-0">
            <NewsManagementTab
              news={news}
              onCreateNew={() => handleCreateNew("news")}
              onEdit={handleEdit}
              onPreview={handlePreview}
              onDelete={handleDelete}
              onApprove={handleApprove}
              onReject={handleReject}
              onToggleFeatured={handleToggleFeatured}
            />
          </TabsContent>
          <TabsContent value="events" className="mt-0">
            <EventsManagementTab
              events={events}
              onCreateNew={() => handleCreateNew("event")}
              onEdit={handleEdit}
              onPreview={handlePreview}
              onDelete={handleDelete}
              onApprove={handleApprove}
              onReject={handleReject}
              onViewRSVPs={(id) => toast({ title: "View RSVPs", description: "Opening RSVP list..." })}
            />
          </TabsContent>
          <TabsContent value="articles" className="mt-0">
            <ArticlesManagementTab
              articles={articles}
              onCreateNew={() => handleCreateNew("article")}
              onEdit={handleEdit}
              onPreview={handlePreview}
              onDelete={handleDelete}
              onApprove={handleApprove}
              onReject={handleReject}
              onToggleFeatured={handleToggleFeatured}
            />
          </TabsContent>
          <TabsContent value="vibes" className="mt-0">
            <VibesManagementTab
              vibes={vibes}
              onCreateNew={() => handleCreateNew("vibe")}
              onEdit={handleEdit}
              onPreview={handlePreview}
              onDelete={handleDelete}
              onApprove={handleApprove}
              onReject={handleReject}
              onToggleSpotlight={handleToggleSpotlight}
            />
          </TabsContent>
        </div>
      </Tabs>

      <ContentFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        contentType={formContentType}
        editingItem={editingItem}
        onSubmit={handleFormSubmit}
      />

      <ContentPreviewSheet
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        content={previewItem}
        onApprove={handleApprove}
        onReject={handleReject}
        onEdit={(id) => {
          const item = [...news, ...events, ...articles, ...vibes].find(i => i.id === id);
          if (item) handleEdit(item);
        }}
      />

      <RejectionReasonDialog
        open={rejectionDialogOpen}
        onOpenChange={setRejectionDialogOpen}
        contentTitle={rejectingItem?.title || ""}
        onConfirm={confirmReject}
      />
    </div>
  );
}
