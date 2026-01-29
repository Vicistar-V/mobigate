import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { 
  Award, 
  Download,
  Printer,
  CheckCircle2,
  Shield,
  QrCode,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { CertificateOfReturn } from "@/types/certificateOfReturn";

interface CertificateOfReturnPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  certificate: CertificateOfReturn;
}

export function CertificateOfReturnPreview({
  open,
  onOpenChange,
  certificate,
}: CertificateOfReturnPreviewProps) {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    // Generate professional text content for download
    const content = `
══════════════════════════════════════════════════════════════════
                     CERTIFICATE OF RETURN
══════════════════════════════════════════════════════════════════

                    MOBIGATE ELECTORAL COMMISSION
                      Official Document

Certificate No: ${certificate.certificateNumber}
══════════════════════════════════════════════════════════════════

                    THIS IS TO CERTIFY THAT

                    ${certificate.winnerName.toUpperCase()}

    Has been duly elected to the esteemed office of

                    ${certificate.officePosition.toUpperCase()}

                            of

                    ${certificate.communityName.toUpperCase()}
                    ${certificate.communityLocation || ''}

══════════════════════════════════════════════════════════════════

ELECTION DETAILS
────────────────────────────────────────────────────────────────
Election Name:     ${certificate.electionName}
Election Date:     ${format(certificate.electionDate, "MMMM d, yyyy")}
Votes Received:    ${certificate.totalVotesReceived.toLocaleString()} votes
Total Votes Cast:  ${certificate.totalVotesCast.toLocaleString()} votes
Vote Percentage:   ${certificate.votePercentage.toFixed(1)}%

TENURE OF OFFICE
────────────────────────────────────────────────────────────────
Commencement:      ${format(certificate.tenureStart, "MMMM d, yyyy")}
Expiration:        ${format(certificate.tenureEnd, "MMMM d, yyyy")}
Duration:          ${certificate.tenureDurationYears} Year(s)

══════════════════════════════════════════════════════════════════

AUTHENTICATION
────────────────────────────────────────────────────────────────
Digital Signature: ${certificate.digitalSignature}
Verification Code: ${certificate.verificationCode}

Issued By:         ${certificate.issuedBy}
Date of Issue:     ${format(certificate.issuedDate, "MMMM d, yyyy")}

══════════════════════════════════════════════════════════════════


                    ___________________________
                        MOBIGATE SIGNATURE
                    Electoral Commission Seal


This Certificate of Return serves as official and verified evidence
of leadership, valid for community bank accounts, legal proceedings,
and all official documentation purposes.

                    Powered by MOBIGATE
              Digital Community Governance Platform

══════════════════════════════════════════════════════════════════
`.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Certificate-of-Return-${certificate.winnerName.replace(/\s+/g, '-')}-${certificate.certificateNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Certificate Downloaded",
      description: "Certificate of Return has been downloaded successfully.",
    });
  };

  const handlePrint = () => {
    window.print();
    toast({
      title: "Print Initiated",
      description: "Opening print dialog...",
    });
  };

  const CertificateDocument = () => (
    <div ref={certificateRef} className="certificate-document">
      {/* Main Certificate Card - Professional Blue Theme */}
      <Card className="border-2 border-primary/30 bg-gradient-to-b from-primary/10 via-primary/5 to-background overflow-hidden shadow-lg">
        <CardContent className="p-0">
          {/* Certificate Header - Blue Bar */}
          <div className="bg-gradient-to-r from-primary to-primary/80 p-4 text-center">
            <div className="flex justify-center mb-2">
              <div className="p-2.5 rounded-full bg-white/20 backdrop-blur-sm">
                <Award className="h-7 w-7 text-white" />
              </div>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-white uppercase tracking-widest">
              Certificate of Return
            </h1>
            <p className="text-primary-foreground/80 text-[10px] sm:text-xs mt-1 tracking-wide">
              Mobigate Electoral Commission
            </p>
          </div>

          {/* Certificate Number Badge */}
          <div className="flex justify-center -mt-3">
            <Badge 
              variant="secondary" 
              className="bg-background border border-primary/20 text-primary font-mono text-[10px] sm:text-xs px-3 py-1 shadow-md"
            >
              {certificate.certificateNumber}
            </Badge>
          </div>

          {/* Certificate Body */}
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
            {/* Certification Statement */}
            <div className="text-center space-y-3">
              <p className="text-xs sm:text-sm text-muted-foreground">
                This is to certify that
              </p>
              
              {/* Winner's Name - Prominent Display */}
              <div className="py-2 px-4 bg-gradient-to-r from-transparent via-primary/5 to-transparent">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-wide">
                  {certificate.winnerName}
                </h2>
              </div>
              
              <p className="text-xs sm:text-sm text-muted-foreground">
                has been duly elected to the office of
              </p>
              
              {/* Office Position - Badge Style */}
              <Badge 
                variant="outline" 
                className="text-sm sm:text-base px-4 py-2 border-primary/30 bg-primary/5 text-foreground font-semibold"
              >
                {certificate.officePosition}
              </Badge>
              
              <p className="text-xs sm:text-sm text-muted-foreground">of</p>
              
              {/* Community Name */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-foreground">
                  {certificate.communityName}
                </h3>
                {certificate.communityLocation && (
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                    {certificate.communityLocation}
                  </p>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border"></div>
              <Shield className="h-4 w-4 text-muted-foreground/50" />
              <div className="flex-1 h-px bg-border"></div>
            </div>

            {/* Election & Tenure Details */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <Card className="bg-muted/40 border-0">
                <CardContent className="p-2.5 sm:p-3">
                  <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
                    Election Date
                  </p>
                  <p className="text-xs sm:text-sm font-semibold">
                    {format(certificate.electionDate, "MMM d, yyyy")}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-muted/40 border-0">
                <CardContent className="p-2.5 sm:p-3">
                  <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
                    Votes Received
                  </p>
                  <p className="text-xs sm:text-sm font-semibold">
                    {certificate.totalVotesReceived.toLocaleString()} ({certificate.votePercentage.toFixed(1)}%)
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Tenure Card */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-3 sm:p-4 text-center">
                <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">
                  Tenure of Office
                </p>
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  <span className="text-sm sm:text-lg font-bold text-primary">
                    {format(certificate.tenureStart, "yyyy")}
                  </span>
                  <span className="text-muted-foreground">—</span>
                  <span className="text-sm sm:text-lg font-bold text-primary">
                    {format(certificate.tenureEnd, "yyyy")}
                  </span>
                  <Badge variant="secondary" className="ml-2 text-[10px] sm:text-xs">
                    {certificate.tenureDurationYears} Year{certificate.tenureDurationYears > 1 ? 's' : ''}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Verification Section */}
            <Card className="bg-muted/30 border-0">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <QrCode className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-[9px] sm:text-[10px] text-muted-foreground">
                        Verification Code
                      </p>
                      <p className="font-mono text-xs sm:text-sm font-medium">
                        {certificate.verificationCode}
                      </p>
                    </div>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
              </CardContent>
            </Card>

            {/* Divider */}
            <div className="border-t border-dashed border-border" />

            {/* Mobigate Signature Section */}
            <div className="text-center space-y-3">
              <div className="inline-flex flex-col items-center">
                {/* Signature Line */}
                <div className="w-40 sm:w-48 h-px bg-foreground mb-1" />
                
                {/* Digital Signature Styled */}
                <div className="relative">
                  <p className="font-serif italic text-lg sm:text-xl text-foreground/80">
                    Mobigate
                  </p>
                  <Badge 
                    variant="outline" 
                    className="absolute -right-8 -top-1 text-[8px] px-1.5 py-0 border-green-500/50 text-green-600"
                  >
                    VERIFIED
                  </Badge>
                </div>
                
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                  Electoral Commission
                </p>
              </div>

              {/* Issue Details */}
              <div className="pt-2 space-y-0.5">
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  Issued by: <span className="font-medium text-foreground">{certificate.issuedBy}</span>
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  Date: <span className="font-medium text-foreground">{format(certificate.issuedDate, "MMMM d, yyyy")}</span>
                </p>
                <p className="text-[8px] sm:text-[9px] text-muted-foreground/70 font-mono mt-1">
                  Sig: {certificate.digitalSignature}
                </p>
              </div>
            </div>

            {/* Footer Notice */}
            <div className="bg-primary/5 rounded-lg p-2.5 sm:p-3">
              <p className="text-[9px] sm:text-[10px] text-muted-foreground text-center leading-relaxed">
                This Certificate of Return serves as verified evidence of leadership, 
                valid for community bank accounts, legal proceedings, and all official documentation purposes.
              </p>
            </div>
          </div>

          {/* Certificate Footer - Blue Bar */}
          <div className="bg-gradient-to-r from-primary/80 to-primary py-2 px-4">
            <p className="text-center text-[9px] sm:text-[10px] text-primary-foreground/80 tracking-wide">
              Powered by <span className="font-semibold text-white">MOBIGATE</span> — Digital Community Governance Platform
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const ActionButtons = () => (
    <div className="flex gap-2 mt-4">
      <Button 
        className="flex-1 gap-2" 
        onClick={handleDownload}
      >
        <Download className="h-4 w-4" />
        Download
      </Button>
      <Button 
        variant="outline" 
        className="flex-1 gap-2"
        onClick={handlePrint}
      >
        <Printer className="h-4 w-4" />
        Print
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[95vh]">
          <DrawerHeader className="border-b pb-3">
            <DrawerTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Certificate of Return
            </DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="flex-1 p-4 overflow-y-auto touch-auto">
            <CertificateDocument />
            <ActionButtons />
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Certificate of Return
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4">
          <CertificateDocument />
          <ActionButtons />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
