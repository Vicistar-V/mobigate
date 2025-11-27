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
  onNavigate?: (section: string) => void;
}

export function CommunityMainMenu({
  isOwner = false,
  isAdmin = false,
  isMember = false,
  onNavigate,
}: CommunityMainMenuProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const handleMenuClick = (action: string, isNavigable?: boolean) => {
    if (isNavigable && onNavigate) {
      onNavigate(action);
      setOpen(false);
    } else {
      toast({
        title: action,
        description: "This feature is coming soon!",
      });
      setOpen(false);
    }
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
          {/* Direct Menu Items - Articles, News Info, Events */}
          <div className="px-4 py-2 space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleMenuClick("articles", true)}
            >
              Articles
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleMenuClick("news", true)}
            >
              News Info
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleMenuClick("events", true)}
            >
              Events
            </Button>
          </div>

          <Separator className="my-2" />

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
              <AccordionContent>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("Login/Logout")}
                >
                  Login/Logout
                </Button>
                
                {/* Nested accordion for Exit Community */}
                <Accordion type="multiple" className="pl-2 mt-1">
                  <AccordionItem value="exit-community" className="border-none">
                    <AccordionTrigger className="text-sm py-2">Exit Community</AccordionTrigger>
                    <AccordionContent className="space-y-1">
                      <Button
                        variant="ghost"
                        className="w-full justify-start pl-4 text-sm h-8"
                        onClick={() => handleMenuClick("Exit Request")}
                      >
                        Exit Request
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </AccordionContent>
            </AccordionItem>

            {/* MEMBERSHIP Section */}
            <AccordionItem value="membership">
              <AccordionTrigger className="text-base font-semibold">MEMBERSHIP</AccordionTrigger>
              <AccordionContent>
                {/* Nested accordion for View Members */}
                <Accordion type="multiple" className="pl-2">
                  <AccordionItem value="view-members" className="border-none">
                    <AccordionTrigger className="text-sm py-2">View Members</AccordionTrigger>
                    <AccordionContent className="space-y-1">
                      <Button
                        variant="ghost"
                        className="w-full justify-start pl-4 text-sm h-8"
                        onClick={() => handleMenuClick("Members")}
                      >
                        Members
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start pl-4 text-sm h-8"
                        onClick={() => handleMenuClick("Chat Members")}
                      >
                        Chat Members
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start pl-4 text-sm h-8"
                        onClick={() => handleMenuClick("Gift Members")}
                      >
                        Gift Members
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start pl-4 text-sm h-8"
                        onClick={() => handleMenuClick("Block Members")}
                      >
                        Block Members
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                {/* Single item: Add Friends */}
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-2 mt-1"
                  onClick={() => handleMenuClick("Add Friends")}
                >
                  Add Friends
                </Button>
                
                {/* Nested accordion for Invite Members */}
                <Accordion type="multiple" className="pl-2 mt-1">
                  <AccordionItem value="invite-members" className="border-none">
                    <AccordionTrigger className="text-sm py-2">Invite Members</AccordionTrigger>
                    <AccordionContent className="space-y-1">
                      <Button
                        variant="ghost"
                        className="w-full justify-start pl-4 text-sm h-8"
                        onClick={() => handleMenuClick("Invite Mobigate Users")}
                      >
                        Invite Mobigate Users
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start pl-4 text-sm h-8"
                        onClick={() => handleMenuClick("Invite Non-Mobigate Users")}
                      >
                        Invite Non-Mobigate Users
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
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
                  onClick={() => handleMenuClick("Management/Executive Committee")}
                >
                  Management/Executive Committee
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
                  onClick={() => handleMenuClick("Staff & Employees")}
                >
                  Staff & Employees
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
                  onClick={() => handleMenuClick("View Celebrity Donors")}
                >
                  View Celebrity Donors
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
                  onClick={() => handleMenuClick("Launch Voting")}
                >
                  Launch Voting
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("View Voting Results")}
                >
                  View Voting Results
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("View Winners")}
                >
                  View Winners
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("View Community Opinions")}
                >
                  View Community Opinions
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
              onClick={() => handleMenuClick("meetings", true)}
            >
              Meetings/Activities
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleMenuClick("rollcalls", true)}
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
                  CAM [Community Account Manager]
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("Financial Overview/Wallet")}
                >
                  Financial Overview/Wallet
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("Financial Obligations")}
                >
                  Financial Obligations
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("Financial Status Checker")}
                >
                  Financial Status Checker
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("Automated Financial Audit")}
                >
                  Automated Financial Audit
                </Button>
              </AccordionContent>
            </AccordionItem>

            {/* Constitution & By-laws */}
            <AccordionItem value="constitution">
              <AccordionTrigger className="text-base">
                Constitution & By-laws
              </AccordionTrigger>
              <AccordionContent className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4"
                  onClick={() => handleMenuClick("View Constitution")}
                >
                  View Constitution
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
                  onClick={() => handleMenuClick("resources", true)}
                >
                  View Resources Section
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
