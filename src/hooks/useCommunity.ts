import { useState, useEffect, useCallback, useRef } from "react";

const API = "/api";

export interface CommunityListItem {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  logoImage?: string;
  type: string;
  memberCount: number;
  createdAt: string;
  isOwner: boolean;
  isMember: boolean;
  role?: string;
  status: string;
  location?: string;
  designation?: string;
}

export function useCommunityList() {
  const [owned,   setOwned]   = useState<CommunityListItem[]>([]);
  const [joined,  setJoined]  = useState<CommunityListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/community/list.php`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load communities");
      const data = await res.json();
      setOwned(data.owned  || []);
      setJoined(data.joined || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch_(); }, [fetch_]);

  return { owned, joined, loading, error, refresh: fetch_ };
}

export function useCommunityProfile(id: string | undefined) {
  const [profile,  setProfile]  = useState<any>(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    if (!id) { setLoading(false); return; }
    setLoading(true);
    setError(null);

    // 10-second timeout so the spinner never hangs forever
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch(`${API}/community/get.php?id=${id}`, {
        credentials: "include",
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (!res.ok) throw new Error(`Community not found (${res.status})`);
      setProfile(await res.json());
    } catch (e: any) {
      clearTimeout(timer);
      setError(e.name === 'AbortError' ? 'Request timed out' : e.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetch_(); }, [fetch_]);
  return { profile, loading, error, refresh: fetch_ };
}

export function useCommunitySettings(communityId: string | undefined) {
  const [data,    setData]    = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetch_ = useCallback(async () => {
    if (!communityId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/community/settings.php?community_id=${communityId}`, { credentials: "include" });
      if (res.ok) setData(await res.json());
    } finally { setLoading(false); }
  }, [communityId]);

  useEffect(() => { fetch_(); }, [fetch_]);

  const vote = async (proposalId: string, vote: "approve" | "disapprove") => {
    await fetch(`${API}/community/settings.php`, {
      method: "POST", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "vote", community_id: communityId, proposal_id: proposalId, vote }),
    });
    fetch_();
  };

  const support = async (recommendationId: string) => {
    await fetch(`${API}/community/settings.php`, {
      method: "POST", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "support", community_id: communityId, recommendation_id: recommendationId }),
    });
    fetch_();
  };

  return { data, loading, vote, support, refresh: fetch_ };
}

export function useCommunityDiscover(search = "", excludeIds: string[] = []) {
  const [communities, setCommunities] = useState<CommunityListItem[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [hasMore,     setHasMore]     = useState(false);
  const [total,       setTotal]       = useState(0);
  const offsetRef = useRef(0);

  const fetchPage = useCallback(async (reset: boolean) => {
    setLoading(true);
    try {
      const offset = reset ? 0 : offsetRef.current;
      const q      = search ? `&search=${encodeURIComponent(search)}` : "";
      const excl   = excludeIds.length ? `&exclude=${encodeURIComponent(excludeIds.join(','))}` : "";
      const res    = await fetch(`${API}/community/discover.php?limit=12&offset=${offset}${q}${excl}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed");
      const data   = await res.json();
      offsetRef.current = reset ? data.communities.length : offsetRef.current + data.communities.length;
      setCommunities(prev => reset ? data.communities : [...prev, ...data.communities]);
      setHasMore(data.hasMore);
      setTotal(data.total);
    } catch { }
    finally { setLoading(false); }
  }, [search, excludeIds.join(',')]);

  useEffect(() => { fetchPage(true); }, [search, excludeIds.join(',')]);

  return { communities, loading, hasMore, total, loadMore: () => fetchPage(false), refresh: () => fetchPage(true) };
}

export function useCommunityMembers(communityId: string | undefined) {
  const [data,    setData]    = useState<{ members: any[]; applications: any[]; totalMembers: number; totalPending: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const fetch_ = useCallback(async () => {
    if (!communityId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/community/manage_members.php?community_id=${communityId}`, { credentials: "include" });
      if (res.ok) setData(await res.json());
    } finally { setLoading(false); }
  }, [communityId]);

  useEffect(() => { fetch_(); }, [fetch_]);

  const approveApplication = async (applicationId: string) => {
    await fetch(`${API}/community/manage_members.php`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "approve_application", community_id: communityId, application_id: applicationId }) });
    fetch_();
  };
  const rejectApplication = async (applicationId: string) => {
    await fetch(`${API}/community/manage_members.php`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "reject_application", community_id: communityId, application_id: applicationId }) });
    fetch_();
  };
  const removeMember = async (userId: string) => {
    await fetch(`${API}/community/manage_members.php`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "remove_member", community_id: communityId, user_id: userId }) });
    fetch_();
  };

  return { data, loading, refresh: fetch_, approveApplication, rejectApplication, removeMember };
}

export async function createCommunity(formData: any): Promise<{ success: boolean; community_id?: string; designation?: string; error?: string }> {
  try {
    const res  = await fetch(`${API}/community/create.php`, {
      method: "POST", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.error || "Failed to create" };
    return data;
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function joinCommunity(communityId: string, applicationData?: any): Promise<{ success: boolean; status?: string; reference_number?: string; error?: string }> {
  try {
    const res  = await fetch(`${API}/community/join.php`, {
      method: "POST", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ community_id: communityId, ...applicationData }),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.error || "Failed" };
    return data;
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function leaveCommunity(communityId: string): Promise<boolean> {
  try {
    const res = await fetch(`${API}/community/leave.php`, {
      method: "POST", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ community_id: communityId }),
    });
    return res.ok;
  } catch { return false; }
}

export async function submitMembershipApplication(communityId: string, form: any): Promise<{ success: boolean; reference_number?: string; error?: string }> {
  try {
    const res  = await fetch(`${API}/community/apply.php`, {
      method: "POST", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ community_id: communityId, ...form }),
    });
    const data = await res.json();
    return res.ok ? data : { success: false, error: data.error };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
