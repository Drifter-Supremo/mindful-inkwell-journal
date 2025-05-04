import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { formatDate } from "@/lib/formatDate";
import { cn } from "@/lib/utils";

type SearchResultsProps = {
  results: any[];
  query: string;
  isVisible: boolean;
  onResultClick: (entryId: string) => void;
};

// Helper function to highlight matching text
const highlightText = (text: string, query: string) => {
  if (!query.trim()) return text;

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, i) =>
    regex.test(part) ? <span key={i} className="bg-accent text-primary font-bold px-0.5 rounded">{part}</span> : part
  );
};

const SearchResults = ({ results, query, isVisible, onResultClick }: SearchResultsProps) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05,
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10, x: -5 },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30
      }
    },
    exit: { opacity: 0, y: -10, x: -5 }
  };

  // No debug logs to avoid potential infinite loops

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="absolute top-full right-0 z-[100] mt-1 shadow-lg rounded-md overflow-hidden w-64"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{ maxWidth: "calc(100vw - 20px)" }}
        >
          <Card className="bg-primary/95 backdrop-blur-sm border-primary/20">
            <CardContent className="p-0">
              <ScrollArea className="max-h-[60vh]">
                <div className="py-2">
                  {results.length > 0 ? (
                    results.map((entry) => (
                      <motion.div
                        key={entry.id}
                        variants={itemVariants}
                        className="px-3 py-2 hover:bg-accent/20 cursor-pointer transition-colors"
                        onClick={() => onResultClick(entry.id)}
                      >
                        <div className="flex flex-col">
                          <div className="text-primary-foreground line-clamp-2 font-medium">
                            {highlightText(entry.content, query)}
                          </div>

                          {entry.poem && entry.poem.toLowerCase().includes(query.toLowerCase()) && (
                            <div className="text-primary-foreground/90 text-sm mt-1 italic line-clamp-1">
                              <span className="text-accent font-semibold mr-1">Poem:</span>
                              {highlightText(entry.poem, query)}
                            </div>
                          )}

                          <div className="text-xs text-primary-foreground/80 mt-1">
                            {formatDate(entry.created_at)}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="px-3 py-4 text-center text-primary-foreground">
                      No results found for "{query}"
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchResults;
