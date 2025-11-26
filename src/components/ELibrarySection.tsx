import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Play, Image, FileText, Headphones, FileIcon, Link, MoreHorizontal, Settings } from "lucide-react";
import { FilterDialog } from "./FilterDialog";
import { ManageELibraryDialog } from "./ManageELibraryDialog";
import { useState } from "react";

interface ELibrarySectionProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  title?: string;
}

const primaryFilters = [
  { value: "all", label: "All", icon: null, count: "500.0k" },
  { value: "video", label: "Videos", icon: Play, count: "200.0k" },
  { value: "photo", label: "Photos", icon: Image, count: "100.0k" },
  { value: "article", label: "Articles", icon: FileText, count: "100.0k" },
];

const moreFilters = [
  { value: "audio", label: "Audio", icon: Headphones, count: "30.0k" },
  { value: "pdf", label: "PDF Documents", icon: FileIcon, count: "50.0k" },
  { value: "url", label: "URL Links", icon: Link, count: "20.0k" },
];

export const ELibrarySection = ({ activeFilter, onFilterChange, title = "Recommended E-Library Contents" }: ELibrarySectionProps) => {
  const isMoreActive = moreFilters.some(filter => filter.value === activeFilter);
  const [sortFilter, setSortFilter] = useState("all");
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);

  const filterOptions = [
    { value: "all", label: "All Content" },
    { value: "recent", label: "Most Recent" },
    { value: "popular", label: "Most Popular" },
    { value: "trending", label: "Trending" },
    { value: "viewed", label: "Most Viewed" },
  ];
  
  return (
    <div className="py-4" data-elibrary-section>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-base md:text-lg">{title}</h3>
        
        <FilterDialog
          title="Filter E-Library Contents"
          description="Choose how you want to sort the library content."
          options={filterOptions}
          defaultValue={sortFilter}
          onApply={setSortFilter}
          triggerLabel="Filter"
        />
      </div>
      
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
              className="text-sm md:text-base gap-1.5"
            >
              {Icon && <Icon className="w-3 h-3" />}
              {option.label} ({option.count})
            </Button>
          );
        })}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={isMoreActive ? "default" : "outline"}
              size="sm"
              className="text-sm md:text-base gap-1.5"
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
                  {option.label} ({option.count})
                </DropdownMenuItem>
              );
            })}
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem
              onClick={() => setIsManageDialogOpen(true)}
              className="font-semibold text-primary cursor-pointer"
            >
              <Settings className="w-4 h-4 mr-2" />
              Manage E-Library
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <ManageELibraryDialog 
        open={isManageDialogOpen} 
        onClose={() => setIsManageDialogOpen(false)} 
      />
    </div>
  );
};
