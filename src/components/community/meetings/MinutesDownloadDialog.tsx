import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Download,
  FileText,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Wallet,
  Lock,
  Unlock,
  Users,
  Info,
} from "lucide-react";
import {
  MeetingMinutes,
  mockMinutesDownloads,
} from "@/data/meetingsData";
import { format, formatDistanceToNow, differenceInDays } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatMobiAmount, formatLocalAmount } from "@/lib/mobiCurrencyTranslation";

interface MinutesDownloadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  minutes: MeetingMinutes;
}

export const MinutesDownloadDialog = ({
  open,
  onOpenChange,
  minutes,
}: MinutesDownloadDialogProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  // Check if user has already downloaded
  const userDownload = mockMinutesDownloads.find(
    (d) => d.minutesId === minutes.id && d.memberId === "p1" // Current user
  );

  // Calculate attendance marking eligibility
  const attendanceDeadline = minutes.attendanceDeadline;
  const canMarkAttendance = attendanceDeadline && new Date() < attendanceDeadline;
  const daysRemaining = attendanceDeadline 
    ? differenceInDays(attendanceDeadline, new Date()) 
    : 0;

  // Mock wallet balance
  const walletBalance = 500;

  const handleDownload = async () => {
    setIsDownloading(true);
    
    // Simulate download process and wallet deduction
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsDownloading(false);
    setDownloadComplete(true);
    setShowConfirmation(false);
    
    // Create a mock file download
    const content = `Meeting Minutes: ${minutes.meetingName}\nDate: ${format(minutes.meetingDate, "MMMM d, yyyy")}\n\n[Minutes content would be here]`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = minutes.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Simulate transaction entry for community ledger
    // In a real implementation, this would call an API to record:
    // {
    //   type: "credit",
    //   category: "minutes_download",
    //   description: `Meeting Minutes Download - ${minutes.meetingName}`,
    //   reference: `MIN-${Date.now()}`,
    //   amount: minutes.downloadFee,
    //   memberName: "Current User",
    //   status: "completed"
    // }
    console.log("Transaction recorded:", {
      type: "credit",
      category: "minutes_download",
      description: `Meeting Minutes Download - ${minutes.meetingName}`,
      amount: minutes.downloadFee,
      timestamp: new Date().toISOString(),
    });

    // Show wallet debit toast first
    toast({
      title: "Payment Processed",
      description: `${formatMobiAmount(minutes.downloadFee)} (≈ ${formatLocalAmount(minutes.downloadFee, "NGN")}) debited from your Mobi Wallet.`,
    });

    // Show community credit toast
    setTimeout(() => {
      toast({
        title: "Community Wallet Credited",
        description: `${formatMobiAmount(minutes.downloadFee)} credited to Community Wallet from your download.`,
      });
    }, 500);
    
    // Show final status toast
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: canMarkAttendance
          ? "Minutes downloaded and your attendance has been marked!"
          : "Minutes downloaded. Attendance was not marked (past 90-day deadline).",
      });
    }, 1000);
  };

  const Content = () => (
    <div className="space-y-6">
      {/* Minutes Info Card */}
      <Card className="p-4 bg-muted/30">
        <div className="flex items-start gap-3">
          <FileText className="h-8 w-8 text-primary flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold">{minutes.meetingName}</h3>
            <p className="text-sm text-muted-foreground">
              <Calendar className="h-3 w-3 inline mr-1" />
              {format(minutes.meetingDate, "MMMM d, yyyy")}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {minutes.fileName} • {minutes.fileSize}
            </p>
          </div>
        </div>
      </Card>

      {/* Download Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-3 text-center">
          <Download className="h-5 w-5 mx-auto text-primary mb-1" />
          <div className="text-lg font-bold">{minutes.downloadCount}</div>
          <div className="text-xs text-muted-foreground">Downloads</div>
        </Card>
        <Card className="p-3 text-center">
          <Wallet className="h-5 w-5 mx-auto text-primary mb-1" />
          <div className="text-lg font-bold">{formatMobiAmount(minutes.downloadFee)}</div>
          <div className="text-xs text-muted-foreground">Download Fee</div>
        </Card>
      </div>

      {/* Attendance Info */}
      <Card className={`p-4 ${canMarkAttendance ? "bg-green-50 border-green-200" : "bg-gray-50"}`}>
        <div className="flex items-start gap-3">
          {canMarkAttendance ? (
            <Unlock className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          ) : (
            <Lock className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <h4 className={`font-medium ${canMarkAttendance ? "text-green-700" : "text-gray-700"}`}>
              {canMarkAttendance ? "Attendance Marking Active" : "Attendance Marking Expired"}
            </h4>
            <p className={`text-sm ${canMarkAttendance ? "text-green-600" : "text-gray-500"}`}>
              {canMarkAttendance
                ? `Downloading will mark your attendance. ${daysRemaining} days remaining.`
                : "Downloads after 90 days do not mark attendance."}
            </p>
          </div>
        </div>
      </Card>

      {/* Already Downloaded Notice */}
      {userDownload && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-700">Previously Downloaded</h4>
              <p className="text-sm text-blue-600">
                You downloaded this on {format(userDownload.downloadedAt, "MMMM d, yyyy")}.
                {userDownload.markedAttendance && " Attendance was marked."}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Download Complete Notice */}
      {downloadComplete && (
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
            <div>
              <h4 className="font-medium text-green-700">Download Complete!</h4>
              <p className="text-sm text-green-600">
                {canMarkAttendance
                  ? "Your attendance for this meeting has been recorded."
                  : "Minutes downloaded successfully."}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Wallet Balance */}
      {!downloadComplete && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              <span className="font-medium">Your Wallet Balance</span>
            </div>
            <div className="text-right">
              <Badge variant="outline" className="text-lg font-bold">
                {formatMobiAmount(walletBalance)}
              </Badge>
              <p className="text-[10px] text-muted-foreground">≈ {formatLocalAmount(walletBalance, "NGN")}</p>
            </div>
          </div>
          {walletBalance < minutes.downloadFee && (
            <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              Insufficient balance. Please top up your wallet.
            </p>
          )}
        </Card>
      )}

      {/* Terms Agreement */}
      {!downloadComplete && !userDownload && (
        <div className="flex items-start space-x-3">
          <Checkbox
            id="terms"
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
          />
          <div className="grid gap-1.5 leading-none">
            <Label
              htmlFor="terms"
              className="text-sm font-medium leading-normal cursor-pointer"
            >
              I agree to pay {formatMobiAmount(minutes.downloadFee)} from my wallet
            </Label>
            <p className="text-xs text-muted-foreground">
              This fee will be deducted from your community wallet balance.
            </p>
          </div>
        </div>
      )}

      {/* Download Button */}
      {!downloadComplete && (
        <Button
          className="w-full gap-2"
          disabled={
            (!agreedToTerms && !userDownload) ||
            walletBalance < minutes.downloadFee ||
            isDownloading
          }
          onClick={() => setShowConfirmation(true)}
        >
          <Download className="h-4 w-4" />
          {userDownload ? "Download Again" : `Download Minutes (${formatMobiAmount(minutes.downloadFee)})`}
        </Button>
      )}

      {/* Info Note */}
      <Card className="p-3 bg-muted/30">
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <p>
            Downloading minutes automatically marks your attendance for this meeting 
            if done within 90 days of adoption. Members who fail to download within 
            this period are considered absent.
          </p>
        </div>
      </Card>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <Drawer open={open} onOpenChange={onOpenChange}>
          <DrawerContent className="max-h-[92vh]">
            <DrawerHeader className="border-b">
              <DrawerTitle>Download Minutes</DrawerTitle>
            </DrawerHeader>
            <ScrollArea className="flex-1 p-4 overflow-y-auto touch-auto">
              <Content />
            </ScrollArea>
          </DrawerContent>
        </Drawer>

        <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Download</AlertDialogTitle>
              <AlertDialogDescription>
                {formatMobiAmount(minutes.downloadFee)} (≈ {formatLocalAmount(minutes.downloadFee, "NGN")}) will be deducted from your wallet.
                {canMarkAttendance && " Your attendance will be marked for this meeting."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDownload} disabled={isDownloading}>
                {isDownloading ? "Processing..." : "Confirm & Download"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Download Minutes</DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 pr-4">
            <Content />
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Download</AlertDialogTitle>
            <AlertDialogDescription>
              {formatMobiAmount(minutes.downloadFee)} (≈ {formatLocalAmount(minutes.downloadFee, "NGN")}) will be deducted from your wallet.
              {canMarkAttendance && " Your attendance will be marked for this meeting."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDownload} disabled={isDownloading}>
              {isDownloading ? "Processing..." : "Confirm & Download"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};