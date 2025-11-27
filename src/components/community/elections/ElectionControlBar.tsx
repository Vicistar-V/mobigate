import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, MessageSquare, MessageCircle, LogOut } from "lucide-react";

interface ElectionControlBarProps {
  isActive?: boolean;
  onMonitorVoting?: () => void;
  onViewComments?: () => void;
  onChatIn?: () => void;
  onExit?: () => void;
}

export const ElectionControlBar = ({
  isActive = true,
  onMonitorVoting,
  onViewComments,
  onChatIn,
  onExit,
}: ElectionControlBarProps) => {
  return (
    <Card className="p-4 mb-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Badge variant={isActive ? "default" : "secondary"} className={isActive ? "bg-green-500" : "bg-red-500"}>
            <span className="w-2 h-2 rounded-full bg-white mr-2 animate-pulse" />
            {isActive ? "Active" : "Inactive"}
          </Badge>
          <span className="text-sm font-medium">Election Process</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onMonitorVoting}
            className="text-xs"
          >
            <Eye className="w-3 h-3 mr-1" />
            Monitor Voting
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={onViewComments}
            className="text-xs"
          >
            <MessageSquare className="w-3 h-3 mr-1" />
            Comments
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={onChatIn}
            className="text-xs"
          >
            <MessageCircle className="w-3 h-3 mr-1" />
            Chat-in
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={onExit}
            className="text-xs"
          >
            <LogOut className="w-3 h-3 mr-1" />
            Exit
          </Button>
        </div>
      </div>
    </Card>
  );
};
