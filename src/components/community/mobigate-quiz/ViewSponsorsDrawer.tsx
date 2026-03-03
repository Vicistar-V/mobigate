import { Globe, MessageCircle, Mail, Phone, Building2, Handshake } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import type { SeasonSponsor } from "@/data/mobigateInteractiveQuizData";

interface ViewSponsorsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sponsors: SeasonSponsor[];
  seasonName?: string;
}

export function ViewSponsorsDrawer({ open, onOpenChange, sponsors, seasonName }: ViewSponsorsDrawerProps) {
  const handleWebsite = (url: string) => {
    const formatted = url.startsWith("http") ? url : `https://${url}`;
    window.open(formatted, "_blank");
  };

  const handleWhatsApp = (number: string) => {
    const cleaned = number.replace(/[^+\d]/g, "");
    window.open(`https://wa.me/${cleaned.replace("+", "")}`, "_blank");
  };

  const handleEmail = (email: string) => {
    window.open(`mailto:${email}`, "_blank");
  };

  const handlePhone = (phone: string) => {
    window.open(`tel:${phone}`, "_blank");
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[92vh]">
        <DrawerHeader className="text-left pb-2">
          <DrawerTitle className="flex items-center gap-2 text-base">
            <Handshake className="h-5 w-5 text-primary" />
            Official Sponsors
          </DrawerTitle>
          {seasonName && (
            <p className="text-xs text-muted-foreground">{seasonName}</p>
          )}
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto touch-auto overscroll-contain px-4 pb-6">
          {sponsors.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <Building2 className="h-10 w-10 mx-auto text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No sponsors for this season yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sponsors.map((sponsor) => (
                <Card key={sponsor.id} className="overflow-hidden">
                  <CardContent className="p-4 space-y-3">
                    {/* Sponsor Identity */}
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 border">
                        {sponsor.logoUrl && <AvatarImage src={sponsor.logoUrl} alt={sponsor.brandName} />}
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                          {sponsor.brandName.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm truncate">{sponsor.brandName}</h4>
                        <p className="text-xs text-muted-foreground">Official Sponsor</p>
                      </div>
                    </div>

                    {/* Contact Actions */}
                    <div className="flex flex-wrap gap-2">
                      {sponsor.websiteUrl && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-9 text-xs gap-1.5 flex-1 min-w-[120px] touch-manipulation active:scale-[0.97]"
                          onClick={() => handleWebsite(sponsor.websiteUrl!)}
                        >
                          <Globe className="h-3.5 w-3.5 text-blue-500" />
                          Website
                        </Button>
                      )}
                      {sponsor.whatsAppNumber && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-9 text-xs gap-1.5 flex-1 min-w-[120px] touch-manipulation active:scale-[0.97]"
                          onClick={() => handleWhatsApp(sponsor.whatsAppNumber!)}
                        >
                          <MessageCircle className="h-3.5 w-3.5 text-green-500" />
                          WhatsApp
                        </Button>
                      )}
                      {sponsor.email && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-9 text-xs gap-1.5 flex-1 min-w-[120px] touch-manipulation active:scale-[0.97]"
                          onClick={() => handleEmail(sponsor.email!)}
                        >
                          <Mail className="h-3.5 w-3.5 text-orange-500" />
                          Email
                        </Button>
                      )}
                      {sponsor.phoneNumber && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-9 text-xs gap-1.5 flex-1 min-w-[120px] touch-manipulation active:scale-[0.97]"
                          onClick={() => handlePhone(sponsor.phoneNumber!)}
                        >
                          <Phone className="h-3.5 w-3.5 text-purple-500" />
                          Call
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
