import { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { format as formatDate } from "date-fns";
import {
  FileText,
  Calendar,
  Download,
  QrCode,
  CheckCircle,
  Loader2,
  Stamp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerBody } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { DownloadFormatSheet, DownloadFormat } from "@/components/common/DownloadFormatSheet";

export interface LetterData {
  templateTitle: string;
  letterNumber: string;
  requestedBy: string;
  purpose: string;
  issuedDate: Date;
  communityName: string;
  signedBy: string;
  verificationCode: string;
}

interface OfficialLetterDisplayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  letterData: LetterData;
}

export function OfficialLetterDisplay({
  open,
  onOpenChange,
  letterData,
}: OfficialLetterDisplayProps) {
  const isMobile = useIsMobile();
  const letterRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showFormatSheet, setShowFormatSheet] = useState(false);

  const handleFormatDownload = async (selectedFormat: DownloadFormat) => {
    if (!letterRef.current) return;

    setIsDownloading(true);

    try {
      const canvas = await html2canvas(letterRef.current, {
        scale: 3,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
        windowWidth: 400,
        windowHeight: letterRef.current.scrollHeight,
      });

      const fileName = `Letter-${letterData.letterNumber.replace(/\//g, "_")}`;

      if (selectedFormat === "pdf") {
        const imgData = canvas.toDataURL("image/png", 1.0);
        const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const padding = 15;
        const availableWidth = pageWidth - padding * 2;
        const ratio = availableWidth / canvas.width;
        const scaledHeight = canvas.height * ratio;
        const yPosition = scaledHeight < pageHeight - padding * 2 ? (pageHeight - scaledHeight) / 2 : padding;
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
        const textContent = `OFFICIAL LETTER\n${letterData.letterNumber}\n\n${letterData.communityName}\n\nDate: ${formatDate(letterData.issuedDate, "MMMM d, yyyy")}\nRef: ${letterData.letterNumber}\n\nTO WHOM IT MAY CONCERN\n\nRE: ${letterData.templateTitle.toUpperCase()}\n\nThis is to certify that ${letterData.requestedBy} is a registered and active member of ${letterData.communityName}.\n\nPurpose: ${letterData.purpose}\n\nThis letter is issued upon request for the purpose stated above.\n\nVerification Code: ${letterData.verificationCode}\n\nSigned by: ${letterData.signedBy}\nDate: ${formatDate(letterData.issuedDate, "MMMM d, yyyy")}`;
        const blob = new Blob([textContent], { type: "text/plain" });
        const link = document.createElement("a");
        link.download = `${fileName}.txt`;
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
      }

      toast({ title: "Letter Downloaded", description: `Saved as ${selectedFormat.toUpperCase()} file.` });
      setShowFormatSheet(false);
    } catch (error) {
      console.error("Error generating download:", error);
      toast({ title: "Download Failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsDownloading(false);
    }
  };

  const LetterContent = () => (
    <div className="space-y-4">
      {/* Printable Letter Area */}
      <div ref={letterRef} className="bg-white">
        <Card className="border-2 border-blue-600/30 bg-white overflow-hidden">
          <CardContent className="p-6 space-y-5">
            {/* Letterhead */}
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <div className="p-3 rounded-full bg-blue-600/15 border border-blue-600/20">
                  <Stamp className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h2 className="text-lg font-bold uppercase tracking-wide text-gray-900">
                {letterData.communityName}
              </h2>
              <p className="text-xs text-gray-500 italic">
                Official Community Correspondence
              </p>
            </div>

            <Separator className="bg-blue-600/20" />

            {/* Date & Reference */}
            <div className="flex justify-between items-start text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="text-gray-700">
                  {formatDate(letterData.issuedDate, "MMMM d, yyyy")}
                </span>
              </div>
              <span className="text-xs text-blue-600 font-mono font-medium">
                {letterData.letterNumber}
              </span>
            </div>

            {/* Addressee */}
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                To Whom It May Concern
              </p>
            </div>

            {/* Subject Line */}
            <div className="bg-blue-50 border border-blue-600/20 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">RE:</p>
              <p className="text-sm font-bold text-gray-900 uppercase">
                {letterData.templateTitle}
              </p>
            </div>

            {/* Body */}
            <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
              <p>
                This is to certify that{" "}
                <span className="font-bold text-gray-900">
                  {letterData.requestedBy}
                </span>{" "}
                is a registered and active member of{" "}
                <span className="font-semibold text-gray-900">
                  {letterData.communityName}
                </span>
                .
              </p>

              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Purpose:</p>
                <p className="text-sm text-gray-800 font-medium">
                  {letterData.purpose}
                </p>
              </div>

              <p>
                This letter is issued upon request for the purpose stated above.
                It carries the full authority of the community leadership.
              </p>
            </div>

            <Separator className="bg-blue-600/20" />

            {/* Verification */}
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-600/10">
              <div className="flex items-center gap-2">
                <QrCode className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-xs text-blue-600">Verification Code</p>
                  <p className="font-mono text-sm font-medium text-gray-900">
                    {letterData.verificationCode}
                  </p>
                </div>
              </div>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>

            {/* Signatory */}
            <div className="text-center space-y-2 pt-2">
              <Separator className="bg-blue-600/20" />
              <div className="pt-4">
                <div className="w-32 border-b border-gray-400 mx-auto mb-1" />
                <p className="text-sm font-semibold text-gray-900">
                  {letterData.signedBy}
                </p>
                <p className="text-xs text-gray-500">Community Secretary</p>
              </div>
              <p className="text-[10px] text-gray-400 italic pt-2">
                This letter is electronically generated and verified. Scan the QR
                code or use the verification code for authenticity.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Download Button */}
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
            Download Letter
          </>
        )}
      </Button>

      {/* Format Selection Sheet */}
      <DownloadFormatSheet
        open={showFormatSheet}
        onOpenChange={setShowFormatSheet}
        onDownload={handleFormatDownload}
        title="Download Letter"
        documentName={`${letterData.templateTitle} - ${letterData.requestedBy}`}
        availableFormats={["pdf", "jpeg", "png", "txt"]}
        isDownloading={isDownloading}
      />
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader className="border-b">
            <DrawerTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Official Letter
            </DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <div className="py-4">
              {LetterContent()}
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
            <FileText className="h-5 w-5 text-blue-600" />
            Official Letter
          </DialogTitle>
        </DialogHeader>
        {LetterContent()}
      </DialogContent>
    </Dialog>
  );
}
