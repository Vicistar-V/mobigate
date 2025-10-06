import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, Users, UsersRound, Heart, Eye } from "lucide-react";

interface PrivacySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const PrivacySelector = ({ value, onChange }: PrivacySelectorProps) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Visible to:</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[160px] h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="z-50 bg-background">
          <SelectItem value="public">
            <div className="flex items-center gap-2">
              <Globe className="h-3 w-3" />
              <span>Public</span>
            </div>
          </SelectItem>
          <SelectItem value="friends">
            <div className="flex items-center gap-2">
              <Users className="h-3 w-3" />
              <span>Friends</span>
            </div>
          </SelectItem>
          <SelectItem value="family">
            <div className="flex items-center gap-2">
              <Heart className="h-3 w-3" />
              <span>Family</span>
            </div>
          </SelectItem>
          <SelectItem value="followers">
            <div className="flex items-center gap-2">
              <UsersRound className="h-3 w-3" />
              <span>Followers</span>
            </div>
          </SelectItem>
          <SelectItem value="only-me">
            <div className="flex items-center gap-2">
              <Eye className="h-3 w-3" />
              <span>Only Me</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
