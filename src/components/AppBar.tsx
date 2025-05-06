
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";
import { useSearch } from "@/contexts/SearchContext";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { logoVariants } from "@/lib/animations";

type AppBarProps = {
  onMenuClick: () => void;
};

const AppBar = ({ onMenuClick }: AppBarProps) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
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

  // Handle search expansion state change
  const handleSearchExpandChange = (expanded: boolean) => {
    setIsSearchExpanded(expanded);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleResultClick = (entryId: string) => {
    setSelectedEntryId(entryId);
    clearSearch();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-primary px-4 py-3">
      <div className="grid grid-cols-3 items-center">
        <div className="flex items-center justify-start">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="text-primary-foreground hover:bg-primary/20"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <div className={cn(
          "flex justify-center items-center transition-opacity duration-300",
          // Hide logo on mobile when search is expanded, but keep it visible on larger screens
          isSearchExpanded ? "opacity-0 md:opacity-100 max-md:invisible" : "opacity-100 visible"
        )}>
          <img
            src="/Gorlea-logo.png"
            alt="Gorlea's Ink"
            className="h-10 object-contain hover:scale-105 transition-transform"
          />
        </div>

        <div className="flex items-center justify-end h-10">
          <div className="relative">
            <SearchBar
              onSearch={handleSearch}
              onExpandChange={handleSearchExpandChange}
            />
            <SearchResults
              results={searchResults}
              query={searchQuery}
              isVisible={isSearching && searchQuery.length > 0}
              onResultClick={handleResultClick}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppBar;
