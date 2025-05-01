
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";

type NewEntryModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (content: string) => void;
};

const NewEntryModal = ({ open, onOpenChange, onSave }: NewEntryModalProps) => {
  const [content, setContent] = useState("");

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
      <DialogContent className="bg-primary border-accent text-primary-foreground sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary-foreground">New Journal Entry</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <Textarea
            className="min-h-[200px] bg-secondary/20 text-primary-foreground placeholder:text-primary-foreground/60"
            placeholder="What's on your mind today?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-accent text-primary-foreground hover:bg-primary/50"
          >
            Cancel
          </Button>
          <Button 
            className="bg-accent text-primary hover:bg-accent/90" 
            onClick={handleSave}
          >
            Save Entry
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewEntryModal;
