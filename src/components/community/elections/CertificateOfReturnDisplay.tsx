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
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
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
    <Card className="border-2 border-primary/20 bg-gradient-to-b from-primary/5 to-transparent">
      <CardContent className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-primary/10">
              <Award className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h2 className="text-xl font-bold uppercase tracking-wide">
            Certificate of Return
          </h2>
          <p className="text-xs text-muted-foreground">
            {certificate.certificateNumber}
          </p>
        </div>

        <Separator />

        {/* Main Content */}
        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">This is to certify that</p>
          <h3 className="text-2xl font-bold text-primary">
            {certificate.winnerName}
          </h3>
          <p className="text-sm text-muted-foreground">
            has been duly elected to the office of
          </p>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {certificate.officePosition}
          </Badge>
          <p className="text-sm text-muted-foreground">of</p>
          <h4 className="text-lg font-semibold">{certificate.communityName}</h4>
        </div>

        <Separator />

        {/* Election Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Election Date</p>
              <p className="font-medium">{format(certificate.electionDate, "MMM d, yyyy")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Votes Received</p>
              <p className="font-medium">
                {certificate.totalVotesReceived} ({certificate.votePercentage.toFixed(1)}%)
              </p>
            </div>
          </div>
        </div>

        {/* Tenure */}
        <Card className="bg-muted/50">
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground text-center mb-2">
              Tenure of Office
            </p>
            <div className="flex justify-center items-center gap-2 text-sm font-medium">
              <span>{format(certificate.tenureStart, "yyyy")}</span>
              <span>—</span>
              <span>{format(certificate.tenureEnd, "yyyy")}</span>
              <Badge variant="outline" className="ml-2">
                {certificate.tenureDurationYears} Years
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Verification */}
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Verification Code</p>
              <p className="font-mono text-sm">{certificate.verificationCode}</p>
            </div>
          </div>
          <CheckCircle className="h-5 w-5 text-green-600" />
        </div>

        {/* Footer */}
        <div className="text-center space-y-2">
          <Separator />
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

        {/* Download Button */}
        <Button className="w-full" onClick={handleDownload}>
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
        <DrawerContent className="max-h-[92vh]">
          <DrawerHeader className="border-b pb-3">
            <DrawerTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Certificate of Return
            </DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="flex-1 p-4 overflow-y-auto touch-auto">
            <CertificateContent />
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
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
  certificateNumber: "COR-2025-COMM001-001",
  communityId: "comm-001",
  communityName: "Lagos Progressive Union",
  communityLocation: "Lagos, Nigeria",
  winnerId: "mem-001",
  winnerName: "Chief Adebayo Okonkwo",
  winnerAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
  officePosition: "President General",
  officeCategory: "executive",
  electionId: "elec-2025",
  electionName: "2025 Community Leadership Elections",
  electionDate: new Date("2025-02-15"),
  totalVotesReceived: 287,
  totalVotesCast: 423,
  votePercentage: 67.8,
  tenureStart: new Date("2025-03-01"),
  tenureEnd: new Date("2029-02-28"),
  tenureDurationYears: 4,
  issuedDate: new Date("2025-02-20"),
  issuedBy: "Mobigate Electoral Commission",
  digitalSignature: "MG-SIG-2025-A7B3C9D2",
  verificationCode: "VER-2025-XK7M9P",
  status: "issued",
};
