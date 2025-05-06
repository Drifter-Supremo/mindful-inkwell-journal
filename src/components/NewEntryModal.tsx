
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInVariants, slideUpVariants } from "@/lib/animations";
import { useIsMobile } from "@/hooks/use-mobile";

// Maximum character limit for journal entries
const MAX_ENTRY_LENGTH = 3000;

type NewEntryModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (content: string) => void;
};

const NewEntryModal = ({ open, onOpenChange, onSave }: NewEntryModalProps) => {
  const [content, setContent] = useState("");
  const isMobile = useIsMobile();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // Detect keyboard visibility on mobile
  useEffect(() => {
    if (!isMobile || !open) return;

    // Function to check if keyboard is likely visible based on window height changes
    const checkKeyboard = () => {
      // On mobile, when keyboard appears, the visual viewport height becomes smaller
      const viewportHeight = window.visualViewport?.height || window.innerHeight;
      const windowHeight = window.innerHeight;

      // If visual viewport is significantly smaller than window height, keyboard is likely visible
      setIsKeyboardVisible(viewportHeight < windowHeight * 0.8);
    };

    // Initial check
    checkKeyboard();

    // Listen for visual viewport resize events (more reliable for detecting keyboard)
    window.visualViewport?.addEventListener('resize', checkKeyboard);

    return () => {
      window.visualViewport?.removeEventListener('resize', checkKeyboard);
    };
  }, [isMobile, open]);

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
      <DialogContent
        className={`bg-primary border-accent text-primary-foreground sm:max-w-md overflow-hidden ${
          isMobile ? 'mobile-dialog' : ''
        }`}
        style={{
          // On mobile with keyboard visible, position the dialog higher up
          ...(isMobile && isKeyboardVisible ? {
            top: '30%',
            transform: 'translate(-50%, -30%)'
          } : {})
        }}
      >
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
              className={`bg-secondary/20 text-primary-foreground placeholder:text-primary-foreground/60 ${
                isMobile && isKeyboardVisible
                  ? 'min-h-[100px] max-h-[120px]'
                  : 'min-h-[200px]'
              }`}
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
          className={isMobile ? 'sticky bottom-0 bg-primary pt-2 pb-1 z-10' : ''}
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
