import { Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AdminRoleBadgeProps {
  adminRole: string;
}

export const AdminRoleBadge = ({ adminRole }: AdminRoleBadgeProps) => {
  return (
    <div className="flex items-center justify-center gap-2 py-2 px-3 bg-primary/10 rounded-lg border border-primary/20">
      <Shield className="h-4 w-4 text-primary" />
      <span className="text-sm font-semibold text-primary">{adminRole}</span>
      <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 text-muted-foreground border-muted-foreground/30">
        Only You See This
      </Badge>
    </div>
  );
};
