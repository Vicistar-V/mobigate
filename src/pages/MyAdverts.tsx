import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { loadUserAdverts, deleteAdvert, updateAdvertStatus } from "@/lib/advertStorage";
import { SavedAdvert } from "@/types/advert";
import { formatCurrency } from "@/lib/advertPricing";
import { Plus, Eye, Trash2, Play, Pause, BarChart3, Calendar, Zap } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const getStatusColor = (status: SavedAdvert["status"]) => {
  switch (status) {
    case "active":
      return "default";
    case "pending":
      return "secondary";
    case "approved":
      return "default";
    case "paused":
      return "outline";
    case "rejected":
      return "destructive";
    case "expired":
      return "outline";
    default:
      return "secondary";
  }
};

const getStatusLabel = (status: SavedAdvert["status"]) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export default function MyAdverts() {
  const navigate = useNavigate();
  const [adverts, setAdverts] = useState<SavedAdvert[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAdvert, setSelectedAdvert] = useState<SavedAdvert | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    loadAdverts();
  }, []);

  const loadAdverts = () => {
    const userAdverts = loadUserAdverts();
    setAdverts(userAdverts);
  };

  const handleDelete = (advert: SavedAdvert) => {
    setSelectedAdvert(advert);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedAdvert) {
      try {
        deleteAdvert(selectedAdvert.id);
        toast({
          title: "Advert deleted",
          description: "Your advert has been successfully deleted.",
        });
        loadAdverts();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete advert. Please try again.",
          variant: "destructive",
        });
      }
    }
    setDeleteDialogOpen(false);
    setSelectedAdvert(null);
  };

  const handleTogglePause = (advert: SavedAdvert) => {
    try {
      const newStatus = advert.status === "active" ? "paused" : "active";
      updateAdvertStatus(advert.id, newStatus);
      toast({
        title: advert.status === "active" ? "Advert paused" : "Advert resumed",
        description: `Your advert is now ${newStatus}.`,
      });
      loadAdverts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update advert status.",
        variant: "destructive",
      });
    }
  };

  const filterAdverts = (status?: string) => {
    if (!status || status === "all") return adverts;
    return adverts.filter(ad => ad.status === status);
  };

  const AdvertCard = ({ advert }: { advert: SavedAdvert }) => {
    const canPause = advert.status === "active" || advert.status === "paused";
    const daysUntilExpiry = advert.expiresAt
      ? Math.ceil((advert.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : null;

    return (
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">
                  {advert.category === "pictorial" ? "Image Advert" : "Video Advert"}
                </CardTitle>
                <Badge variant={getStatusColor(advert.status)}>
                  {getStatusLabel(advert.status)}
                </Badge>
              </div>
              <CardDescription>
                {advert.type.replace("-", " ").replace("multiple", "Multiple")} • {advert.size} • {advert.dpdPackage}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {canPause && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTogglePause(advert)}
                >
                  {advert.status === "active" ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(advert)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Preview Images */}
          <div className="grid grid-cols-4 gap-2">
            {advert.fileUrls.slice(0, 4).map((url, index) => (
              <div key={index} className="aspect-video bg-muted rounded overflow-hidden">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{advert.statistics.impressions.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Impressions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{advert.statistics.clicks.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Clicks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{advert.statistics.views.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Views</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{advert.statistics.displayedToday}</div>
              <div className="text-xs text-muted-foreground">Today</div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t">
            <div className="flex items-center gap-2 text-sm">
              <Zap className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">DPD:</span>
              <span className="font-medium">{advert.pricing.displayPerDay === Infinity ? "Unlimited" : advert.pricing.displayPerDay}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Cost:</span>
              <span className="font-medium">{formatCurrency(advert.pricing.totalCost)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Launch:</span>
              <span className="font-medium">{advert.launchDate.toLocaleDateString()}</span>
            </div>
            {daysUntilExpiry !== null && (
              <div className="flex items-center gap-2 text-sm">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Expires:</span>
                <span className="font-medium">{daysUntilExpiry} days</span>
              </div>
            )}
          </div>

          {/* Rejected Reason */}
          {advert.status === "rejected" && advert.rejectedReason && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive font-medium">Rejection Reason</p>
              <p className="text-xs text-muted-foreground mt-1">{advert.rejectedReason}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const filteredAdverts = filterAdverts(activeTab);

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Adverts</h1>
          <p className="text-muted-foreground mt-1">Manage and track your advertising campaigns</p>
        </div>
        <Button onClick={() => navigate("/submit-advert")}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Advert
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All ({adverts.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({filterAdverts("active").length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({filterAdverts("pending").length})</TabsTrigger>
          <TabsTrigger value="paused">Paused ({filterAdverts("paused").length})</TabsTrigger>
          <TabsTrigger value="expired">Expired ({filterAdverts("expired").length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredAdverts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No adverts found</h3>
                <p className="text-muted-foreground mb-4">
                  {activeTab === "all"
                    ? "Create your first advert to start reaching your audience"
                    : `No ${activeTab} adverts at the moment`}
                </p>
                {activeTab === "all" && (
                  <Button onClick={() => navigate("/submit-advert")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Advert
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredAdverts.map(advert => (
                <AdvertCard key={advert.id} advert={advert} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Advert</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this advert? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
