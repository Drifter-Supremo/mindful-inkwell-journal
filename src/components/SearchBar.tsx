import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type SearchBarProps = {
  onSearch: (query: string) => void;
  className?: string;
  onExpandChange?: (expanded: boolean) => void;
};

const SearchBar = ({ onSearch, className, onExpandChange }: SearchBarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Handle search icon click
  const handleSearchIconClick = () => {
    setIsExpanded(true);
  };

  // Handle close icon click
  const handleCloseIconClick = () => {
    setIsExpanded(false);
    setSearchQuery("");
    onSearch("");
  };

  // Focus input when expanded and handle clicks outside
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }

    // Notify parent component about expansion state change
    onExpandChange?.(isExpanded);

    // Handle clicks outside the search box
    if (isExpanded) {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          searchContainerRef.current &&
          !searchContainerRef.current.contains(event.target as Node)
        ) {
          console.log("Click outside detected, closing search");
          handleCloseIconClick();
        }
      };

      // Add a small delay to prevent immediate closing
      setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 100);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isExpanded, onExpandChange, handleCloseIconClick]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      handleCloseIconClick();
    }
  };

  return (
    <div className={cn("flex items-center justify-end", className)}>
      <div ref={searchContainerRef} className="relative">
        {isExpanded ? (
          <div className="absolute right-0 flex items-center" style={{ zIndex: 100, outline: "none" }}>
            <motion.div
              initial={{ width: 40, opacity: 0 }}
              animate={{ width: "calc(100vw - 80px)", opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="relative w-full flex items-center md:w-[240px] overflow-hidden"
              style={{ maxWidth: "240px", outline: "none" }}
            >
              <Search className="absolute left-2 h-4 w-4 text-primary-foreground/60" />
              <Input
                ref={inputRef}
                type="text"
                placeholder="Search entries and poems..."
                value={searchQuery}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                className="pl-8 pr-8 h-9 bg-secondary/20 border-primary/20 text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:ring-0 focus-visible:outline-none"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 h-full p-0 w-8 text-primary-foreground/60 hover:text-primary-foreground hover:bg-transparent"
                onClick={handleCloseIconClick}
              >
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground h-10 w-10 p-0"
            onClick={handleSearchIconClick}
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
