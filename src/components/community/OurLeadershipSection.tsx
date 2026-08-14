import { useState, useEffect } from "react";
import { Crown, Users } from "lucide-react";

interface Executive {
  user_id: string;
  admin_rank: number;
  username: string;
  profile_photo?: string;
  position?: string;
}

interface OurLeadershipSectionProps {
  communityId: string;
}

export function OurLeadershipSection({ communityId }: OurLeadershipSectionProps) {
  const [executives, setExecutives] = useState<Executive[]>([]);
  const [loading, setLoading] = useState(true);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!communityId) return;
    setLoading(true);
    fetch(`/api/community/leadership.php?action=get_top_executives&community_id=${communityId}`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        console.log("[OurLeadershipSection] executives response:", d);
        setExecutives(d.executives ?? []);
      })
      .catch(() => setExecutives([]))
      .finally(() => setLoading(false));
  }, [communityId]);

  if (!loading && executives.length === 0) return null;

  return (
    <div className="rounded-lg overflow-hidden mb-4">
      <div className="flex items-center gap-2 mb-2 px-0.5">
        <Crown className="h-4 w-4 text-amber-500" />
        <h3 className="font-bold text-sm">Our People, Our Strength</h3>
      </div>

      <div className="flex flex-row gap-2 overflow-x-auto pb-1 h-[220px] sm:h-[260px] touch-pan-x overscroll-x-contain [-webkit-overflow-scrolling:touch] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {loading
          ? [1, 2, 3, 4].map((i) => (
              <div key={i} className="shrink-0 h-full aspect-[3/5] rounded-md bg-muted animate-pulse" />
            ))
          : executives.map((exec) => (
              <div
                key={exec.user_id}
                className="relative shrink-0 h-full aspect-[3/5] rounded-md overflow-hidden bg-muted border border-amber-400/30"
              >
                {exec.profile_photo && !imgErrors[exec.user_id] ? (
                  <img
                    src={exec.profile_photo}
                    alt={exec.username}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    onError={() => {
                      console.warn("[OurLeadershipSection] image failed to load for", exec.username, exec.profile_photo);
                      setImgErrors((prev) => ({ ...prev, [exec.user_id]: true }));
                    }}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-muted">
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}

                {/* Rank 1 (owner) crown badge */}
                {exec.admin_rank === 1 && (
                  <span className="absolute top-1.5 left-1.5 inline-flex items-center justify-center h-6 w-6 rounded-full bg-amber-400 shadow ring-2 ring-white/70">
                    <Crown className="h-3.5 w-3.5 text-white" />
                  </span>
                )}

                {/* Name + role overlay, bottom gradient */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-1.5 pt-4 pb-1.5">
                  <p className="text-[11px] font-bold text-white leading-tight truncate">{exec.username}</p>
                  {exec.position && (
                    <p className="text-[10px] text-white/85 leading-tight truncate">{exec.position}</p>
                  )}
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}