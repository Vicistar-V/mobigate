import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Users, Search, Globe, MapPin, ChevronRight, Shield, ShieldBan, ShieldAlert,
  Eye, Calendar, Mail, Phone, ArrowLeft, UserCheck, UserX, AlertTriangle,
  Crown, Star, Filter, SortAsc, SortDesc, Activity,
} from "lucide-react";
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
        status: statuses[hash % statuses.length],
        role: roles[hash % roles.length],
        joinDate: new Date(2024, hash % 12, (hash % 28) + 1),
        lastActive: new Date(2026, 2, (hash % 9) + 1),
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

export default function ManageUsersPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "name">("newest");
  const [selectedUser, setSelectedUser] = useState<PlatformUser | null>(null);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);

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

  // Filtered users
  const filteredUsers = useMemo(() => {
    let users = [...mockUsers];
    if (selectedCountry !== "all") users = users.filter((u) => u.countryId === selectedCountry);
    if (selectedStatus !== "all") users = users.filter((u) => u.status === selectedStatus);
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
  }, [selectedCountry, selectedStatus, searchQuery, sortOrder]);

  const selectedCountryObj = countries.find((c) => c.id === selectedCountry);

  const openUserDetail = (user: PlatformUser) => {
    setSelectedUser(user);
    setDetailDrawerOpen(true);
  };

  const handleSuspendUser = (user: PlatformUser) => {
    toast({ title: "User Suspended", description: `${user.name} has been suspended.` });
    setDetailDrawerOpen(false);
  };

  const handleBanUser = (user: PlatformUser) => {
    toast({ title: "User Banned", description: `${user.name} has been banned.` });
    setDetailDrawerOpen(false);
  };

  const handleReactivateUser = (user: PlatformUser) => {
    toast({ title: "User Reactivated", description: `${user.name} has been reactivated.` });
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

        {/* Country Selector Cards - Horizontal scroll */}
        <div className="mb-4">
          <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
            <Globe className="h-3 w-3" /> Filter by Country
          </p>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory">
            {/* All Countries card */}
            <button
              onClick={() => setSelectedCountry("all")}
              className={`snap-start shrink-0 flex flex-col items-center gap-1 rounded-xl border p-3 min-w-[80px] transition-all ${
                selectedCountry === "all"
                  ? "border-primary bg-primary/10 ring-1 ring-primary"
                  : "border-border bg-card hover:bg-muted/50"
              }`}
            >
              <span className="text-xl">🌍</span>
              <span className="text-[10px] font-medium leading-tight text-center">All</span>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 font-bold">
                {totalUsers}
              </Badge>
            </button>

            {countries.map((country) => (
              <button
                key={country.id}
                onClick={() => setSelectedCountry(country.id)}
                className={`snap-start shrink-0 flex flex-col items-center gap-1 rounded-xl border p-3 min-w-[80px] transition-all ${
                  selectedCountry === country.id
                    ? "border-primary bg-primary/10 ring-1 ring-primary"
                    : "border-border bg-card hover:bg-muted/50"
                }`}
              >
                <span className="text-xl">{country.flag}</span>
                <span className="text-[10px] font-medium leading-tight text-center truncate max-w-[60px]">
                  {country.name}
                </span>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 font-bold">
                  {countryCounts[country.id] || 0}
                </Badge>
              </button>
            ))}
          </div>
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
                        <Badge
                          variant="outline"
                          className={`text-[10px] mt-1 ${statusConfig[selectedUser.status].color} ${statusConfig[selectedUser.status].bg} ${statusConfig[selectedUser.status].border}`}
                        >
                          {statusConfig[selectedUser.status].label}
                        </Badge>
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
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase">Account</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-lg border p-2.5">
                          <p className="text-[10px] text-muted-foreground">Role</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            {React.createElement(roleConfig[selectedUser.role].icon, {
                              className: "h-3.5 w-3.5 text-primary",
                            })}
                            <p className="text-sm font-medium">{roleConfig[selectedUser.role].label}</p>
                          </div>
                        </div>
                        <div className="rounded-lg border p-2.5">
                          <p className="text-[10px] text-muted-foreground">Joined</p>
                          <p className="text-sm font-medium mt-0.5">
                            {selectedUser.joinDate.toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="rounded-lg border p-2.5">
                          <p className="text-[10px] text-muted-foreground">Communities</p>
                          <p className="text-sm font-medium mt-0.5">{selectedUser.communitiesJoined}</p>
                        </div>
                        <div className="rounded-lg border p-2.5">
                          <p className="text-[10px] text-muted-foreground">Transactions</p>
                          <p className="text-sm font-medium mt-0.5">{selectedUser.totalTransactions}</p>
                        </div>
                      </div>
                      <div className="rounded-lg border p-2.5">
                        <p className="text-[10px] text-muted-foreground">Last Active</p>
                        <p className="text-sm font-medium mt-0.5">
                          {selectedUser.lastActive.toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

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

                        {selectedUser.status === "active" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full justify-start text-xs text-amber-600 border-amber-200 hover:bg-amber-50"
                              onClick={() => handleSuspendUser(selectedUser)}
                            >
                              <ShieldAlert className="h-3.5 w-3.5 mr-2" />
                              Suspend User
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full justify-start text-xs text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => handleBanUser(selectedUser)}
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
                            onClick={() => handleReactivateUser(selectedUser)}
                          >
                            <UserCheck className="h-3.5 w-3.5 mr-2" />
                            Reactivate User
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
    </div>
  );
}
