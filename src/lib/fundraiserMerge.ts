import { FundRaiserCampaign, DonorRecord } from "@/data/fundraiserData";

export interface ApiCampaign {
  id: string;
  id_code: string;
  convener_id: string;
  convener_name: string;
  convener_avatar?: string | null;
  title: string;
  description: string;
  target_amount: string | number;
  raised_amount: string | number;
  currency: "USD" | "NGN" | "MOBI";
  minimum_donation: string | number;
  urgency_level: string | null;
  time_frame: string | null;
  media_items: string | null;
  audience: string | null;
  status: string;
  created_at: string;
  donor_count?: number;
}

export interface ApiDonor {
  id: string;
  donor_id: string;
  donor_name: string;
  donor_avatar?: string | null;
  amount: string | number;
  currency: "USD" | "NGN" | "MOBI";
  donated_at: string;
  message?: string | null;
  is_anonymous: number | boolean;
  is_celebrity: number | boolean;
  campaign_id?: string;
  campaign_theme?: string;
}

export function mapApiCampaign(c: ApiCampaign): FundRaiserCampaign {
  let mediaItems: FundRaiserCampaign["mediaItems"] = [];
  try { mediaItems = c.media_items ? JSON.parse(c.media_items) : []; } catch { mediaItems = []; }
  let audience: string[] = [];
  try { audience = c.audience ? JSON.parse(c.audience) : []; } catch { audience = []; }

  return {
    id: c.id,
    idCode: c.id_code,
    convenerName: c.convener_name?.trim() || "Anonymous",
    convenerAvatar: c.convener_avatar || undefined,
    convenerUserId: c.convener_id,
    theme: c.title,
    description: c.description,
    targetAmount: parseFloat(String(c.target_amount)),
    raisedAmount: parseFloat(String(c.raised_amount)),
    currency: c.currency,
    minimumDonation: parseFloat(String(c.minimum_donation)),
    urgencyLevel: c.urgency_level || "Other",
    timeFrame: c.time_frame || undefined,
    mediaItems,
    audience,
    status: (c.status === "active" || c.status === "completed" || c.status === "paused") ? c.status : "active",
    createdAt: c.created_at,
    // Real donor list isn't included in the list endpoint (kept lightweight) —
    // this dummy-length array exists only so `.donors.length` displays correctly.
    donors: Array.from({ length: c.donor_count ?? 0 }) as DonorRecord[],
  };
}

export function mapApiDonor(d: ApiDonor): DonorRecord & { campaignId?: string; campaignTheme?: string } {
  return {
    id: d.id,
    name: d.is_anonymous ? "Anonymous" : (d.donor_name?.trim() || "Member"),
    avatar: d.is_anonymous ? undefined : (d.donor_avatar || undefined),
    amount: parseFloat(String(d.amount)),
    currency: d.currency,
    date: d.donated_at,
    isCelebrity: !!d.is_celebrity,
    message: d.message || undefined,
    campaignId: d.campaign_id,
    campaignTheme: d.campaign_theme,
  };
}
