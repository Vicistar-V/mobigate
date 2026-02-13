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

  const content = (
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
                          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => openEditAlbum(album)}>
                            <Edit2 className="h-3.5 w-3.5 mr-1" /> Edit
                          </Button>
                          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => handleToggleAlbumVisibility(album.id)}>
                            {album.isHidden ? <Eye className="h-3.5 w-3.5 mr-1" /> : <EyeOff className="h-3.5 w-3.5 mr-1" />}
                            {album.isHidden ? "Show" : "Hide"}
                          </Button>
                          <Button variant="outline" size="sm" className="h-8 text-xs text-destructive hover:text-destructive" onClick={() => handleDeleteAlbum(album.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
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
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Select value={filterAlbum} onValueChange={setFilterAlbum}>
                    <SelectTrigger className="h-9 w-[140px] text-xs">
                      <SelectValue placeholder="All Albums" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Albums</SelectItem>
                      {albums.map(album => (
                        <SelectItem key={album.id} value={album.id}>{album.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button size="sm" onClick={() => setShowUploadMedia(true)}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>

              {selectedItems.length > 0 && (
                <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg overflow-x-auto">
                  <span className="text-xs font-medium whitespace-nowrap">{selectedItems.length} selected:</span>
                  <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => handleBulkAction("hide")}>Hide</Button>
                  <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => handleBulkAction("show")}>Show</Button>
                  <Button size="sm" variant="ghost" className="h-7 text-xs text-destructive hover:text-destructive" onClick={() => handleBulkAction("delete")}>Delete</Button>
                  <Button size="sm" variant="ghost" className="h-7 text-xs ml-auto" onClick={() => setSelectedItems([])}>Cancel</Button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                {filteredItems.map(item => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="aspect-square relative group">
                      <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2">
                        <Checkbox 
                          checked={selectedItems.includes(item.id)}
                          onCheckedChange={(checked) => {
                            if (checked) setSelectedItems(prev => [...prev, item.id]);
                            else setSelectedItems(prev => prev.filter(id => id !== item.id));
                          }}
                          className="bg-white/80 border-white/80 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                      </div>
                      {item.mediaType === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                          <div className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                            <Video className="h-5 w-5 text-white" />
                          </div>
                        </div>
                      )}
                      {item.isHidden && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center pointer-events-none">
                          <EyeOff className="h-6 w-6 text-white/70" />
                        </div>
                      )}
                    </div>
                    <div className="p-2 space-y-2">
                      <p className="text-xs font-medium truncate">{item.title}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          {getPrivacyIcon(item.privacy)}
                          {item.privacy === "public" ? "Public" : "Restricted"}
                        </span>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openEditItem(item)}>
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive" onClick={() => handleDeleteItem(item.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              {filteredItems.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No items found</p>
                </div>
              )}
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy" className="mt-0 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Default Privacy Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
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
                    <div className="space-y-0.5">
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
                    <div className="space-y-0.5">
                      <Label className="text-sm">Allow Social Sharing</Label>
                      <p className="text-xs text-muted-foreground">Members can share items externally</p>
                    </div>
                    <Switch 
                      checked={privacySettings.allowShares}
                      onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, allowShares: checked }))}
                    />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label className="text-sm">Default Album Privacy</Label>
                    <Select 
                      value={privacySettings.defaultPrivacy} 
                      onValueChange={(val) => setPrivacySettings(prev => ({ ...prev, defaultPrivacy: val }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public (Everyone)</SelectItem>
                        <SelectItem value="members-only">Members Only</SelectItem>
                        <SelectItem value="executives-only">Executives Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Managers Tab */}
            <TabsContent value="managers" className="mt-0 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-sm">Gallery Managers</h3>
                {isOwner && (
                  <Button size="sm" onClick={() => setShowAssignManager(true)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Assign
                  </Button>
                )}
              </div>

              {managers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No managers assigned</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {managers.map(manager => (
                    <Card key={manager.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={manager.photo} />
                            <AvatarFallback>{manager.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm">{manager.name}</h4>
                            <p className="text-xs text-muted-foreground">Assigned: {formatDate(manager.assignedDate)}</p>
                          </div>
                          {isOwner && (
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleRemoveManager(manager.id)}>
                              <UserMinus className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
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
              <Label htmlFor="album-name">Album Name</Label>
              <Input 
                id="album-name"
                value={albumForm.name}
                onChange={(e) => setAlbumForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., 2024 Cultural Festival"
              />
            </div>
            <div>
              <Label htmlFor="album-desc">Description</Label>
              <Textarea 
                id="album-desc"
                value={albumForm.description}
                onChange={(e) => setAlbumForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the album content"
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
                      {option.label}
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
              <Label htmlFor="edit-album-name">Album Name</Label>
              <Input 
                id="edit-album-name"
                value={albumForm.name}
                onChange={(e) => setAlbumForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="edit-album-desc">Description</Label>
              <Textarea 
                id="edit-album-desc"
                value={albumForm.description}
                onChange={(e) => setAlbumForm(prev => ({ ...prev, description: e.target.value }))}
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
                      {option.label}
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
      <Dialog open={showUploadMedia} onOpenChange={setShowUploadMedia}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Media</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* File Selection */}
            <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => document.getElementById("file-upload")?.click()}>
              {filePreview ? (
                <div className="relative">
                  {uploadedFile?.type.startsWith('video/') ? (
                    <div className="aspect-video bg-black/10 rounded flex items-center justify-center">
                      <Video className="h-8 w-8 text-muted-foreground" />
                    </div>
                  ) : (
                    <img src={filePreview} alt="Preview" className="max-h-48 mx-auto rounded" />
                  )}
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveUploadedFile();
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">{uploadedFile?.name}</p>
                </div>
              ) : (
                <>
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">Click to upload file</p>
                  <p className="text-xs text-muted-foreground mt-1">Images or Videos (max 50MB)</p>
                </>
              )}
              <Input 
                id="file-upload" 
                type="file" 
                className="hidden" 
                accept="image/*,video/*"
                onChange={handleFileSelect}
              />
            </div>

            <div>
              <Label htmlFor="media-title">Title</Label>
              <Input 
                id="media-title"
                value={itemForm.title}
                onChange={(e) => setItemForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Opening Ceremony"
              />
            </div>
            
            <div>
              <Label>Album</Label>
              <Select
                value={itemForm.albumId}
                onValueChange={(value) => setItemForm(prev => ({ ...prev, albumId: value }))}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select Album" />
                </SelectTrigger>
                <SelectContent>
                  {albums.map(album => (
                    <SelectItem key={album.id} value={album.id}>{album.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="media-caption">Caption</Label>
              <Textarea 
                id="media-caption"
                value={itemForm.caption}
                onChange={(e) => setItemForm(prev => ({ ...prev, caption: e.target.value }))}
                placeholder="Add a caption..."
                className="h-20"
              />
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
            <Button onClick={handleUploadMedia} disabled={!uploadedFile}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={showEditItem} onOpenChange={setShowEditItem}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-media-title">Title</Label>
              <Input 
                id="edit-media-title"
                value={itemForm.title}
                onChange={(e) => setItemForm(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="edit-media-caption">Caption</Label>
              <Textarea 
                id="edit-media-caption"
                value={itemForm.caption}
                onChange={(e) => setItemForm(prev => ({ ...prev, caption: e.target.value }))}
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
          {content}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 flex flex-col">
        {content}
      </DialogContent>
    </Dialog>
  );
}
