import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  return (
    <div className="relative w-full max-w-xl mx-auto">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <Input
        className="pl-10 w-full"
        placeholder="Search videos..."
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;