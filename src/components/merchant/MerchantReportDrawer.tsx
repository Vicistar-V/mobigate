import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
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
  FileText,
  ShieldAlert,
  BanknoteIcon,
  MessageSquareWarning,
  PackageX,
  UserX,
  LayoutTemplate,
  ChevronRight,
  Eye,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

// ─── Report Categories (Platform Standard) ───
const reportCategories = [
  {
    value: "scam-fraud",
    label: "Scam / Fraud",
    description: "Suspected scam, fraudulent activity, or financial deception",
    icon: ShieldAlert,
    color: "text-red-500",
  },
  {
    value: "assault-bullying",
    label: "Assault / Bullying",
    description: "Threatening behaviour, intimidation, or bullying conduct",
    icon: UserX,
    color: "text-orange-500",
  },
  {
    value: "harassment-threat",
    label: "Harassment / Threat",
    description: "Harassment, threats of violence, or intimidation",
    icon: MessageSquareWarning,
    color: "text-amber-600",
  },
  {
    value: "deception-falsehood",
    label: "Deception / Falsehood",
    description: "False claims, misleading information, or impersonation",
    icon: PackageX,
    color: "text-purple-500",
  },
  {
    value: "social-abuse",
    label: "Social Abuse",
    description: "Abuse of platform features, spam, or inappropriate content",
    icon: BanknoteIcon,
    color: "text-blue-500",
  },
  {
    value: "other-offenses",
    label: "Other Offenses",
    description: "Other concerns or violations not listed above",
    icon: Flag,
    color: "text-muted-foreground",
  },
];

// ─── Report Templates ───
interface ReportTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  prefillText: string;
  popularity: number; // times used
}

const reportTemplates: ReportTemplate[] = [
  {
    id: "t1",
    name: "Voucher Scam Report",
    category: "scam-fraud",
    description: "Payment was made but voucher codes were never delivered or are fake",
    prefillText:
      "I completed a payment for vouchers on [DATE] (Transaction Ref: [REF]) but have not received valid voucher codes. The amount charged was [AMOUNT]. I believe this is a scam because [REASON].",
    popularity: 142,
  },
  {
    id: "t2",
    name: "Threatening Behaviour",
    category: "harassment-threat",
    description: "Merchant threatened or harassed me during a transaction dispute",
    prefillText:
      "During a dispute about [ISSUE] on [DATE], this merchant sent threatening messages including [DESCRIBE THREATS]. I felt unsafe and believe this behaviour violates platform rules.",
    popularity: 98,
  },
  {
    id: "t3",
    name: "False Discount Claims",
    category: "deception-falsehood",
    description: "Advertised discounts are false or exaggerated",
    prefillText:
      "This merchant advertises [X]% discount on vouchers but the actual discount is significantly lower at [Y]%. The advertised price of [AMOUNT] does not reflect the actual purchase price of [AMOUNT]. This is deceptive to customers.",
    popularity: 89,
  },
  {
    id: "t4",
    name: "Fake Merchant Profile",
    category: "deception-falsehood",
    description: "This merchant is impersonating a legitimate business",
    prefillText:
      "I believe this merchant profile is impersonating [REAL MERCHANT NAME]. The logo, name, and description appear to be copied from the legitimate business. The real merchant operates at [LOCATION] while this profile seems fraudulent.",
    popularity: 54,
  },
  {
    id: "t5",
    name: "Spam / Platform Abuse",
    category: "social-abuse",
    description: "Merchant is spamming, manipulating reviews, or abusing platform features",
    prefillText:
      "This merchant is abusing the platform by [DESCRIBE ABUSE e.g. fake reviews, spam messages, manipulating ratings]. I have observed this on [DATE(S)] and it affects [HOW IT AFFECTS OTHER USERS].",
    popularity: 63,
  },
  {
    id: "t6",
    name: "Bullying / Intimidation",
    category: "assault-bullying",
    description: "Merchant engaged in bullying or intimidating behaviour",
    prefillText:
      "This merchant engaged in bullying/intimidating behaviour on [DATE]. Specifically: [DESCRIBE WHAT HAPPENED]. This made me feel [IMPACT] and I believe action should be taken.",
    popularity: 41,
  },
];

// ─── Mock Previous Reports ───
interface PreviousReport {
  id: string;
  category: string;
  description: string;
  submittedAt: string;
  status: "pending" | "investigating" | "resolved" | "dismissed";
  reference: string;
  resolution?: string;
  templateUsed?: string;
}

