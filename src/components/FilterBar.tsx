import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterBarProps {
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: string) => void;
  categories: string[];
}

const FilterBar = ({ onCategoryChange, onSortChange, categories }: FilterBarProps) => {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-between w-full max-w-6xl mx-auto p-4">
      <Select onValueChange={onCategoryChange} defaultValue="all">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="カテゴリー選択" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">すべて</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select onValueChange={onSortChange} defaultValue="date-desc">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="並び替え" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="date-desc">新しい順</SelectItem>
          <SelectItem value="date-asc">古い順</SelectItem>
          <SelectItem value="title-asc">タイトル昇順</SelectItem>
          <SelectItem value="title-desc">タイトル降順</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterBar;