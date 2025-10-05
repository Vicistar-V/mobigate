import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

export const WallStatus = () => {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Wall Status</h3>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter Posts
        </Button>
      </div>
    </Card>
  );
};
