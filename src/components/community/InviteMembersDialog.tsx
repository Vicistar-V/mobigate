/**
 * components/community/InviteMembersDialog.tsx
 *
 * 3-tab invite dialog matching the existing UI:
 * Tab 1 — Mobigate Users  : search + checkbox select existing users → send in-app invite
 * Tab 2 — External         : invite non-members via WhatsApp, SMS, Email etc.
 *                            includes community selector + auto-generated message
 * Tab 3 — Share Link       : copy/share a signup link with community links
 */

import { useState, useEffect, useCallback } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button }   from "@/components/ui/button";
import { Input }    from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge }    from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth }  from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Search, Check, Copy, ChevronDown, ChevronUp,
  Send, Loader2, Globe, X, Users, UserPlus, Link2, ArrowLeft,
} from "lucide-react";
import {
  getConnections, connectionTabs,
  type ConnectionCategory, type ConnectionUser,
} from "@/lib/inviteConnections";

const API_BASE = (import.meta.env.VITE_API_URL as string) || "/api";
const APP_URL  = window.location.origin;

interface Community  { id: string; name: string; type?: string; member_count?: number; }
interface MobiUser   { id: string; username: string; name: string; profile_photo?: string; role?: string; }

interface Props {
  open:         boolean;
  onOpenChange: (o: boolean) => void;
  senderName?:  string;
  senderId?:    string;
}

type Tab = "mobigate" | "external" | "link";

// ── Build invite message ────────────────────────────────────────────────────
function buildMessage(
  senderName:    string,
  senderId:      string,
  recipientName: string,
  communities:   Community[],
  customText:    string,
): string {
  const profileLink = `${APP_URL}/profile/${senderId}`;
  const greeting    = recipientName.trim() ? `Hi, ${recipientName.trim()}! ` : "Hi! ";
  let body = `${greeting}${senderName} invites you to join the Mobigate community. Please click on the link below to Sign-Up Now.\n\n👉 ${APP_URL}/register`;
  if (communities.length > 0) {
    body += "\n\nAfter joining, you can also connect with me here:";
    communities.forEach(c => { body += `\n• ${c.name}: ${APP_URL}/community/${c.id}`; });
  }
  if (customText.trim()) body += `\n\n${customText.trim()}`;
  body += `\n\n— ${senderName} (${profileLink})`;
  return body;
}

