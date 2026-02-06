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
        <DialogContent className="max-w-3xl max-h-[90vh] p-0">
          <DialogHeader className="p-4 sm:p-6 pb-0 sticky top-0 bg-background z-10">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold">Community Resources</DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <Tabs defaultValue="id-cards" className="flex-1">
            <div className="px-4 sm:px-6">
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
              <TabsContent value="id-cards" className="mt-0 p-4 sm:p-6 space-y-4">
                <Card className="border-2">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      Your Community ID Card
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* ID Card Preview - Mobile Optimized Vertical Stack */}
                    <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-2 border-primary/20 rounded-xl overflow-hidden">
                      {/* Community Name Header */}
                      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider">Ndigbo Progressive Union</h4>
                            <p className="text-[9px] opacity-80">Official Community ID Card</p>
                          </div>
                        </div>
                      </div>

                      {/* Member Details - Vertically Stacked for Mobile */}
                      <div className="p-4 space-y-3">
                        {/* Photo + Name centered */}
                        <div className="flex flex-col items-center text-center gap-2">
                          <Avatar className="h-16 w-16 border-2 border-primary/20">
                            <AvatarImage src={mockIDCard.memberPhoto} alt={mockIDCard.memberName} />
                            <AvatarFallback>{mockIDCard.memberName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-bold text-base">{mockIDCard.memberName}</h3>
                            <p className="text-sm text-muted-foreground">{mockIDCard.memberId}</p>
                            <Badge className="mt-1" variant={mockIDCard.status === "active" ? "default" : "secondary"}>
                              {mockIDCard.status}
                            </Badge>
                          </div>
                        </div>

                        {/* Card Details Grid */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-muted/50 rounded-lg p-2.5">
                            <p className="text-muted-foreground text-[10px]">Card Number</p>
                            <p className="font-medium">{mockIDCard.cardNumber}</p>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-2.5">
                            <p className="text-muted-foreground text-[10px]">Issue Date</p>
                            <p className="font-medium">{mockIDCard.issueDate.toLocaleDateString()}</p>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-2.5">
                            <p className="text-muted-foreground text-[10px]">Expiry Date</p>
                            <p className="font-medium">{mockIDCard.expiryDate.toLocaleDateString()}</p>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-2.5 flex items-center gap-1.5">
                            <QrCode className="h-4 w-4 text-primary shrink-0" />
                            <div>
                              <p className="text-muted-foreground text-[10px]">Verified</p>
                              <p className="font-medium capitalize">{mockIDCard.status}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons - Mobile Vertical Stack */}
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <Button onClick={handleRequestCard} variant="outline" size="sm">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Request New
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleOpenIDCardPreview}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Digital
                        </Button>
                      </div>
                      <Button onClick={handleRenewCard} variant="default" className="w-full" size="sm">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Renew ID Card
                      </Button>
                    </div>

                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground">
                        Your ID card is valid for 2 years from issue date. Please renew before expiry to maintain uninterrupted access to community services.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* LETTERS TAB */}
              <TabsContent value="letters" className="mt-0 p-4 sm:p-6 space-y-4">
                {/* Request New Letter */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Request Official Letter</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Letter Type</label>
                      <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                        <SelectTrigger>
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
                      <div className="p-3 bg-muted rounded-lg text-xs">
                        <p className="text-muted-foreground">
                          {letterTemplates.find(t => t.id === selectedTemplate)?.description}
                        </p>
                        {letterTemplates.find(t => t.id === selectedTemplate)?.requiresApproval && (
                          <p className="text-yellow-700 mt-2">
                            ⚠️ Requires approval from community leadership
                          </p>
                        )}
                      </div>
                    )}

                    <div>
                      <label className="text-sm font-medium mb-2 block">Purpose of Request</label>
                      <Textarea
                        placeholder="Please provide detailed purpose for this letter..."
                        value={letterPurpose}
                        onChange={(e) => setLetterPurpose(e.target.value)}
                        rows={4}
                      />
                    </div>

                    <Button onClick={handleRequestLetter} className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      Submit Request
                    </Button>
                  </CardContent>
                </Card>

                {/* Letter Requests History */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Your Letter Requests</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {mockLetterRequests.map((request) => {
                      const template = letterTemplates.find(t => t.id === request.templateId);
                      return (
                        <div key={request.id} className="p-3 border rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm">{template?.title}</h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                Requested: {request.requestDate.toLocaleDateString()}
                              </p>
                            </div>
                            <Badge className={getStatusColor(request.status)}>
                              {request.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            Purpose: {request.purpose}
                          </p>
                          {request.letterNumber && (
                            <div className="flex items-center justify-between pt-2 border-t">
                              <span className="text-xs font-medium">{request.letterNumber}</span>
                              <Button 
                                size="sm" 
                                variant="outline"
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
              <TabsContent value="constitution" className="mt-0 p-4 sm:p-6 space-y-4">
                {/* Constitution Header Card */}
                <Card className="border-2 border-primary/20">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Scale className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm leading-tight">{constitutionMetadata.title}</h3>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                          <Badge variant="secondary" className="text-[10px]">
                            Version {constitutionMetadata.version}
                          </Badge>
                          <Badge variant="outline" className="text-[10px]">
                            Effective {format(constitutionMetadata.effectiveDate, "MMM d, yyyy")}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-muted/50 rounded-lg p-2.5">
                        <p className="text-muted-foreground text-[10px]">Adopted</p>
                        <p className="font-medium">{format(constitutionMetadata.adoptedDate, "MMM d, yyyy")}</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-2.5">
                        <p className="text-muted-foreground text-[10px]">Last Amended</p>
                        <p className="font-medium">{format(constitutionMetadata.lastAmendedDate, "MMM d, yyyy")}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Articles List */}
                <div>
                  <h3 className="font-semibold text-sm mb-2">Articles</h3>
                  <div className="space-y-1.5">
                    {constitutionArticles.map((article) => (
                      <button
                        key={article.id}
                        className="w-full flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/60 transition-colors text-left"
                        onClick={handleOpenConstitutionViewer}
                      >
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-bold text-primary">
                            {article.number ? article.number.replace("ARTICLE ", "") : "P"}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{article.title}</p>
                          {article.number && (
                            <p className="text-[10px] text-muted-foreground">{article.number}</p>
                          )}
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Constitution Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <Button onClick={handleOpenConstitutionViewer} className="w-full h-11">
                    <BookOpen className="h-4 w-4 mr-2" />
                    View Full Document
                  </Button>
                  <Button onClick={handleDownloadConstitution} variant="outline" className="w-full h-11">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </TabsContent>

              {/* MORE TAB */}
              <TabsContent value="more" className="mt-0 p-4 sm:p-6 space-y-6">
                {/* Publications Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <h3 className="font-bold text-base">Publications</h3>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search publications..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>

                  {filteredPublications.filter(p => p.featured).length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm mb-3">Featured Publications</h4>
                      <div className="grid gap-4">
                        {filteredPublications.filter(p => p.featured).map((pub) => (
                          <Card key={pub.id} className="border-l-4 border-l-primary">
                            <CardContent className="p-4">
                              <div className="flex gap-4">
                                <div className="bg-primary/10 rounded-lg p-4 flex items-center justify-center shrink-0">
                                  <BookOpen className="h-8 w-8 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2 mb-1">
                                    <h4 className="font-semibold text-sm line-clamp-1">{pub.title}</h4>
                                    <Badge variant="secondary" className="shrink-0 text-xs">
                                      {pub.type}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                                    {pub.description}
                                  </p>
                                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <div className="space-y-1">
                                      <p>{pub.edition}</p>
                                      <p>{pub.pages} pages • {pub.fileSize}</p>
                                    </div>
                                    <Button
                                      onClick={() => handleDownloadPublication({ title: pub.title, fileSize: pub.fileSize })}
                                      size="sm"
                                      className="shrink-0"
                                    >
                                      <Download className="h-3 w-3 mr-1" />
                                      Download
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

                  <div>
                    <h4 className="font-semibold text-sm mb-3">All Publications</h4>
                    <div className="grid gap-3">
                      {filteredPublications.filter(p => !p.featured).map((pub) => (
                        <Card key={pub.id}>
                          <CardContent className="p-3">
                            <div className="flex items-start gap-3">
                              <div className="bg-muted rounded p-2 shrink-0">
                                <BookOpen className="h-5 w-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm line-clamp-1 mb-1">{pub.title}</h4>
                                <p className="text-xs text-muted-foreground mb-2">{pub.edition}</p>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-muted-foreground">{pub.fileSize}</span>
                                  <Button
                                    onClick={() => handleDownloadPublication({ title: pub.title, fileSize: pub.fileSize })}
                                    size="sm"
                                    variant="ghost"
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
                    <div className="text-center py-8 text-muted-foreground">
                      No publications found matching "{searchQuery}"
                    </div>
                  )}
                </div>

                {/* Other Resources Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-5 w-5 text-primary" />
                    <h3 className="font-bold text-base">Other Resources</h3>
                  </div>

                  <div className="space-y-2.5">
                    <Card className="hover:bg-muted/30 transition-colors cursor-pointer">
                      <CardContent className="p-3.5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                            <MessageCircle className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm">Community Forum</h4>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              Discuss topics with fellow community members
                            </p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="hover:bg-muted/30 transition-colors cursor-pointer">
                      <CardContent className="p-3.5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                            <HelpCircle className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm">Help Center</h4>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              Get answers to frequently asked questions
                            </p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="hover:bg-muted/30 transition-colors cursor-pointer">
                      <CardContent className="p-3.5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                            <FileText className="h-5 w-5 text-purple-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm">FAQs</h4>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              Common questions about membership and services
                            </p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
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
