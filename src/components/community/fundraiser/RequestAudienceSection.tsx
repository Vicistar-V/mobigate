import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { audienceOptions } from "@/data/fundraiserData";
import { useToast } from "@/hooks/use-toast";

interface RequestAudienceSectionProps {
  selectedAudience: string[];
  onAudienceChange: (audience: string[]) => void;
}

export const RequestAudienceSection = ({
  selectedAudience,
  onAudienceChange,
}: RequestAudienceSectionProps) => {
  const { toast } = useToast();

  const toggleAudience = (audienceId: string) => {
    if (selectedAudience.includes(audienceId)) {
      onAudienceChange(selectedAudience.filter((id) => id !== audienceId));
    } else {
      onAudienceChange([...selectedAudience, audienceId]);
    }
  };

  const handleBrowseExclusion = () => {
    toast({
      title: "Browse Exclusion List",
      description: "Feature coming soon!",
    });
  };

  const handleViewExclusion = () => {
    toast({
      title: "View Exclusion List",
      description: "Feature coming soon!",
    });
  };

  const handleAddAudience = () => {
    toast({
      title: "Add New Audience",
      description: "Feature coming soon!",
    });
  };

  const handleViewNewList = () => {
    toast({
      title: "View New List",
      description: "Feature coming soon!",
    });
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold mb-4 text-center">
        REQUEST AUDIENCE
      </h3>
      
      <div className="space-y-4">
        {/* CHANNELED TO Section */}
        <div>
          <p className="font-semibold mb-3 text-sm">CHANNELED TO:</p>
          <div className="space-y-3">
            {audienceOptions.map((option) => (
              <div key={option.id} className="flex items-center gap-3">
                <Checkbox
                  checked={selectedAudience.includes(option.id)}
                  onCheckedChange={() => toggleAudience(option.id)}
                />
                <span className="text-sm font-medium">{option.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* PUBLIC EXCEPT Section */}
        <div className="pt-4 border-t">
          <div className="flex items-center gap-3 mb-2">
            <Checkbox />
            <span className="text-sm font-semibold">PUBLIC EXCEPT:</span>
          </div>
          <div className="flex gap-2 pl-7">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBrowseExclusion}
            >
              Browse
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewExclusion}
            >
              View Exclusion List
            </Button>
          </div>
        </div>

        {/* ADD ANOTHER AUDIENCE Section */}
        <div className="pt-4 border-t">
          <div className="flex items-center gap-3 mb-2">
            <Checkbox />
            <span className="text-sm font-semibold">ADD ANOTHER AUDIENCE:</span>
          </div>
          <div className="flex gap-2 pl-7">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddAudience}
            >
              Browse
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewNewList}
            >
              View New List
            </Button>
          </div>
        </div>

        {/* SAVE Button */}
        <Button className="w-full bg-black text-white hover:bg-black/90 font-bold mt-6">
          SAVE
        </Button>
      </div>
    </Card>
  );
};
