import { Globe, Users, Heart, UsersRound, Star, Eye, ShieldMinus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PrivacyLevel } from "@/types/privacy";

interface PrivacyBadgeProps {
  level: PrivacyLevel;
  exceptionsCount?: number;
}

export const PrivacyBadge = ({ level, exceptionsCount = 0 }: PrivacyBadgeProps) => {
  const getPrivacyIcon = () => {
    switch (level) {
      case "public":
        return <Globe className="h-3 w-3" />;
      case "friends":
        return <Users className="h-3 w-3" />;
      case "family":
        return <Heart className="h-3 w-3" />;
      case "followers":
        return <UsersRound className="h-3 w-3" />;
      case "fans":
        return <Star className="h-3 w-3" />;
      case "all-except":
        return <ShieldMinus className="h-3 w-3" />;
      case "only-me":
        return <Eye className="h-3 w-3" />;
      default:
        return <Globe className="h-3 w-3" />;
    }
  };

  const getPrivacyText = () => {
    switch (level) {
      case "public":
        return "Public";
      case "friends":
        return "Friends";
      case "family":
        return "Family";
      case "followers":
        return "Followers";
      case "fans":
        return "Fans";
      case "all-except":
        return `All Except${exceptionsCount > 0 ? ` (${exceptionsCount})` : ""}`;
      case "only-me":
        return "Only Me";
      default:
        return "Public";
    }
  };

  return (
    <Badge variant="outline" className="gap-1 text-base">
      {getPrivacyIcon()}
      <span>{getPrivacyText()}</span>
    </Badge>
  );
};
