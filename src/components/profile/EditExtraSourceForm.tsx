import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ExternalLink, Store, Users, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { useServiceUnavailableDialog } from "@/hooks/useServiceUnavailableDialog";

interface EditExtraSourceFormProps {
  onClose: () => void;
}

export const EditExtraSourceForm = ({ onClose }: EditExtraSourceFormProps) => {
  const { showDialog, Dialog } = useServiceUnavailableDialog();

  const extraSources = [
    {
      id: "mobi-shop",
      title: "My Mobi-Shop @ Mobi-Store",
      description: "Your personal online store",
      icon: Store,
      link: "/mobi-shop",
    },
    {
      id: "mobi-circle",
      title: "Mobi-Circle",
      description: "Connect with your community",
      icon: Users,
      link: "/mobi-circle",
    },
    {
      id: "biz-catalogue",
      title: "Biz-Catalogue",
      description: "Browse business offerings",
      icon: BookOpen,
      link: "/biz-catalogue",
    },
  ];

  const handleNavigate = (link: string, title: string) => {
    showDialog();
  };

  return (
    <div className="space-y-4">
      <p className="text-base text-muted-foreground">
        Click on any option to navigate to the respective page
      </p>

      <div className="space-y-3">
        {extraSources.map((source) => (
          <Card 
            key={source.id} 
            className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => handleNavigate(source.link, source.title)}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <source.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{source.title}</h4>
                <p className="text-base text-muted-foreground">{source.description}</p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button type="button" variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>

      {/* Service Unavailable Dialog */}
      <Dialog />
    </div>
  );
};
