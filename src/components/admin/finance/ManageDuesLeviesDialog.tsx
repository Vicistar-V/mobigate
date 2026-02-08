import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Plus,
  Edit2,
  Trash2,
  Wallet,
  Calendar,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Pause,
  Play,
  Globe,
} from "lucide-react";
import {
  mockDuesAndLevies,
  DuesAndLevies,
  ObligationType,
  getObligationTypeLabel,
  getObligationStatusColor,
} from "@/data/financialManagementData";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatMobiAmount, formatLocalAmount, formatLocalFirst } from "@/lib/mobiCurrencyTranslation";
import { MobiExplainerTooltip } from "@/components/common/MobiExplainerTooltip";
import { DualCurrencyDisplay, formatDualCurrency } from "@/components/common/DualCurrencyDisplay";

interface ManageDuesLeviesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ManageDuesLeviesDialog = ({
  open,
  onOpenChange,
}: ManageDuesLeviesDialogProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("list");
  const [selectedObligation, setSelectedObligation] = useState<DuesAndLevies | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "annual_dues" as ObligationType,
    amount: "",
    description: "",
    dueDate: "",
    gracePeriodDays: "30",
    lateFee: "",
    lateFeeType: "percentage" as "fixed" | "percentage",
    isRecurring: false,
    recurringPeriod: "annually" as "monthly" | "quarterly" | "annually",
  });

  const handleCreateNew = () => {
    setSelectedObligation(null);
    setFormData({
      name: "",
      type: "annual_dues",
      amount: "",
      description: "",
      dueDate: "",
      gracePeriodDays: "30",
      lateFee: "",
      lateFeeType: "percentage",
      isRecurring: false,
      recurringPeriod: "annually",
    });
    setActiveTab("create");
  };

  const handleEdit = (obligation: DuesAndLevies) => {
    setSelectedObligation(obligation);
    setFormData({
      name: obligation.name,
      type: obligation.type,
      amount: obligation.amount.toString(),
      description: obligation.description,
      dueDate: format(obligation.dueDate, "yyyy-MM-dd"),
      gracePeriodDays: obligation.gracePeriodDays.toString(),
      lateFee: obligation.lateFee.toString(),
      lateFeeType: obligation.lateFeeType,
      isRecurring: obligation.isRecurring,
      recurringPeriod: obligation.recurringPeriod || "annually",
    });
    setActiveTab("create");
  };

  const handleSave = () => {
    toast({
      title: selectedObligation ? "Obligation Updated" : "Obligation Created",
      description: `${formData.name} has been ${selectedObligation ? "updated" : "created"} successfully.`,
    });
    setActiveTab("list");
  };

  const handleDelete = () => {
    toast({
      title: "Obligation Deleted",
      description: `${selectedObligation?.name} has been deleted.`,
      variant: "destructive",
    });
    setShowDeleteConfirm(false);
    setSelectedObligation(null);
  };

  const handleToggleStatus = (obligation: DuesAndLevies) => {
    const newStatus = obligation.status === "active" ? "suspended" : "active";
    toast({
      title: `Obligation ${newStatus === "active" ? "Activated" : "Suspended"}`,
      description: `${obligation.name} has been ${newStatus}.`,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle2 className="h-4 w-4" />;
      case "expired":
        return <Clock className="h-4 w-4" />;
      case "suspended":
        return <Pause className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const Content = () => (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="list">View All</TabsTrigger>
        <TabsTrigger value="create">{selectedObligation ? "Edit" : "Create New"}</TabsTrigger>
      </TabsList>

      <TabsContent value="list" className="space-y-4 mt-0">
        <Button onClick={handleCreateNew} className="w-full gap-2 h-11 touch-manipulation active:scale-[0.98]">
          <Plus className="h-4 w-4" />
          Create New Dues/Levy
        </Button>

        <div className="space-y-3">
          {mockDuesAndLevies.map((obligation) => {
            const progressPercentage = Math.round(
              (obligation.totalCollected / obligation.totalExpected) * 100
            );

            return (
              <Card key={obligation.id} className="p-3 space-y-2.5 overflow-hidden">
                {/* Row 1: Title + Status */}
                <div className="flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base leading-snug break-words">{obligation.name}</h3>
                    <Badge className={`mt-1 ${getObligationStatusColor(obligation.status)}`}>
                      {getStatusIcon(obligation.status)}
                      <span className="ml-1 capitalize">{obligation.status}</span>
                    </Badge>
                  </div>
                </div>

                {/* Row 2: Type + Amount */}
                <div>
                  <p className="text-sm text-muted-foreground">
                    {getObligationTypeLabel(obligation.type)} • {formatLocalAmount(obligation.amount, "NGN")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ≈ {formatMobiAmount(obligation.amount)}
                  </p>
                </div>

                {/* Row 3: Description */}
                <p className="text-sm text-muted-foreground line-clamp-2 break-words">
                  {obligation.description}
                </p>

                {/* Row 4: Due date + Paid count stacked */}
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                    Due: {format(obligation.dueDate, "MMM d, yyyy")}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 shrink-0" />
                    {obligation.paidCount}/{obligation.totalMembers} paid
                  </span>
                </div>

                {/* Row 5: Collection Progress - stacked vertically */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1 text-sm">
                    <span className="font-medium">Collection Progress</span>
                    <MobiExplainerTooltip size="sm" />
                  </div>
                  <div className="text-sm font-medium break-words">
                    {formatLocalAmount(obligation.totalCollected, "NGN")} / {formatLocalAmount(obligation.totalExpected, "NGN")}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    ≈ {formatMobiAmount(obligation.totalCollected)} / {formatMobiAmount(obligation.totalExpected)}
                  </p>
                  <Progress value={progressPercentage} className="h-2" />
                  <p className="text-xs text-muted-foreground text-right">{progressPercentage}% collected</p>
                </div>

                {/* Row 6: Action buttons */}
                <div className="flex gap-2 pt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-10 touch-manipulation active:scale-[0.98]"
                    onClick={() => handleEdit(obligation)}
                  >
                    <Edit2 className="h-4 w-4 mr-1.5" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 w-10 touch-manipulation active:scale-[0.97]"
                    onClick={() => handleToggleStatus(obligation)}
                  >
                    {obligation.status === "active" ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 w-10 touch-manipulation active:scale-[0.97]"
                    onClick={() => {
                      setSelectedObligation(obligation);
                      setShowDeleteConfirm(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </TabsContent>

      <TabsContent value="create" className="space-y-4 mt-0">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Obligation Name</Label>
            <Input
              placeholder="e.g., Annual Dues 2025"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="touch-manipulation"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: ObligationType) =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="annual_dues">Annual Dues</SelectItem>
                <SelectItem value="development_levy">Development Levy</SelectItem>
                <SelectItem value="special_assessment">Special Assessment</SelectItem>
                <SelectItem value="registration_fee">Registration Fee</SelectItem>
                <SelectItem value="emergency_levy">Emergency Levy</SelectItem>
                <SelectItem value="project_levy">Project Levy</SelectItem>
                <SelectItem value="social_levy">Social Levy</SelectItem>
                <SelectItem value="condolence_levy">Condolence Levy</SelectItem>
                <SelectItem value="statutory_levy">Statutory Levy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Amount (₦)</Label>
              <Input
                type="number"
                placeholder="15000"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                inputMode="decimal"
                className="touch-manipulation"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="touch-manipulation"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Describe this obligation..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="min-h-[80px] touch-manipulation"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Grace Period (Days)</Label>
              <Input
                type="number"
                value={formData.gracePeriodDays}
                onChange={(e) =>
                  setFormData({ ...formData, gracePeriodDays: e.target.value })
                }
                inputMode="numeric"
                className="touch-manipulation"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="space-y-2">
              <Label>Late Fee</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={formData.lateFee}
                  onChange={(e) => setFormData({ ...formData, lateFee: e.target.value })}
                  className="flex-1 touch-manipulation"
                  inputMode="decimal"
                  onClick={(e) => e.stopPropagation()}
                />
                <Select
                  value={formData.lateFeeType}
                  onValueChange={(value: "fixed" | "percentage") =>
                    setFormData({ ...formData, lateFeeType: value })
                  }
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">%</SelectItem>
                    <SelectItem value="fixed">₦</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Recurring Obligation</h4>
                <p className="text-sm text-muted-foreground">
                  Automatically create new obligations periodically
                </p>
              </div>
              <Switch
                checked={formData.isRecurring}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isRecurring: checked })
                }
              />
            </div>
            {formData.isRecurring && (
              <div className="mt-3">
                <Label>Recurring Period</Label>
                <Select
                  value={formData.recurringPeriod}
                  onValueChange={(value: "monthly" | "quarterly" | "annually") =>
                    setFormData({ ...formData, recurringPeriod: value })
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </Card>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => setActiveTab("list")}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSave}>
              {selectedObligation ? "Update" : "Create"} Obligation
            </Button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );

  if (isMobile) {
    return (
      <>
        <Drawer open={open} onOpenChange={onOpenChange}>
          <DrawerContent className="max-h-[92vh] p-0">
            <DrawerHeader className="border-b shrink-0 px-4 pt-4 pb-3">
              <DrawerTitle>Manage Dues & Levies</DrawerTitle>
            </DrawerHeader>
            <div className="flex-1 overflow-y-auto overflow-x-hidden touch-auto overscroll-contain px-4 py-4 pb-8">
              {Content()}
            </div>
          </DrawerContent>
        </Drawer>

        <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Obligation</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{selectedObligation?.name}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                Delete
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
            <DialogTitle>Manage Dues & Levies</DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 pr-4">
            {Content()}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Obligation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedObligation?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
