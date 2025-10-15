import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle 
} from "@/components/ui/sheet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Upload, 
  FolderOpen, 
  FolderTree, 
  Settings, 
  BarChart, 
  Trash2,
  Library,
  ArrowRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ManageELibraryDialogProps {
  open: boolean;
  onClose: () => void;
}

export const ManageELibraryDialog = ({ open, onClose }: ManageELibraryDialogProps) => {
  const { toast } = useToast();

  const handleViewELibrary = () => {
    onClose();
    
    // Scroll to E-Library section
    setTimeout(() => {
      const eLibrarySection = document.querySelector('[data-elibrary-section]');
      if (eLibrarySection) {
        eLibrarySection.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }, 100);
  };

  const managementOptions = [
    {
      icon: Upload,
      title: "Upload Content",
      description: "Add new videos, photos, articles, and more",
      action: () => {
        toast({
          title: "Upload Content",
          description: "Content upload feature coming soon!",
        });
      }
    },
    {
      icon: FolderOpen,
      title: "My Uploads",
      description: "View and manage your uploaded content",
      action: () => {
        toast({
          title: "My Uploads",
          description: "Your uploads dashboard coming soon!",
        });
      }
    },
    {
      icon: FolderTree,
      title: "Organize Categories",
      description: "Create and manage content categories",
      action: () => {
        toast({
          title: "Organize Categories",
          description: "Category management coming soon!",
        });
      }
    },
    {
      icon: Settings,
      title: "Content Settings",
      description: "Configure privacy and visibility settings",
      action: () => {
        toast({
          title: "Content Settings",
          description: "Settings panel coming soon!",
        });
      }
    },
    {
      icon: BarChart,
      title: "Analytics",
      description: "View stats on your content performance",
      action: () => {
        toast({
          title: "Analytics",
          description: "Analytics dashboard coming soon!",
        });
      }
    },
    {
      icon: Trash2,
      title: "Delete Content",
      description: "Remove unwanted content",
      action: () => {
        toast({
          title: "Delete Content",
          description: "Content deletion interface coming soon!",
        });
      }
    }
  ];

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
        {/* Navigation Bar - View E-Library Contents */}
        <Card 
          className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground mb-6 cursor-pointer hover:shadow-xl transition-all border-none -mt-2" 
          onClick={handleViewELibrary}
        >
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Library className="w-6 h-6" />
              <div>
                <p className="font-bold text-lg">View E-Library Contents Now</p>
                <p className="text-base opacity-90">Browse all available content</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5" />
          </CardContent>
        </Card>

        <Separator className="mb-6" />

        <SheetHeader>
          <SheetTitle>Manage E-Library</SheetTitle>
          <SheetDescription>
            Manage your E-Library content, categories, and settings
          </SheetDescription>
        </SheetHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {managementOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Card 
                key={option.title}
                className="cursor-pointer hover:border-primary transition-all hover:shadow-md"
                onClick={option.action}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">{option.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-base">
                    {option.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
};
