import { Card } from "@/components/ui/card";

export const AdCard = () => {
  return (
    <Card className="p-4">
      <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
        <span className="text-sm text-muted-foreground">Ad Space 300x250</span>
      </div>
    </Card>
  );
};
