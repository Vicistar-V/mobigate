import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Trash2, Edit2, Eye, MousePointer, Image as ImageIcon, Plus } from "lucide-react";
import { MobigateAdminHeader } from "@/components/mobigate/MobigateAdminHeader";
import { useToast } from "@/hooks/use-toast";

interface PromoAd {
  id: string;
  title: string;
  linkUrl: string;
  position: "top-banner" | "feed-insert" | "sidebar";
  active: boolean;
  impressions: number;
  clicks: number;
  thumbnail: string;
}

const initialAds: PromoAd[] = [
  { id: "1", title: "Mobigate Premium Launch", linkUrl: "https://mobigate.com/premium", position: "top-banner", active: true, impressions: 45230, clicks: 1890, thumbnail: "🚀" },
  { id: "2", title: "Quiz Championship 2026", linkUrl: "https://mobigate.com/quiz-championship", position: "feed-insert", active: true, impressions: 23100, clicks: 980, thumbnail: "🏆" },
  { id: "3", title: "Merchant Partner Program", linkUrl: "https://mobigate.com/merchants", position: "sidebar", active: false, impressions: 12400, clicks: 450, thumbnail: "🤝" },
  { id: "4", title: "Valentine's Gift Promo", linkUrl: "https://mobigate.com/valentines", position: "feed-insert", active: true, impressions: 67800, clicks: 3200, thumbnail: "💝" },
];

const positionLabels: Record<string, string> = {
  "top-banner": "Top Banner",
  "feed-insert": "Feed Insert",
  "sidebar": "Sidebar",
};

export default function PromotionalAdsPage() {
  const { toast } = useToast();
  const [ads, setAds] = useState<PromoAd[]>(initialAds);
  const [newTitle, setNewTitle] = useState("");
  const [newLink, setNewLink] = useState("");
  const [newPosition, setNewPosition] = useState<string>("top-banner");
  const [showUpload, setShowUpload] = useState(false);

  const handleToggle = (id: string) => {
    setAds(prev => prev.map(ad => ad.id === id ? { ...ad, active: !ad.active } : ad));
    const ad = ads.find(a => a.id === id);
    toast({ title: ad?.active ? "Ad Disabled" : "Ad Enabled", description: `"${ad?.title}" has been ${ad?.active ? "disabled" : "enabled"}.` });
  };

  const handleDelete = (id: string) => {
    const ad = ads.find(a => a.id === id);
    setAds(prev => prev.filter(a => a.id !== id));
    toast({ title: "Ad Deleted", description: `"${ad?.title}" has been removed.`, variant: "destructive" });
  };

  const handleUpload = () => {
    if (!newTitle.trim()) {
      toast({ title: "Title Required", description: "Please enter a title for the promotional ad.", variant: "destructive" });
      return;
    }
    const newAd: PromoAd = {
      id: Date.now().toString(),
      title: newTitle,
      linkUrl: newLink || "#",
      position: newPosition as PromoAd["position"],
      active: true,
      impressions: 0,
      clicks: 0,
      thumbnail: "📢",
    };
    setAds(prev => [newAd, ...prev]);
    setNewTitle("");
    setNewLink("");
    setNewPosition("top-banner");
    setShowUpload(false);
    toast({ title: "Ad Created", description: `"${newTitle}" has been uploaded and activated.` });
  };

  const totalImpressions = ads.reduce((sum, a) => sum + a.impressions, 0);
  const totalClicks = ads.reduce((sum, a) => sum + a.clicks, 0);
  const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) : "0";

  return (
    <div className="min-h-screen bg-background pb-20">
      <MobigateAdminHeader title="Promotional Ads" subtitle="Upload & manage platform banners" />

      <ScrollArea className="h-[calc(100vh-80px)]">
        <div className="p-4 space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <Card>
              <CardContent className="p-3 text-center">
                <p className="text-xs text-muted-foreground">Active</p>
                <p className="text-xl font-bold text-primary">{ads.filter(a => a.active).length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <p className="text-xs text-muted-foreground">Impressions</p>
                <p className="text-xl font-bold">{(totalImpressions / 1000).toFixed(1)}K</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <p className="text-xs text-muted-foreground">CTR</p>
                <p className="text-xl font-bold text-emerald-600">{ctr}%</p>
              </CardContent>
            </Card>
          </div>

          {/* Upload Button / Form */}
          {!showUpload ? (
            <Button onClick={() => setShowUpload(true)} className="w-full h-12">
              <Plus className="h-4 w-4 mr-2" />
              Upload New Promotional Ad
            </Button>
          ) : (
            <Card className="border-primary/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
                  New Promotional Ad
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Mock upload area */}
                <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-6 text-center">
                  <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">Tap to upload banner image</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">1200×300 recommended</p>
                </div>
                <Input
                  placeholder="Ad Title *"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="h-12"
                />
                <Input
                  placeholder="Link URL (optional)"
                  value={newLink}
                  onChange={e => setNewLink(e.target.value)}
                  className="h-12"
                />
                <Select value={newPosition} onValueChange={setNewPosition}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Display Position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top-banner">Top Banner</SelectItem>
                    <SelectItem value="feed-insert">Feed Insert</SelectItem>
                    <SelectItem value="sidebar">Sidebar</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowUpload(false)} className="flex-1 h-12">Cancel</Button>
                  <Button onClick={handleUpload} className="flex-1 h-12">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Active Promotional Ads */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">All Promotional Ads</h3>
            {ads.map(ad => (
              <Card key={ad.id} className={!ad.active ? "opacity-60" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center text-2xl shrink-0">
                      {ad.thumbnail}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-sm truncate">{ad.title}</p>
                        <Switch checked={ad.active} onCheckedChange={() => handleToggle(ad.id)} />
                      </div>
                      <Badge variant="secondary" className="text-xs mt-1">{positionLabels[ad.position]}</Badge>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {ad.impressions.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MousePointer className="h-3 w-3" />
                          {ad.clicks.toLocaleString()}
                        </span>
                        <span className="font-medium text-primary">
                          {ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(1) : 0}% CTR
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3 pt-3 border-t">
                    <Button variant="outline" size="sm" className="flex-1 h-10">
                      <Edit2 className="h-3.5 w-3.5 mr-1" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" className="h-10" onClick={() => handleDelete(ad.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
