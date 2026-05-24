import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Users, Search, Globe, MapPin, ChevronRight, Shield, ShieldBan, ShieldAlert,
  Eye, Calendar, Mail, Phone, ArrowLeft, UserCheck, UserX, AlertTriangle,
  Crown, Star, Filter, SortAsc, SortDesc, Activity, Ban, Flag, Clock, Slash,
} from "lucide-react";

// Deterministic moderation history derived from user id
function getModerationHistory(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return {
    blockedBy: h % 9,              // times this user has been blocked by others
    reported: (h >> 3) % 28,       // times reported on platform
    suspended: (h >> 7) % 4,       // prior suspensions
    warnings: (h >> 11) % 6,       // admin warnings issued
    contentRemoved: (h >> 5) % 12, // posts/comments removed
  };
}
import { Header } from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerBody } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Trash2 } from "lucide-react";
import { AdminAuthorizationDialog, AdminAction } from "@/components/admin/AdminAuthorizationDialog";
import { getNigerianStatesForFilter, getCitiesForLGA } from "@/data/nigerianLocationsData";

// Country definitions with flags
const countries = [
  { id: "ng", name: "Nigeria", flag: "🇳🇬" },
  { id: "gh", name: "Ghana", flag: "🇬🇭" },
  { id: "ke", name: "Kenya", flag: "🇰🇪" },
  { id: "za", name: "South Africa", flag: "🇿🇦" },
  { id: "uk", name: "United Kingdom", flag: "🇬🇧" },
  { id: "us", name: "United States", flag: "🇺🇸" },
  { id: "ca", name: "Canada", flag: "🇨🇦" },
  { id: "ae", name: "United Arab Emirates", flag: "🇦🇪" },
];

type UserStatus = "active" | "suspended" | "banned" | "deactivated";
type UserRole = "user" | "merchant" | "community_admin" | "mobigate_admin";

interface PlatformUser {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  avatar: string;
  countryId: string;
  city: string;
  stateName?: string;
  stateId?: string;
  status: UserStatus;
  role: UserRole;
  joinDate: Date;
  lastActive: Date;
  communitiesJoined: number;
  totalTransactions: number;
  isVerified: boolean;
}

