import { useState, useMemo } from "react";
import SearchBar from "@/components/SearchBar";
import FilterBar from "@/components/FilterBar";
import VideoCard from "@/components/VideoCard";
import { videos } from "@/data/videos";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");

  const filteredVideos = useMemo(() => {
    console.log("Filtering videos with:", { searchQuery, selectedCategory, sortBy });
    
    let filtered = [...videos];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (video) =>
          video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          video.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((video) => video.category === selectedCategory);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    console.log("Filtered videos:", filtered);
    return filtered;
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-youtube-light">
      <div className="container mx-auto py-8 space-y-8">
        <h1 className="text-4xl font-bold text-center mb-8">Video Collection</h1>
        <SearchBar onSearch={setSearchQuery} />
        <FilterBar
          onCategoryChange={setSelectedCategory}
          onSortChange={setSortBy}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
        {filteredVideos.length === 0 && (
          <p className="text-center text-gray-500">No videos found</p>
        )}
      </div>
    </div>
  );
};

export default Index;