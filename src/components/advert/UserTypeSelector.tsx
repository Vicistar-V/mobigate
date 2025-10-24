import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Award, Check } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { AccreditedAdvertiserBadge } from "./AccreditedAdvertiserBadge";

type UserType = "individual" | "accredited";

interface UserTypeSelectorProps {
  selectedType?: UserType;
  onSelectType: (type: UserType) => void;
}

export function UserTypeSelector({ selectedType, onSelectType }: UserTypeSelectorProps) {
  const isMobile = useIsMobile();

  const userTypes = [
    {
      type: "individual" as UserType,
      icon: User,
      title: "Individual Advertisement",
      description: "Create a single advertisement quickly and easily",
      badge: "Quick Start",
      badgeClass: "bg-blue-500 hover:bg-blue-600 text-white"
    },
    {
      type: "accredited" as UserType,
      icon: Award,
      title: "Accredited Users",
      description: "Access slot packs with volume discounts and premium features",
      badge: "20-35% Discount",
      badgeClass: "bg-green-500 hover:bg-green-600 text-white"
    }
  ];

  if (isMobile) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">Choose Your Path</h2>
          <p className="text-muted-foreground">
            Select how you'd like to create your advertisement
          </p>
        </div>

        <Carousel
          opts={{
            align: "center",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="ml-0">
            {userTypes.map((userType) => {
              const Icon = userType.icon;
              return (
                <CarouselItem key={userType.type} className="pl-0 basis-[90%]">
                  <Card
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedType === userType.type
                        ? "ring-2 ring-primary shadow-lg"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => onSelectType(userType.type)}
                  >
                    <CardContent className="p-8 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-lg bg-primary/10">
                            <Icon className="h-8 w-8 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-bold text-xl">{userType.title}</h3>
                            <Badge className={`mt-2 ${userType.badgeClass}`}>
                              {userType.badge}
                            </Badge>
                          </div>
                        </div>
                        {selectedType === userType.type && (
                          <Check className="h-6 w-6 text-primary" />
                        )}
                      </div>

                      <p className="text-muted-foreground leading-relaxed">
                        {userType.description}
                      </p>

                      {userType.type === "accredited" && (
                        <div className="pt-4 border-t">
                          <AccreditedAdvertiserBadge tier={null} />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Choose Your Path</h2>
        <p className="text-muted-foreground text-lg">
          Select how you'd like to create your advertisement
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {userTypes.map((userType) => {
          const Icon = userType.icon;
          return (
            <Card
              key={userType.type}
              className={`cursor-pointer transition-all hover:shadow-xl ${
                selectedType === userType.type
                  ? "ring-2 ring-primary shadow-xl scale-105"
                  : "hover:border-primary/50 hover:scale-102"
              }`}
              onClick={() => onSelectType(userType.type)}
            >
              <CardContent className="p-8 space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-4 rounded-lg bg-primary/10">
                      <Icon className="h-10 w-10 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-2xl">{userType.title}</h3>
                      <Badge className={`mt-3 ${userType.badgeClass}`}>
                        {userType.badge}
                      </Badge>
                    </div>
                  </div>
                  {selectedType === userType.type && (
                    <Check className="h-6 w-6 text-primary" />
                  )}
                </div>

                <p className="text-muted-foreground text-base leading-relaxed">
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
