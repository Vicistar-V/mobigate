import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserPlus, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ExecutiveMemberCardProps {
  id: string;
  name: string;
  position: string;
  tenure: string;
  imageUrl: string;
  isFriend?: boolean;
  onClick?: () => void;
}

export const ExecutiveMemberCard = ({
  id,
  name,
  position,
  tenure,
  imageUrl,
  isFriend = false,
  onClick,
}: ExecutiveMemberCardProps) => {
  const [requestSent, setRequestSent] = useState(false);
  const [isFriendState, setIsFriendState] = useState(isFriend);
  const { toast } = useToast();

  const handleAddFriend = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFriendState) {
      toast({
        title: "Already Friends",
        description: `You are already friends with ${name}`,
      });
      return;
    }

    setRequestSent(true);
    toast({
      title: "Request Sent",
      description: `Friend request sent to ${name}`,
    });
  };

  const getButtonConfig = () => {
    if (isFriendState) {
      return {
        text: "Friends",
        icon: Check,
        variant: "secondary" as const,
        disabled: true,
      };
    }
    
    if (requestSent) {
      return {
        text: "Request Sent",
        icon: Check,
        variant: "secondary" as const,
        disabled: true,
      };
    }
    
    return {
      text: "Add Friend",
      icon: UserPlus,
      variant: "default" as const,
      disabled: false,
    };
  };

  const buttonConfig = getButtonConfig();
  const ButtonIcon = buttonConfig.icon;

  return (
    <Card 
      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="aspect-[3/4] bg-muted relative">
        <Avatar className="w-full h-full rounded-none">
          <AvatarImage src={imageUrl} alt={name} className="object-cover" />
          <AvatarFallback className="rounded-none text-2xl">
            {name.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </div>
      
      <div className="p-3 space-y-2">
        <Button
          size="sm"
          className="w-full"
          variant={buttonConfig.variant}
          onClick={handleAddFriend}
          disabled={buttonConfig.disabled}
        >
          <ButtonIcon className="h-3.5 w-3.5 mr-1.5" />
          {buttonConfig.text}
        </Button>
        
        <div className="text-center space-y-0.5">
          <h3 className="font-semibold text-sm line-clamp-2">{name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-1">{position}</p>
          <p className="text-xs text-primary font-medium">{tenure}</p>
        </div>
      </div>
    </Card>
  );
};