// Generate realistic mock users
function generateMockUsers(): PlatformUser[] {
  const nigerianNames = [
    { name: "Adebayo Ogundimu", username: "adebayo_o", city: "Lagos", stateId: "lagos", stateName: "Lagos" },
    { name: "Chidinma Eze", username: "chidinma_e", city: "Enugu", stateId: "enugu", stateName: "Enugu" },
    { name: "Oluwaseun Adeleke", username: "seun_adeleke", city: "Ibadan", stateId: "oyo", stateName: "Oyo" },
    { name: "Fatima Bello", username: "fatima_b", city: "Kano", stateId: "kano", stateName: "Kano" },
    { name: "Emeka Nwosu", username: "emeka_n", city: "Owerri", stateId: "imo", stateName: "Imo" },
    { name: "Ngozi Okafor", username: "ngozi_ok", city: "Abuja", stateId: "abuja", stateName: "FCT Abuja" },
    { name: "Yusuf Ibrahim", username: "yusuf_i", city: "Kaduna", stateId: "kano", stateName: "Kano" },
    { name: "Aisha Mohammed", username: "aisha_m", city: "Jos", stateId: "oyo", stateName: "Oyo" },
    { name: "Chukwuemeka Ani", username: "chukwu_a", city: "Onitsha", stateId: "enugu", stateName: "Enugu" },
    { name: "Blessing Okoro", username: "blessing_o", city: "Port Harcourt", stateId: "rivers", stateName: "Rivers" },
    { name: "Tunde Bakare", username: "tunde_b", city: "Abeokuta", stateId: "oyo", stateName: "Oyo" },
    { name: "Ifeoma Udeh", username: "ifeoma_u", city: "Nsukka", stateId: "enugu", stateName: "Enugu" },
    { name: "Musa Danjuma", username: "musa_d", city: "Maiduguri", stateId: "kano", stateName: "Kano" },
    { name: "Funke Akindele", username: "funke_a", city: "Lagos", stateId: "lagos", stateName: "Lagos" },
    { name: "Obinna Uchenna", username: "obinna_u", city: "Aba", stateId: "imo", stateName: "Imo" },
    { name: "Halima Suleiman", username: "halima_s", city: "Sokoto", stateId: "kano", stateName: "Kano" },
    { name: "Kelechi Iheanacho", username: "kelechi_i", city: "Owerri", stateId: "imo", stateName: "Imo" },
    { name: "Damilola Adesanya", username: "dami_a", city: "Lagos", stateId: "lagos", stateName: "Lagos" },
    { name: "Amaka Nnadi", username: "amaka_n", city: "Awka", stateId: "enugu", stateName: "Enugu" },
    { name: "Saheed Balogun", username: "saheed_b", city: "Ilorin", stateId: "oyo", stateName: "Oyo" },
  ];

  const ghanaianNames = [
    { name: "Kwame Asante", username: "kwame_a", city: "Accra" },
    { name: "Abena Mensah", username: "abena_m", city: "Kumasi" },
    { name: "Kofi Boateng", username: "kofi_b", city: "Takoradi" },
    { name: "Ama Darko", username: "ama_d", city: "Tamale" },
    { name: "Yaw Frimpong", username: "yaw_f", city: "Cape Coast" },
    { name: "Efua Owusu", username: "efua_o", city: "Accra" },
  ];

  const kenyanNames = [
    { name: "Wanjiku Kamau", username: "wanjiku_k", city: "Nairobi" },
    { name: "Odhiambo Otieno", username: "odhiambo_o", city: "Kisumu" },
    { name: "Amina Hassan", username: "amina_h", city: "Mombasa" },
    { name: "Kipchoge Mutai", username: "kipchoge_m", city: "Eldoret" },
    { name: "Nyambura Wangari", username: "nyambura_w", city: "Nakuru" },
  ];

  const saNames = [
    { name: "Thabo Mbeki", username: "thabo_m", city: "Johannesburg" },
    { name: "Nomzamo Dlamini", username: "nomzamo_d", city: "Cape Town" },
    { name: "Sipho Ndlovu", username: "sipho_n", city: "Durban" },
    { name: "Zanele Khumalo", username: "zanele_k", city: "Pretoria" },
  ];

  const ukNames = [
    { name: "James Obi", username: "james_o", city: "London" },
    { name: "Sarah Adeyemi", username: "sarah_a", city: "Manchester" },
    { name: "David Eze", username: "david_e", city: "Birmingham" },
    { name: "Grace Nnamdi", username: "grace_n", city: "Leeds" },
  ];

  const usNames = [
    { name: "Michael Okafor", username: "michael_ok", city: "New York" },
    { name: "Linda Adebisi", username: "linda_a", city: "Houston" },
    { name: "Chris Emenike", username: "chris_e", city: "Atlanta" },
    { name: "Jennifer Nwosu", username: "jennifer_n", city: "Los Angeles" },
    { name: "Daniel Okechukwu", username: "daniel_o", city: "Chicago" },
  ];

  const caNames = [
    { name: "Emmanuel Owusu", username: "emmanuel_o", city: "Toronto" },
    { name: "Rita Akinola", username: "rita_a", city: "Vancouver" },
    { name: "Patrick Mensah", username: "patrick_m", city: "Calgary" },
  ];

  const aeNames = [
    { name: "Hassan Abdullahi", username: "hassan_a", city: "Dubai" },
    { name: "Fatimah Al-Rashid", username: "fatimah_r", city: "Abu Dhabi" },
  ];

  const countryUsers: { countryId: string; users: { name: string; username: string; city: string }[] }[] = [
    { countryId: "ng", users: nigerianNames },
    { countryId: "gh", users: ghanaianNames },
    { countryId: "ke", users: kenyanNames },
    { countryId: "za", users: saNames },
    { countryId: "uk", users: ukNames },
    { countryId: "us", users: usNames },
    { countryId: "ca", users: caNames },
    { countryId: "ae", users: aeNames },
  ];

  const allUsers: PlatformUser[] = [];
  const statuses: UserStatus[] = ["active", "active", "active", "active", "active", "active", "active", "suspended", "banned", "deactivated"];
  const roles: UserRole[] = ["user", "user", "user", "user", "merchant", "community_admin", "user", "user", "mobigate_admin", "user"];

  countryUsers.forEach(({ countryId, users }) => {
    users.forEach((u, idx) => {
      const hash = u.name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
      allUsers.push({
        id: `${countryId}-user-${idx}`,
        name: u.name,
        username: u.username,
        email: `${u.username}@email.com`,
        phone: `+${hash % 900 + 100}${hash % 9000000 + 1000000}`,
        avatar: "",
        countryId,
        city: u.city,
        stateName: (u as any).stateName,
        stateId: (u as any).stateId,
        status: statuses[hash % statuses.length],
        role: roles[hash % roles.length],
        joinDate: new Date(2024, hash % 12, (hash % 28) + 1),
        lastActive: (() => {
          // Distribute lastActive across now → 18 months ago for realistic Online filtering
          const now = Date.now();
          const buckets = [
            0, // now (online)
            1000 * 60 * 5, // 5 min
            1000 * 60 * 30, // 30 min
            1000 * 60 * 60 * 3, // 3h
            1000 * 60 * 60 * 20, // ~yesterday
            1000 * 60 * 60 * 24 * 2, // 2d
            1000 * 60 * 60 * 24 * 5, // 5d
            1000 * 60 * 60 * 24 * 12, // 12d
            1000 * 60 * 60 * 24 * 25, // 25d
            1000 * 60 * 60 * 24 * 60, // 2mo
            1000 * 60 * 60 * 24 * 120, // 4mo
            1000 * 60 * 60 * 24 * 200, // 6.5mo
            1000 * 60 * 60 * 24 * 330, // 11mo
            1000 * 60 * 60 * 24 * 480, // 16mo
          ];
          return new Date(now - buckets[hash % buckets.length]);
        })(),
        communitiesJoined: hash % 8,
        totalTransactions: hash % 200 + 10,
        isVerified: hash % 3 !== 0,
      });
    });
  });

  return allUsers;
}

