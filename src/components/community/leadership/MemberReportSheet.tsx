import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { ExecutiveMember } from "@/data/communityExecutivesData";
import { useToast } from "@/hooks/use-toast";
import {
  X,
  Flag,
  AlertTriangle,
  Clock,
  CheckCircle,
  ShieldCheck,
  Send,
  Calendar,
  User,
  FileText,
} from "lucide-react";
interface MemberReportSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: ExecutiveMember;
  viewType: "new" | "pending" | "resolved" | "absolved";
}

interface ReportItem {
  id: string;
  reporterName: string;
  category: string;
  description: string;
  submittedAt: string;
  status: string;
  reference: string;
  resolvedAt?: string;
  resolution?: string;
}

// Mock report data
const mockReports: { pending: ReportItem[]; resolved: ReportItem[]; absolved: ReportItem[] } = {
  pending: [
    {
      id: "r1",
      reporterName: "Anonymous",
      category: "misconduct",
      description: "Failure to attend mandatory executive meetings for 3 consecutive months without valid excuse.",
      submittedAt: "2024-01-10T14:30:00",
      status: "pending",
      reference: "RPT-2024-001",
    },
    {
      id: "r2",
      reporterName: "Kwame Mensah",
      category: "financial",
      description: "Unexplained discrepancy in project fund allocation.",
      submittedAt: "2024-01-08T09:15:00",
      status: "pending",
      reference: "RPT-2024-002",
    },
  ],
  resolved: [
    {
      id: "r3",
      reporterName: "Fatima Hassan",
      category: "communication",
      description: "Delayed response to member inquiries regarding community projects.",
      submittedAt: "2023-12-15T11:00:00",
      resolvedAt: "2023-12-22T16:45:00",
      status: "resolved",
      resolution: "Member was counseled and committed to improved communication. Response time has since improved significantly.",
      reference: "RPT-2023-045",
    },
  ],
  absolved: [
    {
      id: "r4",
      reporterName: "Anonymous",
      category: "misconduct",
      description: "Alleged misuse of community resources for personal benefit.",
      submittedAt: "2023-11-20T08:30:00",
      resolvedAt: "2023-12-01T14:00:00",
      status: "absolved",
      resolution: "After thorough investigation, no evidence was found to support the allegations. Member has been cleared of all accusations.",
      reference: "RPT-2023-039",
    },
  ],
};

const reportCategories = [
  { value: "misconduct", label: "Misconduct", description: "Violation of community rules or code of conduct" },
  { value: "financial", label: "Financial Irregularity", description: "Suspected mishandling of funds" },
  { value: "communication", label: "Poor Communication", description: "Failure to respond or communicate effectively" },
  { value: "attendance", label: "Attendance Issues", description: "Repeated absence from duties or meetings" },
  { value: "other", label: "Other", description: "Other concerns not listed above" },
];

