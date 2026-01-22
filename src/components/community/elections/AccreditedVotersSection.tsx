import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export const AccreditedVotersSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewType, setViewType] = useState<'current' | 'previous'>('current');
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <div className="flex items-center justify-between p-3 bg-gray-100 border-2 border-black cursor-pointer hover:bg-gray-200 transition-colors">
          <span className="font-bold">View All Accredited Voters</span>
          <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="border-2 border-t-0 border-black bg-white">
          <Button
            variant="ghost"
            className={`w-full justify-start py-3 px-4 rounded-none hover:bg-gray-100 h-auto whitespace-normal text-left ${viewType === 'current' ? 'bg-green-50 border-l-4 border-l-green-600 font-semibold text-green-800' : ''}`}
            onClick={() => setViewType('current')}
          >
            Currently Accredited [Valid Voters]
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start py-3 px-4 rounded-none hover:bg-gray-100 h-auto whitespace-normal text-left ${viewType === 'previous' ? 'bg-green-50 border-l-4 border-l-green-600 font-semibold text-green-800' : ''}`}
            onClick={() => setViewType('previous')}
          >
            Previously Accredited [Invalid Voters]
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
