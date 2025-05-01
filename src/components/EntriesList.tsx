
import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Mic, MicOff, Plus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import NewEntryModal from "./NewEntryModal";

// Enhanced mock data for entries with poems
const mockEntries = [
  {
    id: "1",
    content: "Today I went for a long walk in the park and felt really refreshed afterward. The weather was perfect and I took some time to just sit on a bench and watch people go by. It's amazing how therapeutic nature can be.",
    poem: "Green leaves dancing in the breeze,\nSunshine warming my skin with ease.\nStrangers passing, stories untold,\nIn nature's embrace, peace unfolds.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: "2",
    content: "I've been thinking about my goals for next month. I want to focus more on my health and reading. Maybe I'll start that new workout routine I've been putting off and finally finish the book that's been sitting on my nightstand.",
    poem: "Aspirations set, a month ahead,\nStrength in body, wisdom in head.\nPages turning, muscles growing,\nA better self, forever knowing.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: "3",
    content: "Had a great conversation with an old friend today. It's amazing how some connections never fade despite time and distance. We picked up right where we left off, as if no time had passed at all.",
    poem: "Time may flow like rivers wide,\nYet true bonds forever abide.\nVoices familiar, laughter shared,\nProving friendship's depth declared.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
  },
];

const EntriesList = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [entries, setEntries] = useState(mockEntries);
  const [modalOpen, setModalOpen] = useState(false);

  const toggleRecording = () => {
    if (!isRecording) {
      // Start recording
      toast.info("Recording started");
      setIsRecording(true);
    } else {
      // Stop recording
      toast.success("Recording stopped");
      setIsRecording(false);
      
      // Simulate adding a new entry from the recording (with AI poem generation)
      setTimeout(() => {
        const newEntry = {
          id: `${Date.now()}`,
          content: "This is a transcription of your voice recording. It would normally be processed by a speech-to-text service. When implemented, your exact words will appear here exactly as you spoke them.",
          poem: "Words from lips, thoughts from mind,\nCaptured now, by tech refined.\nAI weaves with gentle art,\nPoetry from the spoken heart.",
          created_at: new Date().toISOString(),
        };
        
        setEntries([newEntry, ...entries]);
        toast.success("New entry created from recording");
      }, 1500);
    }
  };

  const handleNewTextEntry = (content: string) => {
    // Add new text entry (with AI poem generation)
    const newEntry = {
      id: `${Date.now()}`,
      content,
      poem: "AI will analyze your entry,\nCrafting verses thoughtful and free.\nMirroring emotions you've expressed,\nIn poetic form, beautifully dressed.",
      created_at: new Date().toISOString(),
    };
    
    setEntries([newEntry, ...entries]);
  };

  return (
    <div className="relative min-h-screen bg-primary p-4">
      <div className="grid gap-4 pb-20">
        {entries.map((entry) => (
          <Card 
            key={entry.id} 
            className="bg-secondary/20 border-primary/20"
          >
            <CardContent className="p-4">
              <p className="text-primary-foreground whitespace-pre-wrap">{entry.content}</p>
              
              {entry.poem && (
                <div className="mt-4 pt-4 border-t border-primary/20">
                  <h4 className="text-accent font-semibold mb-2">AI-Generated Poem</h4>
                  <p className="text-primary-foreground/90 italic whitespace-pre-wrap">{entry.poem}</p>
                </div>
              )}
              
              <p className="mt-3 text-sm text-primary-foreground/60">
                {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
              </p>
            </CardContent>
          </Card>
        ))}
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
        onClick={toggleRecording}
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
