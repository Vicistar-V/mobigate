import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CheckCircle, XCircle, Clock, Store, User, Building2, ChevronDown, Globe, Phone, Mail, Landmark } from "lucide-react";
import { formatMobi, formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
import { useToast } from "@/hooks/use-toast";

interface MockApplication {
  id: string;
  applicantName: string;
  type: "individual" | "corporate";
  storeName: string;
  merchantCode: string;
  gameType: string;
  businessProfile?: string;
  dba?: string;
  registeredOffice?: string;
  companyRegNumber?: string;
  regAuthority?: string;
  countryOfReg?: string;
  tin?: string;
  director1?: string;
  director2?: string;
  phone: string;
  email: string;
  website?: string;
  bankName?: string;
  submittedDate: string;
  feePaid: number;
  eligibility: { label: string; met: boolean }[];
}

const mockApplications: MockApplication[] = [
  {
    id: "MERCH-2026-001",
    applicantName: "Adewale Johnson",
    type: "individual",
    storeName: "AdewaleStore",
    merchantCode: "54321",
    gameType: "Single-Code",
    dba: "AJ Ventures",
    phone: "+234 812 345 6789",
    email: "adewale.johnson@email.com",
    bankName: "First Bank",
    submittedDate: "2026-02-20",
    feePaid: 50000,
    eligibility: [
      { label: "Verified 180+ days", met: true },
      { label: "1,000+ invited friends", met: true },
      { label: "5,000 friends & followers", met: true },
      { label: "100+ e-Library contents", met: false },
      { label: "Followed 500+ creators", met: true },
    ],
  },
  {
    id: "MERCH-2026-002",
    applicantName: "Ngozi Okafor",
    type: "corporate",
    storeName: "ZenithFoods",
    merchantCode: "77890",
    gameType: "Multi-Code",
    businessProfile: "Food distribution and retail",
    dba: "Zenith Foods",
    registeredOffice: "12 Allen Ave, Ikeja, Lagos",
    companyRegNumber: "RC-789012",
    regAuthority: "CAC",
    countryOfReg: "Nigeria",
    tin: "TIN-98765432",
    director1: "Ngozi Okafor",
    director2: "Emeka Okafor",
    phone: "+234 803 456 7890",
    email: "ngozi@zenithfoods.ng",
    website: "https://zenithfoods.ng",
    bankName: "GTBank",
    submittedDate: "2026-02-19",
    feePaid: 50000,
    eligibility: [
      { label: "Verified 180+ days", met: true },
      { label: "1,000+ invited friends", met: true },
      { label: "5,000 friends & followers", met: true },
      { label: "100+ e-Library contents", met: true },
      { label: "Followed 500+ creators", met: true },
    ],
  },
  {
    id: "MERCH-2026-003",
    applicantName: "Chidi Eze",
    type: "individual",
    storeName: "ChidiMart",
    merchantCode: "22345",
    gameType: "Single-Code",
    phone: "+234 905 678 1234",
    email: "chidi.eze@email.com",
    bankName: "UBA",
    submittedDate: "2026-02-18",
    feePaid: 50000,
    eligibility: [
      { label: "Verified 180+ days", met: true },
      { label: "1,000+ invited friends", met: false },
      { label: "5,000 friends & followers", met: false },
      { label: "100+ e-Library contents", met: false },
      { label: "Followed 500+ creators", met: true },
    ],
  },
  {
    id: "MERCH-2026-004",
    applicantName: "Fatima Bello",
    type: "corporate",
    storeName: "AutoPartsNG",
    merchantCode: "88001",
    gameType: "Multi-Code",
    businessProfile: "Automobile parts retail",
    companyRegNumber: "RC-345678",
    regAuthority: "CAC",
    countryOfReg: "Nigeria",
    director1: "Fatima Bello",
    phone: "+234 816 789 0123",
    email: "fatima@autoparts.ng",
    bankName: "Access Bank",
    submittedDate: "2026-02-17",
    feePaid: 50000,
    eligibility: [
      { label: "Verified 180+ days", met: true },
      { label: "1,000+ invited friends", met: true },
      { label: "5,000 friends & followers", met: true },
      { label: "100+ e-Library contents", met: true },
      { label: "Followed 500+ creators", met: false },
    ],
  },
];

type AppStatus = "pending" | "approved" | "declined";

export function MerchantApplicationsAdmin() {
  const { toast } = useToast();
  const [statuses, setStatuses] = useState<Record<string, AppStatus>>(
    Object.fromEntries(mockApplications.map((a) => [a.id, "pending" as AppStatus]))
  );
  const [decliningId, setDecliningId] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const counts = {
    pending: Object.values(statuses).filter((s) => s === "pending").length,
    approved: Object.values(statuses).filter((s) => s === "approved").length,
    declined: Object.values(statuses).filter((s) => s === "declined").length,
  };

  const handleApprove = (id: string, name: string) => {
    setStatuses((prev) => ({ ...prev, [id]: "approved" }));
    setDecliningId(null);
    toast({ title: "Application Approved", description: `${name}'s merchant application has been approved.` });
  };

  const handleDecline = (id: string, name: string) => {
    if (decliningId !== id) {
      setDecliningId(id);
      setDeclineReason("");
      return;
    }
    setStatuses((prev) => ({ ...prev, [id]: "declined" }));
    setDecliningId(null);
    setDeclineReason("");
    toast({ title: "Application Declined", description: `${name}'s merchant application has been declined.` });
  };

  const DetailRow = ({ label, value }: { label: string; value?: string }) => {
    if (!value) return null;
    return (
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-right max-w-[55%] truncate">{value}</span>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="bg-amber-50/50 dark:bg-amber-950/20">
          <CardContent className="p-3 text-center">
            <Clock className="h-4 w-4 text-amber-600 mx-auto mb-1" />
            <p className="text-xl font-bold">{counts.pending}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50/50 dark:bg-emerald-950/20">
          <CardContent className="p-3 text-center">
            <CheckCircle className="h-4 w-4 text-emerald-600 mx-auto mb-1" />
            <p className="text-xl font-bold">{counts.approved}</p>
            <p className="text-xs text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
        <Card className="bg-red-50/50 dark:bg-red-950/20">
          <CardContent className="p-3 text-center">
            <XCircle className="h-4 w-4 text-red-500 mx-auto mb-1" />
            <p className="text-xl font-bold">{counts.declined}</p>
            <p className="text-xs text-muted-foreground">Declined</p>
          </CardContent>
        </Card>
      </div>

      {/* Applications */}
      {mockApplications.map((app) => {
        const status = statuses[app.id];
        const isExpanded = expandedId === app.id;

        return (
          <Card key={app.id} className={status !== "pending" ? "opacity-60" : ""}>
            <CardContent className="p-4 space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    {app.type === "individual" ? <User className="h-4 w-4 text-primary" /> : <Building2 className="h-4 w-4 text-primary" />}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{app.applicantName}</p>
                    <p className="text-xs text-muted-foreground font-mono">{app.storeName} • {app.merchantCode}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant={app.type === "individual" ? "secondary" : "outline"} className="text-xs h-5">
                    {app.type === "individual" ? "Individual" : "Corporate"}
                  </Badge>
                  {status !== "pending" && (
                    <Badge variant={status === "approved" ? "default" : "destructive"} className="text-xs h-5">
                      {status === "approved" ? "Approved" : "Declined"}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Quick details */}
              <div className="bg-muted/30 rounded-lg p-2.5 space-y-1.5 text-sm">
                <DetailRow label="Reference" value={app.id} />
                <DetailRow label="Submitted" value={app.submittedDate} />
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fee Paid</span>
                  <span className="font-medium text-primary">{formatMobi(app.feePaid)}</span>
                </div>
              </div>

              {/* Expandable full details */}
              <Collapsible open={isExpanded} onOpenChange={() => setExpandedId(isExpanded ? null : app.id)}>
                <CollapsibleTrigger asChild>
                  <button className="flex items-center gap-1 text-xs text-primary font-medium w-full">
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    {isExpanded ? "Hide" : "View"} Full Application
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-2 space-y-3">
                    {/* Business Info */}
                    {(app.businessProfile || app.dba || app.registeredOffice || app.companyRegNumber) && (
                      <div className="bg-muted/20 rounded-lg p-2.5 space-y-1.5 border border-border/50">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                          <Store className="h-3.5 w-3.5" /> Business Info
                        </p>
                        <DetailRow label="Profile" value={app.businessProfile} />
                        <DetailRow label="DBA" value={app.dba} />
                        <DetailRow label="Registered Office" value={app.registeredOffice} />
                        <DetailRow label="Reg. Number" value={app.companyRegNumber} />
                        <DetailRow label="Reg. Authority" value={app.regAuthority} />
                        <DetailRow label="Country" value={app.countryOfReg} />
                        <DetailRow label="TIN" value={app.tin} />
                      </div>
                    )}

                    {/* Directors */}
                    {(app.director1 || app.director2) && (
                      <div className="bg-muted/20 rounded-lg p-2.5 space-y-1.5 border border-border/50">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Principal Officers</p>
                        <DetailRow label="Director 1" value={app.director1} />
                        <DetailRow label="Director 2" value={app.director2} />
                      </div>
                    )}

                    {/* Contact & Banking */}
                    <div className="bg-muted/20 rounded-lg p-2.5 space-y-1.5 border border-border/50">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5" /> Contact & Banking
                      </p>
                      <DetailRow label="Email" value={app.email} />
                      <DetailRow label="Phone" value={app.phone} />
                      <DetailRow label="Website" value={app.website} />
                      <DetailRow label="Bank" value={app.bankName} />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Eligibility */}
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Eligibility Check</p>
                <div className="grid grid-cols-1 gap-1">
                  {app.eligibility.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      {item.met ? (
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />
                      )}
                      <span className={item.met ? "" : "text-red-600 dark:text-red-400"}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decline reason input */}
              {decliningId === app.id && status === "pending" && (
                <Input
                  placeholder="Reason for declining (optional)"
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  className="text-xs h-8"
                />
              )}

              {/* Actions */}
              {status === "pending" && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8"
                    onClick={() => handleApprove(app.id, app.applicantName)}
                  >
                    <CheckCircle className="h-3.5 w-3.5 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="flex-1 text-xs h-8"
                    onClick={() => handleDecline(app.id, app.applicantName)}
                  >
                    <XCircle className="h-3.5 w-3.5 mr-1" />
                    {decliningId === app.id ? "Confirm Decline" : "Decline"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
