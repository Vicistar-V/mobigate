import { useState } from "react";
import { X, FileText, Download, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { mockAuditReports } from "@/data/financeData";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface FinancialAuditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FinancialAuditDialog({ open, onOpenChange }: FinancialAuditDialogProps) {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [reports] = useState(mockAuditReports);

  const handleDownloadReport = (reportId: string, period: string) => {
    toast({
      title: "Downloading Report",
      description: `${period} audit report will be downloaded`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-700";
      case "in-progress":
        return "bg-blue-500/10 text-blue-700";
      default:
        return "bg-gray-500/10 text-gray-700";
    }
  };

  const Content = () => (
    <div className="space-y-4">
      {reports.map((report) => (
        <Card key={report.id}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">{report.period}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    {report.startDate.toLocaleDateString()} - {report.endDate.toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Badge className={getStatusColor(report.status)}>
                {report.status}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Financial Summary */}
            {report.status === "completed" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <p className="text-xs text-muted-foreground">Total Income</p>
                    </div>
                    <p className="text-lg font-bold text-green-700">
                      {report.currency} {report.totalIncome.toLocaleString()}
                    </p>
                  </div>

                  <div className="p-3 bg-red-500/10 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingDown className="h-4 w-4 text-red-600" />
                      <p className="text-xs text-muted-foreground">Total Expenses</p>
                    </div>
                    <p className="text-lg font-bold text-red-700">
                      {report.currency} {report.totalExpenditure.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-1">Net Balance</p>
                  <p className={`text-2xl font-bold ${
                    report.balance >= 0 ? "text-green-700" : "text-red-700"
                  }`}>
                    {report.currency} {Math.abs(report.balance).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {report.balance >= 0 ? "Surplus" : "Deficit"}
                  </p>
                </div>

                {/* Discrepancies Alert */}
                {report.discrepancies > 0 && (
                  <div className="flex items-start gap-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm text-yellow-700">
                        {report.discrepancies} Discrepanc{report.discrepancies > 1 ? "ies" : "y"} Found
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Minor accounting discrepancies detected. Review recommended.
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                  <span>Generated: {report.generatedDate.toLocaleDateString()}</span>
                  <Button
                    onClick={() => handleDownloadReport(report.id, report.period)}
                    size="sm"
                    variant="outline"
                  >
                    <Download className="h-3 w-3 mr-2" />
                    Download
                  </Button>
                </div>
              </>
            )}

            {report.status === "in-progress" && (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground">
                  Audit in progress. Report will be available soon.
                </p>
              </div>
            )}

            {report.status === "pending" && (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground">
                  Audit scheduled. Report will be generated after period end.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh]">
          <DrawerHeader className="border-b">
            <DrawerTitle>Financial Audit Reports</DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="flex-1 p-4 overflow-y-auto touch-auto">
            <Content />
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="p-4 sm:p-6 pb-0 sticky top-0 bg-background z-10 border-b pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">Financial Audit Reports</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 p-4 sm:p-6">
          <Content />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}