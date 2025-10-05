import { Card } from "@/components/ui/card";

export const AdCard = () => {
  return (
    <Card className="p-4">
      <h3 className="font-semibold text-center mb-4">ADVERTS</h3>
      <div className="space-y-3">
        <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
          <span className="text-sm text-muted-foreground">Ad Space 300x250</span>
        </div>
        <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
          <span className="text-sm text-muted-foreground">Ad Space 300x250</span>
        </div>
      </div>
    </Card>
  );
};
