import { useState } from "react";
import { X, CreditCard, FileText, BookOpen, QrCode, Download, ExternalLink, Search, Shield } from "lucide-react";
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

  const handleRequestCard = () => {
    toast({
      title: "ID Card Request Submitted",
      description: "Your request will be processed within 5 business days",
    });
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

  const handleDownloadPublication = (title: string) => {
    toast({
      title: "Downloading Publication",
      description: `${title} will be downloaded`,
    });
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
              <TabsList className="w-full grid grid-cols-3 text-xs">
                <TabsTrigger value="id-cards">ID Cards</TabsTrigger>
                <TabsTrigger value="letters">Letters</TabsTrigger>
                <TabsTrigger value="publications">Publications</TabsTrigger>
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
                    {/* ID Card Preview */}
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

                      {/* Member Details */}
                      <div className="p-4">
                        <div className="flex items-start gap-4 mb-4">
                          <Avatar className="h-20 w-20 border-2 border-background">
                            <AvatarImage src={mockIDCard.memberPhoto} alt={mockIDCard.memberName} />
                            <AvatarFallback>{mockIDCard.memberName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-bold text-lg">{mockIDCard.memberName}</h3>
                            <p className="text-sm text-muted-foreground">{mockIDCard.memberId}</p>
                            <Badge className="mt-2" variant={mockIDCard.status === "active" ? "default" : "secondary"}>
                              {mockIDCard.status}
                            </Badge>
                          </div>
                          <div className="bg-white p-2 rounded">
                            <QrCode className="h-12 w-12" />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <p className="text-muted-foreground">Card Number</p>
                            <p className="font-medium">{mockIDCard.cardNumber}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Issue Date</p>
                            <p className="font-medium">{mockIDCard.issueDate.toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Expiry Date</p>
                            <p className="font-medium">{mockIDCard.expiryDate.toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Status</p>
                            <p className="font-medium capitalize">{mockIDCard.status}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button onClick={handleRequestCard} variant="outline" size="sm">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Request New Card
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowIDCardPreview(true)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Digital
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
                                  setSelectedLetterData({
                                    templateTitle: template?.title || "",
                                    letterNumber: request.letterNumber!,
                                    requestedBy: request.requestedBy,
                                    purpose: request.purpose,
                                    issuedDate: request.approvalDate || request.requestDate,
                                    communityName: "Ndigbo Progressive Union",
                                    signedBy: request.approvedBy || "Community Secretary",
                                    verificationCode: `VER-${request.letterNumber?.replace(/\//g, "-")}`,
                                  });
                                  setShowLetterPreview(true);
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

              {/* PUBLICATIONS TAB */}
              <TabsContent value="publications" className="mt-0 p-4 sm:p-6 space-y-4">
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
                    <h3 className="font-semibold mb-3">Featured Publications</h3>
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
                                    onClick={() => handleDownloadPublication(pub.title)}
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
                  <h3 className="font-semibold mb-3">All Publications</h3>
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
                                  onClick={() => handleDownloadPublication(pub.title)}
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
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* ID Card Full Preview with Download */}
      <DigitalIDCardDisplay
        open={showIDCardPreview}
        onOpenChange={setShowIDCardPreview}
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
          onOpenChange={setShowLetterPreview}
          letterData={selectedLetterData}
        />
      )}
    </>
  );
}
