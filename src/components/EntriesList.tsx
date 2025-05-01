
import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Mic, MicOff } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Mock data for entries
const mockEntries = [
  {
    id: "1",
    content: "Today I went for a long walk in the park and felt really refreshed afterward. The weather was perfect.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: "2",
    content: "I've been thinking about my goals for next month. I want to focus more on my health and reading.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: "3",
    content: "Had a great conversation with an old friend today. It's amazing how some connections never fade.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
  },
];

const EntriesList = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [entries, setEntries] = useState(mockEntries);

  const toggleRecording = () => {
    if (!isRecording) {
      // Start recording
      toast.info("Recording started");
      setIsRecording(true);
    } else {
      // Stop recording
      toast.success("Recording stopped");
      setIsRecording(false);
      
      // Simulate adding a new entry from the recording
      const newEntry = {
        id: `${Date.now()}`,
        content: "This is a transcription of your voice recording. It would normally be processed by a speech-to-text service.",
        created_at: new Date().toISOString(),
      };
      
      setEntries([newEntry, ...entries]);
    }
  };

  return (
    <div className="relative min-h-screen bg-primary p-4">
      <div className="grid gap-4">
        {entries.map((entry) => (
          <Card 
            key={entry.id} 
            className="bg-secondary/20 border-primary/20"
          >
            <CardContent className="p-4">
              <p className="text-primary-foreground">{entry.content.slice(0, 100)}...</p>
              <p className="mt-2 text-sm text-primary-foreground/60">
                {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
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
    </div>
  );
};

export default EntriesList;
