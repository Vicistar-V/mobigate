import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Award,
  FileText,
  Download,
  CheckCircle,
  Calendar,
  Building,
  User,
  Shield,
  Printer,
  Eye
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { mockWinnerResults } from "@/data/adminElectionData";
import { format, addYears } from "date-fns";
import { CertificateOfReturn } from "@/types/certificateOfReturn";
import { CertificateOfReturnDisplay } from "@/components/community/elections/CertificateOfReturnDisplay";

interface CertificateOfReturnGeneratorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  communityName?: string;
}

export function CertificateOfReturnGenerator({
  open,
  onOpenChange,
  communityName = "Ndigbo Progressive Union"
}: CertificateOfReturnGeneratorProps) {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const [selectedWinner, setSelectedWinner] = useState<string | null>(null);
  const [tenureYears, setTenureYears] = useState("4");
  const [generatedCertificate, setGeneratedCertificate] = useState<CertificateOfReturn | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const announcedWinners = mockWinnerResults
    .filter(r => r.announced)
    .map(r => ({
      ...r,
      winner: r.candidates.find(c => c.isWinner)
    }))
    .filter(r => r.winner);

  const handleGenerateCertificate = async () => {
    if (!selectedWinner) {
      toast({
        title: "Select a Winner",
        description: "Please select an announced winner to generate certificate.",
        variant: "destructive"
      });
      return;
    }

    const result = announcedWinners.find(r => r.id === selectedWinner);
    if (!result || !result.winner) return;

    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const now = new Date();
    const tenureYearsNum = parseInt(tenureYears);
    const certificate: CertificateOfReturn = {
      id: `cert-${Date.now()}`,
      certificateNumber: `COR/${now.getFullYear()}/${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      communityName,
      communityId: "comm-001",
      communityLocation: "Nigeria",
      winnerName: result.winner.name,
      winnerId: result.winner.id,
      winnerAvatar: result.winner.avatar,
      officePosition: result.officeName,
      officeCategory: 'executive',
      electionId: "elec-2025",
      electionName: "2025 Community Leadership Elections",
      electionDate: now,
      totalVotesReceived: result.winner.votes,
      totalVotesCast: result.candidates.reduce((sum, c) => sum + c.votes, 0),
      votePercentage: result.winner.percentage,
      tenureStart: now,
      tenureEnd: addYears(now, tenureYearsNum),
      tenureDurationYears: tenureYearsNum,
      issuedDate: now,
      issuedBy: "Mobigate Electoral Commission",
      digitalSignature: "MOBIGATE-SIG-" + Math.random().toString(36).substring(2, 10).toUpperCase(),
      verificationCode: Math.random().toString(36).substring(2, 10).toUpperCase(),
      status: 'issued'
    };

    setGeneratedCertificate(certificate);
    setShowPreview(true);
    setIsGenerating(false);

    toast({
      title: "Certificate Generated!",
      description: `Certificate of Return for ${result.winner.name} is ready.`
    });
  };

  const Content = () => (
    <div className="space-y-4">
      {/* Info Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Award className="h-6 w-6 text-primary shrink-0" />
            <div>
              <h4 className="font-semibold text-sm">Certificate of Return</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Generate official certificates for election winners. These digital 
                documents, signed by Mobigate, serve as verified evidence of 
                leadership for bank accounts and legal requirements.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Community Info */}
      <Card>
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Issuing Community</p>
              <p className="font-medium text-sm">{communityName}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Select Winner */}
      <div className="space-y-3">
        <h4 className="font-semibold text-sm">Select Announced Winner</h4>

        {announcedWinners.length === 0 ? (
          <Card className="bg-amber-500/5 border-amber-500/20">
            <CardContent className="p-4 text-center">
              <Shield className="h-8 w-8 text-amber-600 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No winners have been announced yet. 
                Please announce election results first.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {announcedWinners.map((result) => {
              const isSelected = selectedWinner === result.id;
              return (
                <Card 
                  key={result.id}
                  className={`cursor-pointer transition-all ${
                    isSelected ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedWinner(result.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarImage src={result.winner?.avatar} alt={result.winner?.name} />
                        <AvatarFallback>
                          {result.winner?.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{result.winner?.name}</p>
                        <p className="text-xs text-muted-foreground">{result.officeName}</p>
                      </div>
                      {isSelected && (
                        <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Tenure Configuration */}
      <div className="space-y-2">
        <Label className="text-sm">Tenure Duration (Years)</Label>
        <div className="flex gap-2">
          {["2", "3", "4", "5"].map((year) => (
            <Button
              key={year}
              variant={tenureYears === year ? "default" : "outline"}
              size="sm"
              className="flex-1 h-10"
              onClick={() => setTenureYears(year)}
            >
              {year} Years
            </Button>
          ))}
        </div>
      </div>

      {/* Tenure Preview */}
      {selectedWinner && (
        <Card className="bg-muted/50">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Tenure:</span>
              <span className="font-medium">
                {format(new Date(), "yyyy")} - {format(addYears(new Date(), parseInt(tenureYears)), "yyyy")}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generate Button */}
      <Button 
        className="w-full h-11"
        onClick={handleGenerateCertificate}
        disabled={!selectedWinner || isGenerating}
      >
        {isGenerating ? (
          "Generating Certificate..."
        ) : (
          <>
            <FileText className="h-4 w-4 mr-2" />
            Generate Certificate
          </>
        )}
      </Button>

      {/* Previously Generated Certificates */}
      <Separator />

      <div className="space-y-3">
        <h4 className="font-semibold text-sm flex items-center justify-between">
          <span>Issued Certificates</span>
          <Badge variant="secondary" className="text-xs">
            {announcedWinners.length}
          </Badge>
        </h4>

        <p className="text-xs text-muted-foreground">
          Certificates are generated and stored for each announced winner.
          You can view, download, or print them as needed.
        </p>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <Drawer open={open} onOpenChange={onOpenChange}>
          <DrawerContent className="max-h-[92vh]">
            <DrawerHeader className="border-b pb-3">
              <DrawerTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Certificate Generator
              </DrawerTitle>
            </DrawerHeader>
            <ScrollArea className="flex-1 p-4 overflow-y-auto touch-auto">
              <Content />
            </ScrollArea>
          </DrawerContent>
        </Drawer>

        {/* Certificate Preview */}
        {generatedCertificate && (
          <CertificateOfReturnDisplay
            open={showPreview}
            onOpenChange={setShowPreview}
            certificate={generatedCertificate}
          />
        )}
      </>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Certificate Generator
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 pr-4">
            <Content />
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Certificate Preview */}
      {generatedCertificate && (
        <CertificateOfReturnDisplay
          open={showPreview}
          onOpenChange={setShowPreview}
          certificate={generatedCertificate}
        />
      )}
    </>
  );
}
