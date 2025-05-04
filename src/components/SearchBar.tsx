import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type SearchBarProps = {
  onSearch: (query: string) => void;
  className?: string;
};

const SearchBar = ({ onSearch, className }: SearchBarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

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
    <div className={cn("relative flex items-center justify-end", className)}>
      <AnimatePresence>
        {isExpanded ? (
          <motion.div
            initial={{ width: 40, opacity: 0, x: 0 }}
            animate={{ width: "240px", opacity: 1, x: 0 }}
            exit={{ width: 40, opacity: 0, x: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex items-center absolute right-0"
            style={{ zIndex: 100 }}
          >
            <div className="relative w-full flex items-center">
              <Search className="absolute left-2 h-4 w-4 text-primary-foreground/60" />
              <Input
                ref={inputRef}
                type="text"
                placeholder="Search entries and poems..."
                value={searchQuery}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                className="pl-8 pr-8 h-9 bg-secondary/20 border-primary/20 text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:ring-accent"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 h-full p-0 w-8 text-primary-foreground/60 hover:text-primary-foreground hover:bg-transparent"
                onClick={handleCloseIconClick}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground"
              onClick={handleSearchIconClick}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
