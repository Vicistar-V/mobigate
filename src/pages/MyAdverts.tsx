import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
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
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { loadUserAdverts, deleteAdvert, updateAdvertStatus, updateAdvertMedia } from "@/lib/advertStorage";
import { SavedAdvert, getMultipleCount } from "@/types/advert";
import { formatCurrency } from "@/lib/advertPricing";
import { Plus, Eye, Trash2, Play, Pause, BarChart3, Calendar, Zap, X, Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FilePreviewGrid } from "@/components/advert/FilePreviewGrid";

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
  const [previewMedia, setPreviewMedia] = useState<{ url: string; type: string } | null>(null);
  const [changeMediaDialogOpen, setChangeMediaDialogOpen] = useState(false);
  const [newMediaFiles, setNewMediaFiles] = useState<File[]>([]);

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

  const handleOpenChangeMedia = (advert: SavedAdvert) => {
    setSelectedAdvert(advert);
    setNewMediaFiles([]);
    setChangeMediaDialogOpen(true);
  };

  const handleMediaFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (!selectedAdvert) return;

    // Validate file count based on advert type
    const multipleCount = getMultipleCount(selectedAdvert.type);
    const maxFiles = selectedAdvert.type === "single" ? 1 : multipleCount || 1;

    if (files.length > maxFiles) {
      const displayType = selectedAdvert.type === "single" ? "single" : `multiple (${maxFiles} files)`;
      toast({
        title: "Too many files",
        description: `This ${displayType} advert can only have ${maxFiles} file${maxFiles > 1 ? 's' : ''}.`,
        variant: "destructive",
      });
      return;
    }

    // Validate file types
    const validTypes = selectedAdvert.category === "pictorial" 
      ? ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
      : ["video/mp4", "video/webm", "video/quicktime"];

    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    if (invalidFiles.length > 0) {
      toast({
        title: "Invalid file type",
        description: `Please upload ${selectedAdvert.category === "pictorial" ? "image" : "video"} files only.`,
        variant: "destructive",
      });
      return;
    }

    setNewMediaFiles(files);
  };

  const handleRemoveNewMediaFile = (index: number) => {
    setNewMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveNewMedia = () => {
    if (!selectedAdvert || newMediaFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please upload at least one file.",
        variant: "destructive",
      });
      return;
    }

    try {
      updateAdvertMedia(selectedAdvert.id, newMediaFiles);
      toast({
        title: "Media updated",
        description: "Your advert has been updated and sent for admin re-approval.",
      });
      loadAdverts();
      setChangeMediaDialogOpen(false);
      setSelectedAdvert(null);
      setNewMediaFiles([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update media. Please try again.",
        variant: "destructive",
      });
    }
  };

  const AdvertCard = ({ advert }: { advert: SavedAdvert }) => {
    const canPause = advert.status === "active" || advert.status === "paused";
    const daysUntilExpiry = advert.expiresAt
      ? Math.ceil((advert.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : null;

    return (
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-lg">
                  {advert.category === "pictorial" ? "Image Advert" : "Video Advert"}
                </CardTitle>
                <Badge variant={getStatusColor(advert.status)}>
                  {getStatusLabel(advert.status)}
                </Badge>
              </div>
              <CardDescription className="text-xs sm:text-sm">
                {advert.type.replace("-", " ").replace("multiple", "Multiple")} • {advert.size} • {advert.dpdPackage}
              </CardDescription>
            </div>
            <div className="flex gap-2 self-end sm:self-auto flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenChangeMedia(advert)}
                className="flex-1 sm:flex-none"
              >
                <Upload className="h-4 w-4 sm:mr-0 mr-2" />
                <span className="sm:hidden">Change Media</span>
              </Button>
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
                    <Play className="h-8 w-8 text-white" fill="white" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="h-6 w-6 text-white drop-shadow-lg" />
                </div>
              </div>
            ))}
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold">{advert.statistics.impressions.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Impressions</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold">{advert.statistics.clicks.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Clicks</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold">{advert.statistics.views.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Views</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold">{advert.statistics.displayedToday}</div>
              <div className="text-xs text-muted-foreground">Today</div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 gap-3 pt-2 border-t sm:grid-cols-2">
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
    <>
      <Header />
      <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold">My Adverts</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage and track your advertising campaigns</p>
        </div>
        <Button onClick={() => navigate("/submit-advert")} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Create New Advert
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="w-full overflow-x-auto">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="all">All ({adverts.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({filterAdverts("active").length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({filterAdverts("pending").length})</TabsTrigger>
            <TabsTrigger value="paused">Paused ({filterAdverts("paused").length})</TabsTrigger>
            <TabsTrigger value="expired">Expired ({filterAdverts("expired").length})</TabsTrigger>
          </TabsList>
        </div>

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

      {/* Change Media Dialog */}
      <Dialog open={changeMediaDialogOpen} onOpenChange={setChangeMediaDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Change Media</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Upload new {selectedAdvert?.category === "pictorial" ? "images" : "videos"} for your advert
              </p>
            </div>

            {/* Current Media Preview */}
            {selectedAdvert && (
              <div className="space-y-3">
                <Label className="text-sm font-medium">Current Media</Label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                  {selectedAdvert.fileUrls.map((url, index) => (
                    <div 
                      key={index}
                      className="aspect-video bg-muted rounded overflow-hidden relative group"
                    >
                      <img
                        src={url}
                        alt={`Current ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {selectedAdvert.category === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <Play className="h-6 w-6 text-white" fill="white" />
                        </div>
                      )}
                      <div className="absolute top-1 left-1">
                        <div className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* File Upload */}
            <div className="space-y-3">
              <Label htmlFor="media-upload" className="text-sm font-medium">
                Upload New Media
              </Label>
              <div className="flex flex-col gap-3">
                <Input
                  id="media-upload"
                  type="file"
                  accept={selectedAdvert?.category === "pictorial" 
                    ? "image/jpeg,image/jpg,image/png,image/gif,image/webp" 
                    : "video/mp4,video/webm,video/quicktime"}
                  multiple={selectedAdvert?.type !== "single"}
                  onChange={handleMediaFileChange}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  {selectedAdvert && (
                    selectedAdvert.type === "single" 
                      ? "Upload 1 file" 
                      : `Upload up to ${getMultipleCount(selectedAdvert.type)} files`
                  )}
                  {" • "}
                  {selectedAdvert?.category === "pictorial" 
                    ? "JPG, PNG, GIF, or WEBP" 
                    : "MP4, WEBM, or MOV"}
                </p>
              </div>
            </div>

            {/* New Media Preview */}
            {newMediaFiles.length > 0 && selectedAdvert && (
              <div className="space-y-3">
                <Label className="text-sm font-medium">New Media Preview</Label>
                <FilePreviewGrid
                  files={newMediaFiles}
                  onRemove={handleRemoveNewMediaFile}
                  maxFiles={selectedAdvert.type === "single" ? 1 : (getMultipleCount(selectedAdvert.type) || 1)}
                  isMultiple={selectedAdvert.type !== "single"}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setChangeMediaDialogOpen(false);
                  setSelectedAdvert(null);
                  setNewMediaFiles([]);
                }}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveNewMedia}
                disabled={newMediaFiles.length === 0}
                className="w-full sm:w-auto"
              >
                <Upload className="mr-2 h-4 w-4" />
                Save New Media
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </>
  );
}