const mockPreviousReports: PreviousReport[] = [
  {
    id: "mr1",
    category: "scam-fraud",
    description:
      "Payment was made for M5,000 vouchers but only M2,000 worth of codes were delivered. Transaction ref: TXN-20240115-4829.",
    submittedAt: "2024-01-15T10:30:00",
    status: "investigating",
    reference: "RPT-MRC-2024-001",
    templateUsed: "Voucher Scam Report",
  },
  {
    id: "mr2",
    category: "deception-falsehood",
    description:
      "Merchant advertised 15% discount but the actual discount applied was only 3%. The advertised price of ₦4,250 per M5,000 voucher does not match the charge of ₦4,850.",
    submittedAt: "2023-12-20T16:45:00",
    status: "resolved",
    reference: "RPT-MRC-2023-089",
    resolution:
      "Investigation confirmed pricing discrepancy. Merchant has been issued a warning and required to update pricing information. Refund of ₦600 has been processed to the reporter.",
    templateUsed: "False Discount Claims",
  },
  {
    id: "mr3",
    category: "harassment-threat",
    description:
      "Merchant sent threatening messages after I raised a complaint about invalid voucher codes. Screenshots attached.",
    submittedAt: "2023-11-05T09:15:00",
    status: "dismissed",
    reference: "RPT-MRC-2023-072",
    resolution:
      "After investigation, the messages were determined to be a misunderstanding. Both parties have been counselled on proper communication.",
  },
];

// ─── Props ───
interface MerchantReportDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  merchantName: string;
  merchantLogo?: string;
}

