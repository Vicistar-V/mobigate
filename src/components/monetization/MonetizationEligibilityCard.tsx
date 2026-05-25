import { Lock, CheckCircle2, Circle, ShieldCheck, Users, UserPlus, UserCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  checkPostMonetizationEligibility,
  postMonetizationEligibilitySettings,
  type MonetizationProfileSnapshot,
  type MonetizationEligibilityCheck,
} from "@/data/monetizationPolicy";

interface MonetizationEligibilityCardProps {
  profile: MonetizationProfileSnapshot;
  /** When eligible, render nothing (caller shows the toggle instead). */
  hideWhenEligible?: boolean;
  className?: string;
}

const reqIcon = (id: MonetizationEligibilityCheck["requirements"][number]["id"]) => {
  switch (id) {
    case "friends":   return Users;
    case "followers": return UserCheck;
    case "following": return UserPlus;
    case "verified":  return ShieldCheck;
  }
};

export const MonetizationEligibilityCard = ({
  profile,
  hideWhenEligible = true,
  className = "",
}: MonetizationEligibilityCardProps) => {
  const navigate = useNavigate();
  const check = checkPostMonetizationEligibility(profile);

  if (hideWhenEligible && check.eligible) return null;

  return (
    <div className={`rounded-xl border-2 border-amber-300 bg-amber-50/60 p-3 sm:p-4 space-y-3 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center shrink-0">
          <Lock className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-sm text-foreground">
            Monetization Locked
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
            Build your audience first. You can charge viewers once you meet all the requirements below.
          </p>
        </div>
      </div>

      {/* Checklist */}
      <ul className="space-y-2">
        {check.requirements.map(r => {
          const Icon = reqIcon(r.id);
          const isNumeric = typeof r.required === "number";
          return (
            <li
              key={r.id}
              className={`flex items-center gap-3 rounded-lg border px-3 py-2 transition-colors ${
                r.met
                  ? "border-emerald-300 bg-emerald-50/70"
                  : "border-amber-200 bg-white"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  r.met ? "bg-emerald-500 text-white" : "bg-amber-100 text-amber-700"
                }`}
              >
                {r.met ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-foreground truncate">{r.label}</p>
                  <span
                    className={`text-[10px] font-bold whitespace-nowrap ${
                      r.met ? "text-emerald-700" : "text-amber-700"
                    }`}
                  >
                    {isNumeric
                      ? `${(r.current as number).toLocaleString()} / ${(r.required as number).toLocaleString()}`
                      : r.met ? "Verified" : "Required"}
                  </span>
                </div>
                {isNumeric ? (
                  <div className="mt-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        r.met ? "bg-emerald-500" : "bg-amber-400"
                      }`}
                      style={{ width: `${r.progressPct}%` }}
                    />
                  </div>
                ) : (
                  !r.met && (
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Verify your identity to unlock creator features.
                    </p>
                  )
                )}
                {r.remainingHint && !r.met && (
                  <p className="text-[10px] text-amber-700 mt-0.5 font-medium">{r.remainingHint}</p>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {/* Action shortcuts */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-9 text-xs"
          onClick={() => navigate("/friends")}
        >
          <Users className="h-3.5 w-3.5 mr-1.5" />
          Find Friends
        </Button>
        {check.requirements.find(r => r.id === "verified" && !r.met) ? (
          <Button
            type="button"
            size="sm"
            className="h-9 text-xs bg-amber-500 hover:bg-amber-600 text-white"
            onClick={() => navigate("/settings?tab=verification")}
          >
            <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
            Verify Now
          </Button>
        ) : (
          <Button
            type="button"
            size="sm"
            className="h-9 text-xs bg-amber-500 hover:bg-amber-600 text-white"
            onClick={() => navigate("/discover")}
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Discover Creators
          </Button>
        )}
      </div>

      <p className="text-[10px] text-muted-foreground italic text-center pt-1 border-t border-amber-200">
        Until then, your posts will be published as <strong>free</strong> content.
        Thresholds set by Mobigate Admin · Friends ≥ {postMonetizationEligibilitySettings.minFriends.toLocaleString()},
        Followers ≥ {postMonetizationEligibilitySettings.minFollowers.toLocaleString()},
        Following ≥ {postMonetizationEligibilitySettings.minFollowing.toLocaleString()}.
      </p>
    </div>
  );
};
