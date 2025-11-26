import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MoreVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

interface CommunityMainMenuProps {
  isOwner?: boolean;
  isAdmin?: boolean;
  isMember?: boolean;
}

export function CommunityMainMenu({
  isOwner = false,
  isAdmin = false,
  isMember = false,
}: CommunityMainMenuProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const handleMenuClick = (action: string) => {
    toast({
      title: action,
      description: "This feature is coming soon!",
    });
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] p-0">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle>Community Menu</SheetTitle>
        </SheetHeader>
        
        <div className="overflow-y-auto h-[calc(85vh-73px)]">
          <Accordion type="multiple" className="w-full px-4">
            {/* Guests Section */}
            <AccordionItem value="guests">
              <AccordionTrigger className="text-base">Guests</AccordionTrigger>
              <AccordionContent>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("E-Mail Login")}
                >
                  E-Mail Login [OTP]
                </Button>
              </AccordionContent>
            </AccordionItem>

            {/* Members Section */}
            <AccordionItem value="members">
              <AccordionTrigger className="text-base">Members</AccordionTrigger>
              <AccordionContent className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("Login")}
                >
                  Login
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("Logout")}
                >
                  Logout
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("Exit Community")}
                >
                  Exit Community
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("Exit Request")}
                >
                  Exit Request
                </Button>
              </AccordionContent>
            </AccordionItem>

            {/* Admins Section - Only show if user is admin */}
            {(isAdmin || isOwner) && (
              <AccordionItem value="admins">
                <AccordionTrigger className="text-base">Admins</AccordionTrigger>
                <AccordionContent className="space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start pl-4"
                    onClick={() => handleMenuClick("Admin Login")}
                  >
                    Login
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start pl-4"
                    onClick={() => handleMenuClick("Admin Logout")}
                  >
                    Logout
                  </Button>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Administration/Leadership */}
            <AccordionItem value="administration">
              <AccordionTrigger className="text-base">
                Administration/Leadership
              </AccordionTrigger>
              <AccordionContent className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("Management Committee")}
                >
                  Management Committee
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("Office Tenure")}
                >
                  Office Tenure
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("Staff")}
                >
                  Staff
                </Button>
              </AccordionContent>
            </AccordionItem>

            {/* FundRaiser */}
            <AccordionItem value="fundraiser">
              <AccordionTrigger className="text-base">FundRaiser</AccordionTrigger>
              <AccordionContent className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("Raise Campaign")}
                >
                  Raise Campaign
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("View Campaigns")}
                >
                  View Campaigns
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("View Donors")}
                >
                  View Donors
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("Celebrity Donors")}
                >
                  Celebrity Donors
                </Button>
              </AccordionContent>
            </AccordionItem>

            {/* Election/Voting */}
            <AccordionItem value="election">
              <AccordionTrigger className="text-base">
                Election/Voting
              </AccordionTrigger>
              <AccordionContent className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("Launch Election")}
                >
                  Launch
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("View Results")}
                >
                  Results
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("View Winners")}
                >
                  Winners
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("View Opinions")}
                >
                  Opinions
                </Button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Separator className="my-2" />

          {/* Single Items */}
          <div className="px-4 space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleMenuClick("Meetings/Activities")}
            >
              Meetings/Activities
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleMenuClick("Roll-Calls")}
            >
              Roll-Calls
            </Button>
          </div>

          <Separator className="my-2" />

          <Accordion type="multiple" className="w-full px-4">
            {/* Finance */}
            <AccordionItem value="finance">
              <AccordionTrigger className="text-base">Finance</AccordionTrigger>
              <AccordionContent className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("CAM")}
                >
                  CAM
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("Overview")}
                >
                  Overview
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("Obligations")}
                >
                  Obligations
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("Status Checker")}
                >
                  Status Checker
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("Audit")}
                >
                  Audit
                </Button>
              </AccordionContent>
            </AccordionItem>

            {/* Community Resources */}
            <AccordionItem value="resources">
              <AccordionTrigger className="text-base">
                Community Resources
              </AccordionTrigger>
              <AccordionContent className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("ID Card")}
                >
                  ID Card
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("Letter")}
                >
                  Letter
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("Constitution")}
                >
                  Constitution
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("Journals")}
                >
                  Journals
                </Button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Separator className="my-2" />

          {/* Inside Community */}
          <div className="px-4 pb-6">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleMenuClick("Inside Community")}
            >
              Inside Community
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
