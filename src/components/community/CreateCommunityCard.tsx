import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function CreateCommunityCard() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/create-community");
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden border-2 border-dashed border-primary/30 hover:border-primary/60 bg-card hover:bg-accent/5"
      onClick={handleClick}
    >
      <CardContent className="p-0">
        <div className="h-[280px] flex flex-col items-center justify-center gap-3">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Plus className="h-8 w-8 text-primary" />
          </div>
          <div className="text-center px-4">
            <h3 className="font-semibold text-foreground">Create New</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Start your own community
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
