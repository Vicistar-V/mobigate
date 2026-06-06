import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface Props {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (val: string) => void;
  searchQuery: string;
  onSearchChange: (val: string) => void;
}

export function QuizQuestionFilters({ categories, selectedCategory, onCategoryChange, searchQuery, onSearchChange }: Props) {
  return (
    <div className="space-y-2">
      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="h-12 text-base flex-1">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map(c => (
            <SelectItem key={c} value={c} className="text-sm">{c}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search questions..."
          className="h-12 text-base pl-9"
        />
      </div>
    </div>
  );
}
