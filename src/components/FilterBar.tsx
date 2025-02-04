import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories } from "@/data/videos";

interface FilterBarProps {
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: string) => void;
}

const FilterBar = ({ onCategoryChange, onSortChange }: FilterBarProps) => {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-between w-full max-w-6xl mx-auto p-4">
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => onCategoryChange("all")}
          className="hover:bg-youtube-red hover:text-white"
        >
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant="outline"
            onClick={() => onCategoryChange(category)}
            className="hover:bg-youtube-red hover:text-white"
          >
            {category}
          </Button>
        ))}
      </div>
      <Select onValueChange={onSortChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="date-desc">Newest First</SelectItem>
          <SelectItem value="date-asc">Oldest First</SelectItem>
          <SelectItem value="title-asc">Title A-Z</SelectItem>
          <SelectItem value="title-desc">Title Z-A</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterBar;