import { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format as formatDate } from "date-fns";
import { 
  Award, 
  Calendar, 
  Users, 
  CheckCircle,
  Download,
  QrCode,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CertificateOfReturn } from "@/types/certificateOfReturn";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerBody, DrawerFooter } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { DownloadFormatSheet, DownloadFormat } from "@/components/common/DownloadFormatSheet";

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
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showFormatSheet, setShowFormatSheet] = useState(false);

  const handleFormatDownload = async (selectedFormat: DownloadFormat) => {
    if (!certificateRef.current) return;
    
    setIsDownloading(true);
    
    try {
      // Capture the certificate as an image
      const canvas = await html2canvas(certificateRef.current, {
        scale: 3,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
        windowWidth: 400,
        windowHeight: certificateRef.current.scrollHeight,
      });
      
      const fileName = `Certificate-${certificate.certificateNumber.replace(/\//g, "_")}`;
      
      if (selectedFormat === "pdf") {
        const imgData = canvas.toDataURL("image/png", 1.0);
        const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const padding = 15;
        const availableWidth = pageWidth - (padding * 2);
        const ratio = availableWidth / canvas.width;
        const scaledHeight = canvas.height * ratio;
        const yPosition = scaledHeight < (pageHeight - padding * 2) ? (pageHeight - scaledHeight) / 2 : padding;
        pdf.addImage(imgData, "PNG", padding, yPosition, availableWidth, scaledHeight);
        pdf.save(`${fileName}.pdf`);
      } else if (selectedFormat === "jpeg") {
        const link = document.createElement("a");
        link.download = `${fileName}.jpg`;
        link.href = canvas.toDataURL("image/jpeg", 0.95);
        link.click();
      } else if (selectedFormat === "png") {
        const link = document.createElement("a");
        link.download = `${fileName}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      } else if (selectedFormat === "txt") {
        const textContent = `CERTIFICATE OF RETURN\n${certificate.certificateNumber}\n\nThis is to certify that ${certificate.winnerName} has been duly elected to the office of ${certificate.officePosition} of ${certificate.communityName}.\n\nElection Date: ${formatDate(certificate.electionDate, "MMMM d, yyyy")}\nVotes Received: ${certificate.totalVotesReceived} (${certificate.votePercentage.toFixed(1)}%)\nTenure: ${formatDate(certificate.tenureStart, "yyyy")} - ${formatDate(certificate.tenureEnd, "yyyy")}\n\nVerification Code: ${certificate.verificationCode}\nIssued by: ${certificate.issuedBy}\nDate: ${formatDate(certificate.issuedDate, "MMMM d, yyyy")}`;
        const blob = new Blob([textContent], { type: "text/plain" });
        const link = document.createElement("a");
        link.download = `${fileName}.txt`;
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
      }
      
      toast({ title: "Certificate Downloaded", description: `Saved as ${selectedFormat.toUpperCase()} file.` });
      setShowFormatSheet(false);
      onDownload?.();
    } catch (error) {
      console.error("Error generating download:", error);
      toast({ title: "Download Failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsDownloading(false);
    }
  };

  const CertificateContent = () => (
    <div className="space-y-4">
      {/* Printable Certificate Area */}
      <div ref={certificateRef} className="bg-white">
        <Card className="border-2 border-blue-600/30 bg-gradient-to-b from-blue-600/10 via-blue-500/5 to-white overflow-hidden">
          <CardContent className="p-6 space-y-5">
            {/* Header with Blue Accent */}
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <div className="p-3 rounded-full bg-blue-600/15 border border-blue-600/20">
                  <Award className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h2 className="text-xl font-bold uppercase tracking-wide text-gray-900">
                Certificate of Return
              </h2>
              <p className="text-xs text-blue-600 font-medium">
                {certificate.certificateNumber}
              </p>
            </div>

            <Separator className="bg-blue-600/20" />

            {/* Main Content */}
            <div className="text-center space-y-3">
              <p className="text-sm text-gray-500">This is to certify that</p>
              {/* Candidate Name in BLACK */}
              <h3 className="text-2xl font-bold text-gray-900">
                {certificate.winnerName}
              </h3>
              <p className="text-sm text-gray-500">
                has been duly elected to the office of
              </p>
              <div className="inline-block bg-gray-100 text-gray-900 text-lg px-4 py-2 rounded-md font-semibold">
                {certificate.officePosition}
              </div>
              <p className="text-sm text-gray-500">of</p>
              <h4 className="text-lg font-semibold text-gray-900">{certificate.communityName}</h4>
            </div>

            <Separator className="bg-blue-600/20" />

            {/* Election Details */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-500">Election Date</p>
                  <p className="font-medium text-gray-900">{formatDate(certificate.electionDate, "MMM d, yyyy")}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-500">Votes Received</p>
                  <p className="font-medium text-gray-900">
                    {certificate.totalVotesReceived} ({certificate.votePercentage.toFixed(1)}%)
                  </p>
                </div>
              </div>
            </div>

            {/* Tenure - Blue themed */}
            <div className="bg-blue-50 border border-blue-600/20 rounded-lg p-3">
              <p className="text-xs text-gray-500 text-center mb-2">
                Tenure of Office
              </p>
              <div className="flex justify-center items-center gap-2 text-sm font-medium text-gray-900">
                <span>{formatDate(certificate.tenureStart, "yyyy")}</span>
                <span>—</span>
                <span>{formatDate(certificate.tenureEnd, "yyyy")}</span>
                <span className="ml-2 text-xs bg-white border border-blue-600/30 text-blue-600 px-2 py-0.5 rounded">
                  {certificate.tenureDurationYears} Years
                </span>
              </div>
            </div>

            {/* Verification - Blue themed */}
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-600/10">
              <div className="flex items-center gap-2">
                <QrCode className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-xs text-blue-600">Verification Code</p>
                  <p className="font-mono text-sm font-medium text-gray-900">{certificate.verificationCode}</p>
                </div>
              </div>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>

            {/* Footer */}
            <div className="text-center space-y-2 pt-2">
              <Separator className="bg-blue-600/20" />
              <p className="text-xs text-gray-500">
                Issued by: {certificate.issuedBy}
              </p>
              <p className="text-xs text-gray-500">
                Date: {formatDate(certificate.issuedDate, "MMMM d, yyyy")}
              </p>
              <p className="text-[10px] text-gray-400 italic">
                This certificate serves as verified evidence of leadership for 
                community bank accounts and official documentation.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Download Button - Outside printable area */}
      <Button 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
        onClick={() => setShowFormatSheet(true)}
        disabled={isDownloading}
      >
        {isDownloading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Downloading...
          </>
        ) : (
          <>
            <Download className="h-4 w-4 mr-2" />
            Download Certificate
          </>
        )}
      </Button>

      {/* Format Selection Sheet */}
      <DownloadFormatSheet
        open={showFormatSheet}
        onOpenChange={setShowFormatSheet}
        onDownload={handleFormatDownload}
        title="Download Certificate"
        documentName={`Certificate of Return - ${certificate.winnerName}`}
        availableFormats={["pdf", "jpeg", "png", "txt"]}
        isDownloading={isDownloading}
      />
    </div>
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
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-blue-600" />
            Certificate of Return
          </DialogTitle>
        </DialogHeader>
        <CertificateContent />
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
  issuedBy: "Mobigate Electoral System",
  digitalSignature: "MG-SIG-2026-A7B3C9D2",
  verificationCode: "KMN3G0GI",
  status: "issued",
};
