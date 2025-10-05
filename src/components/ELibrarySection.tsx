import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Image, Headphones, FileText, MoreHorizontal } from "lucide-react";

interface ELibrarySectionProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const filterOptions = [
  { value: "all", label: "All", icon: null },
  { value: "video", label: "Videos", icon: Play },
  { value: "photo", label: "Photos", icon: Image },
  { value: "audio", label: "Audio", icon: Headphones },
  { value: "article", label: "Articles", icon: FileText },
  { value: "more", label: "More", icon: MoreHorizontal },
];

export const ELibrarySection = ({ activeFilter, onFilterChange }: ELibrarySectionProps) => {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-base md:text-lg">Recommended E-Library Contents</h3>
      </div>
      
      <div className="flex flex-wrap items-center gap-2">
        {filterOptions.map((option) => {
          const Icon = option.icon;
          const isActive = activeFilter === option.value;
          
          return (
            <Button
              key={option.value}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange(option.value)}
              className="text-xs md:text-sm gap-1.5"
            >
              {Icon && <Icon className="w-3 h-3" />}
              {option.label}
            </Button>
          );
        })}
      </div>
    </Card>
  );
};
