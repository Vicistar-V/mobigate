import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Upload,
  FileText,
  Calendar,
  Users,
  Wallet,
  Bell,
  CheckCircle2,
  AlertCircle,
  Info,
} from "lucide-react";
import { mockMeetings, mockMinutesSettings } from "@/data/meetingsData";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SecretaryUploadMinutesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SecretaryUploadMinutesDialog = ({
  open,
  onOpenChange,
}: SecretaryUploadMinutesDialogProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [selectedMeeting, setSelectedMeeting] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [downloadFee, setDownloadFee] = useState(mockMinutesSettings.downloadFeeDefault.toString());
  const [notes, setNotes] = useState("");
  const [sendNotification, setSendNotification] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  // Get completed meetings that don't have minutes yet
  const completedMeetings = mockMeetings.filter(
    (m) => m.status === "completed"
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!validTypes.includes(selectedFile.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF, DOC, or DOCX file.",
          variant: "destructive",
        });
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Maximum file size is 10MB.",
          variant: "destructive",
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!selectedMeeting || !file) {
      toast({
        title: "Missing Information",
        description: "Please select a meeting and upload a file.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    // Simulate upload
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsUploading(false);
    setUploadComplete(true);

    // Show upload success toast
    toast({
      title: "Minutes Uploaded Successfully",
      description: "Meeting minutes have been uploaded and are pending adoption.",
    });

    // If notifications enabled, show notification sent toast
    if (sendNotification) {
      setTimeout(() => {
        toast({
          title: "Notifications Sent",
          description: "All community members have been notified to adopt the minutes.",
        });
      }, 500);

      // Simulate creating notification entries
      // In a real app, this would add to the notifications data
      console.log("[Minutes Upload] Creating notification entries for all members:", {
        type: "minutes_adoption_required",
        meetingId: selectedMeeting,
        downloadFee: parseInt(downloadFee),
        timestamp: new Date().toISOString(),
      });
    }

    // Show meeting lock notice
    setTimeout(() => {
      toast({
        title: "Meeting Lock Active",
        description: "New meetings are locked until these minutes are adopted.",
        variant: "default",
      });
    }, 1000);
  };

  const handleClose = () => {
    setSelectedMeeting("");
    setFile(null);
    setDownloadFee(mockMinutesSettings.downloadFeeDefault.toString());
    setNotes("");
    setSendNotification(true);
    setUploadComplete(false);
    onOpenChange(false);
  };

  const content = (
    <div className="space-y-6">
      {uploadComplete ? (
        /* Success State */
        <div className="text-center py-8 space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Upload Complete!</h3>
            <p className="text-muted-foreground mt-1">
              Meeting minutes have been uploaded successfully.
            </p>
          </div>
          {sendNotification && (
            <Card className="p-4 bg-blue-50 border-blue-200 text-left">
              <div className="flex items-start gap-3">
                <Bell className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-700">Notifications Sent</h4>
                  <p className="text-sm text-blue-600">
                    All community members have been notified to adopt the minutes.
                  </p>
                </div>
              </div>
            </Card>
          )}
          <Button onClick={handleClose} className="w-full">
            Done
          </Button>
        </div>
      ) : (
        /* Upload Form */
        <>
          {/* Info Alert */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Upload minutes after each meeting. Members must adopt with {mockMinutesSettings.adoptionThreshold}% 
              majority before new meetings can proceed.
            </AlertDescription>
          </Alert>

          {/* Select Meeting */}
          <div className="space-y-2">
            <Label>Select Meeting</Label>
            <Select value={selectedMeeting} onValueChange={setSelectedMeeting}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a completed meeting" />
              </SelectTrigger>
              <SelectContent>
                {completedMeetings.map((meeting) => (
                  <SelectItem key={meeting.id} value={meeting.id}>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {meeting.name} - {format(meeting.date, "MMM d, yyyy")}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label>Upload Minutes File</Label>
            <Card className="p-4 border-dashed border-2">
              <div className="text-center">
                {file ? (
                  <div className="space-y-2">
                    <FileText className="h-10 w-10 mx-auto text-primary" />
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFile(null)}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Drag and drop or click to upload
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, DOC, DOCX (max 10MB)
                    </p>
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      id="minutes-file"
                      onChange={handleFileChange}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("minutes-file")?.click()}
                    >
                      Select File
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Download Fee */}
          <div className="space-y-2">
            <Label>Download Fee (Mobi)</Label>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">M</span>
              <Input
                type="number"
                value={downloadFee}
                onChange={(e) => setDownloadFee(e.target.value)}
                min={0}
                className="flex-1"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Members will pay this fee to download the minutes.
            </p>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label>Additional Notes (Optional)</Label>
            <Textarea
              placeholder="Any special notes about these minutes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          {/* Send Notification */}
          <div className="flex items-start space-x-3">
            <Checkbox
              id="notification"
              checked={sendNotification}
              onCheckedChange={(checked) => setSendNotification(checked as boolean)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="notification"
                className="text-sm font-medium leading-normal cursor-pointer"
              >
                Notify all members
              </Label>
              <p className="text-xs text-muted-foreground">
                Send notification to all members for adoption.
              </p>
            </div>
          </div>

          {/* Fee Distribution Info */}
          <Card className="p-4 bg-muted/30">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Download Fee Distribution
            </h4>
            <p className="text-sm text-muted-foreground">
              Download fees collected from members will be credited to the 
              Community Wallet.
            </p>
          </Card>

          {/* Upload Button */}
          <Button
            className="w-full gap-2"
            disabled={!selectedMeeting || !file || isUploading}
            onClick={handleUpload}
          >
            {isUploading ? (
              <>Processing...</>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Upload Minutes
              </>
            )}
          </Button>
        </>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleClose}>
        <DrawerContent className="max-h-[92vh]">
          <DrawerHeader className="border-b">
            <DrawerTitle>Upload Meeting Minutes</DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="flex-1 p-4 overflow-y-auto touch-auto">
            {content}
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Upload Meeting Minutes</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4">
          {content}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
