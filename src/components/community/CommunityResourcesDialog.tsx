import { useState } from "react";
import { X, CreditCard, FileText, BookOpen, QrCode, Download, ExternalLink, Search, Shield, MoreHorizontal, Scale, HelpCircle, MessageCircle, ChevronRight, ExternalLink as LinkIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockIDCard, letterTemplates, mockLetterRequests, publications } from "@/data/resourcesData";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DigitalIDCardDisplay, IDCardData } from "@/components/community/resources/DigitalIDCardDisplay";
import { OfficialLetterDisplay, LetterData } from "@/components/community/resources/OfficialLetterDisplay";
import { DownloadFormatSheet, DownloadFormat } from "@/components/common/DownloadFormatSheet";
import { ConstitutionViewer } from "@/components/community/ConstitutionViewer";
import { constitutionSections, constitutionMetadata } from "@/data/constitutionData";
import { format } from "date-fns";

interface CommunityResourcesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommunityResourcesDialog({ open, onOpenChange }: CommunityResourcesDialogProps) {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [letterPurpose, setLetterPurpose] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showIDCardPreview, setShowIDCardPreview] = useState(false);
  const [showLetterPreview, setShowLetterPreview] = useState(false);
  const [selectedLetterData, setSelectedLetterData] = useState<LetterData | null>(null);
  const [showPubDownload, setShowPubDownload] = useState(false);
  const [selectedPubForDownload, setSelectedPubForDownload] = useState<{ title: string; fileSize: string } | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showConstitutionViewer, setShowConstitutionViewer] = useState(false);

  // Get only article-level sections for the constitution summary
  const constitutionArticles = constitutionSections.filter(s => s.type === "article");

  const handleRequestCard = () => {
    toast({
      title: "ID Card Request Submitted",
      description: "Your request will be processed within 5 business days",
    });
  };

  const handleRenewCard = () => {
    toast({
      title: "Renewal Request Submitted",
      description: "Your ID card renewal will be processed within 5 business days",
    });
  };

  const handleOpenIDCardPreview = () => {
    onOpenChange(false);
    setTimeout(() => setShowIDCardPreview(true), 150);
  };

  const handleOpenLetterPreview = (letterData: LetterData) => {
    setSelectedLetterData(letterData);
    onOpenChange(false);
    setTimeout(() => setShowLetterPreview(true), 150);
  };

  const handleCloseIDCardPreview = (open: boolean) => {
    setShowIDCardPreview(open);
    if (!open) {
      setTimeout(() => onOpenChange(true), 150);
    }
  };

  const handleCloseLetterPreview = (open: boolean) => {
    setShowLetterPreview(open);
    if (!open) {
      setTimeout(() => onOpenChange(true), 150);
    }
  };

  const handleRequestLetter = () => {
    if (!selectedTemplate || !letterPurpose.trim()) {
      toast({
        title: "Incomplete Request",
        description: "Please select a letter type and provide purpose",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Letter Request Submitted",
      description: "Your request will be reviewed by the appropriate authority",
    });
    setSelectedTemplate("");
    setLetterPurpose("");
  };

  const handleDownloadPublication = (pub: { title: string; fileSize: string }) => {
    setSelectedPubForDownload(pub);
    onOpenChange(false);
    setTimeout(() => setShowPubDownload(true), 150);
  };

  const handlePubDownloadConfirm = (format: DownloadFormat) => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setShowPubDownload(false);
      toast({
        title: "Download Complete",
        description: `${selectedPubForDownload?.title} downloaded as ${format.toUpperCase()}`,
      });
      setTimeout(() => onOpenChange(true), 150);
    }, 1500);
  };

  const handleClosePubDownload = (open: boolean) => {
    setShowPubDownload(open);
    if (!open) {
      setTimeout(() => onOpenChange(true), 150);
    }
  };

  const handleOpenConstitutionViewer = () => {
    onOpenChange(false);
    setTimeout(() => setShowConstitutionViewer(true), 150);
  };

  const handleCloseConstitutionViewer = (open: boolean) => {
    setShowConstitutionViewer(open);
    if (!open) {
      setTimeout(() => onOpenChange(true), 150);
    }
  };

  const handleDownloadConstitution = () => {
    setSelectedPubForDownload({ title: constitutionMetadata.title, fileSize: "2.4 MB" });
    onOpenChange(false);
    setTimeout(() => setShowPubDownload(true), 150);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
      case "issued":
        return "bg-green-500/10 text-green-700";
      case "pending":
        return "bg-yellow-500/10 text-yellow-700";
      case "rejected":
        return "bg-red-500/10 text-red-700";
      default:
        return "bg-gray-500/10 text-gray-700";
    }
  };

  const filteredPublications = searchQuery
    ? publications.filter(
        p =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : publications;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] p-0 overflow-x-hidden">
          <DialogHeader className="p-3 pb-0 sticky top-0 bg-background z-10">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-bold">Community Resources</DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="h-8 w-8 shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <Tabs defaultValue="id-cards" className="flex-1">
            <div className="px-3">
              <TabsList className="w-full grid grid-cols-4 text-xs">
                <TabsTrigger value="id-cards" className="text-[11px] px-1">ID Cards</TabsTrigger>
                <TabsTrigger value="letters" className="text-[11px] px-1">Letters</TabsTrigger>
                <TabsTrigger value="constitution" className="text-[11px] px-1">
                  Constitution
                </TabsTrigger>
                <TabsTrigger value="more" className="text-[11px] px-1 gap-1">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                  More
                </TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="h-[calc(90vh-160px)]">
              {/* ID CARDS TAB */}
              <TabsContent value="id-cards" className="mt-0 p-3 space-y-3">
                <Card className="border-2 overflow-hidden">
                  <CardHeader className="pb-2 px-3 pt-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-primary shrink-0" />
                      Your Community ID Card
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 px-3 pb-3">
                    {/* ID Card Preview - Mobile Optimized */}
                    <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-2 border-primary/20 rounded-xl overflow-hidden">
                      {/* Community Name Header */}
                      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 shrink-0" />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold uppercase tracking-wider truncate">Ndigbo Progressive Union</h4>
                            <p className="text-[9px] opacity-80">Official Community ID Card</p>
                          </div>
                        </div>
                      </div>

                      {/* Member Details */}
                      <div className="p-3 space-y-2.5">
                        {/* Photo + Name centered */}
                        <div className="flex flex-col items-center text-center gap-2">
                          <Avatar className="h-14 w-14 border-2 border-primary/20">
                            <AvatarImage src={mockIDCard.memberPhoto} alt={mockIDCard.memberName} />
                            <AvatarFallback>{mockIDCard.memberName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 w-full">
                            <h3 className="font-bold text-sm truncate">{mockIDCard.memberName}</h3>
                            <p className="text-xs text-muted-foreground">{mockIDCard.memberId}</p>
                            <Badge className="mt-1 text-[10px]" variant={mockIDCard.status === "active" ? "default" : "secondary"}>
                              {mockIDCard.status}
                            </Badge>
                          </div>
                        </div>

                        {/* Card Details Grid */}
                        <div className="grid grid-cols-2 gap-1.5 text-xs">
                          <div className="bg-muted/50 rounded-lg p-2">
                            <p className="text-muted-foreground text-[10px]">Card Number</p>
                            <p className="font-medium text-[11px] truncate">{mockIDCard.cardNumber}</p>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-2">
                            <p className="text-muted-foreground text-[10px]">Issue Date</p>
                            <p className="font-medium text-[11px]">{mockIDCard.issueDate.toLocaleDateString()}</p>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-2">
                            <p className="text-muted-foreground text-[10px]">Expiry Date</p>
                            <p className="font-medium text-[11px]">{mockIDCard.expiryDate.toLocaleDateString()}</p>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-2 flex items-center gap-1.5">
                            <QrCode className="h-3.5 w-3.5 text-primary shrink-0" />
                            <div className="min-w-0">
                              <p className="text-muted-foreground text-[10px]">Verified</p>
                              <p className="font-medium text-[11px] capitalize">{mockIDCard.status}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <Button onClick={handleRequestCard} variant="outline" size="sm" className="text-xs touch-manipulation">
                          <CreditCard className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                          Request New
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleOpenIDCardPreview}
                          className="text-xs touch-manipulation"
                        >
                          <Download className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                          Download
                        </Button>
                      </div>
                      <Button onClick={handleRenewCard} variant="default" className="w-full text-xs touch-manipulation" size="sm">
                        <CreditCard className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                        Renew ID Card
                      </Button>
                    </div>

                    <div className="p-2.5 bg-muted rounded-lg">
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        Your ID card is valid for 2 years from issue date. Please renew before expiry to maintain uninterrupted access to community services.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* LETTERS TAB */}
              <TabsContent value="letters" className="mt-0 p-3 space-y-3">
                {/* Request New Letter */}
                <Card className="overflow-hidden">
                  <CardHeader className="px-3 pt-3 pb-2">
                    <CardTitle className="text-sm">Request Official Letter</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 px-3 pb-3">
                    <div>
                      <label className="text-xs font-medium mb-1.5 block">Letter Type</label>
                      <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Select letter type..." />
                        </SelectTrigger>
                        <SelectContent>
                          {letterTemplates.map((template) => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedTemplate && (
                      <div className="p-2.5 bg-muted rounded-lg text-xs">
                        <p className="text-muted-foreground">
                          {letterTemplates.find(t => t.id === selectedTemplate)?.description}
                        </p>
                        {letterTemplates.find(t => t.id === selectedTemplate)?.requiresApproval && (
                          <p className="text-yellow-700 mt-1.5">
                            ⚠️ Requires approval from community leadership
                          </p>
                        )}
                      </div>
                    )}

                    <div>
                      <label className="text-xs font-medium mb-1.5 block">Purpose of Request</label>
                      <Textarea
                        placeholder="Please provide detailed purpose for this letter..."
                        value={letterPurpose}
                        onChange={(e) => setLetterPurpose(e.target.value)}
                        rows={3}
                        className="text-sm touch-manipulation"
                      />
                    </div>

                    <Button onClick={handleRequestLetter} className="w-full text-sm touch-manipulation">
                      <FileText className="h-4 w-4 mr-2 shrink-0" />
                      Submit Request
                    </Button>
                  </CardContent>
                </Card>

                {/* Letter Requests History */}
                <Card className="overflow-hidden">
                  <CardHeader className="px-3 pt-3 pb-2">
                    <CardTitle className="text-sm">Your Letter Requests</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2.5 px-3 pb-3">
                    {mockLetterRequests.map((request) => {
                      const template = letterTemplates.find(t => t.id === request.templateId);
                      return (
                        <div key={request.id} className="p-2.5 border rounded-lg space-y-2 overflow-hidden">
                          {/* Row 1: Title */}
                          <h4 className="font-semibold text-xs leading-snug">{template?.title}</h4>
                          
                          {/* Row 2: Badge + Date */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className={`${getStatusColor(request.status)} text-[10px] shrink-0`}>
                              {request.status}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground">
                              {request.requestDate.toLocaleDateString()}
                            </span>
                          </div>
                          
                          {/* Row 3: Purpose */}
                          <p className="text-[11px] text-muted-foreground line-clamp-2">
                            Purpose: {request.purpose}
                          </p>
                          
                          {/* Row 4: Letter number + Download */}
                          {request.letterNumber && (
                            <div className="flex items-center justify-between pt-1.5 border-t gap-2">
                              <span className="text-[10px] font-medium truncate min-w-0">{request.letterNumber}</span>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="shrink-0 text-[11px] h-7 px-2 touch-manipulation"
                                onClick={() => {
                                  handleOpenLetterPreview({
                                    templateTitle: template?.title || "",
                                    letterNumber: request.letterNumber!,
                                    requestedBy: request.requestedBy,
                                    purpose: request.purpose,
                                    issuedDate: request.approvalDate || request.requestDate,
                                    communityName: "Ndigbo Progressive Union",
                                    signedBy: request.approvedBy || "Community Secretary",
                                    verificationCode: `VER-${request.letterNumber?.replace(/\//g, "-")}`,
                                  });
                                }}
                              >
                                <Download className="h-3 w-3 mr-1" />
                                Download
                              </Button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* CONSTITUTION TAB */}
              <TabsContent value="constitution" className="mt-0 p-3 space-y-3">
                {/* Constitution Header Card */}
                <Card className="border-2 border-primary/20 overflow-hidden">
                  <CardContent className="p-3 space-y-2.5">
                    <div className="flex items-start gap-2.5">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Scale className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-xs leading-tight">{constitutionMetadata.title}</h3>
                        <div className="flex flex-wrap items-center gap-1 mt-1">
                          <Badge variant="secondary" className="text-[9px]">
                            v{constitutionMetadata.version}
                          </Badge>
                          <Badge variant="outline" className="text-[9px]">
                            {format(constitutionMetadata.effectiveDate, "MMM d, yyyy")}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-1.5 text-xs">
                      <div className="bg-muted/50 rounded-lg p-2">
                        <p className="text-muted-foreground text-[10px]">Adopted</p>
                        <p className="font-medium text-[11px]">{format(constitutionMetadata.adoptedDate, "MMM d, yyyy")}</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-2">
                        <p className="text-muted-foreground text-[10px]">Last Amended</p>
                        <p className="font-medium text-[11px]">{format(constitutionMetadata.lastAmendedDate, "MMM d, yyyy")}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Articles List */}
                <div>
                  <h3 className="font-semibold text-xs mb-1.5">Articles</h3>
                  <div className="space-y-1">
                    {constitutionArticles.map((article) => (
                      <button
                        key={article.id}
                        className="w-full flex items-center gap-2.5 p-2.5 rounded-lg bg-muted/30 hover:bg-muted/60 transition-colors text-left touch-manipulation active:scale-[0.98]"
                        onClick={handleOpenConstitutionViewer}
                      >
                        <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-[9px] font-bold text-primary">
                            {article.number ? article.number.replace("ARTICLE ", "") : "P"}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{article.title}</p>
                          {article.number && (
                            <p className="text-[9px] text-muted-foreground">{article.number}</p>
                          )}
                        </div>
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Constitution Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <Button onClick={handleOpenConstitutionViewer} className="w-full h-10 text-xs touch-manipulation">
                    <BookOpen className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                    View Full
                  </Button>
                  <Button onClick={handleDownloadConstitution} variant="outline" className="w-full h-10 text-xs touch-manipulation">
                    <Download className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                    Download
                  </Button>
                </div>
              </TabsContent>

              {/* MORE TAB */}
              <TabsContent value="more" className="mt-0 p-3 space-y-5">
                {/* Publications Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary shrink-0" />
                    <h3 className="font-bold text-sm">Publications</h3>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search publications..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 text-sm touch-manipulation"
                    />
                  </div>

                  {filteredPublications.filter(p => p.featured).length > 0 && (
                    <div>
                      <h4 className="font-semibold text-xs mb-2">Featured Publications</h4>
                      <div className="space-y-2.5">
                        {filteredPublications.filter(p => p.featured).map((pub) => (
                          <Card key={pub.id} className="border-l-4 border-l-primary overflow-hidden">
                            <CardContent className="p-3 space-y-2">
                              {/* Row 1: Title + Badge */}
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="font-semibold text-xs leading-snug flex-1 min-w-0 line-clamp-2">{pub.title}</h4>
                                <Badge variant="secondary" className="shrink-0 text-[10px]">
                                  {pub.type}
                                </Badge>
                              </div>
                              {/* Row 2: Description */}
                              <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                                {pub.description}
                              </p>
                              {/* Row 3: Meta + Download */}
                              <div className="flex items-center justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="text-[10px] text-muted-foreground truncate">{pub.edition}</p>
                                  <p className="text-[10px] text-muted-foreground">{pub.pages} pages • {pub.fileSize}</p>
                                </div>
                                <Button
                                  onClick={() => handleDownloadPublication({ title: pub.title, fileSize: pub.fileSize })}
                                  size="sm"
                                  className="shrink-0 text-[11px] h-7 px-2.5 touch-manipulation"
                                >
                                  <Download className="h-3 w-3 mr-1" />
                                  Get
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-xs mb-2">All Publications</h4>
                    <div className="space-y-2">
                      {filteredPublications.filter(p => !p.featured).map((pub) => (
                        <Card key={pub.id} className="overflow-hidden">
                          <CardContent className="p-2.5">
                            <div className="flex items-start gap-2.5">
                              <div className="bg-muted rounded p-1.5 shrink-0">
                                <BookOpen className="h-4 w-4" />
                              </div>
                              <div className="flex-1 min-w-0 space-y-1">
                                <h4 className="font-medium text-xs line-clamp-1">{pub.title}</h4>
                                <p className="text-[10px] text-muted-foreground">{pub.edition}</p>
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-[10px] text-muted-foreground">{pub.fileSize}</span>
                                  <Button
                                    onClick={() => handleDownloadPublication({ title: pub.title, fileSize: pub.fileSize })}
                                    size="sm"
                                    variant="ghost"
                                    className="shrink-0 text-[11px] h-6 px-2 touch-manipulation"
                                  >
                                    <Download className="h-3 w-3 mr-1" />
                                    Get
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {filteredPublications.length === 0 && (
                    <div className="text-center py-6 text-muted-foreground text-sm">
                      No publications found matching "{searchQuery}"
                    </div>
                  )}
                </div>

                {/* Other Resources Section */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4 text-primary shrink-0" />
                    <h3 className="font-bold text-sm">Other Resources</h3>
                  </div>

                  <div className="space-y-1.5">
                    <Card className="hover:bg-muted/30 transition-colors cursor-pointer overflow-hidden touch-manipulation">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2.5">
                          <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                            <MessageCircle className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-xs">Community Forum</h4>
                            <p className="text-[10px] text-muted-foreground truncate">
                              Discuss topics with fellow community members
                            </p>
                          </div>
                          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="hover:bg-muted/30 transition-colors cursor-pointer overflow-hidden touch-manipulation">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2.5">
                          <div className="h-9 w-9 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                            <HelpCircle className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-xs">Help Center</h4>
                            <p className="text-[10px] text-muted-foreground truncate">
                              Get answers to frequently asked questions
                            </p>
                          </div>
                          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="hover:bg-muted/30 transition-colors cursor-pointer overflow-hidden touch-manipulation">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2.5">
                          <div className="h-9 w-9 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                            <FileText className="h-4 w-4 text-purple-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-xs">FAQs</h4>
                            <p className="text-[10px] text-muted-foreground truncate">
                              Common questions about membership and services
                            </p>
                          </div>
                          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* ID Card Full Preview with Download */}
      <DigitalIDCardDisplay
        open={showIDCardPreview}
        onOpenChange={handleCloseIDCardPreview}
        cardData={{
          memberName: mockIDCard.memberName,
          memberId: mockIDCard.memberId,
          memberPhoto: mockIDCard.memberPhoto,
          cardNumber: mockIDCard.cardNumber,
          issueDate: mockIDCard.issueDate,
          expiryDate: mockIDCard.expiryDate,
          communityName: "Ndigbo Progressive Union",
          verificationCode: mockIDCard.qrCode,
        }}
      />

      {/* Official Letter Preview with Download */}
      {selectedLetterData && (
        <OfficialLetterDisplay
          open={showLetterPreview}
          onOpenChange={handleCloseLetterPreview}
          letterData={selectedLetterData}
        />
      )}

      {/* Publication Download Format Sheet */}
      {selectedPubForDownload && (
        <DownloadFormatSheet
          open={showPubDownload}
          onOpenChange={handleClosePubDownload}
          onDownload={handlePubDownloadConfirm}
          title="Download Publication"
          documentName={selectedPubForDownload.title}
          availableFormats={["pdf", "jpeg", "png"]}
          isDownloading={isDownloading}
        />
      )}

      {/* Constitution Full Viewer */}
      <ConstitutionViewer
        open={showConstitutionViewer}
        onOpenChange={handleCloseConstitutionViewer}
      />
    </>
  );
}
