
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useRef } from "react";
import RecordRTC from "recordrtc";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { saveEntry } from "../saveEntry";
import { useAuth } from "@/contexts/AuthContext";

const NewEntry = () => {
  const [content, setContent] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const recorderRef = useRef<RecordRTC | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSave = async () => {
    let entryContent = content;
    if (!entryContent.trim() && !audioBlob) {
      toast.error("Please enter some content or record audio before saving");
      return;
    }
    if (!user) {
      toast.error("You must be signed in to save an entry.");
      return;
    }
    // Simulate transcription if audioBlob exists and no text was entered
    if (audioBlob && !entryContent.trim()) {
      toast.loading("Transcribing voice note...");
      await new Promise((res) => setTimeout(res, 1200));
      entryContent = "Simulated transcription: This is where your voice note would be transcribed to text using AI.";
      // Do not call setContent here, just use entryContent for saving
      toast.dismiss();
      toast.success("Voice note transcribed!");
    }
    // Placeholder for AI poem generation
    const poem = "When integrated with AI, a poem based on your journal entry will appear here.";
    const userId = user.uid;
    await saveEntry(entryContent, poem, userId);
    toast.success("Entry saved successfully!");
    navigate("/entries");
  };

  const toggleRecording = async () => {
    if (!isRecording) {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new RecordRTC(stream, {
          type: "audio",
          mimeType: "audio/webm",
          recorderType: RecordRTC.MediaStreamRecorder,
        });
        recorder.startRecording();
        recorderRef.current = recorder;
        setIsRecording(true);
        setAudioURL(null);
        setAudioBlob(null);
        toast.info("Voice recording started");
      } catch (err) {
        toast.error("Microphone access denied or unavailable.");
      }
    } else {
      // Stop recording
      setIsRecording(false);
      const recorder = recorderRef.current;
      if (recorder) {
        recorder.stopRecording(async () => {
          const blob = recorder.getBlob();
          setAudioBlob(blob);
          const url = URL.createObjectURL(blob);
          setAudioURL(url);
          toast.success("Recording completed");

          // Simulate transcription and save entry automatically
          if (!content.trim()) {
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
              navigate("/entries");
            }
          }
        });
        recorderRef.current = null;
      }
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
            disabled={isRecording || (!content.trim() && !audioBlob)}
          >
            Save Entry
          </Button>
        </div>

        {/* Placeholder for AI Poem Generation */}
        {content && (
          <div className="mt-8 p-4 border border-primary/20 rounded-md bg-secondary/10">
            <p className="poem-text text-primary-foreground/80">
              When you save your entry, Gorlea will write a poem inspired by your words.
            </p>
            <p className="text-accent/80 text-sm mt-2 font-poem">~ Gorlea</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewEntry;
