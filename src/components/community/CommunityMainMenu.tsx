import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

  const handleMenuClick = (action: string) => {
    toast({
      title: action,
      description: "This feature is coming soon!",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 max-h-[80vh] overflow-y-auto">
        {/* Guests Section */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <span>Guests</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => handleMenuClick("E-Mail Login")}>
              E-Mail Login [OTP]
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        {/* Members Section */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <span>Members</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => handleMenuClick("Login")}>Login</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuClick("Logout")}>Logout</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuClick("Exit Community")}>
              Exit Community
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuClick("Exit Request")}>
              Exit Request
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* Admins Section - Only show if user is admin */}
        {(isAdmin || isOwner) && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <span>Admins</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => handleMenuClick("Admin Login")}>
                  Login
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleMenuClick("Admin Logout")}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </>
        )}

        <DropdownMenuSeparator />

        {/* Administration/Leadership */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <span>Administration/Leadership</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => handleMenuClick("Management Committee")}>
              Management Committee
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuClick("Office Tenure")}>
              Office Tenure
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuClick("Staff")}>Staff</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        {/* FundRaiser */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <span>FundRaiser</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => handleMenuClick("Raise Campaign")}>
              Raise Campaign
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuClick("View Campaigns")}>
              View Campaigns
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuClick("View Donors")}>
              View Donors
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuClick("Celebrity Donors")}>
              Celebrity Donors
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        {/* Election/Voting */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <span>Election/Voting</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => handleMenuClick("Launch Election")}>
              Launch
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuClick("View Results")}>
              Results
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuClick("View Winners")}>
              Winners
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuClick("View Opinions")}>
              Opinions
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        {/* Other Menu Items */}
        <DropdownMenuItem onClick={() => handleMenuClick("Meetings/Activities")}>
          Meetings/Activities
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleMenuClick("Roll-Calls")}>
          Roll-Calls
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Finance */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <span>Finance</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => handleMenuClick("CAM")}>CAM</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuClick("Overview")}>
              Overview
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuClick("Obligations")}>
              Obligations
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuClick("Status Checker")}>
              Status Checker
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuClick("Audit")}>Audit</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        {/* Community Resources */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <span>Community Resources</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => handleMenuClick("ID Card")}>ID Card</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuClick("Letter")}>Letter</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuClick("Constitution")}>
              Constitution
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuClick("Journals")}>
              Journals
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        {/* Inside Community */}
        <DropdownMenuItem onClick={() => handleMenuClick("Inside Community")}>
          Inside Community
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
