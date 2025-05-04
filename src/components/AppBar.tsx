
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";
import { useSearch } from "@/contexts/SearchContext";
import { useEffect } from "react";

type AppBarProps = {
  onMenuClick: () => void;
};

const AppBar = ({ onMenuClick }: AppBarProps) => {
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    clearSearch,
    setSelectedEntryId
  } = useSearch();

  // Clear search when component unmounts
  useEffect(() => {
    return () => {
      clearSearch();
    };
  }, [clearSearch]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleResultClick = (entryId: string) => {
    setSelectedEntryId(entryId);
    clearSearch();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-primary px-4 py-3">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="text-primary-foreground">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex justify-center items-center">
          <img
            src="/Gorlea-logo.png"
            alt="Gorlea's Ink"
            className="h-10 object-contain"
          />
        </div>
        <div className="relative flex justify-end w-10 md:w-40 lg:w-64">
          <SearchBar onSearch={handleSearch} />
          <SearchResults
            results={searchResults}
            query={searchQuery}
            isVisible={isSearching && searchQuery.length > 0}
            onResultClick={handleResultClick}
          />
        </div>
      </div>
    </header>
  );
};

export default AppBar;
