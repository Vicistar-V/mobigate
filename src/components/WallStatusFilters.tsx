import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Play, Image, FileText, Headphones, FileIcon, Link, MoreHorizontal } from "lucide-react";

interface WallStatusFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const primaryFilters = [
  { value: "all", label: "All", icon: null },
  { value: "video", label: "Videos", icon: Play },
  { value: "photo", label: "Photos", icon: Image },
  { value: "article", label: "Articles", icon: FileText },
];

const moreFilters = [
  { value: "audio", label: "Audio", icon: Headphones },
  { value: "pdf", label: "PDF Documents", icon: FileIcon },
  { value: "url", label: "URL Links", icon: Link },
];

export const WallStatusFilters = ({ activeFilter, onFilterChange }: WallStatusFiltersProps) => {
  const isMoreActive = moreFilters.some(filter => filter.value === activeFilter);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {primaryFilters.map((option) => {
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
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={isMoreActive ? "default" : "outline"}
            size="sm"
            className="text-xs md:text-sm gap-1.5"
          >
            <MoreHorizontal className="w-3 h-3" />
            More
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-card z-50">
          {moreFilters.map((option) => {
            const Icon = option.icon;
            const isActive = activeFilter === option.value;
            
            return (
              <DropdownMenuItem
                key={option.value}
                onClick={() => onFilterChange(option.value)}
                className={isActive ? "bg-primary text-primary-foreground" : ""}
              >
                <Icon className="w-4 h-4 mr-2" />
                {option.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
