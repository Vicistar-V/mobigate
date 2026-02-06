import { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format as formatDate } from "date-fns";
import {
  CreditCard,
  Calendar,
  Download,
  QrCode,
  CheckCircle,
  Loader2,
  Shield,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerBody } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { DownloadFormatSheet, DownloadFormat } from "@/components/common/DownloadFormatSheet";

export interface IDCardData {
  memberName: string;
  memberId: string;
  memberPhoto: string;
  cardNumber: string;
  issueDate: Date;
  expiryDate: Date;
  communityName: string;
  verificationCode: string;
}

interface DigitalIDCardDisplayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cardData: IDCardData;
}

export function DigitalIDCardDisplay({
  open,
  onOpenChange,
  cardData,
}: DigitalIDCardDisplayProps) {
  const isMobile = useIsMobile();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showFormatSheet, setShowFormatSheet] = useState(false);

  const handleFormatDownload = async (selectedFormat: DownloadFormat) => {
    if (!cardRef.current) return;

    setIsDownloading(true);

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
        windowWidth: 400,
        windowHeight: cardRef.current.scrollHeight,
      });

      const fileName = `IDCard-${cardData.cardNumber.replace(/\//g, "_")}`;

      if (selectedFormat === "pdf") {
        const imgData = canvas.toDataURL("image/png", 1.0);
        const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: [86, 54] });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const padding = 2;
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
      }

      toast({ title: "ID Card Downloaded", description: `Saved as ${selectedFormat.toUpperCase()} file.` });
      setShowFormatSheet(false);
    } catch (error) {
      console.error("Error generating download:", error);
      toast({ title: "Download Failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsDownloading(false);
    }
  };

  const CardDisplayContent = () => (
    <div className="space-y-4">
      {/* Printable ID Card Area */}
      <div ref={cardRef} className="bg-white">
        <Card className="border-2 border-blue-600/30 overflow-hidden">
          {/* Card Header - Gradient Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 pb-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider">
                    {cardData.communityName}
                  </h3>
                  <p className="text-[10px] opacity-80">
                    Official Community ID Card
                  </p>
                </div>
              </div>
              <Badge className="bg-white/20 text-white border-0 text-[10px]">
                MEMBER
              </Badge>
            </div>
          </div>

          <CardContent className="p-4 space-y-4 -mt-3">
            {/* Photo & QR Row */}
            <div className="flex items-start gap-4">
              <Avatar className="h-20 w-20 border-4 border-white shadow-lg rounded-lg">
                <AvatarImage src={cardData.memberPhoto} alt={cardData.memberName} className="object-cover" />
                <AvatarFallback className="rounded-lg bg-blue-100 text-blue-700 text-xl">
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 pt-2">
                <h4 className="text-base font-bold text-gray-900 leading-tight">
                  {cardData.memberName}
                </h4>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                      Member ID
                    </span>
                  </div>
                  <p className="text-xs font-mono font-semibold text-blue-600">
                    {cardData.memberId}
                  </p>
                </div>
              </div>
            </div>

            {/* Card Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 rounded-lg p-2.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <CreditCard className="h-3 w-3 text-blue-600" />
                  <span className="text-[10px] text-gray-500 uppercase">
                    Card No
                  </span>
                </div>
                <p className="text-xs font-mono font-medium text-gray-900">
                  {cardData.cardNumber}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span className="text-[10px] text-gray-500 uppercase">
                    Status
                  </span>
                </div>
                <Badge className="bg-green-500/10 text-green-700 border-green-200 text-xs h-5">
                  Active
                </Badge>
              </div>
            </div>

            {/* Dates Row */}
            <div className="flex items-center justify-between bg-blue-50 rounded-lg p-3 border border-blue-600/10">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-[10px] text-gray-500">Issue Date</p>
                  <p className="text-xs font-medium text-gray-900">
                    {formatDate(cardData.issueDate, "dd/MM/yyyy")}
                  </p>
                </div>
              </div>
              <Separator orientation="vertical" className="h-8 bg-blue-600/20" />
              <div className="text-right">
                <p className="text-[10px] text-gray-500">Expiry Date</p>
                <p className="text-xs font-medium text-gray-900">
                  {formatDate(cardData.expiryDate, "dd/MM/yyyy")}
                </p>
              </div>
            </div>

            {/* Verification */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2">
                <QrCode className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-[10px] text-gray-500">Verification</p>
                  <p className="font-mono text-xs font-medium text-gray-900">
                    {cardData.verificationCode}
                  </p>
                </div>
              </div>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>

            {/* Footer */}
            <p className="text-[9px] text-gray-400 text-center italic">
              This digital ID card is electronically verified. Present this card
              for community identification purposes.
            </p>
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
            Download ID Card
          </>
        )}
      </Button>

      {/* Format Selection Sheet */}
      <DownloadFormatSheet
        open={showFormatSheet}
        onOpenChange={setShowFormatSheet}
        onDownload={handleFormatDownload}
        title="Download ID Card"
        documentName={`ID Card - ${cardData.memberName}`}
        availableFormats={["pdf", "jpeg", "png"]}
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
              <CreditCard className="h-5 w-5 text-blue-600" />
              Digital ID Card
            </DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <div className="py-4">
              {CardDisplayContent()}
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
            <CreditCard className="h-5 w-5 text-blue-600" />
            Digital ID Card
          </DialogTitle>
        </DialogHeader>
        {CardDisplayContent()}
      </DialogContent>
    </Dialog>
  );
}
