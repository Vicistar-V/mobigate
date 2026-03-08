import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Building2, Search, Users, MapPin, Star, CheckCircle, Eye, Flag, Shield,
  ShieldCheck, ShieldAlert, ShieldBan, AlertTriangle, Vote, Wallet, FileText,
  Calendar, Hash, Clock, ChevronRight, Loader2, User, ArrowRight, Gavel,
  Ban, ShieldOff, Trash2, Settings, CreditCard, Globe, TrendingUp,
  UserX, MessageSquareWarning, PackageX, ChevronDown,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerBody } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// ─── Mock community data for admin ───
type CommunityStatus = "active" | "inactive" | "suspended" | "flagged";
type CommunityType = "Town Union" | "Club" | "Association" | "Society" | "Group";

interface AdminCommunity {
  id: string;
  name: string;
  type: CommunityType;
  status: CommunityStatus;
  memberCount: number;
  location: string;
  createdDate: string;
  leaderName: string;
  leaderTitle: string;
  logo?: string;
  duesCollected: number;
  walletBalance: number;
  hasConstitution: boolean;
  electionsHeld: number;
  lastElectionDate?: string;
  isVerified: boolean;
}

const mockCommunities: AdminCommunity[] = [
  { id: "c1", name: "Umuahia Progressive Union", type: "Town Union", status: "active", memberCount: 1245, location: "Lagos, Nigeria", createdDate: "2024-03-15", leaderName: "Chief Emeka Obi", leaderTitle: "President", duesCollected: 4500000, walletBalance: 2800000, hasConstitution: true, electionsHeld: 3, lastElectionDate: "2025-11-20", isVerified: true },
  { id: "c2", name: "Lagos Igbo Community", type: "Association", status: "active", memberCount: 2890, location: "Lagos, Nigeria", createdDate: "2023-08-10", leaderName: "Dr. Chika Nwosu", leaderTitle: "Chairman", duesCollected: 8200000, walletBalance: 5100000, hasConstitution: true, electionsHeld: 2, lastElectionDate: "2025-09-14", isVerified: true },
  { id: "c3", name: "Abuja Professional Network", type: "Club", status: "active", memberCount: 567, location: "Abuja, Nigeria", createdDate: "2025-01-20", leaderName: "Engr. Tunde Bakare", leaderTitle: "Coordinator", duesCollected: 1200000, walletBalance: 890000, hasConstitution: true, electionsHeld: 1, lastElectionDate: "2025-06-10", isVerified: true },
  { id: "c4", name: "Delta State Association", type: "Association", status: "flagged", memberCount: 1890, location: "Warri, Nigeria", createdDate: "2024-05-22", leaderName: "Barr. Oghenero Uvie", leaderTitle: "President", duesCollected: 3400000, walletBalance: 450000, hasConstitution: false, electionsHeld: 4, lastElectionDate: "2025-12-01", isVerified: false },
  { id: "c5", name: "Enugu Sports Club", type: "Club", status: "active", memberCount: 340, location: "Enugu, Nigeria", createdDate: "2025-04-10", leaderName: "Coach Ifeanyi Eze", leaderTitle: "Chairman", duesCollected: 600000, walletBalance: 420000, hasConstitution: true, electionsHeld: 1, isVerified: true },
  { id: "c6", name: "Owerri Women's Society", type: "Society", status: "suspended", memberCount: 780, location: "Owerri, Nigeria", createdDate: "2024-11-05", leaderName: "Mrs. Ada Okoro", leaderTitle: "Chairwoman", duesCollected: 1800000, walletBalance: 200000, hasConstitution: true, electionsHeld: 2, lastElectionDate: "2025-07-18", isVerified: false },
  { id: "c7", name: "Port Harcourt Youth Group", type: "Group", status: "active", memberCount: 1120, location: "Port Harcourt, Nigeria", createdDate: "2024-07-30", leaderName: "Comrade Felix Amadi", leaderTitle: "President", duesCollected: 2100000, walletBalance: 1500000, hasConstitution: true, electionsHeld: 2, lastElectionDate: "2026-01-15", isVerified: true },
  { id: "c8", name: "Calabar Cultural Heritage", type: "Town Union", status: "inactive", memberCount: 210, location: "Calabar, Nigeria", createdDate: "2025-06-18", leaderName: "Chief Effiom Bassey", leaderTitle: "Chief Patron", duesCollected: 350000, walletBalance: 180000, hasConstitution: false, electionsHeld: 0, isVerified: false },
  { id: "c9", name: "Kano Traders Association", type: "Association", status: "active", memberCount: 3200, location: "Kano, Nigeria", createdDate: "2023-12-01", leaderName: "Alhaji Musa Danladi", leaderTitle: "Chairman", duesCollected: 9800000, walletBalance: 6200000, hasConstitution: true, electionsHeld: 3, lastElectionDate: "2025-10-05", isVerified: true },
  { id: "c10", name: "Ibadan Scholars Forum", type: "Society", status: "active", memberCount: 450, location: "Ibadan, Nigeria", createdDate: "2025-02-14", leaderName: "Prof. Adeyemi Sola", leaderTitle: "Director", duesCollected: 750000, walletBalance: 600000, hasConstitution: true, electionsHeld: 1, isVerified: true },
];

// ─── Mock applications ───
interface CommunityApplication {
  id: string;
  communityName: string;
  type: CommunityType;
  applicantName: string;
  applicantEmail: string;
  reason: string;
  submittedDate: string;
  memberEstimate: number;
  location: string;
  status: "pending" | "approved" | "rejected";
}

