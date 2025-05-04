import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { getEntries } from "../getEntries";

type SearchContextType = {
  searchQuery: string;
  searchResults: any[];
  setSearchQuery: (query: string) => void;
  isSearching: boolean;
  clearSearch: () => void;
  allEntries: any[];
  refreshEntries: () => Promise<void>;
  selectedEntryId: string | null;
  setSelectedEntryId: (id: string | null) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [allEntries, setAllEntries] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const { user } = useAuth();

  // Define performSearch as a memoized function to prevent recreating it on every render
  const performSearch = useCallback((query: string, entries: any[]) => {
    const normalizedQuery = query.toLowerCase().trim();

    if (!normalizedQuery) {
      return [];
    }

    return entries.filter(entry => {
      const contentMatch = entry.content?.toLowerCase().includes(normalizedQuery);
      const poemMatch = entry.poem?.toLowerCase().includes(normalizedQuery);
      return contentMatch || poemMatch;
    });
  }, []);

  // Function to refresh entries - memoized to prevent recreation on every render
  const refreshEntries = useCallback(async () => {
    if (user) {
      const entries = await getEntries(user.uid);
      setAllEntries(entries);
    }
  }, [user]);

  // Fetch all entries when user changes
  useEffect(() => {
    if (user) {
      refreshEntries();
    } else {
      setAllEntries([]);
    }
  }, [user, refreshEntries]);

  // Update search results when query or entries change
  useEffect(() => {
    const hasQuery = searchQuery.trim() !== "";
    setIsSearching(hasQuery);

    if (!hasQuery) {
      setSearchResults([]);
      return;
    }

    const results = performSearch(searchQuery, allEntries);
    setSearchResults(results);
  }, [searchQuery, allEntries, performSearch]);

  // Clear search - memoized to prevent recreation on every render
  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);
  }, []);

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        searchResults,
        setSearchQuery,
        isSearching,
        clearSearch,
        allEntries,
        refreshEntries,
        selectedEntryId,
        setSelectedEntryId
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};
