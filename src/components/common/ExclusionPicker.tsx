import { useState, useEffect, useCallback, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Search, Loader2, X, UserMinus, Mail, Phone, UserCircle2, Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

const API_BASE = (import.meta.env.VITE_API_URL as string) || "/api";

/**
 * ExclusionPicker
 * ───────────────
 * Lets a user build a list of people who must NOT see a piece of content,
 * regardless of the audience that's been granted access.
 *
 * Three ways to add an exclusion (per spec):
 *   1. Type a person's NAME → fetches matching Mobigate users to pick from.
 *   2. Enter an EMAIL or PHONE → auto-fetches the connected user(s).
 *   3. Select from your own Friends (same search box surfaces friends too).
 *
 * If nothing is fetched, the typed value can still be added as a manual chip
 * (useful for offline / not-yet-registered contacts the backend can resolve).
 */

export type ExclusionVia = "name" | "email" | "phone" | "friend" | "manual";

export interface ExcludedUser {
  id?: string;
  label: string;          // display name or raw entry
  sublabel?: string;      // @username / email / phone
  avatar?: string;
  via: ExclusionVia;
}

interface SearchUser {
  id: string;
  username?: string;
  name?: string;
  full_name?: string;
  profile_photo?: string;
  email?: string;
  phone?: string;
  is_friend?: boolean;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+]?[\d\s().-]{6,}$/;

const detectVia = (q: string): ExclusionVia => {
  const t = q.trim();
  if (EMAIL_RE.test(t)) return "email";
  if (PHONE_RE.test(t)) return "phone";
  return "name";
};

interface ExclusionPickerProps {
  value: ExcludedUser[];
  onChange: (next: ExcludedUser[]) => void;
  /** Compact mode reduces vertical padding (used inside per-audience accordions). */
  compact?: boolean;
}

export const ExclusionPicker = ({ value, onChange, compact }: ExclusionPickerProps) => {
  const [query, setQuery]       = useState("");
  const [results, setResults]   = useState<SearchUser[]>([]);
  const [searching, setSearching] = useState(false);
  const [open, setOpen]         = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const runSearch = useCallback(async (q: string) => {
    const trimmed = q.trim();
    if (trimmed.length < 2) { setResults([]); return; }
    setSearching(true);
    try {
      // Backend search.php resolves by name, @username, email or phone.
      const res = await fetch(
        `${API_BASE}/profile/search.php?q=${encodeURIComponent(trimmed)}&limit=15`,
        { credentials: "include" },
      );
      const data = await res.json();
      const list: SearchUser[] = Array.isArray(data) ? data : data?.users || [];
      setResults(list);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(query), 350);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, runSearch]);

  const has = (u: ExcludedUser) =>
    value.some(v => (u.id && v.id === u.id) || (!u.id && v.label.toLowerCase() === u.label.toLowerCase()));

  const add = (u: ExcludedUser) => {
    if (has(u)) return;
    onChange([...value, u]);
    setQuery("");
    setResults([]);
    setOpen(false);
  };

  const remove = (u: ExcludedUser) =>
    onChange(value.filter(v => !((u.id && v.id === u.id) || (!u.id && v.label === u.label))));

  const addManual = () => {
    const t = query.trim();
    if (!t) return;
    add({ label: t, via: detectVia(t), sublabel: detectVia(t) === "name" ? undefined : t });
  };

  const viaIcon = (via: ExclusionVia) => {
    switch (via) {
      case "email":  return <Mail className="h-3 w-3" />;
      case "phone":  return <Phone className="h-3 w-3" />;
      case "friend": return <UserCircle2 className="h-3 w-3" />;
      default:       return <UserMinus className="h-3 w-3" />;
    }
  };

  return (
    <div className={cn("space-y-2", compact ? "" : "")}>
      {/* Selected exclusion chips */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((u, i) => (
            <Badge
              key={(u.id || u.label) + i}
              variant="secondary"
              className="gap-1 bg-rose-100 text-rose-700 hover:bg-rose-100 pr-1 max-w-full"
            >
              <span className="shrink-0">{viaIcon(u.via)}</span>
              <span className="truncate">{u.label}</span>
              <button
                type="button"
                onClick={() => remove(u)}
                className="ml-0.5 rounded-full hover:bg-rose-200 p-0.5 shrink-0"
                aria-label={`Remove ${u.label}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addManual(); } }}
          placeholder="Type name, email or phone to exclude…"
          className="pl-8 pr-8 h-9 text-sm bg-white"
        />
        {searching && (
          <Loader2 className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 animate-spin text-rose-400" />
        )}
      </div>

      {/* Results dropdown */}
      {open && query.trim().length >= 2 && (
        <div className="rounded-lg border border-rose-200 bg-white shadow-sm overflow-hidden max-h-52 overflow-y-auto">
          {searching && results.length === 0 ? (
            <div className="flex items-center justify-center gap-2 py-4 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Searching…
            </div>
          ) : results.length > 0 ? (
            results.map(u => {
              const name = u.full_name || u.name || u.username || "Unknown";
              const sub  = u.username ? `@${u.username}` : (u.email || u.phone || "");
              const via: ExclusionVia = u.is_friend ? "friend" : "name";
              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => add({ id: u.id, label: name, sublabel: sub, avatar: u.profile_photo, via })}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-rose-50 transition-colors border-b border-rose-50 last:border-0"
                >
                  <Avatar className="h-7 w-7 shrink-0">
                    <AvatarImage src={u.profile_photo} />
                    <AvatarFallback className="bg-rose-100 text-rose-700 text-[10px] font-bold">
                      {name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-medium leading-tight truncate">{name}</span>
                    {sub && <span className="block text-[11px] text-muted-foreground truncate">{sub}</span>}
                  </span>
                  {u.is_friend && (
                    <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 border-emerald-300 text-emerald-600 shrink-0">
                      Friend
                    </Badge>
                  )}
                  <UserMinus className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                </button>
              );
            })
          ) : (
            <button
              type="button"
              onClick={addManual}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-left text-sm text-rose-700 hover:bg-rose-50"
            >
              <Plus className="h-3.5 w-3.5" />
              Add "<span className="font-semibold truncate max-w-[60%]">{query.trim()}</span>" as exclusion
            </button>
          )}
        </div>
      )}

      <p className="text-[10px] text-muted-foreground leading-snug">
        Excluded people can never view this content — even if they belong to a selected audience.
      </p>
    </div>
  );
};
