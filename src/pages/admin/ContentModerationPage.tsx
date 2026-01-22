import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Plus, Search, Eye, Edit, Trash2, Check, X, Clock, Newspaper, Calendar, BookOpen, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockAdminNews, mockAdminEvents, mockAdminArticles, mockAdminVibes, getPendingApprovals, AdminContentItem, getContentAdminStats } from "@/data/adminContentData";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const getStatusColor = (status: AdminContentItem['status']) => {
  switch (status) {
    case 'published': return 'bg-green-500/10 text-green-600';
    case 'pending': return 'bg-amber-500/10 text-amber-600';
    case 'draft': return 'bg-gray-500/10 text-gray-600';
    case 'rejected': return 'bg-red-500/10 text-red-600';
    default: return 'bg-muted text-muted-foreground';
  }
};

const getTypeIcon = (type: AdminContentItem['type']) => {
  switch (type) {
    case 'news': return Newspaper;
    case 'event': return Calendar;
    case 'article': return BookOpen;
    case 'vibe': return MessageSquare;
    default: return FileText;
  }
};

function ContentList({ items, onApprove, onReject, onEdit, onDelete }: { 
  items: AdminContentItem[], 
  onApprove: (id: string) => void, 
  onReject: (id: string) => void,
  onEdit: (id: string) => void,
  onDelete: (id: string) => void
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const filtered = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {filtered.map(item => (
        <Card key={item.id}>
          <CardContent className="p-3">
            <div className="flex gap-3">
              <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center shrink-0">
                {item.thumbnail ? <img src={item.thumbnail} alt="" className="w-full h-full object-cover rounded-lg" /> : React.createElement(getTypeIcon(item.type), { className: "h-6 w-6 text-muted-foreground" })}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-medium text-sm line-clamp-1">{item.title}</h4>
                  <Badge className={`text-[10px] shrink-0 ${getStatusColor(item.status)}`}>{item.status}</Badge>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Avatar className="h-4 w-4"><AvatarImage src={item.authorAvatar} /><AvatarFallback className="text-[8px]">{item.authorName[0]}</AvatarFallback></Avatar>
                  <span className="text-xs text-muted-foreground">{item.authorName}</span>
                </div>
                <div className="flex gap-1 mt-2">
                  {item.status === 'pending' && (
                    <>
                      <Button size="sm" variant="outline" className="h-6 text-[10px] text-green-600" onClick={() => onApprove(item.id)}><Check className="h-3 w-3" /></Button>
                      <Button size="sm" variant="outline" className="h-6 text-[10px] text-red-600" onClick={() => onReject(item.id)}><X className="h-3 w-3" /></Button>
                    </>
                  )}
                  <Button size="sm" variant="outline" className="h-6 text-[10px]" onClick={() => onEdit(item.id)}><Edit className="h-3 w-3" /></Button>
                  <Button size="sm" variant="outline" className="h-6 text-[10px] text-destructive" onClick={() => onDelete(item.id)}><Trash2 className="h-3 w-3" /></Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function ContentModerationPage() {
  const { communityId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [news, setNews] = useState(mockAdminNews);
  const [events, setEvents] = useState(mockAdminEvents);
  const [articles, setArticles] = useState(mockAdminArticles);
  const [vibes, setVibes] = useState(mockAdminVibes);
  
  const stats = getContentAdminStats();
  const pendingItems = getPendingApprovals();

  const handleApprove = (id: string) => {
    setNews(prev => prev.map(n => n.id === id ? { ...n, status: 'published' as const, publishedAt: new Date() } : n));
    setEvents(prev => prev.map(e => e.id === id ? { ...e, status: 'published' as const, publishedAt: new Date() } : e));
    setArticles(prev => prev.map(a => a.id === id ? { ...a, status: 'published' as const, publishedAt: new Date() } : a));
    setVibes(prev => prev.map(v => v.id === id ? { ...v, status: 'published' as const, publishedAt: new Date() } : v));
    toast({ title: "Content Approved", description: "The content has been published" });
  };

  const handleReject = (id: string) => {
    setNews(prev => prev.map(n => n.id === id ? { ...n, status: 'rejected' as const } : n));
    setEvents(prev => prev.map(e => e.id === id ? { ...e, status: 'rejected' as const } : e));
    setArticles(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' as const } : a));
    setVibes(prev => prev.map(v => v.id === id ? { ...v, status: 'rejected' as const } : v));
    toast({ title: "Content Rejected", variant: "destructive" });
  };

  const handleEdit = (id: string) => toast({ title: "Edit", description: "Opening editor..." });
  const handleDelete = (id: string) => toast({ title: "Deleted", variant: "destructive" });

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
        <div className="border-b px-4">
          <ScrollArea className="w-full" style={{ overflowX: 'auto' }}>
            <TabsList className="h-11 bg-transparent w-max">
              <TabsTrigger value="pending" className="gap-1">Pending <Badge variant="destructive" className="text-[10px] px-1">{stats.totalPending}</Badge></TabsTrigger>
              <TabsTrigger value="news">News</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="articles">Articles</TabsTrigger>
              <TabsTrigger value="vibes">Vibes</TabsTrigger>
            </TabsList>
          </ScrollArea>
        </div>

        <div className="p-4">
          <TabsContent value="pending" className="mt-0">
            <div className="mb-4">
              <Button className="gap-2 bg-purple-600 hover:bg-purple-700"><Plus className="h-4 w-4" />Create Content</Button>
            </div>
            <ContentList items={pendingItems} onApprove={handleApprove} onReject={handleReject} onEdit={handleEdit} onDelete={handleDelete} />
          </TabsContent>
          <TabsContent value="news" className="mt-0">
            <ContentList items={news} onApprove={handleApprove} onReject={handleReject} onEdit={handleEdit} onDelete={handleDelete} />
          </TabsContent>
          <TabsContent value="events" className="mt-0">
            <ContentList items={events} onApprove={handleApprove} onReject={handleReject} onEdit={handleEdit} onDelete={handleDelete} />
          </TabsContent>
          <TabsContent value="articles" className="mt-0">
            <ContentList items={articles} onApprove={handleApprove} onReject={handleReject} onEdit={handleEdit} onDelete={handleDelete} />
          </TabsContent>
          <TabsContent value="vibes" className="mt-0">
            <ContentList items={vibes} onApprove={handleApprove} onReject={handleReject} onEdit={handleEdit} onDelete={handleDelete} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