export function MerchantReportDrawer({
  open,
  onOpenChange,
  merchantName,
  merchantLogo,
}: MerchantReportDrawerProps) {
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"new" | "templates" | "history">("new");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [viewingReport, setViewingReport] = useState<PreviousReport | null>(null);

  const handleSubmitReport = async () => {
    if (!selectedCategory) {
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
        description: "Please provide at least 20 characters of detail",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);

    toast({
      title: "Report Submitted",
      description: `Your report against ${merchantName} has been submitted and will be reviewed by our team.`,
    });

    setSelectedCategory("");
    setReportDescription("");
    setSelectedTemplate(null);
    onOpenChange(false);
  };

  const handleUseTemplate = (template: ReportTemplate) => {
    setSelectedTemplate(template);
    setSelectedCategory(template.category);
    setReportDescription(template.prefillText);
    setActiveTab("new");
    toast({
      title: "Template Applied",
      description: `"${template.name}" template loaded. Edit the placeholders with your details.`,
    });
  };

  const getStatusConfig = (status: PreviousReport["status"]) => {
    switch (status) {
      case "pending":
        return { label: "Pending", icon: Clock, bg: "bg-amber-100 text-amber-700 border-amber-200" };
      case "investigating":
        return { label: "Investigating", icon: Eye, bg: "bg-blue-100 text-blue-700 border-blue-200" };
      case "resolved":
        return { label: "Resolved", icon: CheckCircle, bg: "bg-emerald-100 text-emerald-700 border-emerald-200" };
      case "dismissed":
        return { label: "Dismissed", icon: ShieldCheck, bg: "bg-muted text-muted-foreground border-border" };
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const getCategoryLabel = (value: string) =>
    reportCategories.find((c) => c.value === value)?.label ?? value;

  // ─── New Report Form ───
  const renderNewReportForm = () => (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto touch-auto overscroll-contain">
        <div className="p-4 space-y-5">
          {/* Warning Notice */}
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="p-3 flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-destructive">Important Notice</p>
                <p className="text-xs text-muted-foreground mt-1">
                  False or malicious reports may result in account restrictions. Please ensure your report is accurate and made in good faith.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Template Badge (if using a template) */}
          {selectedTemplate && (
            <div className="flex items-center gap-2 px-3 py-2 bg-primary/5 border border-primary/20 rounded-lg">
              <LayoutTemplate className="h-4 w-4 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-primary truncate">Using template: {selectedTemplate.name}</p>
                <p className="text-xs text-muted-foreground">Edit the [PLACEHOLDERS] with your details</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => {
                  setSelectedTemplate(null);
                  setReportDescription("");
                  setSelectedCategory("");
                }}
              >
                Clear
              </Button>
            </div>
          )}

          {/* Category Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Report Category *</Label>
            <RadioGroup value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-2">
              {reportCategories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <div
                    key={cat.value}
                    className={`flex items-start space-x-3 p-2.5 rounded-lg border transition-colors touch-manipulation ${
                      selectedCategory === cat.value
                        ? "border-primary/40 bg-primary/5"
                        : "border-transparent"
                    }`}
                  >
                    <RadioGroupItem value={cat.value} id={`cat-${cat.value}`} className="mt-0.5" />
                    <Label htmlFor={`cat-${cat.value}`} className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-1.5">
                        <Icon className={`h-4 w-4 ${cat.color} shrink-0`} />
                        <span className="font-medium text-sm">{cat.label}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{cat.description}</p>
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Detailed Description *</Label>
            <Textarea
              placeholder="Describe what happened in detail. Include dates, amounts, transaction references, and any evidence you have..."
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              className="min-h-[140px] resize-none text-sm touch-manipulation"
            />
            <div className="flex justify-between">
              <p className="text-xs text-muted-foreground">
                Minimum 20 characters
              </p>
              <p className={`text-xs ${reportDescription.length >= 20 ? "text-emerald-600" : "text-muted-foreground"}`}>
                {reportDescription.length} characters
              </p>
            </div>
          </div>

          {/* Anonymous Toggle */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div>
              <p className="font-medium text-sm">Submit Anonymously</p>
              <p className="text-xs text-muted-foreground">Your identity will be hidden from the merchant</p>
            </div>
            <Switch checked={isAnonymous} onCheckedChange={setIsAnonymous} />
          </div>
        </div>
      </div>

      {/* Submit Button — pinned to bottom */}
      <div className="p-4 border-t shrink-0 bg-background">
        <Button
          onClick={handleSubmitReport}
          disabled={isSubmitting || !selectedCategory || reportDescription.length < 20}
          className="w-full h-12 text-sm font-semibold touch-manipulation active:scale-[0.97]"
          variant="destructive"
        >
          <Send className="h-4 w-4 mr-2" />
          {isSubmitting ? "Submitting Report..." : "Submit Report"}
        </Button>
      </div>
    </div>
  );

  // ─── Templates Tab ───
  const renderTemplates = () => (
    <div className="flex-1 min-h-0 overflow-y-auto touch-auto overscroll-contain">
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <p className="text-sm font-semibold text-foreground">Quick Report Templates</p>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Use a pre-built template to speed up your report. Templates pre-fill the category and description — just edit the placeholders.
        </p>

        {reportTemplates
          .sort((a, b) => b.popularity - a.popularity)
          .map((template) => {
            const catObj = reportCategories.find((c) => c.value === template.category);
            const Icon = catObj?.icon ?? Flag;
            return (
              <Card
                key={template.id}
                className="overflow-hidden active:scale-[0.98] transition-transform touch-manipulation cursor-pointer"
                onClick={() => handleUseTemplate(template)}
              >
                <CardContent className="p-3 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 bg-muted">
                        <Icon className={`h-4 w-4 ${catObj?.color ?? "text-muted-foreground"}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">{template.name}</p>
                        <Badge variant="outline" className="text-xs mt-0.5 capitalize">
                          {catObj?.label ?? template.category}
                        </Badge>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {template.description}
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-muted-foreground/70">
                      Used {template.popularity} times
                    </span>
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-primary px-2">
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </div>
  );

  // ─── Report Detail View ───
  const renderReportDetail = () => {
    if (!viewingReport) return null;
    const statusConfig = getStatusConfig(viewingReport.status);
    const StatusIcon = statusConfig.icon;
    const catObj = reportCategories.find((c) => c.value === viewingReport.category);

    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 px-4 py-3 border-b shrink-0">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewingReport(null)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="font-semibold text-sm">Report Details</span>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto touch-auto overscroll-contain">
          <div className="p-4 space-y-4">
            {/* Status & Reference */}
            <div className="flex items-center justify-between">
              <Badge className={`${statusConfig.bg} text-xs gap-1`}>
                <StatusIcon className="h-3 w-3" />
                {statusConfig.label}
              </Badge>
              <span className="text-xs text-muted-foreground font-mono">{viewingReport.reference}</span>
            </div>

            {/* Category */}
            <div className="flex items-center gap-2">
              {catObj && <catObj.icon className={`h-4 w-4 ${catObj.color}`} />}
              <span className="text-sm font-medium">{getCategoryLabel(viewingReport.category)}</span>
            </div>

            {/* Template Used */}
            {viewingReport.templateUsed && (
              <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg">
                <LayoutTemplate className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Template: {viewingReport.templateUsed}</span>
              </div>
            )}

            {/* Description */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase">Description</Label>
              <p className="text-sm leading-relaxed">{viewingReport.description}</p>
            </div>

            {/* Date */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>Submitted: {formatDate(viewingReport.submittedAt)}</span>
            </div>

            {/* Resolution */}
            {viewingReport.resolution && (
              <Card className="border-emerald-200 bg-emerald-50">
                <CardContent className="p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <FileText className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-700">Resolution</span>
                  </div>
                  <p className="text-xs text-emerald-800 leading-relaxed">{viewingReport.resolution}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ─── History Tab ───
  const renderHistory = () => {
    if (viewingReport) return renderReportDetail();

    return (
      <div className="flex-1 min-h-0 overflow-y-auto touch-auto overscroll-contain">
        <div className="p-4 space-y-3">
          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {(
              [
                { label: "Total", count: mockPreviousReports.length, color: "text-foreground" },
                { label: "Pending", count: mockPreviousReports.filter((r) => r.status === "pending" || r.status === "investigating").length, color: "text-amber-600" },
                { label: "Resolved", count: mockPreviousReports.filter((r) => r.status === "resolved").length, color: "text-emerald-600" },
                { label: "Dismissed", count: mockPreviousReports.filter((r) => r.status === "dismissed").length, color: "text-muted-foreground" },
              ] as const
            ).map((stat) => (
              <div key={stat.label} className="text-center p-2 bg-muted/30 rounded-lg">
                <p className={`text-lg font-bold ${stat.color}`}>{stat.count}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {mockPreviousReports.length === 0 ? (
            <div className="text-center py-10">
              <Flag className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No reports submitted yet</p>
            </div>
          ) : (
            mockPreviousReports.map((report) => {
              const statusConfig = getStatusConfig(report.status);
              const StatusIcon = statusConfig.icon;
              return (
                <Card
                  key={report.id}
                  className="overflow-hidden active:scale-[0.98] transition-transform touch-manipulation cursor-pointer"
                  onClick={() => setViewingReport(report)}
                >
                  <CardContent className="p-3 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <Badge variant="outline" className="text-xs capitalize">
                        {getCategoryLabel(report.category)}
                      </Badge>
                      <Badge className={`${statusConfig.bg} text-xs gap-1`}>
                        <StatusIcon className="h-3 w-3" />
                        {statusConfig.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed line-clamp-2">
                      {report.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/30">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(report.submittedAt)}
                      </span>
                      <span className="font-mono text-xs">{report.reference}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    );
  };

  // ─── Main Content ───
  const content = (
    <div className="flex flex-col h-full">
      {/* Merchant Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b bg-destructive/5 shrink-0">
        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0">
          {merchantLogo ? (
            <img src={merchantLogo} alt={merchantName} className="h-full w-full object-cover" />
          ) : (
            <Flag className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{merchantName}</p>
          <p className="text-xs text-destructive">Report this merchant</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="flex flex-col flex-1 min-h-0">
        <TabsList className="w-full rounded-none border-b bg-background h-11 shrink-0">
          <TabsTrigger value="new" className="flex-1 text-xs data-[state=active]:shadow-none">
            <Send className="h-3.5 w-3.5 mr-1" />
            New Report
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex-1 text-xs data-[state=active]:shadow-none">
            <LayoutTemplate className="h-3.5 w-3.5 mr-1" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="history" className="flex-1 text-xs data-[state=active]:shadow-none">
            <Clock className="h-3.5 w-3.5 mr-1" />
            History
            {mockPreviousReports.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-4 px-1.5 text-[10px]">
                {mockPreviousReports.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="flex-1 min-h-0 m-0 overflow-hidden">
          {renderNewReportForm()}
        </TabsContent>
        <TabsContent value="templates" className="flex-1 min-h-0 m-0 overflow-hidden">
          {renderTemplates()}
        </TabsContent>
        <TabsContent value="history" className="flex-1 min-h-0 m-0 overflow-hidden flex flex-col">
          {renderHistory()}
        </TabsContent>
      </Tabs>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh] h-[92vh] flex flex-col">
          <DrawerHeader className="shrink-0 pb-0 relative">
            <DrawerTitle className="text-base font-semibold flex items-center gap-2">
              <Flag className="h-5 w-5 text-destructive" />
              Report Merchant
            </DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="absolute right-4 top-2 h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </DrawerHeader>
          <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
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
            <Flag className="h-5 w-5 text-destructive" />
            Report Merchant
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
          {content}
        </div>
      </DialogContent>
    </Dialog>
  );
}
