import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Award, Check } from "lucide-react";
import { AccreditedAdvertiserBadge } from "./AccreditedAdvertiserBadge";

type UserType = "individual" | "accredited";

interface UserTypeSelectorProps {
  selectedType?: UserType;
  onSelectType: (type: UserType) => void;
}

export function UserTypeSelector({ selectedType, onSelectType }: UserTypeSelectorProps) {
  const userTypes = [
    {
      type: "individual" as UserType,
      icon: User,
      title: "Individual Advertiser",
      description: "Create a single advertisement quickly and easily",
      badge: "Quick Start",
      badgeClass: "bg-blue-500 hover:bg-blue-600 text-white"
    },
    {
      type: "accredited" as UserType,
      icon: Award,
      title: "Accredited Advertiser",
      description: "Access Slot Packs with Volume Discounts and premium features",
      badge: "20-35% Discount",
      badgeClass: "bg-green-500 hover:bg-green-600 text-white"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Choose Your Path</h2>
        <p className="text-muted-foreground text-base sm:text-lg">
          Select how you'd like to create your advertisement
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
        {userTypes.map((userType) => {
          const Icon = userType.icon;
          return (
            <Card
              key={userType.type}
              className={`cursor-pointer transition-all hover:shadow-xl ${
                selectedType === userType.type
                  ? "ring-2 ring-primary shadow-xl"
                  : "hover:border-primary/50"
              }`}
              onClick={() => onSelectType(userType.type)}
            >
              <CardContent className="p-6 sm:p-8 space-y-4 sm:space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="p-3 sm:p-4 rounded-lg bg-primary/10">
                      <Icon className="h-7 w-7 sm:h-10 sm:w-10 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg sm:text-2xl">{userType.title}</h3>
                      <Badge className={`mt-2 sm:mt-3 ${userType.badgeClass}`}>
                        {userType.badge}
                      </Badge>
                    </div>
                  </div>
                  {selectedType === userType.type && (
                    <Check className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  )}
                </div>

                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  {userType.description}
                </p>

                {userType.type === "accredited" && (
                  <div className="pt-4 border-t">
                    <AccreditedAdvertiserBadge tier={null} />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
