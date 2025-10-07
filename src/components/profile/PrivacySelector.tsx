import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, Users, UsersRound, Heart, Eye, Star, ShieldMinus } from "lucide-react";
import { FriendExceptionDialog } from "./FriendExceptionDialog";

interface PrivacySelectorProps {
  value: string;
  onChange: (value: string) => void;
  exceptions?: string[];
  onExceptionsChange?: (exceptions: string[]) => void;
}

export const PrivacySelector = ({ value, onChange, exceptions = [], onExceptionsChange }: PrivacySelectorProps) => {
  const [showExceptionDialog, setShowExceptionDialog] = useState(false);

  const handlePrivacyChange = (newValue: string) => {
    onChange(newValue);
    
    // Open dialog when "All Except" is selected
    if (newValue === "all-except") {
      setShowExceptionDialog(true);
    }
  };

  const handleExceptionsSave = (newExceptions: string[]) => {
    if (onExceptionsChange) {
      onExceptionsChange(newExceptions);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Visible to:</span>
        <Select value={value} onValueChange={handlePrivacyChange}>
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
            <SelectItem value="fans">
              <div className="flex items-center gap-2">
                <Star className="h-3 w-3" />
                <span>Fans</span>
              </div>
            </SelectItem>
            <SelectItem value="all-except">
              <div className="flex items-center gap-2">
                <ShieldMinus className="h-3 w-3" />
                <span>All Except</span>
                {exceptions.length > 0 && (
                  <span className="text-xs text-muted-foreground">({exceptions.length})</span>
                )}
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

      <FriendExceptionDialog
        open={showExceptionDialog}
        onOpenChange={setShowExceptionDialog}
        selectedExceptions={exceptions}
        onSave={handleExceptionsSave}
      />
    </>
  );
};
