
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";

const NewEntry = () => {
  const [content, setContent] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!content.trim()) {
      toast.error("Please enter some content before saving");
      return;
    }
    
    // Mock saving entry
    console.log("Saving entry:", content);
    toast.success("Entry saved successfully!");
    navigate("/entries");
  };

  const toggleRecording = () => {
    if (!isRecording) {
      // Start recording
      toast.info("Voice recording started");
      setIsRecording(true);

      // Simulating recording - in a real app, this would use Web Audio API
      setTimeout(() => {
        toast.info("Listening to your journal entry...");
      }, 1000);
    } else {
      // Stop recording
      setIsRecording(false);
      toast.success("Recording completed");

      // Simulate transcription delay
      toast.loading("Transcribing your entry...");
      
      setTimeout(() => {
        // Update text area with transcription
        setContent(prev => 
          prev + (prev ? "\n\n" : "") + 
          "This is where your voice recording would be transcribed to text. " +
          "When implemented with AI, your exact words will appear here as you spoke them."
        );
        toast.dismiss();
        toast.success("Voice entry transcribed");
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-primary p-4">
      <div className="mx-auto max-w-2xl">
        <Textarea
          className="min-h-[300px] bg-secondary/20 text-primary-foreground placeholder:text-primary-foreground/60"
          placeholder="Write your thoughts..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        
        <div className="mt-4 flex justify-between">
          <Button
            className={cn(
              "transition-all duration-300",
              isRecording 
                ? "bg-red-500 hover:bg-red-600 animate-pulse"
                : "bg-accent/80 hover:bg-accent"
            )}
            onClick={toggleRecording}
          >
            {isRecording ? (
              <>
                <MicOff className="mr-2 h-4 w-4" />
                Stop Recording
              </>
            ) : (
              <>
                <Mic className="mr-2 h-4 w-4" />
                Record Voice Entry
              </>
            )}
          </Button>
          
          <Button 
            className="bg-accent text-primary hover:bg-accent/90" 
            onClick={handleSave}
          >
            Save Entry
          </Button>
        </div>

        {/* Placeholder for AI Poem Generation */}
        {content && (
          <div className="mt-8 p-4 border border-primary/20 rounded-md bg-secondary/10">
            <h3 className="text-accent font-semibold mb-2">AI Poem Preview</h3>
            <p className="text-primary-foreground/80 italic">
              When integrated with AI, a poem based on your journal entry will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewEntry;
