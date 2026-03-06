import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  ShieldAlert,
  UserX,
  MessageSquareWarning,
  PackageX,
  AlertTriangle,
  Flag,
  Clock,
  Search,
  CheckCircle,
  XCircle,
  Eye,
  ChevronRight,
  Loader2,
  User,
  Calendar,
  Hash,
  FileText,
  ArrowRight,
  Gavel,
  Ban,
  ShieldOff,
  Trash2,
  ChevronDown,
} from "lucide-react";

// ─── Category definitions ───
const reportCategories = [
  { value: "scam-fraud", label: "Scam / Fraud", icon: ShieldAlert, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/30", badge: "bg-red-500/15 text-red-700 border-red-300" },
  { value: "assault-bullying", label: "Assault / Bullying", icon: UserX, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/30", badge: "bg-orange-500/15 text-orange-700 border-orange-300" },
  { value: "harassment-threat", label: "Harassment / Threat", icon: MessageSquareWarning, color: "text-amber-600", bg: "bg-amber-500/10", border: "border-amber-500/30", badge: "bg-amber-500/15 text-amber-700 border-amber-300" },
  { value: "deception-falsehood", label: "Deception / Falsehood", icon: PackageX, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/30", badge: "bg-purple-500/15 text-purple-700 border-purple-300" },
  { value: "social-abuse", label: "Social Abuse", icon: AlertTriangle, color: "text-pink-500", bg: "bg-pink-500/10", border: "border-pink-500/30", badge: "bg-pink-500/15 text-pink-700 border-pink-300" },
  { value: "other", label: "Other Offenses", icon: Flag, color: "text-slate-500", bg: "bg-slate-500/10", border: "border-slate-500/30", badge: "bg-slate-500/15 text-slate-700 border-slate-300" },
];

type PenaltyType = "warning" | "suspend" | "ban" | "deactivate";

const penaltyDurations = [
  { value: "30d", label: "30 Days" },
  { value: "60d", label: "60 Days" },
  { value: "90d", label: "90 Days" },
  { value: "120d", label: "120 Days" },
  { value: "6m", label: "6 Months" },
  { value: "12m", label: "12 Months" },
  { value: "18m", label: "18 Months" },
  { value: "24m", label: "24 Months" },
];

const penaltyConfig: Record<PenaltyType, { label: string; description: string; icon: React.ElementType; color: string; bg: string; border: string; requiresDuration: boolean }> = {
  warning: { label: "Send Warning ⚠️", description: "Send an official warning to the merchant", icon: AlertTriangle, color: "text-amber-700", bg: "bg-amber-500/10", border: "border-amber-400", requiresDuration: false },
  suspend: { label: "Suspend Merchant", description: "Suspend merchant account only (user's Mobigate account stays active)", icon: ShieldOff, color: "text-orange-700", bg: "bg-orange-500/10", border: "border-orange-400", requiresDuration: true },
  ban: { label: "Ban on Mobigate", description: "Ban the user entirely from Mobigate platform", icon: Ban, color: "text-red-700", bg: "bg-red-500/10", border: "border-red-400", requiresDuration: true },
  deactivate: { label: "Deactivate Permanently", description: "Permanently deactivate the account — irreversible", icon: Trash2, color: "text-red-900", bg: "bg-red-600/10", border: "border-red-600", requiresDuration: false },
};

type ComplaintStatus = "pending" | "investigating" | "resolved" | "dismissed" | "penalised";

interface Complaint {
  id: string;
  refNumber: string;
  merchantName: string;
  merchantId: string;
  category: string;
  status: ComplaintStatus;
  description: string;
  reporterName: string;
  reporterEmail: string;
  isAnonymous: boolean;
  submittedDate: string;
  lastUpdated: string;
  resolutionNotes?: string;
  resolutionDate?: string;
  assignedTo?: string;
  evidence?: string[];
  timeline: { date: string; action: string; by: string }[];
}

// ─── Mock complaints data ───
const initialComplaints: Complaint[] = [
  {
    id: "c1", refNumber: "RPT-2026-0001", merchantName: "QuickBuy Electronics", merchantId: "m1",
    category: "scam-fraud", status: "pending",
    description: "This merchant charged my card ₦45,000 for a product that was never delivered. Multiple attempts to contact them have been ignored. The tracking number provided was fake and leads to a non-existent shipment.",
    reporterName: "Adebayo Johnson", reporterEmail: "adebayo.j@email.com", isAnonymous: false,
    submittedDate: "2026-03-01", lastUpdated: "2026-03-01",
    timeline: [{ date: "2026-03-01", action: "Report submitted", by: "Adebayo Johnson" }],
  },
  {
    id: "c2", refNumber: "RPT-2026-0002", merchantName: "FreshMart Foods", merchantId: "m2",
    category: "deception-falsehood", status: "investigating",
    description: "Merchant advertises organic produce but sells regular items at premium prices. Multiple customers have confirmed this deceptive practice. Product labels don't match actual content.",
    reporterName: "", reporterEmail: "", isAnonymous: true,
    submittedDate: "2026-02-27", lastUpdated: "2026-03-02",
    assignedTo: "Admin Chidi",
    timeline: [
      { date: "2026-02-27", action: "Report submitted", by: "Anonymous" },
      { date: "2026-03-02", action: "Investigation started", by: "Admin Chidi" },
    ],
  },
  {
    id: "c3", refNumber: "RPT-2026-0003", merchantName: "TechZone Repairs", merchantId: "m3",
    category: "harassment-threat", status: "pending",
    description: "Merchant staff used abusive language and threatened physical harm when I tried to return a defective product within the warranty period. I have witness testimony.",
    reporterName: "Chioma Eze", reporterEmail: "chioma.e@email.com", isAnonymous: false,
    submittedDate: "2026-02-28", lastUpdated: "2026-02-28",
    timeline: [{ date: "2026-02-28", action: "Report submitted", by: "Chioma Eze" }],
  },
  {
    id: "c4", refNumber: "RPT-2026-0004", merchantName: "GlamStyle Beauty", merchantId: "m4",
    category: "assault-bullying", status: "resolved",
    description: "Staff member physically pushed me out of the store during a dispute over pricing. Security camera footage should be available.",
    reporterName: "Ngozi Okafor", reporterEmail: "ngozi.o@email.com", isAnonymous: false,
    submittedDate: "2026-02-20", lastUpdated: "2026-02-25",
    resolutionNotes: "Merchant has been warned. Staff member suspended. Merchant agreed to compensate customer with ₦15,000 store credit.",
    resolutionDate: "2026-02-25",
    timeline: [
      { date: "2026-02-20", action: "Report submitted", by: "Ngozi Okafor" },
      { date: "2026-02-21", action: "Investigation started", by: "Admin Funke" },
      { date: "2026-02-23", action: "Evidence reviewed — CCTV confirmed incident", by: "Admin Funke" },
      { date: "2026-02-25", action: "Resolved — Merchant warned, staff suspended", by: "Admin Funke" },
    ],
  },
  {
    id: "c5", refNumber: "RPT-2026-0005", merchantName: "DataPlug Hub", merchantId: "m5",
    category: "social-abuse", status: "dismissed",
    description: "Merchant posted my personal phone number on their social media page after I left a negative review, encouraging followers to harass me.",
    reporterName: "Emeka Nwankwo", reporterEmail: "emeka.n@email.com", isAnonymous: false,
    submittedDate: "2026-02-15", lastUpdated: "2026-02-18",
    resolutionNotes: "After investigation, the social media post was found to be from a different account not linked to the merchant. Case dismissed due to insufficient evidence.",
    resolutionDate: "2026-02-18",
    timeline: [
      { date: "2026-02-15", action: "Report submitted", by: "Emeka Nwankwo" },
      { date: "2026-02-16", action: "Investigation started", by: "Admin Chidi" },
      { date: "2026-02-18", action: "Dismissed — insufficient evidence linking merchant", by: "Admin Chidi" },
    ],
  },
  {
    id: "c6", refNumber: "RPT-2026-0006", merchantName: "QuickBuy Electronics", merchantId: "m1",
    category: "scam-fraud", status: "investigating",
    description: "Received a counterfeit phone instead of the original Samsung Galaxy advertised. Serial number check confirms it's a fake device. Merchant refuses refund.",
    reporterName: "Ibrahim Musa", reporterEmail: "ibrahim.m@email.com", isAnonymous: false,
    submittedDate: "2026-03-02", lastUpdated: "2026-03-03",
    assignedTo: "Admin Funke",
    timeline: [
      { date: "2026-03-02", action: "Report submitted", by: "Ibrahim Musa" },
      { date: "2026-03-03", action: "Investigation started — contacting merchant", by: "Admin Funke" },
    ],
  },
  {
    id: "c7", refNumber: "RPT-2026-0007", merchantName: "FreshMart Foods", merchantId: "m2",
    category: "other", status: "pending",
    description: "Store operates beyond licensed hours and plays extremely loud music that disturbs the neighborhood. Multiple community complaints have been filed.",
    reporterName: "", reporterEmail: "", isAnonymous: true,
    submittedDate: "2026-03-03", lastUpdated: "2026-03-03",
    timeline: [{ date: "2026-03-03", action: "Report submitted", by: "Anonymous" }],
  },
];

const statusConfig: Record<ComplaintStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  pending: { label: "Pending", color: "text-amber-700", bg: "bg-amber-500/15 border-amber-300", icon: Clock },
  investigating: { label: "Investigating", color: "text-blue-700", bg: "bg-blue-500/15 border-blue-300", icon: Search },
  resolved: { label: "Resolved", color: "text-emerald-700", bg: "bg-emerald-500/15 border-emerald-300", icon: CheckCircle },
  dismissed: { label: "Dismissed", color: "text-slate-600", bg: "bg-slate-500/15 border-slate-300", icon: XCircle },
};

export function AdminComplaintsTab() {
  const { toast } = useToast();
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const [statusFilter, setStatusFilter] = useState<"all" | ComplaintStatus>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [processing, setProcessing] = useState(false);
  const [actionReason, setActionReason] = useState("");
  const [showReasonFor, setShowReasonFor] = useState<"resolve" | "dismiss" | null>(null);
  const [showPenalty, setShowPenalty] = useState(false);
  const [selectedPenalty, setSelectedPenalty] = useState<PenaltyType | null>(null);
  const [penaltyDuration, setPenaltyDuration] = useState("");
  const [penaltyReason, setPenaltyReason] = useState("");
  const [penaltyProcessing, setPenaltyProcessing] = useState(false);
  const [confirmDeactivate, setConfirmDeactivate] = useState(false);

  const getCat = (val: string) => reportCategories.find((c) => c.value === val);

  // Stats
  const stats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "pending").length,
    investigating: complaints.filter((c) => c.status === "investigating").length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
    dismissed: complaints.filter((c) => c.status === "dismissed").length,
  };

  // Filtered list
  const filtered = complaints.filter((c) => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (categoryFilter !== "all" && c.category !== categoryFilter) return false;
    return true;
  });

  // Actions
  const handleAction = (id: string, action: "investigate" | "resolve" | "dismiss", reason?: string) => {
    setProcessing(true);
    setTimeout(() => {
      setComplaints((prev) =>
        prev.map((c) => {
          if (c.id !== id) return c;
          const now = new Date().toISOString().split("T")[0];
          const newStatus: ComplaintStatus =
            action === "investigate" ? "investigating" :
            action === "resolve" ? "resolved" : "dismissed";
          const actionLabel =
            action === "investigate" ? "Investigation started" :
            action === "resolve" ? `Resolved — ${reason}` :
            `Dismissed — ${reason}`;
          return {
            ...c,
            status: newStatus,
            lastUpdated: now,
            ...(action !== "investigate" ? { resolutionNotes: reason, resolutionDate: now } : { assignedTo: "You" }),
            timeline: [...c.timeline, { date: now, action: actionLabel, by: "You (Admin)" }],
          };
        })
      );
      setProcessing(false);
      setShowReasonFor(null);
      setActionReason("");
      // Update selected complaint view
      setSelectedComplaint((prev) => {
        if (!prev || prev.id !== id) return prev;
        const updated = complaints.find((c) => c.id === id);
        return updated ? { ...updated } : prev;
      });
      toast({
        title: action === "investigate" ? "🔍 Investigation Started" : action === "resolve" ? "✅ Complaint Resolved" : "❌ Complaint Dismissed",
        description: `Case ${complaints.find((c) => c.id === id)?.refNumber} has been updated.`,
      });
      // Close drawer after action
      setTimeout(() => setSelectedComplaint(null), 500);
    }, 2000);
  };

  const handlePenalty = (complaintId: string) => {
    if (!selectedPenalty) return;
    const penalty = penaltyConfig[selectedPenalty];
    if (penalty.requiresDuration && !penaltyDuration) return;
    if (selectedPenalty === "deactivate" && !confirmDeactivate) return;
    if (!penaltyReason.trim() && selectedPenalty !== "warning") return;

    setPenaltyProcessing(true);
    setTimeout(() => {
      const durationLabel = penaltyDuration ? penaltyDurations.find(d => d.value === penaltyDuration)?.label : "";
      const penaltyLabel =
        selectedPenalty === "warning" ? "Official warning sent" :
        selectedPenalty === "suspend" ? `Merchant suspended for ${durationLabel}` :
        selectedPenalty === "ban" ? `Banned from Mobigate for ${durationLabel}` :
        "Account permanently deactivated";

      setComplaints((prev) =>
        prev.map((c) => {
          if (c.id !== complaintId) return c;
          const now = new Date().toISOString().split("T")[0];
          return {
            ...c,
            lastUpdated: now,
            timeline: [...c.timeline, { date: now, action: `Penalty applied — ${penaltyLabel}${penaltyReason ? `: ${penaltyReason}` : ""}`, by: "You (Admin)" }],
          };
        })
      );

      setPenaltyProcessing(false);
      setShowPenalty(false);
      setSelectedPenalty(null);
      setPenaltyDuration("");
      setPenaltyReason("");
      setConfirmDeactivate(false);

      toast({
        title: selectedPenalty === "warning" ? "⚠️ Warning Sent" : selectedPenalty === "suspend" ? "🔒 Merchant Suspended" : selectedPenalty === "ban" ? "🚫 User Banned" : "💀 Account Deactivated",
        description: penaltyLabel,
      });
    }, 2000);
  };

  const pendingCount = stats.pending + stats.investigating;

  const resetPenaltyState = () => {
    setShowPenalty(false);
    setSelectedPenalty(null);
    setPenaltyDuration("");
    setPenaltyReason("");
    setPenaltyProcessing(false);
    setConfirmDeactivate(false);
  };

  return (
    <div className="space-y-3 pb-6">
      {/* ─── Summary Stats ─── */}
      <div className="grid grid-cols-4 gap-2">
        <div className="rounded-xl bg-muted/50 border border-border p-2.5 text-center">
          <p className="text-lg font-bold">{stats.total}</p>
          <p className="text-xs text-muted-foreground">Total</p>
        </div>
        <div className="rounded-xl bg-amber-500/10 border border-amber-300/50 p-2.5 text-center">
          <p className="text-lg font-bold text-amber-700">{stats.pending}</p>
          <p className="text-xs text-amber-600">Pending</p>
        </div>
        <div className="rounded-xl bg-blue-500/10 border border-blue-300/50 p-2.5 text-center">
          <p className="text-lg font-bold text-blue-700">{stats.investigating}</p>
          <p className="text-xs text-blue-600">Active</p>
        </div>
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-300/50 p-2.5 text-center">
          <p className="text-lg font-bold text-emerald-700">{stats.resolved}</p>
          <p className="text-xs text-emerald-600">Resolved</p>
        </div>
      </div>

      {/* ─── Status Filters ─── */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide" style={{ WebkitOverflowScrolling: "touch" }}>
        {[
          { key: "all", label: `All (${stats.total})` },
          { key: "pending", label: `Pending (${stats.pending})` },
          { key: "investigating", label: `Active (${stats.investigating})` },
          { key: "resolved", label: `Resolved (${stats.resolved})` },
          { key: "dismissed", label: `Dismissed (${stats.dismissed})` },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setStatusFilter(f.key as any)}
            className={`h-9 px-3 rounded-full text-xs font-medium whitespace-nowrap shrink-0 touch-manipulation transition-colors border ${
              statusFilter === f.key
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted/50 text-muted-foreground border-border hover:bg-muted"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ─── Category Filters ─── */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide" style={{ WebkitOverflowScrolling: "touch" }}>
        <button
          onClick={() => setCategoryFilter("all")}
          className={`h-8 px-3 rounded-full text-xs font-medium whitespace-nowrap shrink-0 touch-manipulation transition-colors border ${
            categoryFilter === "all"
              ? "bg-primary/10 text-primary border-primary/30"
              : "bg-muted/30 text-muted-foreground border-border/50"
          }`}
        >
          All Types
        </button>
        {reportCategories.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.value}
              onClick={() => setCategoryFilter(cat.value)}
              className={`h-8 px-2.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 touch-manipulation transition-colors border flex items-center gap-1 ${
                categoryFilter === cat.value
                  ? `${cat.bg} ${cat.color} ${cat.border}`
                  : "bg-muted/30 text-muted-foreground border-border/50"
              }`}
            >
              <Icon className="h-3 w-3 shrink-0" />
              {cat.label.split(" / ")[0]}
            </button>
          );
        })}
      </div>

      {/* ─── Results Count ─── */}
      <p className="text-xs text-muted-foreground">
        {filtered.length} complaint{filtered.length !== 1 ? "s" : ""} found
      </p>

      {/* ─── Complaint Cards ─── */}
      {filtered.length === 0 ? (
        <div className="py-12 text-center">
          <Flag className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No complaints found</p>
          <p className="text-xs text-muted-foreground mt-1">Try changing your filters</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((complaint) => {
            const cat = getCat(complaint.category);
            const st = statusConfig[complaint.status];
            const CatIcon = cat?.icon || Flag;
            const StIcon = st.icon;
            return (
              <Card
                key={complaint.id}
                className="overflow-hidden cursor-pointer active:scale-[0.98] transition-transform touch-manipulation"
                onClick={() => setSelectedComplaint(complaint)}
              >
                <CardContent className="p-3">
                  {/* Row 1: Category + Status badges */}
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Badge variant="outline" className={`text-xs h-6 px-2 whitespace-nowrap ${cat?.badge || ""} flex items-center gap-1`}>
                      <CatIcon className="h-3 w-3 shrink-0" />
                      {cat?.label || "Other"}
                    </Badge>
                    <Badge variant="outline" className={`text-xs h-6 px-2 whitespace-nowrap ${st.bg} ${st.color} border flex items-center gap-1`}>
                      <StIcon className="h-3 w-3 shrink-0" />
                      {st.label}
                    </Badge>
                  </div>

                  {/* Row 2: Merchant name */}
                  <p className="text-sm font-bold mb-1">vs. {complaint.merchantName}</p>

                  {/* Row 3: Description truncated */}
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{complaint.description}</p>

                  {/* Row 4: Meta info */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3 shrink-0" />
                      {complaint.isAnonymous ? "Anonymous" : complaint.reporterName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 shrink-0" />
                      {complaint.submittedDate}
                    </span>
                  </div>

                  {/* Row 5: Ref + action hint */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                    <span className="text-xs font-mono text-muted-foreground">{complaint.refNumber}</span>
                    <span className="text-xs text-primary flex items-center gap-0.5 font-medium">
                      View Details <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* ─── Complaint Detail Drawer ─── */}
      <Drawer open={!!selectedComplaint} onOpenChange={(open) => { if (!open) { setSelectedComplaint(null); setShowReasonFor(null); setActionReason(""); resetPenaltyState(); } }}>
        <DrawerContent className="max-h-[92vh]">
          <div className="flex flex-col h-full max-h-[92vh]">
            <DrawerHeader className="pb-2 border-b border-border shrink-0">
              <DrawerTitle className="text-base font-bold flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary shrink-0" />
                Complaint Details
              </DrawerTitle>
            </DrawerHeader>

            {selectedComplaint && (() => {
              const c = selectedComplaint;
              // Re-fetch current state
              const current = complaints.find((x) => x.id === c.id) || c;
              const cat = getCat(current.category);
              const st = statusConfig[current.status];
              const CatIcon = cat?.icon || Flag;
              const StIcon = st.icon;

              return (
                <>
                  <div className="flex-1 overflow-y-auto touch-auto overscroll-contain px-4 py-3 space-y-4">
                    {/* Header badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className={`text-xs h-7 px-2.5 ${cat?.badge || ""} flex items-center gap-1`}>
                        <CatIcon className="h-3.5 w-3.5 shrink-0" />
                        {cat?.label || "Other"}
                      </Badge>
                      <Badge variant="outline" className={`text-xs h-7 px-2.5 ${st.bg} ${st.color} border flex items-center gap-1`}>
                        <StIcon className="h-3.5 w-3.5 shrink-0" />
                        {st.label}
                      </Badge>
                      <span className="text-xs font-mono text-muted-foreground ml-auto">{current.refNumber}</span>
                    </div>

                    {/* Merchant */}
                    <div className="rounded-xl bg-muted/50 border border-border p-3">
                      <p className="text-xs text-muted-foreground mb-1">Reported Merchant</p>
                      <p className="text-sm font-bold">{current.merchantName}</p>
                    </div>

                    {/* Description */}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1.5">Description</p>
                      <p className="text-sm leading-relaxed">{current.description}</p>
                    </div>

                    {/* Reporter info */}
                    <div className="rounded-xl bg-muted/50 border border-border p-3 space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">Reporter</p>
                      {current.isAnonymous ? (
                        <p className="text-sm text-muted-foreground italic">Anonymous report</p>
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span className="text-sm">{current.reporterName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{current.reporterEmail}</span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-muted/50 border border-border p-2.5">
                        <p className="text-xs text-muted-foreground mb-0.5">Submitted</p>
                        <p className="text-sm font-medium">{current.submittedDate}</p>
                      </div>
                      <div className="rounded-xl bg-muted/50 border border-border p-2.5">
                        <p className="text-xs text-muted-foreground mb-0.5">Last Updated</p>
                        <p className="text-sm font-medium">{current.lastUpdated}</p>
                      </div>
                    </div>

                    {/* Assigned to */}
                    {current.assignedTo && (
                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-500/10 border border-blue-300/50">
                        <Eye className="h-4 w-4 text-blue-600 shrink-0" />
                        <span className="text-sm text-blue-700">Assigned to: <strong>{current.assignedTo}</strong></span>
                      </div>
                    )}

                    {/* Resolution notes */}
                    {current.resolutionNotes && (
                      <div className="rounded-xl bg-emerald-500/5 border border-emerald-300/50 p-3">
                        <p className="text-xs font-medium text-emerald-700 mb-1.5">Resolution Notes</p>
                        <p className="text-sm leading-relaxed">{current.resolutionNotes}</p>
                        {current.resolutionDate && (
                          <p className="text-xs text-muted-foreground mt-2">Resolved on {current.resolutionDate}</p>
                        )}
                      </div>
                    )}

                    {/* Timeline */}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Case Timeline</p>
                      <div className="space-y-0">
                        {current.timeline.map((entry, i) => (
                          <div key={i} className="flex gap-3 relative">
                            {/* Vertical line */}
                            {i < current.timeline.length - 1 && (
                              <div className="absolute left-[7px] top-5 bottom-0 w-px bg-border" />
                            )}
                            <div className="h-4 w-4 rounded-full bg-primary/20 border-2 border-primary shrink-0 mt-0.5 z-10" />
                            <div className="pb-4 flex-1 min-w-0">
                              <p className="text-sm">{entry.action}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {entry.date} · {entry.by}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Reason textarea for resolve/dismiss */}
                    {showReasonFor && !showPenalty && (
                      <div className="rounded-xl border border-primary/30 bg-primary/5 p-3 space-y-2">
                        <p className="text-sm font-medium">
                          {showReasonFor === "resolve" ? "Resolution Notes" : "Dismissal Reason"}
                        </p>
                        <Textarea
                          value={actionReason}
                          onChange={(e) => setActionReason(e.target.value)}
                          placeholder={showReasonFor === "resolve" ? "Describe how this was resolved..." : "Explain why this is being dismissed..."}
                          className="min-h-[80px] touch-manipulation"
                        />
                      </div>
                    )}

                    {/* ─── Penalty Panel ─── */}
                    {showPenalty && (
                      <div className="rounded-xl border-2 border-red-400/50 bg-red-500/5 p-3 space-y-3">
                        <div className="flex items-center gap-2">
                          <Gavel className="h-4 w-4 text-red-600 shrink-0" />
                          <p className="text-sm font-bold text-red-700">Penalise Merchant</p>
                        </div>
                        <p className="text-xs text-muted-foreground">Select penalty type for <strong>{current.merchantName}</strong></p>

                        {/* Penalty type selection */}
                        <div className="space-y-2">
                          {(Object.entries(penaltyConfig) as [PenaltyType, typeof penaltyConfig[PenaltyType]][]).map(([key, config]) => {
                            const Icon = config.icon;
                            const isSelected = selectedPenalty === key;
                            return (
                              <button
                                key={key}
                                onClick={() => { setSelectedPenalty(key); setPenaltyDuration(""); setConfirmDeactivate(false); }}
                                className={`w-full text-left p-3 rounded-xl border-2 transition-all touch-manipulation ${
                                  isSelected
                                    ? `${config.bg} ${config.border} ring-1 ring-offset-1`
                                    : "bg-muted/30 border-border hover:bg-muted/50"
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <Icon className={`h-5 w-5 shrink-0 ${isSelected ? config.color : "text-muted-foreground"}`} />
                                  <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-semibold ${isSelected ? config.color : ""}`}>{config.label}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{config.description}</p>
                                  </div>
                                  <div className={`h-5 w-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                                    isSelected ? `${config.border} ${config.bg}` : "border-muted-foreground/30"
                                  }`}>
                                    {isSelected && <div className={`h-2.5 w-2.5 rounded-full ${config.border.replace("border-", "bg-")}`} />}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {/* Duration selector for suspend/ban */}
                        {selectedPenalty && penaltyConfig[selectedPenalty].requiresDuration && (
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-muted-foreground">
                              {selectedPenalty === "suspend" ? "Suspension" : "Ban"} Duration
                            </p>
                            <div className="grid grid-cols-2 gap-1.5">
                              {penaltyDurations.map((d) => (
                                <button
                                  key={d.value}
                                  onClick={() => setPenaltyDuration(d.value)}
                                  className={`h-10 px-3 rounded-lg text-sm font-medium touch-manipulation transition-colors border ${
                                    penaltyDuration === d.value
                                      ? selectedPenalty === "suspend"
                                        ? "bg-orange-500/15 text-orange-700 border-orange-400"
                                        : "bg-red-500/15 text-red-700 border-red-400"
                                      : "bg-muted/30 text-muted-foreground border-border hover:bg-muted/50"
                                  }`}
                                >
                                  {d.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Reason for penalty */}
                        {selectedPenalty && selectedPenalty !== "warning" && (
                          <div className="space-y-1.5">
                            <p className="text-xs font-medium text-muted-foreground">Reason for penalty</p>
                            <Textarea
                              value={penaltyReason}
                              onChange={(e) => setPenaltyReason(e.target.value)}
                              placeholder="Explain the reason for this penalty action..."
                              className="min-h-[70px] touch-manipulation"
                            />
                          </div>
                        )}

                        {/* Deactivate confirmation */}
                        {selectedPenalty === "deactivate" && (
                          <div className="rounded-lg bg-red-600/10 border border-red-500 p-3 space-y-2">
                            <p className="text-xs font-bold text-red-800">⚠️ This action is PERMANENT and IRREVERSIBLE</p>
                            <p className="text-xs text-red-700">The merchant's account and all associated data will be permanently deactivated.</p>
                            <button
                              onClick={() => setConfirmDeactivate(!confirmDeactivate)}
                              className="flex items-center gap-2 h-10 touch-manipulation"
                            >
                              <div className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-colors ${
                                confirmDeactivate ? "bg-red-600 border-red-600" : "border-red-400"
                              }`}>
                                {confirmDeactivate && <CheckCircle className="h-3 w-3 text-white" />}
                              </div>
                              <span className="text-sm text-red-700 font-medium">I understand this cannot be undone</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* ─── Bottom Action Buttons ─── */}
                  <div className="shrink-0 border-t border-border p-4 bg-background space-y-2">
                    {/* Investigation / Resolve / Dismiss — only when penalty panel is NOT open */}
                    {!showPenalty && (
                      <>
                        {current.status === "pending" && !showReasonFor && (
                          <Button
                            className="w-full h-11 touch-manipulation"
                            onClick={() => handleAction(current.id, "investigate")}
                            disabled={processing}
                          >
                            {processing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
                            Start Investigation
                          </Button>
                        )}

                        {(current.status === "pending" || current.status === "investigating") && !showReasonFor && (
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              className="flex-1 h-11 touch-manipulation text-emerald-700 border-emerald-300 hover:bg-emerald-500/10"
                              onClick={() => setShowReasonFor("resolve")}
                            >
                              <CheckCircle className="h-4 w-4 mr-1.5" />
                              Resolve
                            </Button>
                            <Button
                              variant="outline"
                              className="flex-1 h-11 touch-manipulation text-slate-600 border-slate-300 hover:bg-slate-500/10"
                              onClick={() => setShowReasonFor("dismiss")}
                            >
                              <XCircle className="h-4 w-4 mr-1.5" />
                              Dismiss
                            </Button>
                          </div>
                        )}

                        {showReasonFor && (
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              className="flex-1 h-11 touch-manipulation"
                              onClick={() => { setShowReasonFor(null); setActionReason(""); }}
                              disabled={processing}
                            >
                              Cancel
                            </Button>
                            <Button
                              className={`flex-1 h-11 touch-manipulation ${
                                showReasonFor === "resolve" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-slate-600 hover:bg-slate-700"
                              }`}
                              onClick={() => handleAction(current.id, showReasonFor, actionReason)}
                              disabled={!actionReason.trim() || processing}
                            >
                              {processing ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : showReasonFor === "resolve" ? (
                                <CheckCircle className="h-4 w-4 mr-1.5" />
                              ) : (
                                <XCircle className="h-4 w-4 mr-1.5" />
                              )}
                              Confirm {showReasonFor === "resolve" ? "Resolve" : "Dismiss"}
                            </Button>
                          </div>
                        )}

                        {/* Penalise button — available for investigating/resolved cases */}
                        {(current.status === "investigating" || current.status === "resolved") && !showReasonFor && (
                          <Button
                            variant="outline"
                            className="w-full h-11 touch-manipulation text-red-700 border-red-300 hover:bg-red-500/10"
                            onClick={() => setShowPenalty(true)}
                          >
                            <Gavel className="h-4 w-4 mr-2" />
                            Penalise Merchant
                          </Button>
                        )}
                      </>
                    )}

                    {/* Penalty action buttons */}
                    {showPenalty && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1 h-11 touch-manipulation"
                          onClick={resetPenaltyState}
                          disabled={penaltyProcessing}
                        >
                          Cancel
                        </Button>
                        <Button
                          className={`flex-1 h-11 touch-manipulation ${
                            selectedPenalty === "deactivate" ? "bg-red-700 hover:bg-red-800" :
                            selectedPenalty === "ban" ? "bg-red-600 hover:bg-red-700" :
                            selectedPenalty === "suspend" ? "bg-orange-600 hover:bg-orange-700" :
                            "bg-amber-600 hover:bg-amber-700"
                          }`}
                          onClick={() => handlePenalty(current.id)}
                          disabled={
                            !selectedPenalty ||
                            (penaltyConfig[selectedPenalty!]?.requiresDuration && !penaltyDuration) ||
                            (selectedPenalty !== "warning" && !penaltyReason.trim()) ||
                            (selectedPenalty === "deactivate" && !confirmDeactivate) ||
                            penaltyProcessing
                          }
                        >
                          {penaltyProcessing ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Gavel className="h-4 w-4 mr-1.5" />
                          )}
                          Apply Penalty
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export function getComplaintsPendingCount(): number {
  return initialComplaints.filter((c) => c.status === "pending" || c.status === "investigating").length;
}