export function MemberReportSheet({
  open,
  onOpenChange,
  member,
  viewType,
}: MemberReportSheetProps) {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [reportCategory, setReportCategory] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(true);

  const handleSubmitReport = async () => {
    if (!reportCategory) {
      toast({
        title: "Category Required",
        description: "Please select a report category",
        variant: "destructive",
      });
      return;
    }

    if (!reportDescription.trim() || reportDescription.length < 20) {
      toast({
        title: "Description Required",
        description: "Please provide a detailed description (at least 20 characters)",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setReportCategory("");
    setReportDescription("");

    toast({
      title: "Report Submitted",
      description: "Your report has been submitted and will be reviewed by administrators.",
    });

    onOpenChange(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "resolved": return "bg-green-100 text-green-700 border-green-200";
      case "absolved": return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="h-4 w-4" />;
      case "resolved": return <CheckCircle className="h-4 w-4" />;
      case "absolved": return <ShieldCheck className="h-4 w-4" />;
      default: return <Flag className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getReportsForView = (): ReportItem[] => {
    switch (viewType) {
      case "pending": return mockReports.pending;
      case "resolved": return mockReports.resolved;
      case "absolved": return mockReports.absolved;
      default: return [];
    }
  };

  const getTitle = () => {
    switch (viewType) {
      case "new": return "Report Member";
      case "pending": return "Pending Reports";
      case "resolved": return "Resolved Reports";
      case "absolved": return "Absolved Reports";
      default: return "Reports";
    }
  };

  const getTitleIcon = () => {
    switch (viewType) {
      case "new": return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case "pending": return <Clock className="h-5 w-5 text-yellow-500" />;
      case "resolved": return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "absolved": return <ShieldCheck className="h-5 w-5 text-blue-500" />;
      default: return <Flag className="h-5 w-5 text-primary" />;
    }
  };

  const reports = getReportsForView();

  const renderNewReportForm = () => (
    <div className="flex flex-col h-full">
      {/* Member Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-destructive/5 shrink-0">
        <Avatar className="h-12 w-12">
          <AvatarImage src={member.imageUrl} alt={member.name} />
          <AvatarFallback className="text-lg">{member.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base truncate">{member.name}</h3>
          <p className="text-sm text-muted-foreground truncate">{member.position}</p>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-5">
          {/* Warning */}
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="p-3 flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-destructive">Important Notice</p>
                <p className="text-xs text-muted-foreground mt-1">
                  False reports may result in disciplinary action. Please ensure your report is accurate and made in good faith.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Category Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Report Category *</Label>
            <RadioGroup value={reportCategory} onValueChange={setReportCategory} className="space-y-2">
              {reportCategories.map((cat) => (
                <div key={cat.value} className="flex items-start space-x-3">
                  <RadioGroupItem value={cat.value} id={cat.value} className="mt-1" />
                  <Label htmlFor={cat.value} className="flex-1 cursor-pointer">
                    <span className="font-medium text-sm">{cat.label}</span>
                    <p className="text-xs text-muted-foreground mt-0.5">{cat.description}</p>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Description *</Label>
            <Textarea
              placeholder="Please provide detailed information about your report. Include dates, witnesses, and any evidence if available..."
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              className="min-h-[120px] resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Minimum 20 characters. Current: {reportDescription.length}
            </p>
          </div>

          {/* Anonymous Toggle */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div>
              <p className="font-medium text-sm">Submit Anonymously</p>
              <p className="text-xs text-muted-foreground">Your identity will be hidden</p>
            </div>
            <Button
              variant={isAnonymous ? "default" : "outline"}
              size="sm"
              onClick={() => setIsAnonymous(!isAnonymous)}
            >
              {isAnonymous ? "Anonymous" : "Identified"}
            </Button>
          </div>
        </div>
      </ScrollArea>

      {/* Submit Button */}
      <div className="p-4 border-t shrink-0">
        <Button 
          onClick={handleSubmitReport}
          disabled={isSubmitting || !reportCategory || reportDescription.length < 20}
          className="w-full h-12"
          variant="destructive"
        >
          <Send className="h-4 w-4 mr-2" />
          {isSubmitting ? "Submitting..." : "Submit Report"}
        </Button>
      </div>
    </div>
  );

  const renderReportsList = () => (
    <div className="flex flex-col h-full">
      {/* Member Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-muted/30 shrink-0">
        <Avatar className="h-10 w-10">
          <AvatarImage src={member.imageUrl} alt={member.name} />
          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate">{member.name}</h3>
          <p className="text-xs text-muted-foreground truncate">{member.position}</p>
        </div>
        <Badge variant="secondary" className="text-xs">
          {reports.length} reports
        </Badge>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {reports.map((report) => (
            <Card key={report.id} className="overflow-hidden">
              <CardContent className="p-3 space-y-3">
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <User className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm font-medium truncate">{report.reporterName}</span>
                  </div>
                  <Badge className={`text-xs shrink-0 ${getStatusColor(report.status)}`}>
                    {getStatusIcon(report.status)}
                    <span className="ml-1 capitalize">{report.status}</span>
                  </Badge>
                </div>

                {/* Category */}
                <Badge variant="outline" className="text-xs capitalize">
                  {report.category}
                </Badge>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {report.description}
                </p>

                {/* Resolution (if resolved/absolved) */}
                {"resolution" in report && report.resolution && (
                  <div className="p-2 bg-muted/50 rounded-md">
                    <div className="flex items-center gap-1 mb-1">
                      <FileText className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs font-medium">Resolution</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{report.resolution}</p>
                  </div>
                )}

                {/* Metadata row */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(report.submittedAt)}
                  </span>
                  <span className="text-muted-foreground/50">•</span>
                  <span className="truncate">{report.reference}</span>
                </div>
              </CardContent>
            </Card>
          ))}

          {reports.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {getTitleIcon()}
              <p className="mt-3">No {viewType} reports found</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );

  const content = viewType === "new" ? renderNewReportForm() : renderReportsList();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh] h-[92vh] flex flex-col">
          <DrawerHeader className="shrink-0 pb-0 relative">
            <DrawerTitle className="text-lg font-semibold flex items-center gap-2">
              {getTitleIcon()}
              {getTitle()}
            </DrawerTitle>
            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-2 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </DrawerHeader>
          <div className="flex-1 min-h-0 overflow-hidden">
            {content}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="shrink-0 p-4 pb-0">
          <DialogTitle className="flex items-center gap-2">
            {getTitleIcon()}
            {getTitle()}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 min-h-0 overflow-hidden">
          {content}
        </div>
      </DialogContent>
    </Dialog>
  );
}
