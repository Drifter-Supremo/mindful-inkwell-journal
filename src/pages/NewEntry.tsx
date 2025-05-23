
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
import { motion, AnimatePresence } from "framer-motion";
import { fadeInVariants, slideUpVariants, poemRevealVariants, buttonVariants } from "@/lib/animations";

// Maximum character limit for journal entries
const MAX_ENTRY_LENGTH = 3000;

const NewEntry = () => {
  const [content, setContent] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const recorderRef = useRef<RecordRTC | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

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
    <motion.div
      className="min-h-screen bg-primary p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="mx-auto max-w-2xl"
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={slideUpVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
        >
          <div className="relative">
            <Textarea
              className="min-h-[300px] bg-secondary/20 text-primary-foreground placeholder:text-primary-foreground/60"
              placeholder="Write your thoughts..."
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
          className="mt-4 flex justify-between"
          variants={fadeInVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            animate={isRecording ? { scale: [1, 1.05, 1] } : {}}
            transition={isRecording ? {
              repeat: Infinity,
              duration: 1.5,
              repeatType: "reverse"
            } : {}}
          >
            <Button
              className={cn(
                "transition-all duration-300",
                isRecording
                  ? "bg-red-500 hover:bg-red-600"
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
          </motion.div>

          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              className="bg-accent text-primary hover:bg-accent/90"
              onClick={handleSave}
              disabled={isRecording || (!content.trim() && !audioBlob)}
            >
              Save Entry
            </Button>
          </motion.div>
        </motion.div>

        {/* Placeholder for AI Poem Generation */}
        <AnimatePresence>
          {content && (
            <motion.div
              className="mt-8 p-4 border border-primary/20 rounded-md bg-secondary/10"
              variants={poemRevealVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <motion.p
                className="poem-text text-primary-foreground/80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                When you save your entry, Gorlea will write a poem inspired by your words.
              </motion.p>
              <motion.p
                className="text-accent/80 text-sm mt-2 font-poem"
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                ~ Gorlea
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default NewEntry;
