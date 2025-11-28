import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

export const UpcomingElectionsSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <div className="flex items-center justify-between p-3 bg-purple-800 text-white cursor-pointer hover:bg-purple-900 transition-colors">
          <span className="font-bold">Upcoming Elections</span>
          <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="border border-t-0 border-gray-300 bg-white">
          <div className="p-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-200">
            General Elections
          </div>
          <div className="p-3 hover:bg-gray-50 cursor-pointer transition-colors">
            Ad-hoc Committees Election
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