const initialApplications: CommunityApplication[] = [
  { id: "a1", communityName: "Abia State Professionals", type: "Association", applicantName: "Dr. Ngozi Ibe", applicantEmail: "ngozi@email.com", reason: "To unite Abia State professionals in the diaspora for networking and community development.", submittedDate: "2026-02-28", memberEstimate: 200, location: "Lagos, Nigeria", status: "pending" },
  { id: "a2", communityName: "Benin City Alumni Network", type: "Club", applicantName: "Mr. Osaze Igbinoba", applicantEmail: "osaze@email.com", reason: "Alumni of Benin City schools to reconnect and support educational initiatives.", submittedDate: "2026-03-01", memberEstimate: 350, location: "Benin City, Nigeria", status: "pending" },
  { id: "a3", communityName: "Jos Peace Builders", type: "Group", applicantName: "Rev. Danladi Gyang", applicantEmail: "danladi@email.com", reason: "Promoting interfaith dialogue and peaceful coexistence in Plateau State.", submittedDate: "2026-03-05", memberEstimate: 150, location: "Jos, Nigeria", status: "pending" },
];

// ─── Mock complaints data ───
type ComplaintStatus = "pending" | "investigating" | "resolved" | "dismissed" | "penalised";

const communityReportCategories = [
  { value: "financial-mismanagement", label: "Financial Mismanagement", icon: Wallet, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/30", badge: "bg-red-500/15 text-red-700 border-red-300" },
  { value: "election-fraud", label: "Election Fraud", icon: Vote, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/30", badge: "bg-orange-500/15 text-orange-700 border-orange-300" },
  { value: "harassment-abuse", label: "Harassment / Abuse", icon: UserX, color: "text-amber-600", bg: "bg-amber-500/10", border: "border-amber-500/30", badge: "bg-amber-500/15 text-amber-700 border-amber-300" },
  { value: "misrepresentation", label: "Misrepresentation", icon: PackageX, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/30", badge: "bg-purple-500/15 text-purple-700 border-purple-300" },
  { value: "policy-violation", label: "Policy Violation", icon: AlertTriangle, color: "text-pink-500", bg: "bg-pink-500/10", border: "border-pink-500/30", badge: "bg-pink-500/15 text-pink-700 border-pink-300" },
  { value: "other", label: "Other", icon: Flag, color: "text-slate-500", bg: "bg-slate-500/10", border: "border-slate-500/30", badge: "bg-slate-500/15 text-slate-700 border-slate-300" },
];

interface CommunityComplaint {
  id: string;
  refNumber: string;
  communityName: string;
  communityId: string;
  category: string;
  status: ComplaintStatus;
  description: string;
  reporterName: string;
  isAnonymous: boolean;
  submittedDate: string;
  lastUpdated: string;
  resolutionNotes?: string;
  timeline: { date: string; action: string; by: string }[];
}

const initialComplaints: CommunityComplaint[] = [
  { id: "cc1", refNumber: "CRP-2026-0001", communityName: "Delta State Association", communityId: "c4", category: "financial-mismanagement", status: "pending", description: "Alleged misuse of community dues by the executive committee. Over ₦2M unaccounted for in the last quarter.", reporterName: "Anonymous", isAnonymous: true, submittedDate: "2026-03-01", lastUpdated: "2026-03-01", timeline: [{ date: "2026-03-01", action: "Complaint submitted", by: "System" }] },
  { id: "cc2", refNumber: "CRP-2026-0002", communityName: "Owerri Women's Society", communityId: "c6", category: "election-fraud", status: "investigating", description: "The last election results were allegedly manipulated. Multiple members reported discrepancies in vote counts.", reporterName: "Mrs. Chidinma Agu", isAnonymous: false, submittedDate: "2026-02-25", lastUpdated: "2026-03-02", resolutionNotes: "Investigation ongoing, awaiting audit report.", timeline: [{ date: "2026-02-25", action: "Complaint submitted", by: "System" }, { date: "2026-03-02", action: "Investigation opened", by: "Admin-1" }] },
  { id: "cc3", refNumber: "CRP-2026-0003", communityName: "Kano Traders Association", communityId: "c9", category: "harassment-abuse", status: "resolved", description: "A member was verbally abused during a general meeting by an executive member.", reporterName: "Alhaji Ibrahim Yusuf", isAnonymous: false, submittedDate: "2026-02-10", lastUpdated: "2026-02-20", resolutionNotes: "Warning issued to the offending executive. Formal apology rendered.", timeline: [{ date: "2026-02-10", action: "Complaint submitted", by: "System" }, { date: "2026-02-15", action: "Investigation opened", by: "Admin-2" }, { date: "2026-02-20", action: "Resolved — warning issued", by: "Admin-1" }] },
  { id: "cc4", refNumber: "CRP-2026-0004", communityName: "Lagos Igbo Community", communityId: "c2", category: "policy-violation", status: "dismissed", description: "Community allegedly violating platform content guidelines by posting political content.", reporterName: "Anonymous", isAnonymous: true, submittedDate: "2026-01-28", lastUpdated: "2026-02-05", resolutionNotes: "Content reviewed — no violation found. Posts were community-related civic engagement.", timeline: [{ date: "2026-01-28", action: "Complaint submitted", by: "System" }, { date: "2026-02-05", action: "Dismissed — no violation", by: "Admin-1" }] },
  { id: "cc5", refNumber: "CRP-2026-0005", communityName: "Delta State Association", communityId: "c4", category: "misrepresentation", status: "penalised", description: "Community leadership falsely represented membership numbers to qualify for premium features.", reporterName: "Mr. Ese Oghene", isAnonymous: false, submittedDate: "2026-01-15", lastUpdated: "2026-02-01", resolutionNotes: "Verified — membership inflated by 40%. Community flagged and premium access revoked.", timeline: [{ date: "2026-01-15", action: "Complaint submitted", by: "System" }, { date: "2026-01-20", action: "Investigation opened", by: "Admin-3" }, { date: "2026-02-01", action: "Penalised — community flagged", by: "Admin-1" }] },
];

// ─── Settings data ───
interface CommunityPlatformSettings {
  creationFee: number;
  minimumMembers: number;
  electionMinInterval: number; // months
  maxInactivityDays: number;
  requiredConstitution: boolean;
  financialReportingRequired: boolean;
  auditTriggerThreshold: number; // wallet amount
  suspensionMaxDays: number;
}

const defaultSettings: CommunityPlatformSettings = {
  creationFee: 25000,
  minimumMembers: 10,
  electionMinInterval: 12,
  maxInactivityDays: 180,
  requiredConstitution: true,
  financialReportingRequired: true,
  auditTriggerThreshold: 5000000,
  suspensionMaxDays: 365,
};

// ─── Helpers ───
function getStatusConfig(status: CommunityStatus) {
  const configs = {
    active: { label: "Active", icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
    inactive: { label: "Inactive", icon: Clock, color: "text-slate-500", bg: "bg-slate-500/10", border: "border-slate-500/30" },
    suspended: { label: "Suspended", icon: ShieldAlert, color: "text-amber-600", bg: "bg-amber-500/10", border: "border-amber-500/30" },
    flagged: { label: "Flagged", icon: Flag, color: "text-red-600", bg: "bg-red-500/10", border: "border-red-500/30" },
  };
  return configs[status];
}

function getTypeColor(type: CommunityType) {
  const colors: Record<CommunityType, string> = {
    "Town Union": "bg-blue-500/10 text-blue-700 border-blue-300",
    "Club": "bg-emerald-500/10 text-emerald-700 border-emerald-300",
    "Association": "bg-purple-500/10 text-purple-700 border-purple-300",
    "Society": "bg-amber-500/10 text-amber-700 border-amber-300",
    "Group": "bg-pink-500/10 text-pink-700 border-pink-300",
  };
  return colors[type];
}

const formatCurrency = (n: number) => "₦" + n.toLocaleString();

export function getCommunitiesPendingCount() {
  return initialApplications.filter(a => a.status === "pending").length;
}

export function getComplaintsPendingCount() {
  return initialComplaints.filter(c => c.status === "pending" || c.status === "investigating").length;
}

// ═══════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════
export default function ManageCommunitiesPage() {
  const [activeTab, setActiveTab] = useState("all");

  const pendingApps = initialApplications.filter(a => a.status === "pending").length;
  const pendingComplaints = initialComplaints.filter(c => c.status === "pending" || c.status === "investigating").length;

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 mb-1">
          <Building2 className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-bold">Manage Communities</h1>
        </div>
        <p className="text-sm text-muted-foreground">Platform community oversight & regulation</p>
      </div>

      <div className="px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="overflow-x-auto -mx-4 px-4 mb-3">
            <TabsList className="inline-flex w-auto min-w-full h-11 whitespace-nowrap touch-pan-x">
              <TabsTrigger value="all" className="text-xs py-2.5 px-3">
                <Building2 className="h-4 w-4 mr-1" />
                All Communities
              </TabsTrigger>
              <TabsTrigger value="applications" className="text-xs py-2.5 px-3 relative">
                <Users className="h-4 w-4 mr-1" />
                Applications
                {pendingApps > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 min-w-4 text-xs px-1">{pendingApps}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="complaints" className="text-xs py-2.5 px-3 relative">
                <Flag className="h-4 w-4 mr-1" />
                Complaints
                {pendingComplaints > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 min-w-4 text-xs px-1">{pendingComplaints}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-xs py-2.5 px-3">
                <Settings className="h-4 w-4 mr-1" />
                Settings
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="mt-0">
            <AllCommunitiesTab />
          </TabsContent>

          <TabsContent value="applications" className="mt-0">
            <ApplicationsTab />
          </TabsContent>

          <TabsContent value="complaints" className="mt-0">
            <ComplaintsTab />
          </TabsContent>

          <TabsContent value="settings" className="mt-0">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// TAB 1: ALL COMMUNITIES
// ═══════════════════════════════════════════
function AllCommunitiesTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | CommunityStatus>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | CommunityType>("all");
  const [selectedCommunity, setSelectedCommunity] = useState<AdminCommunity | null>(null);

  const filtered = useMemo(() => {
    let list = [...mockCommunities];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.location.toLowerCase().includes(q));
    }
    if (statusFilter !== "all") list = list.filter(c => c.status === statusFilter);
    if (typeFilter !== "all") list = list.filter(c => c.type === typeFilter);
    return list;
  }, [searchQuery, statusFilter, typeFilter]);

  return (
    <>
      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search communities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-11 pl-10 pr-4 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 touch-manipulation"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" style={{ WebkitOverflowScrolling: "touch" }}>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
          <SelectTrigger className={`h-9 w-auto min-w-[90px] max-w-[130px] rounded-full text-xs shrink-0 touch-manipulation ${
            statusFilter === "all" ? "border-primary/30 bg-primary/5" :
            statusFilter === "active" ? "border-emerald-400 bg-emerald-500/10 text-emerald-700" :
            statusFilter === "suspended" ? "border-amber-400 bg-amber-500/10 text-amber-700" :
            statusFilter === "flagged" ? "border-red-400 bg-red-500/10 text-red-700" :
            "border-slate-400 bg-slate-500/10 text-slate-700"
          }`}>
            <ShieldCheck className="h-3.5 w-3.5 mr-1 shrink-0" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">✅ Active</SelectItem>
            <SelectItem value="inactive">⏸ Inactive</SelectItem>
            <SelectItem value="suspended">⚠️ Suspended</SelectItem>
            <SelectItem value="flagged">🚩 Flagged</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as any)}>
          <SelectTrigger className="h-9 w-auto min-w-[100px] max-w-[140px] rounded-full text-xs border-primary/30 bg-primary/5 shrink-0 touch-manipulation">
            <Building2 className="h-3.5 w-3.5 mr-1 shrink-0" />
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Town Union">Town Union</SelectItem>
            <SelectItem value="Club">Club</SelectItem>
            <SelectItem value="Association">Association</SelectItem>
            <SelectItem value="Society">Society</SelectItem>
            <SelectItem value="Group">Group</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <p className="text-xs text-muted-foreground mb-2">
        {filtered.length} communit{filtered.length !== 1 ? "ies" : "y"} found
      </p>

      {/* Community cards */}
      <div className="space-y-2 pb-6">
        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <Building2 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No communities found</p>
            <p className="text-xs text-muted-foreground mt-1">Try changing your filters</p>
          </div>
        ) : (
          filtered.map((community) => (
            <CommunityCard
              key={community.id}
              community={community}
              onClick={() => setSelectedCommunity(community)}
            />
          ))
        )}
      </div>

      {/* Detail drawer */}
      <CommunityDetailDrawer
        community={selectedCommunity}
        onClose={() => setSelectedCommunity(null)}
      />
    </>
  );
}

