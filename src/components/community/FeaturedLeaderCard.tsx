import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ExecutiveMember } from "@/data/communityExecutivesData";

interface FeaturedLeaderCardProps {
  leader: ExecutiveMember;
  onClick?: () => void;
}

export const FeaturedLeaderCard = ({ leader, onClick }: FeaturedLeaderCardProps) => {
  const displayImage = leader.communityImageUrl || leader.imageUrl;
  
  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="aspect-[4/5] bg-muted relative">
        <Avatar className="w-full h-full rounded-none">
          <AvatarImage src={displayImage} alt={leader.name} className="object-cover" />
          <AvatarFallback className="rounded-none text-6xl">
            {leader.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </div>
      
      <div className="p-6 text-center bg-gradient-to-b from-card to-muted/20">
        <h2 className="text-2xl font-bold mb-2">{leader.name}</h2>
        <p className="text-lg text-primary font-semibold">
          {leader.position} {leader.tenure}
        </p>
      </div>
    </Card>
  );
};