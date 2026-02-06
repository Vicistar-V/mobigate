import { useState, useRef } from "react";
import { 
  X, CreditCard, FileText, BookOpen, Users, Search, Check, 
  XCircle, Send, Upload, Edit, Trash2, Star, StarOff, Eye,
  Plus, UserMinus, IdCard, Settings
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  mockIDCardRequests, 
  mockLetterRequests, 
  publications, 
  letterTemplates,
  mockResourceManagers 
} from "@/data/resourcesData";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
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
import { OfficialLetterDisplay, LetterData } from "@/components/community/resources/OfficialLetterDisplay";
import { DigitalIDCardDisplay, IDCardData } from "@/components/community/resources/DigitalIDCardDisplay";
import { MemberPreviewDialog } from "@/components/community/MemberPreviewDialog";
import { ExecutiveMember } from "@/data/communityExecutivesData";

interface ManageCommunityResourcesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isOwner?: boolean;
}

export function ManageCommunityResourcesDialog({ 
  open, 
  onOpenChange,
  isOwner = false 
}: ManageCommunityResourcesDialogProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("id-cards");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  
  // Letter & ID Card preview state
  const [showLetterPreview, setShowLetterPreview] = useState(false);
  const [selectedLetterData, setSelectedLetterData] = useState<LetterData | null>(null);
  const [showIDCardPreview, setShowIDCardPreview] = useState(false);
  const [selectedIDCardData, setSelectedIDCardData] = useState<IDCardData | null>(null);

  // Publication upload form state
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [pubTitle, setPubTitle] = useState("");
  const [pubDescription, setPubDescription] = useState("");
  const [pubType, setPubType] = useState<string>("");
  const [pubEdition, setPubEdition] = useState("");
  const [pubPages, setPubPages] = useState("");
  const [pubFeatured, setPubFeatured] = useState(false);

  // File upload refs and state
  const coverInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const [coverImageFile, setCoverImageFile] = useState<{ name: string; preview: string } | null>(null);
  const [pdfFile, setPdfFile] = useState<{ name: string } | null>(null);

  // Member preview state
  const [selectedMember, setSelectedMember] = useState<ExecutiveMember | null>(null);
  const [showMemberPreview, setShowMemberPreview] = useState(false);

  // Assign manager state
  const [showAssignManager, setShowAssignManager] = useState(false);
  const [newManagerName, setNewManagerName] = useState("");
  const [newManagerRole, setNewManagerRole] = useState<string>("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
      case "issued":
      case "active":
        return "bg-green-500/10 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-200";
      case "rejected":
        return "bg-red-500/10 text-red-700 border-red-200";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleApproveIDCard = (requestId: string) => {
    toast({
      title: "ID Card Request Approved",
      description: "The member will be notified and can proceed with card issuance",
    });
  };

  const handleRejectIDCard = (requestId: string) => {
    toast({
      title: "ID Card Request Rejected",
      description: "The member will be notified of the rejection",
      variant: "destructive"
    });
  };

  const handleIssueIDCard = (request: typeof mockIDCardRequests[0]) => {
    const cardData: IDCardData = {
      memberName: request.memberName,
      memberId: request.memberId,
      memberPhoto: request.memberPhoto,
      cardNumber: `CMT-001-${request.memberId.split('-').pop()}`,
      issueDate: new Date(),
      expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 2)),
      communityName: "Ndigbo Progressive Union",
      verificationCode: `VRF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    };
    setSelectedIDCardData(cardData);
    setShowIDCardPreview(true);
    toast({
      title: "ID Card Generated",
      description: "The digital ID card has been generated and is ready for download",
    });
  };

  const handleViewIDCard = (request: typeof mockIDCardRequests[0]) => {
    const cardData: IDCardData = {
      memberName: request.memberName,
      memberId: request.memberId,
      memberPhoto: request.memberPhoto,
      cardNumber: `CMT-001-${request.memberId.split('-').pop()}`,
      issueDate: request.processedDate || new Date(),
      expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 2)),
      communityName: "Ndigbo Progressive Union",
      verificationCode: `VRF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    };
    setSelectedIDCardData(cardData);
    setShowIDCardPreview(true);
  };

  const handleApproveLetter = (requestId: string) => {
    toast({
      title: "Letter Request Approved",
      description: "The letter can now be issued to the member",
    });
  };

  const handleRejectLetter = (requestId: string) => {
    toast({
      title: "Letter Request Rejected",
      description: "The member will be notified",
      variant: "destructive"
    });
  };

  const handleIssueLetter = (request: typeof mockLetterRequests[0]) => {
    const template = letterTemplates.find(t => t.id === request.templateId);
    const letterData: LetterData = {
      templateTitle: template?.title || "Official Letter",
      letterNumber: request.letterNumber || `CMT/LTR/${new Date().getFullYear()}/${String(Math.floor(Math.random() * 999)).padStart(3, '0')}`,
      requestedBy: request.requestedBy,
      purpose: request.purpose,
      issuedDate: new Date(),
      communityName: "Ndigbo Progressive Union",
      signedBy: "Community Secretary",
      verificationCode: `LTR-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    };
    setSelectedLetterData(letterData);
    setShowLetterPreview(true);
    toast({
      title: "Letter Generated",
      description: "The official letter has been generated and is ready for download",
    });
  };

  const handleViewLetter = (request: typeof mockLetterRequests[0]) => {
    const template = letterTemplates.find(t => t.id === request.templateId);
    const letterData: LetterData = {
      templateTitle: template?.title || "Official Letter",
      letterNumber: request.letterNumber || "CMT/LTR/2024/000",
      requestedBy: request.requestedBy,
      purpose: request.purpose,
      issuedDate: request.approvalDate || new Date(),
      communityName: "Ndigbo Progressive Union",
      signedBy: "Community Secretary",
      verificationCode: `LTR-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    };
    setSelectedLetterData(letterData);
    setShowLetterPreview(true);
  };

  const handleUploadPublication = () => {
    if (!pubTitle || !pubType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Publication Uploaded",
      description: `"${pubTitle}" has been added to community publications`,
    });
    
    // Reset form
    setPubTitle("");
    setPubDescription("");
    setPubType("");
    setPubEdition("");
    setPubPages("");
    setPubFeatured(false);
    setCoverImageFile(null);
    setPdfFile(null);
    setShowUploadForm(false);
  };

  const handleCoverImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid File", description: "Please select an image file (JPG, PNG, etc.)", variant: "destructive" });
      return;
    }
    const preview = URL.createObjectURL(file);
    setCoverImageFile({ name: file.name, preview });
    toast({ title: "Cover Image Selected", description: file.name });
  };

  const handlePDFSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast({ title: "Invalid File", description: "Please select a PDF file", variant: "destructive" });
      return;
    }
    setPdfFile({ name: file.name });
    toast({ title: "PDF File Selected", description: file.name });
  };

  const handleToggleFeatured = (pubId: string, currentFeatured: boolean) => {
    toast({
      title: currentFeatured ? "Removed from Featured" : "Added to Featured",
      description: currentFeatured 
        ? "Publication removed from featured list" 
        : "Publication is now featured",
    });
  };

  const handleDeletePublication = () => {
    if (itemToDelete) {
      toast({
        title: "Publication Deleted",
        description: "The publication has been removed",
      });
      setShowDeleteConfirm(false);
      setItemToDelete(null);
    }
  };

  const handleAssignManager = () => {
    if (!newManagerName || !newManagerRole) {
      toast({
        title: "Missing Information",
        description: "Please select a member and assign a role",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Manager Assigned",
      description: `${newManagerName} has been assigned as Resource Manager`,
    });
    setNewManagerName("");
    setNewManagerRole("");
    setShowAssignManager(false);
  };

  const handleRemoveManager = (managerId: string, managerName: string) => {
    toast({
      title: "Manager Removed",
      description: `${managerName} has been removed from Resource Management`,
    });
  };

  const handleManagerClick = (manager: typeof mockResourceManagers[0]) => {
    setSelectedMember({
      id: manager.id,
      name: manager.name,
      position: "Resource Manager",
      tenure: "",
      imageUrl: manager.photo,
      level: "officer",
      committee: "executive",
    });
    setShowMemberPreview(true);
  };

  const filteredIDCardRequests = mockIDCardRequests.filter(req => {
    const matchesStatus = statusFilter === "all" || req.status === statusFilter;
    const matchesSearch = searchQuery === "" || 
      req.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.memberId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredLetterRequests = mockLetterRequests.filter(req => {
    const matchesStatus = statusFilter === "all" || req.status === statusFilter;
    const matchesSearch = searchQuery === "" || 
      req.requestedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.purpose.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredPublications = publications.filter(pub => {
    return searchQuery === "" || 
      pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-[95vh] p-0 rounded-t-2xl">
          <SheetHeader className="p-4 pb-0 sticky top-0 bg-background z-10 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                <SheetTitle className="text-lg font-bold">Manage Resources</SheetTitle>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
              <TabsList className="w-full grid grid-cols-4 text-xs h-9">
                <TabsTrigger value="id-cards" className="text-xs px-2">
                  <CreditCard className="h-3 w-3 mr-1" />
                  ID Cards
                </TabsTrigger>
                <TabsTrigger value="letters" className="text-xs px-2">
                  <FileText className="h-3 w-3 mr-1" />
                  Letters
                </TabsTrigger>
                <TabsTrigger value="publications" className="text-xs px-2">
                  <BookOpen className="h-3 w-3 mr-1" />
                  Pubs
                </TabsTrigger>
                <TabsTrigger value="managers" className="text-xs px-2">
                  <Users className="h-3 w-3 mr-1" />
                  Team
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </SheetHeader>

          <ScrollArea className="h-[calc(95vh-120px)]">
            <div className="p-4">
              {/* Search and Filter Bar - for ID Cards and Letters */}
              {(activeTab === "id-cards" || activeTab === "letters") && (
                <div className="flex gap-2 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 h-10 text-base"
                      style={{ touchAction: 'manipulation' }}
                      onClick={(e) => e.stopPropagation()}
                      autoComplete="off"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-28 h-10">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="issued">Issued</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* ID CARDS TAB */}
              {activeTab === "id-cards" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">
                      {filteredIDCardRequests.length} request(s)
                    </p>
                  </div>

                  {filteredIDCardRequests.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p>No ID card requests found</p>
                    </div>
                  ) : (
                    filteredIDCardRequests.map((request) => (
                      <Card key={request.id} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-12 w-12 border">
                              <AvatarImage src={request.memberPhoto} alt={request.memberName} />
                              <AvatarFallback>
                                {request.memberName.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h4 className="font-semibold text-sm">{request.memberName}</h4>
                                  <p className="text-xs text-muted-foreground">{request.memberId}</p>
                                </div>
                                <Badge className={`${getStatusColor(request.status)} text-xs`}>
                                  {request.status}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                <span>Type: {request.requestType}</span>
                                <span>{request.requestDate.toLocaleDateString()}</span>
                              </div>
                              
                              {/* Action buttons based on status */}
                              <div className="flex flex-wrap gap-2 mt-3">
                                {request.status === "pending" && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="default"
                                      className="h-8 text-xs"
                                      onClick={() => handleApproveIDCard(request.id)}
                                    >
                                      <Check className="h-3 w-3 mr-1" />
                                      Approve
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-8 text-xs text-destructive"
                                      onClick={() => handleRejectIDCard(request.id)}
                                    >
                                      <XCircle className="h-3 w-3 mr-1" />
                                      Reject
                                    </Button>
                                  </>
                                )}
                                {request.status === "approved" && (
                                  <Button
                                    size="sm"
                                    variant="default"
                                    className="h-8 text-xs"
                                    onClick={() => handleIssueIDCard(request)}
                                  >
                                    <Send className="h-3 w-3 mr-1" />
                                    Issue Card
                                  </Button>
                                )}
                                {request.status === "issued" && (
                                  <Button size="sm" variant="outline" className="h-8 text-xs"
                                    onClick={() => handleViewIDCard(request)}
                                  >
                                    <Eye className="h-3 w-3 mr-1" />
                                    View Card
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              )}

              {/* LETTERS TAB */}
              {activeTab === "letters" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">
                      {filteredLetterRequests.length} request(s)
                    </p>
                  </div>

                  {filteredLetterRequests.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p>No letter requests found</p>
                    </div>
                  ) : (
                    filteredLetterRequests.map((request) => {
                      const template = letterTemplates.find(t => t.id === request.templateId);
                      return (
                        <Card key={request.id} className="overflow-hidden">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex-1">
                                <h4 className="font-semibold text-sm">{template?.title}</h4>
                                <p className="text-xs text-muted-foreground">
                                  Requested by: {request.requestedBy}
                                </p>
                              </div>
                              <Badge className={`${getStatusColor(request.status)} text-xs`}>
                                {request.status}
                              </Badge>
                            </div>
                            
                            <div className="bg-muted/50 rounded p-2 mb-3">
                              <p className="text-xs">
                                <span className="font-medium">Purpose:</span> {request.purpose}
                              </p>
                            </div>
                            
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                              <span>Requested: {request.requestDate.toLocaleDateString()}</span>
                              {request.letterNumber && (
                                <span className="font-mono">{request.letterNumber}</span>
                              )}
                            </div>

                            {/* Action buttons */}
                            <div className="flex flex-wrap gap-2">
                              {request.status === "pending" && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="default"
                                    className="h-8 text-xs"
                                    onClick={() => handleApproveLetter(request.id)}
                                  >
                                    <Check className="h-3 w-3 mr-1" />
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 text-xs text-destructive"
                                    onClick={() => handleRejectLetter(request.id)}
                                  >
                                    <XCircle className="h-3 w-3 mr-1" />
                                    Reject
                                  </Button>
                                </>
                              )}
                              {request.status === "approved" && (
                                <Button
                                  size="sm"
                                  variant="default"
                                  className="h-8 text-xs"
                                  onClick={() => handleIssueLetter(request)}
                                >
                                  <Send className="h-3 w-3 mr-1" />
                                  Issue Letter
                                </Button>
                              )}
                              {request.status === "issued" && (
                                <Button size="sm" variant="outline" className="h-8 text-xs"
                                  onClick={() => handleViewLetter(request)}
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  Preview
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              )}

              {/* PUBLICATIONS TAB */}
              {activeTab === "publications" && (
                <div className="space-y-4">
                  {/* Upload Section */}
                  {!showUploadForm ? (
                    <Button 
                      onClick={() => setShowUploadForm(true)} 
                      className="w-full h-12"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload New Publication
                    </Button>
                  ) : (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center justify-between">
                          <span>Upload Publication</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => setShowUploadForm(false)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Title *</Label>
                          <Input
                            value={pubTitle}
                            onChange={(e) => setPubTitle(e.target.value)}
                            placeholder="Publication title..."
                            className="h-10 text-base"
                            style={{ touchAction: 'manipulation' }}
                            onClick={(e) => e.stopPropagation()}
                            autoComplete="off"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            value={pubDescription}
                            onChange={(e) => setPubDescription(e.target.value)}
                            placeholder="Brief description..."
                            rows={3}
                            className="text-base"
                            style={{ touchAction: 'manipulation' }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label>Type *</Label>
                            <Select value={pubType} onValueChange={setPubType}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="magazine">Magazine</SelectItem>
                                <SelectItem value="journal">Journal</SelectItem>
                                <SelectItem value="newsletter">Newsletter</SelectItem>
                                <SelectItem value="report">Report</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Edition</Label>
                            <Input
                              value={pubEdition}
                              onChange={(e) => setPubEdition(e.target.value)}
                              placeholder="Vol. X, Issue Y"
                              className="h-10 text-base"
                              style={{ touchAction: 'manipulation' }}
                              onClick={(e) => e.stopPropagation()}
                              autoComplete="off"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label>Pages</Label>
                            <Input
                              type="number"
                              value={pubPages}
                              onChange={(e) => setPubPages(e.target.value)}
                              placeholder="Number of pages"
                              className="h-10 text-base"
                              style={{ touchAction: 'manipulation' }}
                              onClick={(e) => e.stopPropagation()}
                              autoComplete="off"
                            />
                          </div>
                          
                          <div className="flex items-center justify-between border rounded-md p-3">
                            <Label className="cursor-pointer">Featured</Label>
                            <Switch
                              checked={pubFeatured}
                              onCheckedChange={setPubFeatured}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Cover Image</Label>
                          <input
                            ref={coverInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleCoverImageSelect}
                          />
                          <div
                            className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 active:bg-muted/70 transition-colors"
                            onClick={() => coverInputRef.current?.click()}
                          >
                            {coverImageFile ? (
                              <div className="space-y-2">
                                <img
                                  src={coverImageFile.preview}
                                  alt="Cover preview"
                                  className="h-20 w-auto mx-auto rounded object-cover"
                                />
                                <p className="text-xs text-muted-foreground truncate">
                                  {coverImageFile.name}
                                </p>
                                <p className="text-xs text-primary font-medium">
                                  Tap to change
                                </p>
                              </div>
                            ) : (
                              <>
                                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                  Click to upload cover image
                                </p>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>PDF File *</Label>
                          <input
                            ref={pdfInputRef}
                            type="file"
                            accept=".pdf,application/pdf"
                            className="hidden"
                            onChange={handlePDFSelect}
                          />
                          <div
                            className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 active:bg-muted/70 transition-colors"
                            onClick={() => pdfInputRef.current?.click()}
                          >
                            {pdfFile ? (
                              <div className="space-y-1">
                                <FileText className="h-8 w-8 mx-auto text-green-600" />
                                <p className="text-xs text-foreground font-medium truncate">
                                  {pdfFile.name}
                                </p>
                                <p className="text-xs text-primary font-medium">
                                  Tap to change
                                </p>
                              </div>
                            ) : (
                              <>
                                <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                  Click to upload PDF file
                                </p>
                              </>
                            )}
                          </div>
                        </div>

                        <Button onClick={handleUploadPublication} className="w-full">
                          Upload Publication
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search publications..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 h-10 text-base"
                      style={{ touchAction: 'manipulation' }}
                      onClick={(e) => e.stopPropagation()}
                      autoComplete="off"
                    />
                  </div>

                  {/* Publications List */}
                  <div className="space-y-3">
                    {filteredPublications.map((pub) => (
                      <Card key={pub.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="bg-primary/10 rounded-lg p-3 shrink-0">
                              <BookOpen className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-sm line-clamp-1">{pub.title}</h4>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="secondary" className="text-xs">
                                      {pub.type}
                                    </Badge>
                                    {pub.featured && (
                                      <Badge className="bg-yellow-500/10 text-yellow-700 text-xs">
                                        <Star className="h-3 w-3 mr-1" />
                                        Featured
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              <p className="text-xs text-muted-foreground mt-2">
                                {pub.edition} • {pub.pages} pages • {pub.fileSize}
                              </p>

                              <div className="flex gap-2 mt-3 overflow-x-auto pb-1 -mb-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 text-xs shrink-0"
                                  onClick={() => handleToggleFeatured(pub.id, pub.featured)}
                                >
                                  {pub.featured ? (
                                    <>
                                      <StarOff className="h-3 w-3 mr-1" />
                                      Unfeature
                                    </>
                                  ) : (
                                    <>
                                      <Star className="h-3 w-3 mr-1" />
                                      Feature
                                    </>
                                  )}
                                </Button>
                                <Button size="sm" variant="outline" className="h-8 text-xs shrink-0">
                                  <Edit className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 text-xs text-destructive shrink-0"
                                  onClick={() => {
                                    setItemToDelete(pub.id);
                                    setShowDeleteConfirm(true);
                                  }}
                                >
                                  <Trash2 className="h-3 w-3 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* MANAGERS TAB */}
              {activeTab === "managers" && (
                <div className="space-y-4">
                  {/* Info Card */}
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <IdCard className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-sm">Resource Managers</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Only designated Resource Managers can approve ID cards, letters, and upload publications. 
                            {isOwner ? " As the Community Owner, you can assign or remove managers." : " Contact the Community Owner to modify manager assignments."}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Assign Manager Button - Only for Owner */}
                  {isOwner && !showAssignManager && (
                    <Button 
                      onClick={() => setShowAssignManager(true)} 
                      className="w-full h-12"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Assign New Manager
                    </Button>
                  )}

                  {/* Assign Manager Form */}
                  {isOwner && showAssignManager && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center justify-between">
                          <span>Assign Manager</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => setShowAssignManager(false)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Select Member</Label>
                          <Select value={newManagerName} onValueChange={setNewManagerName}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a member..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="John Smith">John Smith</SelectItem>
                              <SelectItem value="Jane Doe">Jane Doe</SelectItem>
                              <SelectItem value="Michael Johnson">Michael Johnson</SelectItem>
                              <SelectItem value="Sarah Williams">Sarah Williams</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Management Role</Label>
                          <Select value={newManagerRole} onValueChange={setNewManagerRole}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="id_cards">ID Cards Only</SelectItem>
                              <SelectItem value="letters">Letters Only</SelectItem>
                              <SelectItem value="publications">Publications Only</SelectItem>
                              <SelectItem value="all">All Resources</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Button onClick={handleAssignManager} className="w-full">
                          Assign Manager
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  <Separator />

                  {/* Current Managers List */}
                  <div>
                    <h3 className="font-semibold text-sm mb-3">Current Resource Managers</h3>
                    <div className="space-y-3">
                      {mockResourceManagers.map((manager) => (
                        <Card 
                          key={manager.id} 
                          className="cursor-pointer active:scale-[0.99] transition-transform"
                          onClick={() => handleManagerClick(manager)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-12 w-12 border">
                                <AvatarImage src={manager.photo} alt={manager.name} />
                                <AvatarFallback>
                                  {manager.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm">{manager.name}</h4>
                                <Badge variant="secondary" className="text-xs mt-1">
                                  {manager.role === "all" ? "All Resources" : 
                                   manager.role === "id_cards" ? "ID Cards" :
                                   manager.role === "letters" ? "Letters" : "Publications"}
                                </Badge>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Assigned: {manager.assignedDate.toLocaleDateString()}
                                </p>
                              </div>
                              {isOwner && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-destructive h-8"
                                  onClick={(e) => { e.stopPropagation(); handleRemoveManager(manager.id, manager.name); }}
                                >
                                  <UserMinus className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                      {mockResourceManagers.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
                          <p>No Resource Managers assigned yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Publication?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The publication will be permanently removed from the community.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeletePublication}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Official Letter Preview */}
      {selectedLetterData && (
        <OfficialLetterDisplay
          open={showLetterPreview}
          onOpenChange={(open) => {
            setShowLetterPreview(open);
            if (!open) setSelectedLetterData(null);
          }}
          letterData={selectedLetterData}
        />
      )}

      {/* Digital ID Card Preview */}
      {selectedIDCardData && (
        <DigitalIDCardDisplay
          open={showIDCardPreview}
          onOpenChange={(open) => {
            setShowIDCardPreview(open);
            if (!open) setSelectedIDCardData(null);
          }}
          cardData={selectedIDCardData}
        />
      )}

      {/* Member Preview Dialog */}
      {selectedMember && (
        <MemberPreviewDialog
          member={selectedMember}
          open={showMemberPreview}
          onOpenChange={setShowMemberPreview}
        />
      )}
    </>
  );
}