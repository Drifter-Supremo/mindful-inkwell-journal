
import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Mic, MicOff, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import NewEntryModal from "./NewEntryModal";

import { getEntries } from "../getEntries";
import { saveEntry } from "../saveEntry";
import { useAuth } from "@/contexts/AuthContext";

const EntriesList = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [entries, setEntries] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      getEntries(user.uid).then(setEntries);
    }
  }, [user]);

  // Removed simulated voice entry logic. Use NewEntry page for voice entries.

  const handleNewTextEntry = async (content: string) => {
    if (!user) {
      toast.error("You must be signed in to save an entry.");
      return;
    }
    // Placeholder for AI poem generation
    const poem = "AI will analyze your entry,\nCrafting verses thoughtful and free.\nMirroring emotions you've expressed,\nIn poetic form, beautifully dressed.";
    const userId = user.uid;
    await saveEntry(content, poem, userId);
    // Refresh entries from Firestore
    const updatedEntries = await getEntries(userId);
    setEntries(updatedEntries);
  };

  const toggleExpandEntry = (id: string) => {
    setExpandedEntryId(expandedEntryId === id ? null : id);
  };

  return (
    <div className="relative min-h-screen bg-primary p-4">
      <div className="grid gap-4 pb-20">
        {entries.map((entry) => {
          const isExpanded = expandedEntryId === entry.id;
          const contentPreview = entry.content.length > 100 && !isExpanded
            ? `${entry.content.substring(0, 100)}...`
            : entry.content;
            
          return (
            <Card 
              key={entry.id} 
              className={cn(
                "bg-secondary/20 border-primary/20 transition-all duration-300",
                isExpanded ? "shadow-md" : ""
              )}
            >
              <CardContent className="p-4">
                <div 
                  className="flex justify-between items-start cursor-pointer"
                  onClick={() => toggleExpandEntry(entry.id)}
                >
                  <div className="flex-1">
                    <p className="text-primary-foreground whitespace-pre-wrap mb-2">
                      {contentPreview}
                    </p>
                    {!isExpanded && entry.content.length > 100 && (
                      <span className="text-accent text-sm">Click to read more</span>
                    )}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-1 h-6 w-6 p-0 text-primary-foreground/60 hover:text-primary-foreground hover:bg-transparent"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpandEntry(entry.id);
                    }}
                  >
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                

                {isExpanded && entry.poem && (
                  <div 
                    className="mt-4 pt-4 border-t border-primary/20 animate-fade-in"
                  >
                    <h4 className="text-accent font-semibold mb-2">AI-Generated Poem</h4>
                    <p className="text-primary-foreground/90 italic whitespace-pre-wrap">{entry.poem}</p>
                  </div>
                )}
                
                <p className="mt-3 text-sm text-primary-foreground/60">
                  {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* New Entry Button */}
      <Button
        size="icon"
        className="fixed bottom-24 right-6 h-14 w-14 rounded-full bg-accent hover:bg-accent/90 transition-all duration-300"
        onClick={() => setModalOpen(true)}
      >
        <Plus className="h-6 w-6 text-primary" />
      </Button>
      
      {/* Voice Recording Button */}
      <Button
        size="icon"
        className={cn(
          "fixed bottom-6 right-6 h-14 w-14 rounded-full transition-all duration-300",
          isRecording 
            ? "bg-red-500 hover:bg-red-600 animate-pulse" 
            : "bg-accent hover:bg-accent/90"
        )}
        onClick={async () => {
          if (!isRecording) {
            toast.info("Recording started");
            setIsRecording(true);
          } else {
            toast.success("Recording stopped");
            setIsRecording(false);

            // Simulate transcription and save entry to Firestore
            toast.loading("Transcribing voice note...");
            await new Promise((res) => setTimeout(res, 1200));
            const entryContent = "Simulated transcription: This is where your voice note would be transcribed to text using AI.";
            toast.dismiss();
            toast.success("Voice note transcribed!");

            if (user) {
              const poem = "When integrated with AI, a poem based on your journal entry will appear here.";
              const userId = user.uid;
              await saveEntry(entryContent, poem, userId);
              toast.success("Entry saved successfully!");
              // Refresh entries from Firestore
              const updatedEntries = await getEntries(userId);
              setEntries(updatedEntries);
            }
          }
        }}
      >
        {isRecording ? (
          <MicOff className="h-6 w-6 text-primary animate-pulse" />
        ) : (
          <Mic className="h-6 w-6 text-primary" />
        )}
      </Button>

      <NewEntryModal 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
        onSave={handleNewTextEntry} 
      />
    </div>
  );
};

export default EntriesList;