const mockUsers = generateMockUsers();

const statusConfig: Record<UserStatus, { label: string; color: string; bg: string; border: string }> = {
  active: { label: "Active", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  suspended: { label: "Suspended", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
  banned: { label: "Banned", color: "text-red-700", bg: "bg-red-50", border: "border-red-200" },
  deactivated: { label: "Deactivated", color: "text-muted-foreground", bg: "bg-muted", border: "border-border" },
};

const roleConfig: Record<UserRole, { label: string; icon: React.ElementType }> = {
  user: { label: "User", icon: Users },
  merchant: { label: "Merchant", icon: Star },
  community_admin: { label: "Community Admin", icon: Crown },
  mobigate_admin: { label: "Mobigate Admin", icon: Shield },
};

// Authorising admins for status changes (UI template — deterministic by user id)
const AUTHORISING_ADMINS = ["Amaka Eze", "Tunde Bakare", "Ngozi Okafor", "Chinedu Obi"];
const getAuthorisingAdmin = (userId: string, status: UserStatus): string => {
  let h = 0;
  const seed = `${userId}-${status}`;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return AUTHORISING_ADMINS[h % AUTHORISING_ADMINS.length];
};

export default function ManageUsersPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedOnline, setSelectedOnline] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "name">("newest");
  const [selectedUser, setSelectedUser] = useState<PlatformUser | null>(null);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [authAction, setAuthAction] = useState<AdminAction | null>(null);

  const isNigeria = selectedCountry === "ng";

  // Nigerian states for filter
  const nigerianStates = useMemo(() => getNigerianStatesForFilter(), []);

  // Cities for selected state
  const citiesForState = useMemo(() => {
    if (!isNigeria || selectedState === "all") return [];
    return getCitiesForLGA(undefined, selectedState);
  }, [isNigeria, selectedState]);

  // Country user counts
  const countryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    mockUsers.forEach((u) => {
      counts[u.countryId] = (counts[u.countryId] || 0) + 1;
    });
    return counts;
  }, []);

  const totalUsers = mockUsers.length;

  // Status counts
  const statusCounts = useMemo(() => {
    const base = selectedCountry === "all" ? mockUsers : mockUsers.filter((u) => u.countryId === selectedCountry);
    return {
      active: base.filter((u) => u.status === "active").length,
      suspended: base.filter((u) => u.status === "suspended").length,
      banned: base.filter((u) => u.status === "banned").length,
      deactivated: base.filter((u) => u.status === "deactivated").length,
    };
  }, [selectedCountry]);

  // Online filter helpers — boundaries in ms from now
  const onlineFilterOptions: { value: string; label: string }[] = [
    { value: "all", label: "Any time" },
    { value: "now", label: "Online now" },
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "3d", label: "Last 3 days" },
    { value: "7d", label: "Last 7 days" },
    { value: "1mo", label: "Last month" },
    { value: "3mo", label: "Last 3 months" },
    { value: "6mo", label: "Last 6 months" },
    { value: "12mo", label: "Last 12 months" },
  ];

  const matchesOnlineFilter = (lastActive: Date, key: string): boolean => {
    if (key === "all") return true;
    const ms = Date.now() - lastActive.getTime();
    const MIN = 60 * 1000;
    const HR = 60 * MIN;
    const DAY = 24 * HR;
    switch (key) {
      case "now": return ms <= 5 * MIN;
      case "today": return ms <= DAY;
      case "yesterday": return ms > DAY && ms <= 2 * DAY;
      case "3d": return ms <= 3 * DAY;
      case "7d": return ms <= 7 * DAY;
      case "1mo": return ms <= 30 * DAY;
      case "3mo": return ms <= 90 * DAY;
      case "6mo": return ms <= 180 * DAY;
      case "12mo": return ms <= 365 * DAY;
      default: return true;
    }
  };

  // Filtered users
  const filteredUsers = useMemo(() => {
    let users = [...mockUsers];
    if (selectedCountry !== "all") users = users.filter((u) => u.countryId === selectedCountry);
    if (isNigeria && selectedState !== "all") users = users.filter((u) => u.stateId === selectedState);
    if (isNigeria && selectedCity !== "all") users = users.filter((u) => u.city.toLowerCase() === selectedCity.toLowerCase());
    if (selectedStatus !== "all") users = users.filter((u) => u.status === selectedStatus);
    if (selectedOnline !== "all") users = users.filter((u) => matchesOnlineFilter(u.lastActive, selectedOnline));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      users = users.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.username.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.city.toLowerCase().includes(q)
      );
    }
    users.sort((a, b) => {
      if (sortOrder === "newest") return b.joinDate.getTime() - a.joinDate.getTime();
      if (sortOrder === "oldest") return a.joinDate.getTime() - b.joinDate.getTime();
      return a.name.localeCompare(b.name);
    });
    return users;
  }, [selectedCountry, selectedState, selectedCity, selectedStatus, selectedOnline, searchQuery, sortOrder, isNigeria]);

  const selectedCountryObj = countries.find((c) => c.id === selectedCountry);

  const openUserDetail = (user: PlatformUser) => {
    setSelectedUser(user);
    setDetailDrawerOpen(true);
  };

  const openAuthDialog = (action: AdminAction) => {
    // Close the parent drawer first so the dialog receives focus/pointer events on mobile
    setDetailDrawerOpen(false);
    setTimeout(() => setAuthAction(action), 220);
  };

  const handleAuthConfirm = (payload: { months?: number; authorisers: string[] }) => {
    if (!selectedUser || !authAction) return;
    const titleMap: Record<AdminAction, string> = {
      suspend: "User Suspended",
      ban: "User Banned",
      deactivate: "User Deactivated",
      reactivate: "User Reactivated",
    };
    const duration = payload.months
      ? ` for ${payload.months} month${payload.months === 1 ? "" : "s"}`
      : "";
    const auth = payload.authorisers.length === 1
      ? `Authorised by ${payload.authorisers[0]}.`
      : `Authorised by ${payload.authorisers.join(", ")}.`;
    toast({
      title: titleMap[authAction],
      description: `${selectedUser.name}${duration}. ${auth}`,
    });
    setAuthAction(null);
    setDetailDrawerOpen(false);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <div className="p-4">
        {/* Back + Title */}
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/mobigate-admin")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold">Manage Users</h1>
            <p className="text-xs text-muted-foreground">
              {totalUsers.toLocaleString()} total registered users
            </p>
          </div>
          <Badge variant="secondary" className="text-xs">
            <Activity className="h-3 w-3 mr-1" />
            {statusCounts.active} online
          </Badge>
        </div>

        {/* Country Selector — single dropdown to save space */}
        <div className="mb-4">
          <p className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
            <Globe className="h-3 w-3" /> Filter by Country
          </p>
          <Select
            value={selectedCountry}
            onValueChange={(v) => {
              setSelectedCountry(v);
              setSelectedState("all");
              setSelectedCity("all");
            }}
          >
            <SelectTrigger className="h-10 text-sm font-semibold touch-manipulation">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-50 bg-popover max-h-[60vh]">
              <SelectItem value="all">
                <span className="inline-flex items-center gap-2">
                  <span className="text-base">🌍</span>
                  <span>All Countries</span>
                  <span className="text-muted-foreground">· {totalUsers}</span>
                </span>
              </SelectItem>
              {countries.map((country) => (
                <SelectItem key={country.id} value={country.id}>
                  <span className="inline-flex items-center gap-2">
                    <span className="text-base">{country.flag}</span>
                    <span>{country.name}</span>
                    <span className="text-muted-foreground">· {countryCounts[country.id] || 0}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Summary Row */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {(Object.entries(statusCounts) as [UserStatus, number][]).map(([status, count]) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(selectedStatus === status ? "all" : status)}
              className={`rounded-lg border p-2 text-center transition-all ${
                selectedStatus === status
                  ? `${statusConfig[status].bg} ${statusConfig[status].border} ring-1 ring-primary`
                  : "border-border bg-card"
              }`}
            >
              <p className={`text-lg font-bold ${statusConfig[status].color}`}>{count}</p>
              <p className="text-[10px] text-muted-foreground">{statusConfig[status].label}</p>
            </button>
          ))}
        </div>

        {/* State & City Filters (Nigeria only) */}
        {isNigeria && (
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1 -mx-4 px-4">
            <Select
              value={selectedState}
              onValueChange={(v) => { setSelectedState(v); setSelectedCity("all"); }}
            >
              <SelectTrigger className="h-9 text-xs min-w-[130px] shrink-0">
                <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                <SelectValue placeholder="All States" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {nigerianStates.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedState !== "all" && citiesForState.length > 0 && (
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="h-9 text-xs min-w-[130px] shrink-0">
                  <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                  <SelectValue placeholder="All Cities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {citiesForState.map((c) => (
                    <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )}

        {/* Online / Activity Filter — horizontal pill chips */}
        <div className="mb-3">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 font-semibold flex items-center gap-1">
            <Activity className="h-3 w-3" /> Online
          </p>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 snap-x">
            {onlineFilterOptions.map((opt) => {
              const active = selectedOnline === opt.value;
              const label = opt.value === "now" ? "Now" : opt.label.replace(/^Last\s+/i, "Last ");
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSelectedOnline(opt.value)}
                  className={`snap-start shrink-0 h-8 px-3 rounded-full border text-xs font-semibold whitespace-nowrap transition-colors touch-manipulation ${
                    active
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-card text-foreground border-border hover:bg-muted/60"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search + Sort */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name, username, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>
          <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as typeof sortOrder)}>
            <SelectTrigger className="w-[100px] h-9 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="name">A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        <p className="text-xs text-muted-foreground mb-3">
          {selectedCountryObj ? `${selectedCountryObj.flag} ${selectedCountryObj.name}: ` : ""}
          {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""} found
        </p>

        {/* User List */}
        <ScrollArea className="h-[calc(100vh-460px)]">
          <div className="space-y-2 pb-6">
            {filteredUsers.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium">No users found</p>
                  <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters</p>
                </CardContent>
              </Card>
            ) : (
              filteredUsers.map((user) => {
                const countryObj = countries.find((c) => c.id === user.countryId);
                const RoleIcon = roleConfig[user.role].icon;
                return (
                  <Card
                    key={user.id}
                    className="cursor-pointer active:scale-[0.99] transition-transform"
                    onClick={() => openUserDetail(user)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 shrink-0">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                            {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-semibold truncate">{user.name}</p>
                            {user.isVerified && (
                              <UserCheck className="h-3 w-3 text-blue-500 shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground">@{user.username}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                              {countryObj?.flag} {user.city}
                            </span>
                            <span className="text-[10px] text-muted-foreground">•</span>
                            <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                              <RoleIcon className="h-2.5 w-2.5" />
                              {roleConfig[user.role].label}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <Badge
                            variant="outline"
                            className={`text-[10px] px-1.5 py-0 ${statusConfig[user.status].color} ${statusConfig[user.status].bg} ${statusConfig[user.status].border}`}
                          >
                            {statusConfig[user.status].label}
                          </Badge>
                          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </ScrollArea>
      </div>

      {/* User Detail Drawer */}
      <Drawer open={detailDrawerOpen} onOpenChange={setDetailDrawerOpen}>
        <DrawerContent className="max-h-[90vh]">
          {selectedUser && (
            <>
              <DrawerHeader>
                <DrawerTitle className="text-base">User Details</DrawerTitle>
              </DrawerHeader>
              <DrawerBody>
                <ScrollArea className="h-[70vh]">
                  <div className="space-y-4 pb-6">
                    {/* User Header */}
                    <div className="flex items-center gap-3">
                      <Avatar className="h-14 w-14">
                        <AvatarImage src={selectedUser.avatar} />
                        <AvatarFallback className="text-lg bg-primary/10 text-primary font-bold">
                          {selectedUser.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold">{selectedUser.name}</p>
                          {selectedUser.isVerified && <UserCheck className="h-4 w-4 text-blue-500" />}
                        </div>
                        <p className="text-sm text-muted-foreground">@{selectedUser.username}</p>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          <Badge
                            variant="outline"
                            className={`text-[10px] ${statusConfig[selectedUser.status].color} ${statusConfig[selectedUser.status].bg} ${statusConfig[selectedUser.status].border}`}
                          >
                            {statusConfig[selectedUser.status].label}
                          </Badge>
                          {selectedUser.status !== "active" && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                              <Shield className="h-3 w-3" />
                              <span>
                                Authorisation:{" "}
                                <span className="font-semibold text-foreground">
                                  Admin {getAuthorisingAdmin(selectedUser.id, selectedUser.status)}
                                </span>
                              </span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Contact Info */}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase">Contact</p>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="truncate">{selectedUser.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{selectedUser.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>
                            {countries.find((c) => c.id === selectedUser.countryId)?.flag}{" "}
                            {selectedUser.city},{" "}
                            {countries.find((c) => c.id === selectedUser.countryId)?.name}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Account Info */}
                    <div className="space-y-2.5">
                      <p className="text-sm font-semibold text-muted-foreground uppercase">Account</p>
                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="rounded-lg border p-3">
                          <p className="text-xs text-muted-foreground">Role</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            {React.createElement(roleConfig[selectedUser.role].icon, {
                              className: "h-4 w-4 text-primary",
                            })}
                            <p className="text-base font-semibold">{roleConfig[selectedUser.role].label}</p>
                          </div>
                        </div>
                        <div className="rounded-lg border p-3">
                          <p className="text-xs text-muted-foreground">Joined</p>
                          <p className="text-base font-semibold mt-1">
                            {selectedUser.joinDate.toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="rounded-lg border p-3">
                          <p className="text-xs text-muted-foreground">Communities</p>
                          <p className="text-base font-semibold mt-1">{selectedUser.communitiesJoined}</p>
                        </div>
                        <div className="rounded-lg border p-3">
                          <p className="text-xs text-muted-foreground">Transactions</p>
                          <p className="text-base font-semibold mt-1">{selectedUser.totalTransactions}</p>
                        </div>
                      </div>
                      <div className="rounded-lg border p-3">
                        <p className="text-xs text-muted-foreground">Last Active</p>
                        <p className="text-base font-semibold mt-1">
                          {selectedUser.lastActive.toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    {/* Moderation History */}
                    {(() => {
                      const mh = getModerationHistory(selectedUser.id);
                      const items = [
                        { label: "Blocked by users", value: mh.blockedBy, icon: Slash, tone: "text-slate-700", bg: "bg-slate-50", border: "border-slate-200" },
                        { label: "Reported", value: mh.reported, icon: Flag, tone: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200" },
                        { label: "Suspended", value: mh.suspended, icon: ShieldAlert, tone: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
                        { label: "Warnings", value: mh.warnings, icon: AlertTriangle, tone: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-200" },
                        { label: "Content removed", value: mh.contentRemoved, icon: Ban, tone: "text-red-700", bg: "bg-red-50", border: "border-red-200" },
                      ];
                      return (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-muted-foreground uppercase">Moderation History</p>
                            <span className="text-[10px] text-muted-foreground">Lifetime</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {items.map((it) => (
                              <div key={it.label} className={`rounded-lg border ${it.border} ${it.bg} p-2.5`}>
                                <div className="flex items-center gap-1.5">
                                  <it.icon className={`h-3.5 w-3.5 ${it.tone}`} />
                                  <p className="text-[10px] text-muted-foreground leading-tight">{it.label}</p>
                                </div>
                                <p className={`text-sm font-semibold mt-1 ${it.tone}`}>
                                  {it.value}
                                  <span className="text-[10px] font-normal text-muted-foreground ml-1">
                                    {it.value === 1 ? "time" : "times"}
                                  </span>
                                </p>
                              </div>
                            ))}
                          </div>
                          {mh.reported >= 10 && (
                            <div className="flex items-start gap-1.5 rounded-md border border-orange-200 bg-orange-50 p-2">
                              <AlertTriangle className="h-3.5 w-3.5 text-orange-600 mt-0.5 shrink-0" />
                              <p className="text-[11px] text-orange-800 leading-snug">
                                Frequently reported user — consider reviewing recent activity before action.
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    <Separator />

                    {/* Quick Actions */}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase">Actions</p>
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start text-xs"
                          onClick={() => {
                            navigate(`/profile/${selectedUser.id}`);
                            setDetailDrawerOpen(false);
                          }}
                        >
                          <Eye className="h-3.5 w-3.5 mr-2" />
                          View Full Profile
                        </Button>

                        {selectedUser.status !== "deactivated" && selectedUser.status === "active" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full justify-start text-xs text-amber-600 border-amber-200 hover:bg-amber-50"
                              onClick={() => openAuthDialog("suspend")}
                            >
                              <ShieldAlert className="h-3.5 w-3.5 mr-2" />
                              Suspend User
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full justify-start text-xs text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => openAuthDialog("ban")}
                            >
                              <ShieldBan className="h-3.5 w-3.5 mr-2" />
                              Ban User
                            </Button>
                          </>
                        )}

                        {(selectedUser.status === "suspended" || selectedUser.status === "banned") && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start text-xs text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                            onClick={() => openAuthDialog("reactivate")}
                          >
                            <UserCheck className="h-3.5 w-3.5 mr-2" />
                            Reactivate User
                          </Button>
                        )}

                        {selectedUser.status !== "deactivated" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start text-xs text-red-700 border-red-300 hover:bg-red-50"
                            onClick={() => openAuthDialog("deactivate")}
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-2" />
                            Deactivate User
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>

      {/* Admin Authorisation Dialog */}
      {selectedUser && authAction && (
        <AdminAuthorizationDialog
          open={!!authAction}
          onOpenChange={(v) => !v && setAuthAction(null)}
          action={authAction}
          targetName={selectedUser.name}
          onConfirm={handleAuthConfirm}
        />
      )}
    </div>
  );
}