export const InviteMembersDialog = ({
  open, onOpenChange, senderName: propSenderName, senderId: propSenderId,
}: Props) => {
  const { user }  = useAuth();
  const { toast } = useToast();

  const senderName = propSenderName || user?.fullName || user?.username || "A Mobigate Member";
  const senderId   = propSenderId   || user?.id || "";
  const profileUrl = `${APP_URL}/profile/${senderId}`;
  const signupUrl  = `${APP_URL}/register`;

  const [tab,             setTab]             = useState<Tab>("mobigate");
  // Mobigate Users tab
  const [userSearch,      setUserSearch]      = useState("");
  const [searchResults,   setSearchResults]   = useState<MobiUser[]>([]);
  const [searching,       setSearching]       = useState(false);
  const [selectedUsers,   setSelectedUsers]   = useState<MobiUser[]>([]);
  const [sending,         setSending]         = useState(false);
  // Connections picker (Friends / Followers / Suggested)
  const [showConnections, setShowConnections] = useState(false);
  const [connTab,         setConnTab]         = useState<ConnectionCategory>("friends");
  const [connSearch,      setConnSearch]      = useState("");
  const [mobiMessage,     setMobiMessage]     = useState("");
  // External tab
  const [recipientName,   setRecipientName]   = useState("");
  const [communities,     setCommunities]     = useState<Community[]>([]);
  const [selectedComms,   setSelectedComms]   = useState<Community[]>([]);
  const [commLoading,     setCommLoading]     = useState(false);
  const [commOpen,        setCommOpen]        = useState(false);
  const [customText,      setCustomText]      = useState("");
  const [extStep,         setExtStep]         = useState<"compose"|"share">("compose");
  // Share Link tab
  const [linkComms,       setLinkComms]       = useState<Community[]>([]);
  const [linkCommOpen,    setLinkCommOpen]    = useState(false);
  const [copied,          setCopied]          = useState(false);

  // ── Reset on close ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) {
      setTab("mobigate"); setUserSearch(""); setSearchResults([]);
      setSelectedUsers([]); setMobiMessage(""); setRecipientName("");
      setSelectedComms([]); setCustomText(""); setExtStep("compose");
      setLinkComms([]); setCopied(false); setCommOpen(false); setLinkCommOpen(false);
      setShowConnections(false); setConnTab("friends"); setConnSearch("");
    }
  }, [open]);

  // ── Fetch communities when external/link tab opens ──────────────────────
  useEffect(() => {
    if (!open || (tab !== "external" && tab !== "link")) return;
    if (communities.length > 0) return;
    setCommLoading(true);
    fetch(`${API_BASE}/community/my_communities.php`, { credentials: "include" })
      .then(r => r.ok ? r.json() : [])
      .then((d: any) => setCommunities(Array.isArray(d) ? d : d?.communities || []))
      .catch(() => setCommunities([]))
      .finally(() => setCommLoading(false));
  }, [open, tab]);

  // ── Search Mobigate users ───────────────────────────────────────────────
  const searchUsers = useCallback(async (q: string) => {
    if (q.length < 2) { setSearchResults([]); return; }
    setSearching(true);
    try {
      const res  = await fetch(`${API_BASE}/profile/search.php?q=${encodeURIComponent(q)}&limit=20`, { credentials: "include" });
      const data = await res.json();
      setSearchResults(Array.isArray(data) ? data : data?.users || []);
    } catch { setSearchResults([]); }
    finally { setSearching(false); }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => searchUsers(userSearch), 350);
    return () => clearTimeout(t);
  }, [userSearch, searchUsers]);

  const toggleUser = (u: MobiUser) =>
    setSelectedUsers(prev => prev.find(p => p.id === u.id) ? prev.filter(p => p.id !== u.id) : [...prev, u]);

  // Connections shown in the picker, filtered by the picker's own search box
  const connList: ConnectionUser[] = (() => {
    const list = getConnections(connTab);
    const q = connSearch.trim().toLowerCase();
    if (!q) return list;
    return list.filter(c =>
      c.name.toLowerCase().includes(q) || c.username.toLowerCase().includes(q));
  })();

  const toggleComm = (c: Community) =>
    setSelectedComms(prev => prev.find(p => p.id === c.id) ? prev.filter(p => p.id !== c.id) : [...prev, c]);

  const toggleLinkComm = (c: Community) =>
    setLinkComms(prev => prev.find(p => p.id === c.id) ? prev.filter(p => p.id !== c.id) : [...prev, c]);

  // ── Send in-app invites ─────────────────────────────────────────────────
  const sendMobiInvites = async () => {
    if (!selectedUsers.length) { toast({ title: "Select at least one user", variant: "destructive" }); return; }
    setSending(true);
    try {
      await fetch(`${API_BASE}/notifications/invite.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipient_ids: selectedUsers.map(u => u.id), message: mobiMessage }),
      });
      toast({ title: `Invite sent to ${selectedUsers.length} user${selectedUsers.length > 1 ? "s" : ""}!` });
      onOpenChange(false);
    } catch { toast({ title: "Error sending invites", variant: "destructive" }); }
    finally { setSending(false); }
  };

  // ── Computed values ─────────────────────────────────────────────────────
  const extMessage = buildMessage(senderName, senderId, recipientName, selectedComms, customText);

  const linkText = (() => {
    let t = `Join me on Mobigate! Sign up here: ${signupUrl}`;
    if (linkComms.length > 0) {
      t += "\n\nJoin these communities:";
      linkComms.forEach(c => { t += `\n• ${c.name}: ${APP_URL}/community/${c.id}`; });
    }
    t += `\n\n— ${senderName} (${profileUrl})`;
    return t;
  })();

  const copyLink = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true); toast({ title: "Copied to clipboard!" });
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Share channels ──────────────────────────────────────────────────────
  const shareChannels = (msg: string) => [
    { label:"WhatsApp", icon:"💬", color:"bg-[#25D366] hover:bg-[#1ebe5d] text-white",
      action:()=>window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`,"_blank") },
    { label:"SMS",      icon:"📱", color:"bg-blue-500 hover:bg-blue-600 text-white",
      action:()=>window.open(`sms:?body=${encodeURIComponent(msg)}`,"_blank") },
    { label:"Email",    icon:"✉️", color:"bg-gray-700 hover:bg-gray-800 text-white",
      action:()=>window.open(`mailto:?subject=${encodeURIComponent(senderName+" invites you to Mobigate")}&body=${encodeURIComponent(msg)}`,"_blank") },
    { label:"Twitter/X",icon:"𝕏", color:"bg-black hover:bg-gray-900 text-white",
      action:()=>window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(senderName+" invites you to Mobigate: "+signupUrl)}`,"_blank") },
    { label:"Telegram", icon:"✈️", color:"bg-[#229ED9] hover:bg-[#1a8fbf] text-white",
      action:()=>window.open(`https://t.me/share/url?url=${encodeURIComponent(signupUrl)}&text=${encodeURIComponent(msg)}`,"_blank") },
    { label:"Facebook", icon:"f",  color:"bg-[#1877F2] hover:bg-[#1462cc] text-white",
      action:()=>window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(signupUrl)}`,"_blank") },
    { label:"Mobi-Chat",icon:"💜", color:"bg-purple-600 hover:bg-purple-700 text-white",
      action:()=>{ window.dispatchEvent(new CustomEvent("openMobiChat",{detail:{shareText:msg}})); onOpenChange(false); } },
    { label:"Instagram",icon:"📸", color:"bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 hover:opacity-90 text-white",
      action:()=>{ navigator.clipboard.writeText(msg); toast({title:"Copied!", description:"Paste in your Instagram DM or story."}); } },
  ];

  // ── Community dropdown (shared) ─────────────────────────────────────────
  const CommDropdown = ({
    selected, onToggle, isOpen, setIsOpen, label,
  }: {
    selected: Community[]; onToggle:(c:Community)=>void;
    isOpen: boolean; setIsOpen:(o:boolean)=>void; label: string;
  }) => (
    <div>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {selected.map(c => (
            <Badge key={c.id} className="bg-purple-100 text-purple-700 gap-1 cursor-pointer pr-1.5" onClick={() => onToggle(c)}>
              {c.name}<X className="h-3 w-3" />
            </Badge>
          ))}
        </div>
      )}
      <button type="button" onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm hover:border-purple-400 transition-colors bg-white text-left">
        <span className={selected.length ? "text-gray-900" : "text-gray-400"}>
          {commLoading ? "Loading communities..." : selected.length ? `${selected.length} selected` : label}
        </span>
        {isOpen ? <ChevronUp className="h-4 w-4 text-gray-400"/> : <ChevronDown className="h-4 w-4 text-gray-400"/>}
      </button>
      {isOpen && (
        <div className="mt-1 border-2 border-purple-100 rounded-xl overflow-hidden bg-white shadow-lg max-h-44 overflow-y-auto">
          {commLoading ? (
            <div className="flex items-center justify-center gap-2 py-5 text-sm text-gray-400">
              <Loader2 className="h-4 w-4 animate-spin"/>Loading...
            </div>
          ) : communities.length === 0 ? (
            <div className="py-5 text-center text-sm text-gray-400">
              <Globe className="h-7 w-7 mx-auto mb-1.5 opacity-40"/>No communities yet
            </div>
          ) : communities.map(c => {
            const isSel = selected.some(s => s.id === c.id);
            return (
              <button key={c.id} type="button" onClick={() => onToggle(c)}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left border-b border-gray-50 last:border-0 transition-colors
                  ${isSel ? "bg-purple-50 text-purple-700 font-semibold" : "hover:bg-gray-50 text-gray-700"}`}>
                <div>
                  <span className="font-medium">{c.name}</span>
                  {c.type && <span className="text-xs text-gray-400 ml-2">• {c.type}</span>}
                  {c.member_count !== undefined && <span className="text-xs text-gray-400 ml-1">• {c.member_count} members</span>}
                </div>
                {isSel && <Check className="h-4 w-4 text-purple-600 shrink-0"/>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined} className="max-w-lg w-full p-0 overflow-hidden rounded-2xl max-h-[90vh] flex flex-col">

        <DialogHeader className="px-6 pt-5 pb-0 shrink-0">
          <DialogTitle className="text-lg font-bold">Invite Members</DialogTitle>
        </DialogHeader>

        {/* ── Tab switcher (matching screenshot) ── */}
        <div className="flex gap-1 mx-6 mt-4 bg-gray-100 rounded-xl p-1 shrink-0">
          {([
            ["mobigate","Mobigate Users", <UserPlus className="h-3.5 w-3.5"/>],
            ["external","External",       <Send      className="h-3.5 w-3.5"/>],
            ["link",    "Share Link",     <Link2     className="h-3.5 w-3.5"/>],
          ] as [Tab, string, React.ReactNode][]).map(([t, label, icon]) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all
                ${tab === t ? "bg-white text-purple-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              {icon}{label}
            </button>
          ))}
        </div>

        {/* ── Tab content ── */}
        <div className="flex-1 overflow-y-auto px-6 py-4">

          {/* ══ TAB 1: MOBIGATE USERS ══ */}
          {tab === "mobigate" && showConnections && (
            <div className="space-y-3">
              {/* Picker header */}
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => { setShowConnections(false); setConnSearch(""); }}
                  className="flex items-center gap-1 text-sm font-semibold text-purple-600 hover:text-purple-700">
                  <ArrowLeft className="h-4 w-4"/>Back
                </button>
                <span className="text-sm font-bold text-gray-800 ml-1">Select from Connections</span>
              </div>

              {/* Category chips */}
              <div className="flex gap-1.5 bg-gray-100 rounded-xl p-1">
                {connectionTabs.map(({ key, label }) => (
                  <button key={key} type="button" onClick={() => setConnTab(key)}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all
                      ${connTab === key ? "bg-white text-purple-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                    {label}
                  </button>
                ))}
              </div>

              {/* Picker search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/>
                <Input value={connSearch} onChange={e => setConnSearch(e.target.value)}
                  placeholder={`Search your ${connTab}...`}
                  className="pl-9 rounded-xl border-gray-200 focus-visible:ring-purple-400"/>
              </div>

              {selectedUsers.length > 0 && (
                <p className="text-sm text-purple-600 font-semibold">
                  {selectedUsers.length} selected
                </p>
              )}

              {/* Connections list */}
              <div className="space-y-1 max-h-72 overflow-y-auto">
                {connList.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-6">
                    {connSearch ? "No matches found" : `No ${connTab} yet`}
                  </p>
                )}
                {connList.map(u => {
                  const isSel = selectedUsers.some(s => s.id === u.id);
                  return (
                    <div key={u.id} onClick={() => toggleUser(u)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer border transition-all
                        ${isSel ? "bg-purple-50 border-purple-200" : "border-transparent hover:bg-gray-50"}`}>
                      <div className={`w-5 h-5 rounded flex items-center justify-center border-2 shrink-0 transition-colors
                        ${isSel ? "bg-purple-600 border-purple-600" : "border-gray-300"}`}>
                        {isSel && <Check className="h-3 w-3 text-white"/>}
                      </div>
                      <Avatar className="h-9 w-9 shrink-0">
                        <AvatarImage src={u.profile_photo}/>
                        <AvatarFallback className="bg-purple-100 text-purple-700 text-xs font-bold">
                          {(u.name || u.username || "?").charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{u.name || u.username}</p>
                        <p className="text-xs text-gray-400">@{u.username}{u.role ? ` • ${u.role}` : ""}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Button className="w-full rounded-xl bg-purple-600 hover:bg-purple-700 text-white gap-2"
                onClick={() => { setShowConnections(false); setConnSearch(""); }}>
                <Check className="h-4 w-4"/>
                Done{selectedUsers.length > 0 ? ` (${selectedUsers.length} selected)` : ""}
              </Button>
            </div>
          )}

          {tab === "mobigate" && !showConnections && (
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/>
                <Input
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  placeholder="Search Mobigate users..."
                  className="pl-9 rounded-xl border-gray-200 focus-visible:ring-purple-400"
                />
                {searching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-purple-400"/>}
              </div>

<<<<<<< Updated upstream
              {/* Select from Connections */}
              <Button type="button" variant="outline"
                onClick={() => setShowConnections(true)}
                className="w-full rounded-xl border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 gap-2 font-semibold">
                <Users className="h-4 w-4"/>
                Select from Connections
              </Button>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-gray-100"/>
                <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">or search</span>
                <div className="flex-1 h-px bg-gray-100"/>
              </div>


              {/* Select Community / Group */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  Select Community <span className="text-gray-400 font-normal normal-case">(optional — multiple allowed)</span>
                </label>
                <CommDropdown selected={selectedMobiComms} onToggle={toggleMobiComm}
                  isOpen={mobiCommOpen} setIsOpen={setMobiCommOpen}
                  label="Select community/group to invite to..."/>
                <p className="text-xs text-gray-400 mt-1">
                  Each selected community/group adds its own join link to the invitation.
                </p>
              </div>


=======
>>>>>>> Stashed changes
              {/* Personalized message */}
              <div>
                <p className="text-sm font-bold text-gray-800 mb-2">Personalized Message</p>
                <Textarea
                  value={mobiMessage}
                  onChange={e => setMobiMessage(e.target.value)}
                  placeholder={`You've been invited to join our community on Mobigate! Click the link below to complete your membership application.`}
                  rows={3}
                  className="rounded-xl border-gray-200 focus-visible:ring-purple-400 resize-none text-sm"
                />
              </div>

              {/* Selected users (chips — removable) */}
              {selectedUsers.length > 0 && (
                <div>
                  <p className="text-sm text-purple-600 font-semibold mb-2">
                    {selectedUsers.length} user{selectedUsers.length > 1 ? "s" : ""} selected
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedUsers.map(u => (
                      <Badge key={u.id} onClick={() => toggleUser(u)}
                        className="bg-purple-100 text-purple-700 gap-1 cursor-pointer pr-1.5 hover:bg-purple-200">
                        {u.name || u.username}<X className="h-3 w-3"/>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* User list */}
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-2">
                  {userSearch.length >= 2
                    ? `Results (${searchResults.length})`
                    : "Select members to invite"}
                </p>
                <div className="space-y-1 max-h-56 overflow-y-auto">
                  {searchResults.length === 0 && userSearch.length >= 2 && !searching && (
                    <p className="text-sm text-gray-400 text-center py-4">No users found</p>
                  )}
                  {searchResults.length === 0 && userSearch.length < 2 && (
                    <p className="text-sm text-gray-400 text-center py-4">Type at least 2 characters to search</p>
                  )}
                  {searchResults.map(u => {
                    const isSel = selectedUsers.some(s => s.id === u.id);
                    return (
                      <div key={u.id} onClick={() => toggleUser(u)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer border transition-all
                          ${isSel ? "bg-purple-50 border-purple-200" : "border-transparent hover:bg-gray-50"}`}>
                        <div className={`w-5 h-5 rounded flex items-center justify-center border-2 shrink-0 transition-colors
                          ${isSel ? "bg-purple-600 border-purple-600" : "border-gray-300"}`}>
                          {isSel && <Check className="h-3 w-3 text-white"/>}
                        </div>
                        <Avatar className="h-9 w-9 shrink-0">
                          <AvatarImage src={u.profile_photo}/>
                          <AvatarFallback className="bg-purple-100 text-purple-700 text-xs font-bold">
                            {(u.name || u.username || "?").charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{u.name || u.username}</p>
                          <p className="text-xs text-gray-400">@{u.username}{u.role ? ` • ${u.role}` : ""}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ══ TAB 2: EXTERNAL ══ */}
          {tab === "external" && (
            extStep === "compose" ? (
              <div className="space-y-4">
                {/* Recipient name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    Recipient's First Name <span className="text-gray-400 font-normal normal-case">(optional)</span>
                  </label>
                  <Input value={recipientName} onChange={e => setRecipientName(e.target.value)}
                    placeholder="e.g. John" className="rounded-xl border-gray-200 focus-visible:ring-purple-400"/>
                </div>

                {/* Community select */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    Select Community <span className="text-gray-400 font-normal normal-case">(optional — multiple allowed)</span>
                  </label>
                  <CommDropdown selected={selectedComms} onToggle={toggleComm}
                    isOpen={commOpen} setIsOpen={setCommOpen}
                    label="Select a community or group..."/>
                </div>

                {/* Personalized message */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    Personalized Message <span className="text-gray-400 font-normal normal-case">(optional)</span>
                  </label>
                  <Textarea value={customText} onChange={e => setCustomText(e.target.value)}
                    placeholder="e.g. I've been using Mobigate and it's amazing! You should join too..."
                    rows={2} className="rounded-xl border-gray-200 focus-visible:ring-purple-400 resize-none"/>
                </div>

                {/* Message preview */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Preview</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed max-h-44 overflow-y-auto">
                    {extMessage.split(senderName).map((part, i, arr) =>
                      i < arr.length - 1 ? (
                        <span key={i}>{part}
                          <a href={profileUrl} target="_blank" rel="noreferrer"
                            className="text-purple-600 font-bold underline underline-offset-2">{senderName}</a>
                        </span>
                      ) : <span key={i}>{part}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">ℹ️ Your name links to your profile.</p>
                </div>
              </div>
            ) : (
              /* Share step */
              <div className="space-y-4">
                <div className="bg-purple-50 border border-purple-100 rounded-xl p-3 text-sm text-purple-800 font-medium">
                  ✓ Message ready — choose how to send it:
                </div>
                {typeof navigator !== "undefined" && (navigator as any).share && (
                  <Button className="w-full gap-2 bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={async () => { try { await (navigator as any).share({ title:`${senderName} invites you to Mobigate`, text:extMessage, url:signupUrl }); } catch {} }}>
                    <Send className="h-4 w-4"/>Share via device apps
                  </Button>
                )}
                <div className="grid grid-cols-2 gap-2">
                  {shareChannels(extMessage).map(ch => (
                    <button key={ch.label} onClick={ch.action}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${ch.color}`}>
                      <span className="text-base w-5 text-center">{ch.icon}</span>
                      <span>{ch.label}</span>
                    </button>
                  ))}
                </div>
                <div className="pt-2 border-t border-gray-100 flex gap-2">
                  <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-500 line-clamp-2">
                    {extMessage.substring(0,80)}...
                  </div>
                  <Button size="sm" variant="outline" onClick={() => copyLink(extMessage)}
                    className="shrink-0 rounded-xl border-gray-200 hover:border-purple-400 hover:text-purple-600 px-3 gap-1.5">
                    {copied ? <Check className="h-4 w-4 text-emerald-500"/> : <Copy className="h-4 w-4"/>}
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </div>
            )
          )}

          {/* ══ TAB 3: SHARE LINK ══ */}
          {tab === "link" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Share your Mobigate signup link directly. Optionally include community links so recipients can join specific groups after signing up.
              </p>

              {/* Community select for link */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  Include Community Links <span className="text-gray-400 font-normal normal-case">(optional)</span>
                </label>
                <CommDropdown selected={linkComms} onToggle={toggleLinkComm}
                  isOpen={linkCommOpen} setIsOpen={setLinkCommOpen}
                  label="Select communities to include..."/>
              </div>

              {/* Link preview */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Your Invite Link & Message</label>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
                  {linkText.split(senderName).map((part, i, arr) =>
                    i < arr.length - 1 ? (
                      <span key={i}>{part}
                        <a href={profileUrl} target="_blank" rel="noreferrer"
                          className="text-purple-600 font-bold underline">{senderName}</a>
                      </span>
                    ) : <span key={i}>{part}</span>
                  )}
                </div>
              </div>

              {/* Copy link button */}
              <Button className="w-full gap-2 bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => copyLink(linkText)}>
                {copied ? <Check className="h-4 w-4"/> : <Copy className="h-4 w-4"/>}
                {copied ? "Copied!" : "Copy Link & Message"}
              </Button>

              {/* Share channels */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Or share via:</p>
                <div className="grid grid-cols-2 gap-2">
                  {shareChannels(linkText).map(ch => (
                    <button key={ch.label} onClick={ch.action}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${ch.color}`}>
                      <span className="text-base w-5 text-center">{ch.icon}</span>
                      <span>{ch.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 border-t border-gray-100 shrink-0 flex justify-between gap-3">
          {tab === "mobigate" && (
            <>
              <Button variant="outline" className="rounded-xl" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white gap-2"
                onClick={sendMobiInvites} disabled={sending || !selectedUsers.length}>
                {sending ? <Loader2 className="h-4 w-4 animate-spin"/> : <Send className="h-4 w-4"/>}
                Send Invite{selectedUsers.length > 1 ? "s" : ""}
                {selectedUsers.length > 0 && ` (${selectedUsers.length})`}
              </Button>
            </>
          )}
          {tab === "external" && (
            extStep === "compose" ? (
              <>
                <Button variant="outline" className="rounded-xl" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white gap-2"
                  onClick={() => setExtStep("share")}>
                  <Send className="h-4 w-4"/>Continue to Share
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" className="rounded-xl" onClick={() => setExtStep("compose")}>← Edit</Button>
                <Button variant="outline" className="rounded-xl" onClick={() => onOpenChange(false)}>Done</Button>
              </>
            )
          )}
          {tab === "link" && (
            <Button variant="outline" className="rounded-xl w-full" onClick={() => onOpenChange(false)}>Close</Button>
          )}
        </div>

      </DialogContent>
    </Dialog>
  );
};
