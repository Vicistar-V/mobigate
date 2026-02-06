import { Card } from "@/components/ui/card";

export const FundRaiserHeader = () => {
  return (
    <Card className="p-4 text-center bg-gradient-to-br from-blue-50 to-red-50">
      <div className="space-y-1.5">
        <h1 className="text-xl font-bold">
          <span className="text-blue-600">Mobi</span>
          <span className="text-red-600"> FundRaiser</span>
        </h1>
        <p className="text-sm font-semibold text-muted-foreground">
          MUTUAL SUPPORT CAMPAIGN
        </p>
        <p className="text-xs italic text-red-600">
          "*...Helping when we can is but humanity!*"
        </p>
      </div>
    </Card>
  );
};
