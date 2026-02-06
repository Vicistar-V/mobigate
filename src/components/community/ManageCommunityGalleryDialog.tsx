import { useState } from "react";
import {
  X,
  Search,
  Plus,
  Eye,
  EyeOff,
  Trash2,
  Edit2,
  Image as ImageIcon,
  Video,
  FolderOpen,
  Upload,
  Settings,
  UserPlus,
  UserMinus,
  Lock,
  Globe,
  Users,
  Shield,
  Camera
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  mockGalleryAlbums,
  mockGalleryItems,
  mockGalleryManagers,
  GalleryAlbum,
  GalleryItem,
  GalleryManager,
  privacyOptions
} from "@/data/communityGalleryData";
import { mockOnlineMembers as membersList } from "@/data/membershipData";

interface ManageCommunityGalleryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isOwner?: boolean;
}

export function ManageCommunityGalleryDialog({
  open,
  onOpenChange,
  isOwner = false
}: ManageCommunityGalleryDialogProps) {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("albums");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Data state
  const [albums, setAlbums] = useState<GalleryAlbum[]>(mockGalleryAlbums);
  const [items, setItems] = useState<GalleryItem[]>(mockGalleryItems);
  const [managers, setManagers] = useState<GalleryManager[]>(mockGalleryManagers);
  
  // Dialog states
  const [showCreateAlbum, setShowCreateAlbum] = useState(false);
  const [showEditAlbum, setShowEditAlbum] = useState(false);
  const [showUploadMedia, setShowUploadMedia] = useState(false);
  const [showEditItem, setShowEditItem] = useState(false);
  const [showAssignManager, setShowAssignManager] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: "album" | "item", id: string } | null>(null);
  
  // Form state
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filterAlbum, setFilterAlbum] = useState("all");
  const [selectedNewManager, setSelectedNewManager] = useState("");
  
  // Album form
  const [albumForm, setAlbumForm] = useState({
    name: "",
    description: "",
    privacy: "public" as "public" | "members-only" | "executives-only"
  });
  
  // Item form
  const [itemForm, setItemForm] = useState({
    title: "",
    caption: "",
    description: "",
    albumId: "",
    privacy: "public" as "public" | "members-only" | "executives-only"
  });

  // File upload state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>("");

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    defaultPrivacy: "public",
    allowComments: true,
    allowLikes: true,
    allowShares: true,
    notifyOnEngagement: true
  });

  const filteredAlbums = albums.filter(album =>
    album.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredItems = items.filter(item => {
    if (!item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterAlbum !== "all" && item.albumId !== filterAlbum) return false;
    return true;
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Album handlers
  const handleCreateAlbum = () => {
    if (!albumForm.name.trim()) {
      toast({ title: "Error", description: "Album name is required", variant: "destructive" });
      return;
    }
    const newAlbum: GalleryAlbum = {
      id: `album-${Date.now()}`,
      name: albumForm.name,
      description: albumForm.description,
      coverImage: "/placeholder.svg",
      itemCount: 0,
      privacy: albumForm.privacy,
      isHidden: false,
      createdAt: new Date(),
      createdBy: "Secretary"
    };
    setAlbums(prev => [newAlbum, ...prev]);
    setShowCreateAlbum(false);
    setAlbumForm({ name: "", description: "", privacy: "public" });
    toast({ title: "Album Created", description: "New album has been created successfully." });
  };

  const handleEditAlbum = () => {
    if (!selectedAlbum || !albumForm.name.trim()) return;
    setAlbums(prev => prev.map(album =>
      album.id === selectedAlbum.id
        ? { ...album, name: albumForm.name, description: albumForm.description, privacy: albumForm.privacy }
        : album
    ));
    setShowEditAlbum(false);
    setSelectedAlbum(null);
    toast({ title: "Album Updated", description: "Album details have been updated." });
  };

  const handleDeleteAlbum = (albumId: string) => {
    setDeleteTarget({ type: "album", id: albumId });
    setShowDeleteConfirm(true);
  };

  const handleToggleAlbumVisibility = (albumId: string) => {
    setAlbums(prev => prev.map(album =>
      album.id === albumId ? { ...album, isHidden: !album.isHidden } : album
    ));
    toast({ title: "Visibility Updated", description: "Album visibility has been changed." });
  };

  // File upload handler
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");
      if (!isImage && !isVideo) {
        toast({ title: "Invalid File", description: "Please select an image or video file", variant: "destructive" });
        return;
      }
      // Validate file size (50MB max)
      if (file.size > 50 * 1024 * 1024) {
        toast({ title: "File Too Large", description: "File must be under 50MB", variant: "destructive" });
        return;
      }
      setUploadedFile(file);
      const url = URL.createObjectURL(file);
      setFilePreview(url);
    }
  };

  const handleRemoveUploadedFile = () => {
    setUploadedFile(null);
    setFilePreview("");
  };

  // Item handlers
  const handleUploadMedia = () => {
    if (!itemForm.title.trim() || !itemForm.albumId) {
      toast({ title: "Error", description: "Title and album are required", variant: "destructive" });
      return;
    }
    if (!uploadedFile) {
      toast({ title: "Error", description: "Please select a file to upload", variant: "destructive" });
      return;
    }
    const isVideo = uploadedFile.type.startsWith("video/");
    const newItem: GalleryItem = {
      id: `item-${Date.now()}`,
      title: itemForm.title,
      caption: itemForm.caption,
      description: itemForm.description,
      mediaType: isVideo ? "video" : "photo",
      mediaUrl: filePreview,
      thumbnailUrl: filePreview,
      albumId: itemForm.albumId,
      likes: 0,
      comments: 0,
      shares: 0,
      views: 0,
      uploadedBy: "Secretary",
      uploadedByPhoto: "/placeholder.svg",
      uploadedAt: new Date(),
      isHidden: false,
      privacy: itemForm.privacy
    };
    setItems(prev => [newItem, ...prev]);
    setAlbums(prev => prev.map(album =>
      album.id === itemForm.albumId ? { ...album, itemCount: album.itemCount + 1 } : album
    ));
    setShowUploadMedia(false);
    setItemForm({ title: "", caption: "", description: "", albumId: "", privacy: "public" });
    setUploadedFile(null);
    setFilePreview("");
    toast({ title: "Media Uploaded", description: "New media has been added to the gallery." });
  };

  const handleEditItem = () => {
    if (!selectedItem || !itemForm.title.trim()) return;
    setItems(prev => prev.map(item =>
      item.id === selectedItem.id
        ? { 
            ...item, 
            title: itemForm.title, 
            caption: itemForm.caption, 
            description: itemForm.description,
            albumId: itemForm.albumId,
            privacy: itemForm.privacy 
          }
        : item
    ));
    setShowEditItem(false);
    setSelectedItem(null);
    toast({ title: "Item Updated", description: "Gallery item has been updated." });
  };

  const handleDeleteItem = (itemId: string) => {
    setDeleteTarget({ type: "item", id: itemId });
    setShowDeleteConfirm(true);
  };

  const handleToggleItemVisibility = (itemId: string) => {
    setItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, isHidden: !item.isHidden } : item
    ));
    toast({ title: "Visibility Updated", description: "Item visibility has been changed." });
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === "album") {
      setAlbums(prev => prev.filter(a => a.id !== deleteTarget.id));
      setItems(prev => prev.filter(i => i.albumId !== deleteTarget.id));
      toast({ title: "Album Deleted", description: "Album and its contents have been deleted." });
    } else {
      const item = items.find(i => i.id === deleteTarget.id);
      if (item) {
        setAlbums(prev => prev.map(album =>
          album.id === item.albumId ? { ...album, itemCount: album.itemCount - 1 } : album
        ));
      }
      setItems(prev => prev.filter(i => i.id !== deleteTarget.id));
      toast({ title: "Item Deleted", description: "Gallery item has been deleted." });
    }
    setShowDeleteConfirm(false);
    setDeleteTarget(null);
  };

  const handleBulkAction = (action: "hide" | "show" | "delete") => {
    if (selectedItems.length === 0) return;
    if (action === "delete") {
      setItems(prev => prev.filter(i => !selectedItems.includes(i.id)));
      toast({ title: "Items Deleted", description: `${selectedItems.length} items have been deleted.` });
    } else {
      setItems(prev => prev.map(item =>
        selectedItems.includes(item.id) ? { ...item, isHidden: action === "hide" } : item
      ));
      toast({ title: "Items Updated", description: `${selectedItems.length} items have been ${action === "hide" ? "hidden" : "shown"}.` });
    }
    setSelectedItems([]);
  };

  // Manager handlers
  const handleAssignManager = () => {
    if (!selectedNewManager) {
      toast({ title: "Error", description: "Please select a member", variant: "destructive" });
      return;
    }
    const member = membersList.find(m => m.id === selectedNewManager);
    if (member) {
      const newManager: GalleryManager = {
        id: `gm-${Date.now()}`,
        name: member.name,
        photo: member.avatar,
        role: "Gallery Manager",
        assignedDate: new Date(),
        assignedBy: "Community Owner"
      };
      setManagers(prev => [...prev, newManager]);
      toast({ title: "Manager Assigned", description: `${member.name} has been assigned as Gallery Manager.` });
    }
    setShowAssignManager(false);
    setSelectedNewManager("");
  };

  const handleRemoveManager = (managerId: string) => {
    setManagers(prev => prev.filter(m => m.id !== managerId));
    toast({ title: "Manager Removed", description: "Gallery Manager has been removed." });
  };

  const openEditAlbum = (album: GalleryAlbum) => {
    setSelectedAlbum(album);
    setAlbumForm({ name: album.name, description: album.description, privacy: album.privacy });
    setShowEditAlbum(true);
  };

  const openEditItem = (item: GalleryItem) => {
    setSelectedItem(item);
    setItemForm({
      title: item.title,
      caption: item.caption,
      description: item.description,
      albumId: item.albumId,
      privacy: item.privacy
    });
    setShowEditItem(true);
  };

  const getPrivacyIcon = (privacy: string) => {
    switch (privacy) {
      case "public": return <Globe className="h-3.5 w-3.5" />;
      case "members-only": return <Users className="h-3.5 w-3.5" />;
      case "executives-only": return <Shield className="h-3.5 w-3.5" />;
      default: return <Globe className="h-3.5 w-3.5" />;
    }
  };

  const Content = () => (
    <>
      <div className="p-4 border-b space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Manage Community Gallery</h2>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search albums or items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 text-base"
            style={{ touchAction: 'manipulation' }}
            onClick={(e) => e.stopPropagation()}
            autoComplete="off"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden min-h-0">
        <div className="px-4 pt-2">
          <TabsList className="w-full grid grid-cols-4 h-auto">
            <TabsTrigger value="albums" className="text-xs py-2 flex-col gap-1">
              <FolderOpen className="h-4 w-4" />
              <span>Albums</span>
            </TabsTrigger>
            <TabsTrigger value="items" className="text-xs py-2 flex-col gap-1">
              <ImageIcon className="h-4 w-4" />
              <span>Items</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="text-xs py-2 flex-col gap-1">
              <Lock className="h-4 w-4" />
              <span>Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="managers" className="text-xs py-2 flex-col gap-1">
              <Settings className="h-4 w-4" />
              <span>Managers</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1 min-h-0 touch-auto">
          <div className="p-4">
            {/* Albums Tab */}
            <TabsContent value="albums" className="mt-0 space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">{filteredAlbums.length} albums</p>
                <Button size="sm" onClick={() => setShowCreateAlbum(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Album
                </Button>
              </div>

              {filteredAlbums.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FolderOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No albums found</p>
                  <Button variant="outline" className="mt-4" onClick={() => setShowCreateAlbum(true)}>
                    Create First Album
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredAlbums.map(album => (
                    <Card key={album.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                            <img src={album.coverImage} alt={album.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-sm truncate">{album.name}</h4>
                              {album.isHidden && <Badge variant="secondary" className="text-xs">Hidden</Badge>}
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-1">{album.description}</p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                              <span>{album.itemCount} items</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                {getPrivacyIcon(album.privacy)}
                                {album.privacy === "public" ? "Public" : album.privacy === "members-only" ? "Members" : "Executives"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <Button variant="outline" size="sm" onClick={() => openEditAlbum(album)}>
                            <Edit2 className="h-3.5 w-3.5 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleAlbumVisibility(album.id)}
                          >
                            {album.isHidden ? <Eye className="h-3.5 w-3.5 mr-1" /> : <EyeOff className="h-3.5 w-3.5 mr-1" />}
                            {album.isHidden ? "Show" : "Hide"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteAlbum(album.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Items Tab */}
            <TabsContent value="items" className="mt-0 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between gap-3">
                <Select value={filterAlbum} onValueChange={setFilterAlbum}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by album" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Albums</SelectItem>
                    {albums.map(album => (
                      <SelectItem key={album.id} value={album.id}>{album.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button size="sm" onClick={() => setShowUploadMedia(true)}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Media
                </Button>
              </div>

              {selectedItems.length > 0 && (
                <Card className="p-3 bg-muted/50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{selectedItems.length} items selected</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleBulkAction("hide")}>
                        <EyeOff className="h-3.5 w-3.5 mr-1" />
                        Hide
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleBulkAction("show")}>
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        Show
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleBulkAction("delete")}>
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {filteredItems.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No gallery items found</p>
                  <Button variant="outline" className="mt-4" onClick={() => setShowUploadMedia(true)}>
                    Upload First Media
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredItems.map(item => (
                    <Card key={item.id}>
                      <CardContent className="p-3">
                        <div className="flex items-start gap-3">
                          <div className="relative">
                            <Checkbox
                              checked={selectedItems.includes(item.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedItems(prev => [...prev, item.id]);
                                } else {
                                  setSelectedItems(prev => prev.filter(id => id !== item.id));
                                }
                              }}
                              className="absolute top-1 left-1 z-10 bg-background"
                            />
                            <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden">
                              <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
                              {item.mediaType === "video" && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                  <Video className="h-5 w-5 text-white" />
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-sm truncate">{item.title}</h4>
                              {item.isHidden && <Badge variant="secondary" className="text-xs">Hidden</Badge>}
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-1">{item.caption}</p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                              <span>{albums.find(a => a.id === item.albumId)?.name}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                {getPrivacyIcon(item.privacy)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <Button variant="outline" size="sm" onClick={() => openEditItem(item)}>
                            <Edit2 className="h-3.5 w-3.5 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleItemVisibility(item.id)}
                          >
                            {item.isHidden ? <Eye className="h-3.5 w-3.5 mr-1" /> : <EyeOff className="h-3.5 w-3.5 mr-1" />}
                            {item.isHidden ? "Show" : "Hide"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy" className="mt-0 space-y-4">
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">Default Privacy Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm">Default Privacy for New Uploads</Label>
                    <Select
                      value={privacySettings.defaultPrivacy}
                      onValueChange={(value) => setPrivacySettings(prev => ({ ...prev, defaultPrivacy: value }))}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {privacyOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              {option.value === "public" && <Globe className="h-4 w-4" />}
                              {option.value === "members-only" && <Users className="h-4 w-4" />}
                              {option.value === "executives-only" && <Shield className="h-4 w-4" />}
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">Engagement Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">Allow Comments</Label>
                      <p className="text-xs text-muted-foreground">Members can comment on gallery items</p>
                    </div>
                    <Switch
                      checked={privacySettings.allowComments}
                      onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, allowComments: checked }))}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">Allow Likes</Label>
                      <p className="text-xs text-muted-foreground">Members can like gallery items</p>
                    </div>
                    <Switch
                      checked={privacySettings.allowLikes}
                      onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, allowLikes: checked }))}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">Allow Sharing</Label>
                      <p className="text-xs text-muted-foreground">Members can share gallery items</p>
                    </div>
                    <Switch
                      checked={privacySettings.allowShares}
                      onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, allowShares: checked }))}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">Engagement Notifications</Label>
                      <p className="text-xs text-muted-foreground">Get notified of likes, comments, shares</p>
                    </div>
                    <Switch
                      checked={privacySettings.notifyOnEngagement}
                      onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, notifyOnEngagement: checked }))}
                    />
                  </div>
                </CardContent>
              </Card>

              <Button
                className="w-full"
                onClick={() => toast({ title: "Settings Saved", description: "Privacy settings have been updated." })}
              >
                Save Privacy Settings
              </Button>
            </TabsContent>

            {/* Managers Tab */}
            <TabsContent value="managers" className="mt-0 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Gallery Managers</h3>
                  <p className="text-xs text-muted-foreground">
                    Users who can manage gallery content
                  </p>
                </div>
                {isOwner && (
                  <Button size="sm" onClick={() => setShowAssignManager(true)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Assign
                  </Button>
                )}
              </div>

              <Separator />

              {managers.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Settings className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No gallery managers assigned</p>
                  {isOwner && (
                    <Button variant="outline" className="mt-4" onClick={() => setShowAssignManager(true)}>
                      Assign First Manager
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {managers.map(manager => (
                    <Card key={manager.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12 border">
                              <AvatarImage src={manager.photo} />
                              <AvatarFallback>{manager.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium">{manager.name}</h4>
                              <p className="text-xs text-muted-foreground">{manager.role}</p>
                              <p className="text-xs text-muted-foreground">
                                Assigned: {formatDate(manager.assignedDate)}
                              </p>
                            </div>
                          </div>
                          {isOwner && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleRemoveManager(manager.id)}
                            >
                              <UserMinus className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {!isOwner && (
                <p className="text-xs text-center text-muted-foreground italic">
                  Only the Community Owner can assign or remove Gallery Managers
                </p>
              )}
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>

      {/* Create Album Dialog */}
      <Dialog open={showCreateAlbum} onOpenChange={setShowCreateAlbum}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Album</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Album Name *</Label>
              <Input
                placeholder="Enter album name"
                value={albumForm.name}
                onChange={(e) => setAlbumForm(prev => ({ ...prev, name: e.target.value }))}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                placeholder="Describe this album"
                value={albumForm.description}
                onChange={(e) => setAlbumForm(prev => ({ ...prev, description: e.target.value }))}
                className="mt-2"
                rows={3}
              />
            </div>
            <div>
              <Label>Privacy</Label>
              <Select
                value={albumForm.privacy}
                onValueChange={(value: "public" | "members-only" | "executives-only") => 
                  setAlbumForm(prev => ({ ...prev, privacy: value }))
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {privacyOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label} - {option.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowCreateAlbum(false)}>Cancel</Button>
            <Button onClick={handleCreateAlbum}>Create Album</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Album Dialog */}
      <Dialog open={showEditAlbum} onOpenChange={setShowEditAlbum}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Album</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Album Name *</Label>
              <Input
                placeholder="Enter album name"
                value={albumForm.name}
                onChange={(e) => setAlbumForm(prev => ({ ...prev, name: e.target.value }))}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                placeholder="Describe this album"
                value={albumForm.description}
                onChange={(e) => setAlbumForm(prev => ({ ...prev, description: e.target.value }))}
                className="mt-2"
                rows={3}
              />
            </div>
            <div>
              <Label>Privacy</Label>
              <Select
                value={albumForm.privacy}
                onValueChange={(value: "public" | "members-only" | "executives-only") => 
                  setAlbumForm(prev => ({ ...prev, privacy: value }))
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {privacyOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label} - {option.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowEditAlbum(false)}>Cancel</Button>
            <Button onClick={handleEditAlbum}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Media Dialog */}
      <Dialog open={showUploadMedia} onOpenChange={(open) => {
        setShowUploadMedia(open);
        if (!open) {
          setUploadedFile(null);
          setFilePreview("");
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Media</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* File Upload Section */}
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Upload className="h-4 w-4 text-primary" />
                Select File *
              </Label>
              {filePreview ? (
                <div className="relative rounded-lg overflow-hidden border bg-muted">
                  {uploadedFile?.type.startsWith("video/") ? (
                    <video 
                      src={filePreview} 
                      className="w-full h-48 object-cover"
                      controls
                    />
                  ) : (
                    <img 
                      src={filePreview} 
                      alt="Upload preview" 
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full"
                    onClick={handleRemoveUploadedFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="absolute bottom-2 left-2">
                    <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                      {uploadedFile?.type.startsWith("video/") ? (
                        <><Video className="h-3 w-3 mr-1" />Video</>
                      ) : (
                        <><ImageIcon className="h-3 w-3 mr-1" />Image</>
                      )}
                    </Badge>
                  </div>
                </div>
              ) : (
                <label className="block cursor-pointer">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                  <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 hover:bg-muted/50 transition-all">
                    <Camera className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm font-medium">Click to select file</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Images & Videos up to 50MB
                    </p>
                  </div>
                </label>
              )}
            </div>
            <div>
              <Label>Title *</Label>
              <Input
                placeholder="Enter title"
                value={itemForm.title}
                onChange={(e) => setItemForm(prev => ({ ...prev, title: e.target.value }))}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Caption</Label>
              <Input
                placeholder="Short caption"
                value={itemForm.caption}
                onChange={(e) => setItemForm(prev => ({ ...prev, caption: e.target.value }))}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                placeholder="Detailed description"
                value={itemForm.description}
                onChange={(e) => setItemForm(prev => ({ ...prev, description: e.target.value }))}
                className="mt-2"
                rows={3}
              />
            </div>
            <div>
              <Label>Album *</Label>
              <Select
                value={itemForm.albumId}
                onValueChange={(value) => setItemForm(prev => ({ ...prev, albumId: value }))}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select album" />
                </SelectTrigger>
                <SelectContent>
                  {albums.map(album => (
                    <SelectItem key={album.id} value={album.id}>{album.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Privacy</Label>
              <Select
                value={itemForm.privacy}
                onValueChange={(value: "public" | "members-only" | "executives-only") => 
                  setItemForm(prev => ({ ...prev, privacy: value }))
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {privacyOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowUploadMedia(false)}>Cancel</Button>
            <Button onClick={handleUploadMedia}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={showEditItem} onOpenChange={setShowEditItem}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Gallery Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title *</Label>
              <Input
                placeholder="Enter title"
                value={itemForm.title}
                onChange={(e) => setItemForm(prev => ({ ...prev, title: e.target.value }))}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Caption</Label>
              <Input
                placeholder="Short caption"
                value={itemForm.caption}
                onChange={(e) => setItemForm(prev => ({ ...prev, caption: e.target.value }))}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                placeholder="Detailed description"
                value={itemForm.description}
                onChange={(e) => setItemForm(prev => ({ ...prev, description: e.target.value }))}
                className="mt-2"
                rows={3}
              />
            </div>
            <div>
              <Label>Album</Label>
              <Select
                value={itemForm.albumId}
                onValueChange={(value) => setItemForm(prev => ({ ...prev, albumId: value }))}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {albums.map(album => (
                    <SelectItem key={album.id} value={album.id}>{album.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Privacy</Label>
              <Select
                value={itemForm.privacy}
                onValueChange={(value: "public" | "members-only" | "executives-only") => 
                  setItemForm(prev => ({ ...prev, privacy: value }))
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {privacyOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowEditItem(false)}>Cancel</Button>
            <Button onClick={handleEditItem}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Manager Dialog */}
      <Dialog open={showAssignManager} onOpenChange={setShowAssignManager}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Gallery Manager</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Select a community member to assign as a Gallery Manager.
            </p>
            <div>
              <Label>Select Member</Label>
              <Select value={selectedNewManager} onValueChange={setSelectedNewManager}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Choose a member" />
                </SelectTrigger>
                <SelectContent>
                  {membersList
                    .filter(m => !managers.find(mgr => mgr.name === m.name))
                    .map(member => (
                      <SelectItem key={member.id} value={member.id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>{member.name[0]}</AvatarFallback>
                          </Avatar>
                          {member.name}
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowAssignManager(false)}>Cancel</Button>
            <Button onClick={handleAssignManager}>Assign Manager</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.type === "album" ? "Album" : "Item"}?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.type === "album"
                ? "This will permanently delete the album and all its contents. This action cannot be undone."
                : "This will permanently delete this gallery item. This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh] flex flex-col touch-auto overflow-hidden">
          {Content()}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 flex flex-col">
        {Content()}
      </DialogContent>
    </Dialog>
  );
}
