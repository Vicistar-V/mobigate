import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface QuizLevelFiltersProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function QuizLevelFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: QuizLevelFiltersProps) {
  return (
    <div className="space-y-2">
      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="h-11 text-sm touch-manipulation">
          <SelectValue placeholder="Filter by category" />
        </SelectTrigger>
        <SelectContent className="max-h-60">
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat} value={cat} className="text-sm">
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search level name..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-11 pl-9 text-sm touch-manipulation"
        />
      </div>
    </div>
  );
}
