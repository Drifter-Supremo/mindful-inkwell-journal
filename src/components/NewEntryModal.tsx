
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInVariants, slideUpVariants } from "@/lib/animations";

// Maximum character limit for journal entries
const MAX_ENTRY_LENGTH = 3000;

type NewEntryModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (content: string) => void;
};

const NewEntryModal = ({ open, onOpenChange, onSave }: NewEntryModalProps) => {
  const [content, setContent] = useState("");

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    if (newContent.length <= MAX_ENTRY_LENGTH) {
      setContent(newContent);
    } else {
      // If user tries to paste text that exceeds the limit, truncate it
      setContent(newContent.slice(0, MAX_ENTRY_LENGTH));
      toast.info(`Journal entries are limited to ${MAX_ENTRY_LENGTH} characters`);
    }
  };

  const handleSave = () => {
    if (!content.trim()) {
      toast.error("Please enter some content for your journal entry");
      return;
    }

    onSave(content);
    setContent("");
    onOpenChange(false);
    toast.success("Entry saved successfully!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-primary border-accent text-primary-foreground sm:max-w-md overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader>
            <DialogTitle className="text-primary-foreground">New Journal Entry</DialogTitle>
          </DialogHeader>
        </motion.div>

        <motion.div
          className="py-4"
          variants={slideUpVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
        >
          <div className="relative">
            <Textarea
              className="min-h-[200px] bg-secondary/20 text-primary-foreground placeholder:text-primary-foreground/60"
              placeholder="What's on your mind today?"
              value={content}
              onChange={handleContentChange}
              maxLength={MAX_ENTRY_LENGTH}
              autoFocus
            />
            <div className={`text-xs mt-1 text-right ${content.length >= MAX_ENTRY_LENGTH * 0.9 ? 'text-red-400' : 'text-primary-foreground/60'}`}>
              {content.length}/{MAX_ENTRY_LENGTH} characters
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={fadeInVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-accent text-primary-foreground hover:bg-primary/50 w-full"
              >
                Cancel
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
              <Button
                className="bg-accent text-primary hover:bg-accent/90 w-full"
                onClick={handleSave}
              >
                Save Entry
              </Button>
            </motion.div>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default NewEntryModal;
