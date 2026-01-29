import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { 
  Award, 
  Calendar, 
  Users, 
  CheckCircle,
  Download,
  QrCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CertificateOfReturn } from "@/types/certificateOfReturn";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerBody, DrawerFooter } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

export interface CertificateOfReturnDisplayProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  certificate: CertificateOfReturn;
  onDownload?: () => void;
}

export function CertificateOfReturnDisplay({
  open,
  onOpenChange,
  certificate,
  onDownload,
}: CertificateOfReturnDisplayProps) {
  const isMobile = useIsMobile();
  const handleDownload = () => {
    // Generate text content for download
    const content = `
CERTIFICATE OF RETURN
=====================

Certificate Number: ${certificate.certificateNumber}
Verification Code: ${certificate.verificationCode}

This is to certify that:

${certificate.winnerName}

Has been duly elected to the office of:

${certificate.officePosition}

Of ${certificate.communityName}

Election Date: ${format(certificate.electionDate, "MMMM d, yyyy")}
Votes Received: ${certificate.totalVotesReceived} (${certificate.votePercentage.toFixed(1)}%)

TENURE OF OFFICE
Start: ${format(certificate.tenureStart, "MMMM d, yyyy")}
End: ${format(certificate.tenureEnd, "MMMM d, yyyy")}
Duration: ${certificate.tenureDurationYears} years

Issued by: ${certificate.issuedBy}
Date Issued: ${format(certificate.issuedDate, "MMMM d, yyyy")}

Digital Signature: ${certificate.digitalSignature}

This certificate serves as verified evidence of leadership
for community bank accounts and official documentation.

Powered by Mobigate
    `.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Certificate-${certificate.certificateNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    onDownload?.();
  };

  const CertificateContent = () => (
    <Card className="border-2 border-blue-600/30 bg-gradient-to-b from-blue-600/10 via-blue-500/5 to-transparent overflow-hidden">
      <CardContent className="p-6 space-y-6">
        {/* Header with Blue Accent */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-blue-600/15 border border-blue-600/20">
              <Award className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h2 className="text-xl font-bold uppercase tracking-wide text-foreground">
            Certificate of Return
          </h2>
          <p className="text-xs text-blue-600/80 font-medium">
            {certificate.certificateNumber}
          </p>
        </div>

        <Separator className="bg-blue-600/20" />

        {/* Main Content */}
        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">This is to certify that</p>
          {/* Candidate Name in BLACK */}
          <h3 className="text-2xl font-bold text-foreground">
            {certificate.winnerName}
          </h3>
          <p className="text-sm text-muted-foreground">
            has been duly elected to the office of
          </p>
          <Badge className="text-lg px-4 py-2 bg-secondary text-secondary-foreground">
            {certificate.officePosition}
          </Badge>
          <p className="text-sm text-muted-foreground">of</p>
          <h4 className="text-lg font-semibold text-foreground">{certificate.communityName}</h4>
        </div>

        <Separator className="bg-blue-600/20" />

        {/* Election Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-xs text-muted-foreground">Election Date</p>
              <p className="font-medium">{format(certificate.electionDate, "MMM d, yyyy")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-xs text-muted-foreground">Votes Received</p>
              <p className="font-medium">
                {certificate.totalVotesReceived} ({certificate.votePercentage.toFixed(1)}%)
              </p>
            </div>
          </div>
        </div>

        {/* Tenure - Blue themed */}
        <Card className="bg-blue-600/5 border-blue-600/20">
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground text-center mb-2">
              Tenure of Office
            </p>
            <div className="flex justify-center items-center gap-2 text-sm font-medium">
              <span>{format(certificate.tenureStart, "yyyy")}</span>
              <span>—</span>
              <span>{format(certificate.tenureEnd, "yyyy")}</span>
              <Badge variant="outline" className="ml-2 border-blue-600/30 text-blue-600">
                {certificate.tenureDurationYears} Years
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Verification - Blue themed */}
        <div className="flex items-center justify-between p-3 bg-blue-600/5 rounded-lg border border-blue-600/10">
          <div className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-xs text-blue-600/80">Verification Code</p>
              <p className="font-mono text-sm font-medium">{certificate.verificationCode}</p>
            </div>
          </div>
          <CheckCircle className="h-5 w-5 text-green-600" />
        </div>

        {/* Footer */}
        <div className="text-center space-y-2">
          <Separator className="bg-blue-600/20" />
          <p className="text-xs text-muted-foreground">
            Issued by: {certificate.issuedBy}
          </p>
          <p className="text-xs text-muted-foreground">
            Date: {format(certificate.issuedDate, "MMMM d, yyyy")}
          </p>
          <p className="text-[10px] text-muted-foreground italic">
            This certificate serves as verified evidence of leadership for 
            community bank accounts and official documentation.
          </p>
        </div>

        {/* Download Button - Blue themed */}
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-2" />
          Download Certificate
        </Button>
      </CardContent>
    </Card>
  );

  // If open/onOpenChange not provided, render inline
  if (open === undefined) {
    return <CertificateContent />;
  }

  // Otherwise render in a dialog/drawer
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader className="border-b">
            <DrawerTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-blue-600" />
              Certificate of Return
            </DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <div className="py-4">
              <CertificateContent />
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-blue-600" />
            Certificate of Return
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4">
          <CertificateContent />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

// Mock certificate for demo
export const mockCertificate: CertificateOfReturn = {
  id: "cert-001",
  certificateNumber: "COR/2026/0247",
  communityId: "comm-001",
  communityName: "Ndigbo Progressive Union",
  communityLocation: "Lagos, Nigeria",
  winnerId: "mem-001",
  winnerName: "Daniel Obiora Chibueze",
  winnerAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
  officePosition: "Secretary",
  officeCategory: "executive",
  electionId: "elec-2026",
  electionName: "2026 Community Leadership Elections",
  electionDate: new Date("2026-01-27"),
  totalVotesReceived: 523,
  totalVotesCast: 1000,
  votePercentage: 52.3,
  tenureStart: new Date("2026-03-01"),
  tenureEnd: new Date("2030-02-28"),
  tenureDurationYears: 4,
  issuedDate: new Date("2026-01-27"),
  issuedBy: "Mobigate Electoral Commission",
  digitalSignature: "MG-SIG-2026-A7B3C9D2",
  verificationCode: "KMN3G0GI",
  status: "issued",
};
