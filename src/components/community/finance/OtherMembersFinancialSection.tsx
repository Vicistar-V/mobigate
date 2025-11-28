import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { otherMembersFinancialData } from "@/data/financialData";

export const OtherMembersFinancialSection = () => {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold">Other Members' Financial Summaries</h3>
        <Button size="sm" className="bg-yellow-400 text-black hover:bg-yellow-500">
          View Now
        </Button>
      </div>
      
      <div className="space-y-3">
        {otherMembersFinancialData.map(member => (
          <div key={member.id} className="flex items-center gap-3 p-3 bg-yellow-50 rounded border border-yellow-200">
            <Avatar>
              <AvatarImage src={member.avatar} />
              <AvatarFallback>{member.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-semibold text-sm">{member.name}</div>
              <div className="text-xs text-muted-foreground">{member.registration}</div>
              <div className="flex gap-2 mt-1">
                <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                  Friends
                </Button>
                <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                  Profile
                </Button>
                <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                  View Report
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