function CommunityCard({ community, onClick }: { community: AdminCommunity; onClick: () => void }) {
  const statusCfg = getStatusConfig(community.status);

  return (
    <Card
      className={`overflow-hidden cursor-pointer active:scale-[0.98] transition-transform touch-manipulation border-l-4 ${
        community.status === "suspended" ? "border-l-amber-500/60" :
        community.status === "flagged" ? "border-l-red-500/60" :
        community.status === "inactive" ? "border-l-slate-400/60 opacity-70" :
        "border-l-primary/60"
      }`}
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-11 w-11 shrink-0 border-2 border-primary/20 mt-0.5">
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
              {community.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-bold truncate">{community.name}</p>
              {community.isVerified && <CheckCircle className="h-3.5 w-3.5 text-blue-500 shrink-0" />}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{community.leaderName} • {community.leaderTitle}</p>
          </div>
          {community.status !== "active" && (
            <Badge variant="outline" className={`text-xs h-6 px-2 shrink-0 whitespace-nowrap ${
              community.status === "suspended" ? "text-amber-700 border-amber-300 bg-amber-500/10" :
              community.status === "flagged" ? "text-red-700 border-red-300 bg-red-500/10" :
              "text-slate-600 border-slate-300 bg-slate-500/10"
            }`}>
              {community.status === "suspended" ? "⚠️ Suspended" : community.status === "flagged" ? "🚩 Flagged" : "⏸ Inactive"}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2 mt-2.5 flex-wrap">
          <Badge variant="outline" className={`text-xs h-5 px-1.5 ${getTypeColor(community.type)}`}>
            {community.type}
          </Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-0.5">
            <Users className="h-3 w-3 shrink-0" />
            {community.memberCount.toLocaleString()} members
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-0.5">
            <MapPin className="h-3 w-3 shrink-0" />
            {community.location}
          </span>
        </div>

        {/* Compliance indicators */}
        <div className="flex items-center gap-3 mt-2 pt-2 border-t border-border/50">
          <span className={`text-xs font-medium flex items-center gap-1 ${community.hasConstitution ? "text-emerald-600" : "text-red-500"}`}>
            <FileText className="h-3.5 w-3.5 shrink-0" />
            {community.hasConstitution ? "Constitution" : "No Constitution"}
          </span>
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <Vote className="h-3.5 w-3.5 shrink-0" />
            {community.electionsHeld} Election{community.electionsHeld !== 1 ? "s" : ""}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function CommunityDetailDrawer({ community, onClose }: { community: AdminCommunity | null; onClose: () => void }) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [communityStatus, setCommunityStatus] = useState<CommunityStatus>("active");
  const [confirmAction, setConfirmAction] = useState<"suspend" | "flag" | "activate" | null>(null);

  React.useEffect(() => {
    if (community) {
      setCommunityStatus(community.status);
      setConfirmAction(null);
    }
  }, [community?.id]);

  if (!community) return null;

  const statusCfg = getStatusConfig(communityStatus);
  const StatusIcon = statusCfg.icon;

  const handleStatusChange = (action: "suspend" | "flag" | "activate") => {
    const newStatus = action === "activate" ? "active" as CommunityStatus : action === "suspend" ? "suspended" as CommunityStatus : "flagged" as CommunityStatus;
    setCommunityStatus(newStatus);
    setConfirmAction(null);
    toast({
      title: `Community ${action === "activate" ? "Activated" : action === "suspend" ? "Suspended" : "Flagged"}`,
      description: `${community.name} has been ${newStatus}.`,
    });
  };

  return (
    <Drawer open={!!community} onOpenChange={(open) => { if (!open) { onClose(); setConfirmAction(null); } }}>
      <DrawerContent className="max-h-[92vh]">
        <DrawerHeader className="pb-2">
          <DrawerTitle className="text-base">Community Details</DrawerTitle>
        </DrawerHeader>
        <DrawerBody className="overflow-y-auto touch-auto overscroll-contain px-4 pb-8">
          {/* Profile Header */}
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                {community.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-base font-bold truncate">{community.name}</p>
                {community.isVerified && <CheckCircle className="h-4 w-4 text-blue-500 shrink-0" />}
              </div>
              <Badge variant="outline" className={`text-xs mt-1 ${getTypeColor(community.type)}`}>{community.type}</Badge>
              <div className="flex items-center gap-1 mt-1">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{community.location}</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-2 mb-5">
            <StatCard label="Members" value={community.memberCount.toLocaleString()} icon={<Users className="h-4 w-4 text-blue-500" />} />
            <StatCard label="Elections Held" value={community.electionsHeld.toString()} icon={<Vote className="h-4 w-4 text-purple-500" />} />
            <StatCard label="Dues Collected" value={formatCurrency(community.duesCollected)} icon={<Wallet className="h-4 w-4 text-emerald-500" />} highlight />
            <StatCard label="Wallet Balance" value={formatCurrency(community.walletBalance)} icon={<CreditCard className="h-4 w-4 text-amber-500" />} />
          </div>

          {/* Leadership */}
          <div className="rounded-xl border border-border bg-muted/30 p-3 mb-5">
            <p className="text-xs text-muted-foreground mb-1">Leadership</p>
            <p className="text-sm font-bold">{community.leaderName}</p>
            <p className="text-xs text-muted-foreground">{community.leaderTitle}</p>
            {community.lastElectionDate && (
              <p className="text-xs text-muted-foreground mt-1">Last election: {community.lastElectionDate}</p>
            )}
          </div>

          {/* Compliance */}
          <div className="rounded-xl border border-border bg-muted/30 p-3 mb-5">
            <p className="text-xs text-muted-foreground mb-2">Compliance Status</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Constitution Uploaded</span>
                {community.hasConstitution ? (
                  <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-300 text-xs">✅ Yes</Badge>
                ) : (
                  <Badge variant="outline" className="text-red-600 border-red-300 text-xs">❌ No</Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Verified</span>
                {community.isVerified ? (
                  <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-300 text-xs">✅ Verified</Badge>
                ) : (
                  <Badge variant="outline" className="text-amber-600 border-amber-300 text-xs">⏳ Unverified</Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Created</span>
                <span className="text-sm text-muted-foreground">{community.createdDate}</span>
              </div>
            </div>
          </div>

          {/* Status Management */}
          <div className={`rounded-xl border p-3 mb-5 ${statusCfg.bg} ${statusCfg.border}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <StatusIcon className={`h-5 w-5 ${statusCfg.color}`} />
                <div>
                  <p className="text-sm font-bold">Account Status</p>
                  <p className={`text-xs font-semibold ${statusCfg.color}`}>{statusCfg.label}</p>
                </div>
              </div>
              <Badge variant="outline" className={`text-xs ${statusCfg.color} border-current`}>{statusCfg.label}</Badge>
            </div>

            {confirmAction && (
              <div className="rounded-lg bg-background border border-border p-3 mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <p className="text-sm font-semibold">
                    {confirmAction === "activate" ? "Reactivate" : confirmAction === "suspend" ? "Suspend" : "Flag"} {community.name}?
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  {confirmAction === "flag"
                    ? "This community will be flagged for review. Members will be notified."
                    : confirmAction === "suspend"
                    ? "The community will be temporarily restricted from all activities."
                    : "The community will regain full access to all platform features."}
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 h-10 text-xs touch-manipulation" onClick={() => setConfirmAction(null)}>Cancel</Button>
                  <Button
                    size="sm"
                    className={`flex-1 h-10 text-xs touch-manipulation ${
                      confirmAction === "flag" ? "bg-red-600 hover:bg-red-700 text-white" :
                      confirmAction === "suspend" ? "bg-amber-600 hover:bg-amber-700 text-white" :
                      "bg-emerald-600 hover:bg-emerald-700 text-white"
                    }`}
                    onClick={() => handleStatusChange(confirmAction)}
                  >
                    Confirm {confirmAction === "activate" ? "Reactivate" : confirmAction === "suspend" ? "Suspend" : "Flag"}
                  </Button>
                </div>
              </div>
            )}

            {!confirmAction && (
              <div className="flex gap-2">
                {communityStatus !== "active" && (
                  <Button size="sm" className="flex-1 h-10 text-xs bg-emerald-600 hover:bg-emerald-700 text-white touch-manipulation active:scale-[0.97]" onClick={() => setConfirmAction("activate")}>
                    <ShieldCheck className="h-3.5 w-3.5 mr-1" /> Reactivate
                  </Button>
                )}
                {communityStatus !== "suspended" && (
                  <Button size="sm" variant="outline" className="flex-1 h-10 text-xs text-amber-600 border-amber-300 hover:bg-amber-50 touch-manipulation active:scale-[0.97]" onClick={() => setConfirmAction("suspend")}>
                    <ShieldAlert className="h-3.5 w-3.5 mr-1" /> Suspend
                  </Button>
                )}
                {communityStatus !== "flagged" && (
                  <Button size="sm" variant="outline" className="flex-1 h-10 text-xs text-red-600 border-red-300 hover:bg-red-50 touch-manipulation active:scale-[0.97]" onClick={() => setConfirmAction("flag")}>
                    <Flag className="h-3.5 w-3.5 mr-1" /> Flag
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* View Admin Dashboard */}
          <Button
            variant="outline"
            className="w-full h-12 mt-2 touch-manipulation border-primary/30 text-primary hover:bg-primary/5 active:scale-[0.97]"
            onClick={() => { onClose(); navigate(`/community/${community.id}/admin`); }}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Community Admin Dashboard
          </Button>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

// ═══════════════════════════════════════════
// TAB 2: APPLICATIONS
// ═══════════════════════════════════════════
function ApplicationsTab() {
  const { toast } = useToast();
  const [applications, setApplications] = useState(initialApplications);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [processing, setProcessing] = useState<string | null>(null);

  const pending = applications.filter(a => a.status === "pending");

  const handleAction = (id: string, action: "approved" | "rejected") => {
    if (action === "rejected" && !rejectReason.trim()) {
      toast({ title: "Reason Required", description: "Please provide a reason for declining.", variant: "destructive" });
      return;
    }
    setProcessing(id);
    setTimeout(() => {
      setApplications(prev => prev.map(a => a.id === id ? { ...a, status: action } : a));
      setProcessing(null);
      setRejectReason("");
      toast({
        title: action === "approved" ? "Application Approved ✅" : "Application Declined ❌",
        description: `${applications.find(a => a.id === id)?.communityName} has been ${action}.`,
      });
    }, 2000);
  };

  return (
    <ScrollArea className="h-[calc(100vh-220px)]">
      <div className="pb-6 space-y-3">
        {pending.length === 0 ? (
          <div className="py-12 text-center">
            <CheckCircle className="h-12 w-12 text-emerald-500/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No pending applications</p>
          </div>
        ) : (
          pending.map((app) => (
            <Collapsible key={app.id} open={expandedId === app.id} onOpenChange={(open) => { setExpandedId(open ? app.id : null); setRejectReason(""); }}>
              <Card className="overflow-hidden border-l-4 border-l-amber-500/60">
                <CollapsibleTrigger className="w-full text-left">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{app.communityName}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">By {app.applicantName}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <Badge variant="outline" className={`text-xs ${getTypeColor(app.type)}`}>{app.type}</Badge>
                          <span className="text-xs text-muted-foreground">{app.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-xs text-muted-foreground">{app.submittedDate}</span>
                        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${expandedId === app.id ? "rotate-180" : ""}`} />
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="px-3 pb-3 space-y-3">
                    <div className="rounded-lg bg-muted/30 border border-border p-3">
                      <p className="text-xs text-muted-foreground mb-1">Reason for Creation</p>
                      <p className="text-sm">{app.reason}</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> ~{app.memberEstimate} est. members</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {app.location}</span>
                    </div>

                    {/* Reject reason */}
                    <Textarea
                      placeholder="Reason for declining (required if rejecting)..."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="min-h-[60px] text-sm"
                    />

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 h-11 text-xs text-red-600 border-red-300 hover:bg-red-50 touch-manipulation"
                        disabled={!!processing}
                        onClick={() => handleAction(app.id, "rejected")}
                      >
                        {processing === app.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Decline"}
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 h-11 text-xs bg-emerald-600 hover:bg-emerald-700 text-white touch-manipulation"
                        disabled={!!processing}
                        onClick={() => handleAction(app.id, "approved")}
                      >
                        {processing === app.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Approve ✅"}
                      </Button>
                    </div>
                  </div>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))
        )}
      </div>
    </ScrollArea>
  );
}

// ═══════════════════════════════════════════
// TAB 3: COMPLAINTS
// ═══════════════════════════════════════════
function ComplaintsTab() {
  const { toast } = useToast();
  const [complaints, setComplaints] = useState(initialComplaints);
  const [statusFilter, setStatusFilter] = useState<"all" | ComplaintStatus>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedComplaint, setSelectedComplaint] = useState<CommunityComplaint | null>(null);

  const filtered = useMemo(() => {
    let list = [...complaints];
    if (statusFilter !== "all") list = list.filter(c => c.status === statusFilter);
    if (categoryFilter !== "all") list = list.filter(c => c.category === categoryFilter);
    return list;
  }, [complaints, statusFilter, categoryFilter]);

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === "pending").length,
    investigating: complaints.filter(c => c.status === "investigating").length,
    resolved: complaints.filter(c => c.status === "resolved").length,
    dismissed: complaints.filter(c => c.status === "dismissed").length,
    penalised: complaints.filter(c => c.status === "penalised").length,
  };

  const handleStatusChange = (id: string, newStatus: ComplaintStatus, note?: string) => {
    setComplaints(prev => prev.map(c => c.id === id ? {
      ...c,
      status: newStatus,
      lastUpdated: new Date().toISOString().split("T")[0],
      resolutionNotes: note || c.resolutionNotes,
      timeline: [...c.timeline, { date: new Date().toISOString().split("T")[0], action: `Status changed to ${newStatus}${note ? `: ${note}` : ""}`, by: "Admin-1" }],
    } : c));
    setSelectedComplaint(null);
    toast({ title: "Complaint Updated", description: `Status changed to ${newStatus}.` });
  };

  return (
    <>
      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="rounded-xl bg-muted/50 border border-border p-2.5 text-center">
          <p className="text-lg font-bold">{stats.total}</p>
          <p className="text-xs text-muted-foreground">Total</p>
        </div>
        <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-2.5 text-center">
          <p className="text-lg font-bold text-amber-700">{stats.pending}</p>
          <p className="text-xs text-amber-600">Pending</p>
        </div>
        <div className="rounded-xl bg-blue-500/10 border border-blue-500/30 p-2.5 text-center">
          <p className="text-lg font-bold text-blue-700">{stats.investigating}</p>
          <p className="text-xs text-blue-600">Investigating</p>
        </div>
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-2.5 text-center">
          <p className="text-lg font-bold text-emerald-700">{stats.resolved}</p>
          <p className="text-xs text-emerald-600">Resolved</p>
        </div>
        <div className="rounded-xl bg-slate-500/10 border border-slate-500/30 p-2.5 text-center">
          <p className="text-lg font-bold text-slate-700">{stats.dismissed}</p>
          <p className="text-xs text-slate-600">Dismissed</p>
        </div>
        <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-2.5 text-center">
          <p className="text-lg font-bold text-red-700">{stats.penalised}</p>
          <p className="text-xs text-red-600">Penalised</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" style={{ WebkitOverflowScrolling: "touch" }}>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
          <SelectTrigger className="h-9 w-auto min-w-[100px] max-w-[140px] rounded-full text-xs shrink-0 touch-manipulation border-primary/30 bg-primary/5">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">⏳ Pending</SelectItem>
            <SelectItem value="investigating">🔍 Investigating</SelectItem>
            <SelectItem value="resolved">✅ Resolved</SelectItem>
            <SelectItem value="dismissed">❌ Dismissed</SelectItem>
            <SelectItem value="penalised">⚖️ Penalised</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="h-9 w-auto min-w-[110px] max-w-[160px] rounded-full text-xs shrink-0 touch-manipulation border-primary/30 bg-primary/5">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {communityReportCategories.map(cat => (
              <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Complaint cards */}
      <div className="space-y-2 pb-6">
        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <Flag className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No complaints found</p>
          </div>
        ) : (
          filtered.map(complaint => {
            const cat = communityReportCategories.find(c => c.value === complaint.category);
            const statusColors: Record<ComplaintStatus, string> = {
              pending: "bg-amber-500/15 text-amber-700 border-amber-300",
              investigating: "bg-blue-500/15 text-blue-700 border-blue-300",
              resolved: "bg-emerald-500/15 text-emerald-700 border-emerald-300",
              dismissed: "bg-slate-500/15 text-slate-700 border-slate-300",
              penalised: "bg-red-500/15 text-red-700 border-red-300",
            };

            return (
              <Card
                key={complaint.id}
                className="overflow-hidden cursor-pointer active:scale-[0.98] transition-transform touch-manipulation"
                onClick={() => setSelectedComplaint(complaint)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      {cat && <Badge variant="outline" className={`text-xs ${cat.badge}`}>{cat.label}</Badge>}
                      <Badge variant="outline" className={`text-xs ${statusColors[complaint.status]}`}>{complaint.status}</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">{complaint.refNumber}</span>
                  </div>
                  <p className="text-sm font-bold">{complaint.communityName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{complaint.description}</p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {complaint.isAnonymous ? "Anonymous" : complaint.reporterName}
                    </span>
                    <span className="text-xs text-muted-foreground">{complaint.submittedDate}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Complaint detail drawer */}
      <ComplaintDetailDrawer
        complaint={selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
        onStatusChange={handleStatusChange}
      />
    </>
  );
}

function ComplaintDetailDrawer({ complaint, onClose, onStatusChange }: {
  complaint: CommunityComplaint | null;
  onClose: () => void;
  onStatusChange: (id: string, status: ComplaintStatus, note?: string) => void;
}) {
  const [resolutionNote, setResolutionNote] = useState("");
  const [processing, setProcessing] = useState(false);

  if (!complaint) return null;

  const cat = communityReportCategories.find(c => c.value === complaint.category);

  const handleAction = (status: ComplaintStatus) => {
    if ((status === "resolved" || status === "dismissed") && !resolutionNote.trim()) {
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      onStatusChange(complaint.id, status, resolutionNote || undefined);
      setProcessing(false);
      setResolutionNote("");
    }, 2000);
  };

  return (
    <Drawer open={!!complaint} onOpenChange={(open) => { if (!open) { onClose(); setResolutionNote(""); } }}>
      <DrawerContent className="max-h-[92vh]">
        <DrawerHeader className="pb-2">
          <DrawerTitle className="text-base">Complaint Details</DrawerTitle>
        </DrawerHeader>
        <DrawerBody className="overflow-y-auto touch-auto overscroll-contain px-4 pb-8">
          {/* Ref + badges */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge variant="outline" className="text-xs font-mono">{complaint.refNumber}</Badge>
            {cat && <Badge variant="outline" className={`text-xs ${cat.badge}`}>{cat.label}</Badge>}
          </div>

          {/* Community */}
          <p className="text-base font-bold mb-1">{complaint.communityName}</p>
          <p className="text-sm text-muted-foreground mb-4">{complaint.description}</p>

          {/* Reporter */}
          <div className="rounded-xl border border-border bg-muted/30 p-3 mb-4">
            <p className="text-xs text-muted-foreground mb-1">Reported By</p>
            <p className="text-sm font-medium">{complaint.isAnonymous ? "Anonymous Reporter" : complaint.reporterName}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Submitted: {complaint.submittedDate}</p>
          </div>

          {/* Resolution notes */}
          {complaint.resolutionNotes && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3 mb-4">
              <p className="text-xs text-emerald-700 font-medium mb-1">Resolution Notes</p>
              <p className="text-sm">{complaint.resolutionNotes}</p>
            </div>
          )}

          {/* Timeline */}
          <div className="mb-5">
            <p className="text-sm font-bold mb-2">Timeline</p>
            <div className="space-y-2">
              {complaint.timeline.map((entry, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div>
                    <p className="text-sm">{entry.action}</p>
                    <p className="text-xs text-muted-foreground">{entry.date} • {entry.by}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions — only for non-final statuses */}
          {(complaint.status === "pending" || complaint.status === "investigating") && (
            <div className="space-y-3 pt-3 border-t border-border">
              <Textarea
                placeholder="Resolution notes (required for resolve/dismiss)..."
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                className="min-h-[60px] text-sm"
              />
              <div className="flex gap-2">
                {complaint.status === "pending" && (
                  <Button
                    size="sm"
                    className="flex-1 h-11 text-xs bg-blue-600 hover:bg-blue-700 text-white touch-manipulation"
                    disabled={processing}
                    onClick={() => handleAction("investigating")}
                  >
                    {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : "🔍 Investigate"}
                  </Button>
                )}
                <Button
                  size="sm"
                  className="flex-1 h-11 text-xs bg-emerald-600 hover:bg-emerald-700 text-white touch-manipulation"
                  disabled={processing || !resolutionNote.trim()}
                  onClick={() => handleAction("resolved")}
                >
                  {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : "✅ Resolve"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 h-11 text-xs text-slate-600 border-slate-300 touch-manipulation"
                  disabled={processing || !resolutionNote.trim()}
                  onClick={() => handleAction("dismissed")}
                >
                  {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : "❌ Dismiss"}
                </Button>
              </div>
            </div>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

// ═══════════════════════════════════════════
// TAB 4: SETTINGS
// ═══════════════════════════════════════════
function SettingsTab() {
  return (
    <ScrollArea className="h-[calc(100vh-220px)]">
      <div className="pb-6 space-y-6">
        <SettingsSection
          title="Community Creation"
          description="Fees and requirements for new communities"
          icon={<Building2 className="h-5 w-5 text-primary shrink-0" />}
          items={[
            { label: "Creation Fee", value: formatCurrency(defaultSettings.creationFee), description: "One-time fee to register a new community" },
            { label: "Minimum Members", value: defaultSettings.minimumMembers.toString(), description: "Required members before community goes active" },
            { label: "Constitution Required", value: defaultSettings.requiredConstitution ? "Yes" : "No", description: "Whether communities must upload a constitution" },
          ]}
        />

        <SettingsSection
          title="Election Regulations"
          description="Platform rules for community elections"
          icon={<Vote className="h-5 w-5 text-primary shrink-0" />}
          items={[
            { label: "Minimum Interval", value: `${defaultSettings.electionMinInterval} months`, description: "Minimum gap between elections" },
          ]}
        />

        <SettingsSection
          title="Financial Compliance"
          description: "Reporting requirements and audit triggers"
          icon={<Wallet className="h-5 w-5 text-primary shrink-0" />}
          items={[
            { label: "Financial Reporting", value: defaultSettings.financialReportingRequired ? "Required" : "Optional", description: "Whether communities must submit financial reports" },
            { label: "Audit Trigger", value: formatCurrency(defaultSettings.auditTriggerThreshold), description: "Wallet balance that triggers automatic audit review" },
          ]}
        />

        <SettingsSection
          title="Suspension & Deactivation"
          description="Rules for community penalties"
          icon={<ShieldAlert className="h-5 w-5 text-primary shrink-0" />}
          items={[
            { label: "Max Inactivity", value: `${defaultSettings.maxInactivityDays} days`, description: "Days before auto-marking as inactive" },
            { label: "Max Suspension", value: `${defaultSettings.suspensionMaxDays} days`, description: "Maximum suspension duration" },
          ]}
        />
      </div>
    </ScrollArea>
  );
}

function SettingsSection({ title, description, icon, items }: {
  title: string;
  description: string;
  icon: React.ReactNode;
  items: { label: string; value: string; description: string }[];
}) {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");

  const handleUnlock = () => {
    if (password.trim()) {
      setUnlocked(true);
    }
  };

  return (
    <Collapsible onOpenChange={(open) => { if (!open) { setUnlocked(false); setPassword(""); } }}>
      <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
        {icon}
        <div className="flex-1">
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        {!unlocked ? (
          <div className="p-3 mt-2 rounded-lg border border-border bg-muted/30">
            <p className="text-xs text-muted-foreground mb-2">Enter admin password to view settings</p>
            <div className="flex gap-2">
              <Input
                type="password"
                placeholder="Password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
                className="h-10 text-sm flex-1"
              />
              <Button size="sm" className="h-10 px-4 touch-manipulation" onClick={handleUnlock}>Unlock</Button>
            </div>
          </div>
        ) : (
          <div className="mt-2 space-y-2">
            {items.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                <Badge variant="secondary" className="text-sm font-bold shrink-0">{item.value}</Badge>
              </div>
            ))}
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}

// ─── Shared StatCard ───
function StatCard({ label, value, icon, highlight }: { label: string; value: string; icon: React.ReactNode; highlight?: boolean }) {
  return (
    <div className={`p-3 rounded-xl border ${highlight ? "bg-emerald-500/10 border-emerald-500/20" : "bg-muted/30 border-border"}`}>
      <div className="flex items-center gap-1.5 mb-1">
        {icon}
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className={`text-sm font-bold ${highlight ? "text-emerald-600" : ""}`}>{value}</p>
    </div>
  );
}
