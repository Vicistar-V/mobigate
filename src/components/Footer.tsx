import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, ChevronDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <footer className="bg-muted/50 border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        {/* First Row - Main Sections */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* About Us */}
          <Collapsible open={openSections.about} onOpenChange={() => toggleSection('about')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full text-left group">
              <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">About Us</h3>
              <ChevronDown className={`h-4 w-4 transition-transform ${openSections.about ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3">
              <p className="text-base text-muted-foreground leading-relaxed">
                Connect, share, and engage with a vibrant community. Build meaningful relationships and discover new opportunities.
              </p>
            </CollapsibleContent>
          </Collapsible>

          {/* Quick Links */}
          <Collapsible open={openSections.links} onOpenChange={() => toggleSection('links')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full text-left group">
              <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">Quick Links</h3>
              <ChevronDown className={`h-4 w-4 transition-transform ${openSections.links ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3">
              <ul className="space-y-2 text-base">
                <li>
                  <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="text-muted-foreground hover:text-primary transition-colors">
                    Profile
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </CollapsibleContent>
          </Collapsible>

          {/* Support */}
          <Collapsible open={openSections.support} onOpenChange={() => toggleSection('support')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full text-left group">
              <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">Support</h3>
              <ChevronDown className={`h-4 w-4 transition-transform ${openSections.support ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3">
              <ul className="space-y-2 text-base">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>
            </CollapsibleContent>
          </Collapsible>

          {/* Contact */}
          <Collapsible open={openSections.contact} onOpenChange={() => toggleSection('contact')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full text-left group">
              <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">Contact</h3>
              <ChevronDown className={`h-4 w-4 transition-transform ${openSections.contact ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3">
              <ul className="space-y-2 text-base">
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Lagos, Nigeria
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <a href="tel:+2348064089171" className="text-muted-foreground hover:text-primary transition-colors">
                    +234-806-408-9171
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <a href="mailto:info@example.com" className="text-muted-foreground hover:text-primary transition-colors">
                    info@example.com
                  </a>
                </li>
              </ul>
            </CollapsibleContent>
          </Collapsible>
        </div>

        <Separator className="my-6" />

        {/* Second Row - Copyright and Legal Links */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-base text-muted-foreground">
          <p>© {currentYear} Your Platform Name. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary transition-colors">
              Accessibility
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Sitemap
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Legal
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
