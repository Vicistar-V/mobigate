import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle 
} from "@/components/ui/sheet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Upload, 
  FolderOpen, 
  FolderTree, 
  Settings, 
  BarChart, 
  Trash2 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ManageELibraryDialogProps {
  open: boolean;
  onClose: () => void;
}

export const ManageELibraryDialog = ({ open, onClose }: ManageELibraryDialogProps) => {
  const { toast } = useToast();

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
                  <CardDescription className="text-sm">
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
