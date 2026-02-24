import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { loadAllAdverts, deleteAdvert, updateAdvertStatus } from "@/lib/advertStorage";
import { SavedAdvert } from "@/types/advert";
import { 
  Search, 
  Filter, 
  Eye, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Play, 
  Pause, 
  BarChart3, 
  Calendar, 
  Zap, 
  X,
  Users,
  TrendingUp,
  Activity,
  Package,
  ChevronDown,
  Shield,
  Clock,
  AlertTriangle
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// User mapping for display (supports PHP window.__USER_MAP__)
const getUserDisplay = (userId: string) => {
  // Priority 1: PHP user map
  if (typeof window !== 'undefined' && window.__USER_MAP__?.[userId]) {
    return window.__USER_MAP__[userId].name;
  }
  
  // Priority 2: Hardcoded fallback (development)
  const userMap: Record<string, string> = {
    "user-123": "John Doe",
    "user-456": "Jane Smith",
    "user-789": "Bob Johnson",
  };
  return userMap[userId] || `User ${userId.slice(-4)}`;
};

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

export default function AdminManageAdverts() {
  const navigate = useNavigate();
  const [adverts, setAdverts] = useState<SavedAdvert[]>([]);
  const [filteredAdverts, setFilteredAdverts] = useState<SavedAdvert[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAdverts, setSelectedAdverts] = useState<Set<string>>(new Set());
  
  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [bulkActionDialogOpen, setBulkActionDialogOpen] = useState(false);
  
  // Selected advert for actions
  const [selectedAdvert, setSelectedAdvert] = useState<SavedAdvert | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [bulkAction, setBulkAction] = useState<"approve" | "reject" | "delete" | null>(null);
  
  // Preview media
  const [previewMedia, setPreviewMedia] = useState<{ url: string; type: string } | null>(null);
  
  // Filter drawer for mobile
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  useEffect(() => {
    loadAdvertsData();
  }, []);

  useEffect(() => {
    filterAndSearchAdverts();
  }, [adverts, activeTab, searchQuery]);

  const loadAdvertsData = () => {
    const allAdverts = loadAllAdverts();
    setAdverts(allAdverts);
  };

  const filterAndSearchAdverts = () => {
    let filtered = adverts;

    // Filter by status tab
    if (activeTab !== "all") {
      filtered = filtered.filter(ad => ad.status === activeTab);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(ad => 
        ad.id.toLowerCase().includes(query) ||
        ad.userId.toLowerCase().includes(query) ||
        getUserDisplay(ad.userId).toLowerCase().includes(query) ||
        ad.category.toLowerCase().includes(query) ||
        ad.dpdPackage.toLowerCase().includes(query)
      );
    }

    setFilteredAdverts(filtered);
  };

  const getStatistics = () => {
    const total = adverts.length;
    const pending = adverts.filter(ad => ad.status === "pending").length;
    const active = adverts.filter(ad => ad.status === "active").length;
    const totalImpressions = adverts.reduce((sum, ad) => sum + ad.statistics.impressions, 0);
    
    return { total, pending, active, totalImpressions };
  };

  const stats = getStatistics();

  // Selection handlers
  const toggleSelectAdvert = (advertId: string) => {
    const newSelected = new Set(selectedAdverts);
    if (newSelected.has(advertId)) {
      newSelected.delete(advertId);
    } else {
      newSelected.add(advertId);
    }
    setSelectedAdverts(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedAdverts.size === filteredAdverts.length) {
      setSelectedAdverts(new Set());
    } else {
      setSelectedAdverts(new Set(filteredAdverts.map(ad => ad.id)));
    }
  };

  // Action handlers
  const handleApprove = (advert: SavedAdvert) => {
    setSelectedAdvert(advert);
    setApproveDialogOpen(true);
  };

  const confirmApprove = () => {
    if (selectedAdvert) {
      try {
        updateAdvertStatus(selectedAdvert.id, "approved");
        toast({
          title: "Advert approved",
          description: "The advert is now live and active.",
        });
        loadAdvertsData();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to approve advert.",
          variant: "destructive",
        });
      }
    }
    setApproveDialogOpen(false);
    setSelectedAdvert(null);
  };

  const handleReject = (advert: SavedAdvert) => {
    setSelectedAdvert(advert);
    // Pre-fill with default rejection template
    setRejectionReason("Sorry, your Advert Subscription placement was rejected by our System. It's either your Advert material did not follow our Community Standards, or appropriate Specifications were not maintained. Click below for more clarification.\n\nPlease correct the very issues raised, and Submit again. Enjoy the world of Mobigate ...your World!");
    setRejectDialogOpen(true);
  };

  const confirmReject = () => {
    if (selectedAdvert && rejectionReason.trim()) {
      try {
        updateAdvertStatus(selectedAdvert.id, "rejected", rejectionReason);
        toast({
          title: "Advert rejected",
          description: "User will be notified of the rejection.",
        });
        loadAdvertsData();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to reject advert.",
          variant: "destructive",
        });
      }
    }
    setRejectDialogOpen(false);
    setSelectedAdvert(null);
    setRejectionReason("");
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
          description: "The advert has been permanently removed.",
        });
        loadAdvertsData();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete advert.",
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
        description: `The advert is now ${newStatus}.`,
      });
      loadAdvertsData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update advert status.",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (advert: SavedAdvert) => {
    setSelectedAdvert(advert);
    setDetailsDialogOpen(true);
  };

  // Bulk actions
  const handleBulkAction = (action: "approve" | "reject" | "delete") => {
    if (selectedAdverts.size === 0) {
      toast({
        title: "No adverts selected",
        description: "Please select at least one advert.",
        variant: "destructive",
      });
      return;
    }
    setBulkAction(action);
    if (action === "reject") {
      // Pre-fill with default rejection template for bulk actions
      setRejectionReason("Sorry, your Advert Subscription placement was rejected by our System. It's either your Advert material did not follow our Community Standards, or appropriate Specifications were not maintained. Click below for more clarification.\n\nPlease correct the very issues raised, and Submit again. Enjoy the world of Mobigate ...your World!");
    }
    setBulkActionDialogOpen(true);
  };

  const confirmBulkAction = () => {
    try {
      const advertIds = Array.from(selectedAdverts);
      
      advertIds.forEach(id => {
        if (bulkAction === "approve") {
          updateAdvertStatus(id, "approved");
        } else if (bulkAction === "reject") {
          updateAdvertStatus(id, "rejected", rejectionReason || "Bulk rejection");
        } else if (bulkAction === "delete") {
          deleteAdvert(id);
        }
      });

      toast({
        title: "Bulk action completed",
        description: `${advertIds.length} advert(s) ${bulkAction === "delete" ? "deleted" : bulkAction + "d"}.`,
      });

      setSelectedAdverts(new Set());
      loadAdvertsData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete bulk action.",
        variant: "destructive",
      });
    }

    setBulkActionDialogOpen(false);
    setBulkAction(null);
    setRejectionReason("");
  };

  // Admin Advert Card Component
  const AdminAdvertCard = ({ advert }: { advert: SavedAdvert }) => {
    const canPause = advert.status === "active" || advert.status === "paused";
    const isPending = advert.status === "pending";
    const isSelected = selectedAdverts.has(advert.id);
    const daysUntilExpiry = advert.expiresAt
      ? Math.ceil((advert.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : null;

    return (
      <Card className={cn(
        "relative transition-all",
        isSelected && "ring-2 ring-primary"
      )}>
        {/* Selection Checkbox */}
        <div className="absolute top-3 left-3 z-10">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => toggleSelectAdvert(advert.id)}
            className="bg-background"
          />
        </div>

        <CardHeader className="pt-12">
          <div className="flex flex-col gap-3">
            {/* User Info Badge */}
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{getUserDisplay(advert.userId)}</span>
              <Badge variant="outline" className="text-xs">
                {advert.userId.slice(-4)}
              </Badge>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <CardTitle className="text-base sm:text-lg">
                    {advert.category === "pictorial" ? "Image Advert" : "Video Advert"}
                  </CardTitle>
                  <Badge variant={getStatusColor(advert.status)}>
                    {getStatusLabel(advert.status)}
                  </Badge>
                </div>
                <CardDescription className="text-xs">
                  {advert.type.replace("-", " ").replace("multiple", "Multiple")} • {advert.size}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Preview Images */}
          <div className="grid grid-cols-4 gap-2">
            {advert.fileUrls.slice(0, 4).map((url, index) => (
              <div 
                key={index} 
                className="aspect-video bg-muted rounded overflow-hidden cursor-pointer hover:opacity-80 transition-opacity relative group"
                onClick={() => setPreviewMedia({ url, type: advert.category })}
              >
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {advert.category === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                    <Play className="h-6 w-6 text-white" fill="white" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="h-5 w-5 text-white drop-shadow-lg" />
                </div>
              </div>
            ))}
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
            <div className="text-center p-2 bg-muted/50 rounded">
              <div className="text-lg sm:text-xl font-bold">{advert.statistics.impressions.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Impressions</div>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded">
              <div className="text-lg sm:text-xl font-bold">{advert.statistics.clicks.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Clicks</div>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded">
              <div className="text-lg sm:text-xl font-bold">{advert.statistics.views.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Views</div>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded">
              <div className="text-lg sm:text-xl font-bold">{advert.statistics.displayedToday}</div>
              <div className="text-xs text-muted-foreground">Today</div>
            </div>
          </div>

          {/* Info Grid - Minimal Financial Info */}
          <div className="grid grid-cols-1 gap-2 pt-2 border-t sm:grid-cols-2">
            <div className="flex items-center gap-2 text-sm">
              <Package className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground">Package:</span>
              <span className="font-medium capitalize truncate">{advert.dpdPackage.replace("-", " ")}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Zap className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground">DPD:</span>
              <span className="font-medium">{advert.pricing.displayPerDay === Infinity ? "Unlimited" : advert.pricing.displayPerDay.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground">Launch:</span>
              <span className="font-medium">{advert.launchDate.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground">Created:</span>
              <span className="font-medium">{advert.createdAt.toLocaleDateString()}</span>
            </div>
            {daysUntilExpiry !== null && (
              <div className="flex items-center gap-2 text-sm col-span-full">
                <Eye className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">Expires in:</span>
                <span className="font-medium">{daysUntilExpiry} days</span>
              </div>
            )}
          </div>

          {/* Rejected Reason */}
          {advert.status === "rejected" && advert.rejectedReason && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-destructive font-medium">Rejection Reason</p>
                  <p className="text-xs text-muted-foreground mt-1">{advert.rejectedReason}</p>
                </div>
              </div>
            </div>
          )}

          {/* Approved Reason */}
          {(advert.status === "approved" || advert.status === "active") && advert.approvedReason && (
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-primary font-medium">Approval Message</p>
                  <p className="text-xs text-muted-foreground mt-1">{advert.approvedReason}</p>
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Admin Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewDetails(advert)}
              className="flex-1 min-w-[100px]"
            >
              <Eye className="h-4 w-4 mr-1" />
              Details
            </Button>

            {isPending && (
              <>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleApprove(advert)}
                  className="flex-1 min-w-[100px]"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleReject(advert)}
                  className="flex-1 min-w-[100px]"
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </>
            )}

            {canPause && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTogglePause(advert)}
                className="min-w-[100px]"
              >
                {advert.status === "active" ? (
                  <>
                    <Pause className="h-4 w-4 mr-1" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-1" />
                    Resume
                  </>
                )}
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDelete(advert)}
              className="min-w-[100px]"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <Header />
      <div className="container mx-auto py-4 px-4 max-w-7xl sm:py-8">
        {/* Page Header */}
        <div className="flex flex-col gap-3 mb-6 sm:mb-8">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage and moderate all advertising campaigns across the platform
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-4 sm:gap-4 sm:mb-8">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Adverts</p>
                  <p className="text-xl sm:text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Pending</p>
                  <p className="text-xl sm:text-2xl font-bold">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Activity className="h-5 w-5 text-green-600 dark:text-green-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Active</p>
                  <p className="text-xl sm:text-2xl font-bold">{stats.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Impressions</p>
                  <p className="text-lg sm:text-2xl font-bold">{(stats.totalImpressions / 1000).toFixed(1)}k</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by ID, user, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          {/* Mobile Filter Button */}
          <Sheet open={filterDrawerOpen} onOpenChange={setFilterDrawerOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="sm:hidden">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[92vh] overflow-y-auto touch-auto">
              <SheetHeader>
                <SheetTitle>Filter Adverts</SheetTitle>
                <SheetDescription>
                  Apply filters to narrow down your search
                </SheetDescription>
              </SheetHeader>
              <div className="mt-4 space-y-5">
                {/* Status Filter */}
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Status</Label>
                  <div className="flex flex-wrap gap-2">
                    {["all", "pending", "approved", "active", "paused", "rejected", "expired"].map((status) => (
                      <Button
                        key={status}
                        size="sm"
                        variant={activeTab === status ? "default" : "outline"}
                        onClick={() => {
                          setActiveTab(status);
                        }}
                        className="capitalize"
                      >
                        {status}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Category Filter */}
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Category</Label>
                  <div className="flex flex-wrap gap-2">
                    {["pictoral", "video"].map((cat) => (
                      <Button
                        key={cat}
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSearchQuery(cat);
                          setFilterDrawerOpen(false);
                        }}
                        className="capitalize"
                      >
                        {cat}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Quick Search */}
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Search</Label>
                  <Input
                    type="search"
                    placeholder="Search by ID, user, category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setActiveTab("all");
                      setSearchQuery("");
                    }}
                  >
                    Clear All
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => setFilterDrawerOpen(false)}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Bulk Actions Bar */}
        {selectedAdverts.size > 0 && (
          <Card className="mb-4 border-primary">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedAdverts.size === filteredAdverts.length}
                    onCheckedChange={toggleSelectAll}
                  />
                  <span className="text-sm font-medium">
                    {selectedAdverts.size} selected
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => handleBulkAction("approve")}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve All
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleBulkAction("reject")}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject All
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkAction("delete")}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <div className="w-full overflow-x-auto">
            <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex">
              <TabsTrigger value="all" className="text-xs sm:text-sm">
                All <Badge variant="secondary" className="ml-1 text-xs">{adverts.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="pending" className="text-xs sm:text-sm">
                Pending <Badge variant="secondary" className="ml-1 text-xs">{stats.pending}</Badge>
              </TabsTrigger>
              <TabsTrigger value="active" className="text-xs sm:text-sm">
                Active <Badge variant="secondary" className="ml-1 text-xs">{stats.active}</Badge>
              </TabsTrigger>
              <TabsTrigger value="approved" className="text-xs sm:text-sm">
                Approved
              </TabsTrigger>
              <TabsTrigger value="paused" className="text-xs sm:text-sm">
                Paused
              </TabsTrigger>
              <TabsTrigger value="rejected" className="text-xs sm:text-sm">
                Rejected
              </TabsTrigger>
              <TabsTrigger value="expired" className="text-xs sm:text-sm">
                Expired
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredAdverts.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No adverts found</h3>
                  <p className="text-muted-foreground text-sm">
                    {searchQuery
                      ? "Try adjusting your search query"
                      : activeTab === "all"
                      ? "No adverts in the system yet"
                      : `No ${activeTab} adverts at the moment`}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {filteredAdverts.map(advert => (
                  <AdminAdvertCard key={advert.id} advert={advert} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Approve Dialog */}
        <AlertDialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Approve Advert</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to approve this advert? It will become active and visible to users.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmApprove}>
                Approve
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Reject Dialog */}
        <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Advert</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting this advert. The user will be notified.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="rejection-reason">Rejection Reason *</Label>
                <Textarea
                  id="rejection-reason"
                  placeholder="Edit the template or write your own rejection reason..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={8}
                  className="font-sans"
                />
                <p className="text-xs text-muted-foreground">
                  Template pre-filled. You can edit, delete, or send as-is.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmReject}
                disabled={!rejectionReason.trim()}
              >
                Reject Advert
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Advert</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to permanently delete this advert? This action cannot be undone.
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

        {/* Bulk Action Dialog */}
        <Dialog open={bulkActionDialogOpen} onOpenChange={setBulkActionDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Bulk {bulkAction === "approve" ? "Approve" : bulkAction === "reject" ? "Reject" : "Delete"}
              </DialogTitle>
              <DialogDescription>
                You are about to {bulkAction} {selectedAdverts.size} advert(s). 
                {bulkAction === "delete" && " This action cannot be undone."}
              </DialogDescription>
            </DialogHeader>
            {bulkAction === "reject" && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="bulk-rejection-reason">Rejection Reason *</Label>
                  <Textarea
                    id="bulk-rejection-reason"
                    placeholder="Edit the template or write your own rejection reason..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={8}
                    className="font-sans"
                  />
                  <p className="text-xs text-muted-foreground">
                    Template pre-filled. You can edit, delete, or send as-is.
                  </p>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setBulkActionDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant={bulkAction === "delete" || bulkAction === "reject" ? "destructive" : "default"}
                onClick={confirmBulkAction}
                disabled={bulkAction === "reject" && !rejectionReason.trim()}
              >
                Confirm {bulkAction === "approve" ? "Approval" : bulkAction === "reject" ? "Rejection" : "Deletion"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Details Dialog */}
        <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Advert Details</DialogTitle>
              <DialogDescription>
                Complete information about this advertisement
              </DialogDescription>
            </DialogHeader>
            {selectedAdvert && (
              <div className="space-y-4">
                {/* User Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">User Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">User Name:</span>
                      <span className="font-medium">{getUserDisplay(selectedAdvert.userId)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">User ID:</span>
                      <span className="font-mono text-xs">{selectedAdvert.userId}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Advert Configuration */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-muted-foreground">Advert ID:</span>
                        <p className="font-mono text-xs mt-1">{selectedAdvert.id}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Category:</span>
                        <p className="font-medium mt-1 capitalize">{selectedAdvert.category}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Type:</span>
                        <p className="font-medium mt-1">{selectedAdvert.type.replace("-", " ")}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Size:</span>
                        <p className="font-medium mt-1">{selectedAdvert.size}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Package:</span>
                        <p className="font-medium mt-1 capitalize">{selectedAdvert.dpdPackage.replace("-", " ")}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">DPD:</span>
                        <p className="font-medium mt-1">
                          {selectedAdvert.pricing.displayPerDay === Infinity 
                            ? "Unlimited" 
                            : selectedAdvert.pricing.displayPerDay.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Statistics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-muted rounded">
                        <div className="text-2xl font-bold">{selectedAdvert.statistics.impressions.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Impressions</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded">
                        <div className="text-2xl font-bold">{selectedAdvert.statistics.clicks.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Clicks</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded">
                        <div className="text-2xl font-bold">{selectedAdvert.statistics.views.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Views</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded">
                        <div className="text-2xl font-bold">{selectedAdvert.statistics.displayedToday}</div>
                        <div className="text-xs text-muted-foreground">Displayed Today</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Dates */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Timeline</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created:</span>
                      <span className="font-medium">{selectedAdvert.createdAt.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Launch Date:</span>
                      <span className="font-medium">{selectedAdvert.launchDate.toLocaleString()}</span>
                    </div>
                    {selectedAdvert.approvedAt && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Approved:</span>
                        <span className="font-medium">{selectedAdvert.approvedAt.toLocaleString()}</span>
                      </div>
                    )}
                    {selectedAdvert.expiresAt && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Expires:</span>
                        <span className="font-medium">{selectedAdvert.expiresAt.toLocaleString()}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Contact Information */}
                {(selectedAdvert.contactPhone || selectedAdvert.contactEmail || selectedAdvert.websiteUrl) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      {selectedAdvert.contactPhone && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Phone:</span>
                          <span className="font-medium">{selectedAdvert.contactPhone}</span>
                        </div>
                      )}
                      {selectedAdvert.contactEmail && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Email:</span>
                          <span className="font-medium">{selectedAdvert.contactEmail}</span>
                        </div>
                      )}
                      {selectedAdvert.websiteUrl && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Website:</span>
                          <a 
                            href={selectedAdvert.websiteUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-medium text-primary hover:underline"
                          >
                            {selectedAdvert.websiteUrl}
                          </a>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Media Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Media Files ({selectedAdvert.fileUrls.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedAdvert.fileUrls.map((url, index) => (
                        <div 
                          key={index}
                          className="aspect-video bg-muted rounded overflow-hidden cursor-pointer hover:opacity-80 transition-opacity relative group"
                          onClick={() => setPreviewMedia({ url, type: selectedAdvert.category })}
                        >
                          <img
                            src={url}
                            alt={`Media ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {selectedAdvert.category === "video" && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                              <Play className="h-8 w-8 text-white" fill="white" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Media Preview Dialog */}
        <Dialog open={!!previewMedia} onOpenChange={() => setPreviewMedia(null)}>
          <DialogContent className="max-w-4xl p-0">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 z-50 rounded-full bg-background/80 backdrop-blur-sm"
              onClick={() => setPreviewMedia(null)}
            >
              <X className="h-4 w-4" />
            </Button>
            {previewMedia && (
              <div className="w-full">
                {previewMedia.type === "video" ? (
                  <video
                    src={previewMedia.url}
                    controls
                    autoPlay
                    className="w-full h-auto max-h-[80vh]"
                  />
                ) : (
                  <img
                    src={previewMedia.url}
                    alt="Preview"
                    className="w-full h-auto max-h-[80vh] object-contain"
                  />
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
