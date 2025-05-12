import { useState, useEffect, useRef, useMemo } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Mic, MicOff, Plus, ChevronDown, ChevronUp, Trash, FilterX, X, Timer } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/formatDate";
import NewEntryModal from "./NewEntryModal";
import { motion, AnimatePresence } from "framer-motion";

import { saveEntry } from "../saveEntry";
import { generatePoem } from "../generatePoem";
import { useAuth } from "@/contexts/AuthContext";
import { useSearch } from "@/contexts/SearchContext";
import { getDateRangeForFilter, isDateInRange } from "@/lib/dateFilters";

import { deleteEntry } from "../deleteEntry";
import DeleteEntryModal from "./DeleteEntryModal";

type EntriesListProps = {
  activeFilter: string | null;
};

const EntriesList = ({ activeFilter }: EntriesListProps) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
  const [longPressTimeout, setLongPressTimeout] = useState<NodeJS.Timeout | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [recordingTime, setRecordingTime] = useState(60); // 60 seconds = 1 minute
  const [timerActive, setTimerActive] = useState(false);
  const { user } = useAuth();
  const {
    allEntries,
    refreshEntries,
    selectedEntryId,
    setSelectedEntryId
  } = useSearch();
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch all entries when user changes
  useEffect(() => {
    if (user) {
      refreshEntries();
    }
  }, [user, refreshEntries]);

  // Timer effect for recording
  useEffect(() => {
    if (timerActive && recordingTime > 0) {
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev - 1);
      }, 1000);
    } else if (recordingTime === 0 && isRecording) {
      // Auto-stop recording when timer reaches 0
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        toast.info("Recording time limit reached");
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [timerActive, recordingTime, isRecording]);

  // Handle selected entry from search
  useEffect(() => {
    if (selectedEntryId) {
      setExpandedEntryId(selectedEntryId);
      // Scroll to the selected entry with a slight delay to ensure rendering
      setTimeout(() => {
        const element = document.getElementById(`entry-${selectedEntryId}`);
        if (element) {
          // Scroll with animation
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });

          // Add a temporary highlight animation class
          element.classList.add('highlight-pulse');

          // Remove the highlight class after animation completes
          setTimeout(() => {
            element.classList.remove('highlight-pulse');
          }, 2000);
        }
      }, 100);

      // Clear the selected entry ID after a delay to allow for future selections of the same entry
      setTimeout(() => {
        setSelectedEntryId(null);
      }, 3000);
    }
  }, [selectedEntryId, setSelectedEntryId]);

  // Filter entries based on activeFilter
  const filteredEntries = useMemo(() => {
    if (!activeFilter) return allEntries;

    const dateRange = getDateRangeForFilter(activeFilter);
    if (!dateRange) return allEntries;

    return allEntries.filter(entry => isDateInRange(entry.created_at, dateRange));
  }, [allEntries, activeFilter]);

  // Removed simulated voice entry logic. Use NewEntry page for voice entries.

  const handleNewTextEntry = async (content: string) => {
    if (!user) {
      toast.error("You must be signed in to save an entry.");
      return;
    }
    const userId = user.uid;
    toast.loading("Gorlea is writing your poem...");
    let poem = "";
    try {
      poem = await generatePoem(content, userId); // Call generatePoem with userId
      toast.dismiss();
      toast.success("Poem generated!");
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to generate poem. Saving entry without poem.");
    }
    await saveEntry(content, poem, userId);
    // Refresh entries from Firestore
    await refreshEntries();
  };

  const toggleExpandEntry = (id: string) => {
    setExpandedEntryId(expandedEntryId === id ? null : id);
  };

  // Transcribe audio blob using OpenAI Whisper
  const transcribeAudio = async (blob: Blob): Promise<string> => {
    const formData = new FormData();
    formData.append('file', blob, 'recording.webm');
    formData.append('model', 'gpt-4o-mini-transcribe');
    formData.append('response_format', 'text');
    const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}` },
      body: formData
    });
    const text = await res.text();
    return text;
  };

  return (
    <div className="relative min-h-screen bg-primary p-4">
      <motion.div
        className="grid gap-4 pb-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence>
          {activeFilter && (
            <motion.div
              className="bg-secondary/30 rounded-lg p-3 mb-2 flex items-center justify-between border-[#4CAF50] border-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center">
                <FilterX className="h-4 w-4 mr-2 text-primary-foreground/70" />
                <span className="text-primary-foreground/90">Filtered by: {activeFilter}</span>
              </div>
              <span className="text-xs text-primary-foreground/60">
                {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'} found
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {allEntries.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center h-[50vh] text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="max-w-md p-4">
              <motion.p
                className="text-primary-foreground/90 text-xl mb-3"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                No journal entries yet
              </motion.p>
              <motion.p
                className="text-primary-foreground/70 text-sm"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Start your journey by creating your first entry
              </motion.p>
            </div>
          </motion.div>
        ) : filteredEntries.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center h-[50vh] text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="max-w-md p-4">
              <motion.p
                className="text-primary-foreground/90 text-xl mb-3"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                No entries match your filter
              </motion.p>
              <motion.p
                className="text-primary-foreground/70 text-sm"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Try a different filter or clear the current one
              </motion.p>
            </div>
          </motion.div>
        ) : (
          filteredEntries.map((entry, index) => {
            const isExpanded = expandedEntryId === entry.id;
            const contentPreview = entry.content.length > 100 && !isExpanded
              ? `${entry.content.substring(0, 100)}...`
              : entry.content;

          // Desktop delete handler
          const handleDelete = async (e: React.MouseEvent) => {
            e.stopPropagation();
            if (window.confirm("Are you sure you want to delete this entry? This cannot be undone.")) {
              if (user) {
                await deleteEntry(entry.id, user.uid);
                toast.success("Entry deleted.");
                await refreshEntries();
              }
            }
          };

          // Mobile long-press handlers
          const handleLongPressStart = (_e: React.TouchEvent) => {
            if (window.innerWidth < 768) { // Tailwind 'md' breakpoint
              setLongPressTimeout(setTimeout(() => {
                setEntryToDelete(entry.id);
                setDeleteModalOpen(true);
              }, 600)); // 600ms for long press
            }
          };
          const handleLongPressEnd = () => {
            if (longPressTimeout) clearTimeout(longPressTimeout);
          };


          return (
            <motion.div
              key={entry.id}
              id={`entry-${entry.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={cn(
                "transition-all duration-300 hover:shadow-md",
                selectedEntryId === entry.id && "ring-2 ring-accent shadow-lg shadow-accent/30"
              )}
            >
            <Card
              className={cn(
                "bg-secondary/20 border-primary/20 transition-all duration-300 hover:translate-y-[-2px]",
                isExpanded ? "shadow-md" : ""
              )}
              onTouchStart={handleLongPressStart}
              onTouchEnd={handleLongPressEnd}
              onTouchMove={handleLongPressEnd}
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
                      <span className="text-accent text-sm">
                        Click to read more
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-1 h-6 w-6 p-0 text-primary-foreground/60 hover:text-primary-foreground hover:bg-transparent hover:scale-110 transition-transform"
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
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label="Delete entry"
                      className="h-6 w-6 p-0 text-destructive hover:text-destructive/80 hidden md:inline-flex hover:scale-110 transition-transform"
                      onClick={handleDelete}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && entry.poem && (
                    <motion.div
                      className="mt-4 pt-4 border-t border-primary/20"
                      initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="poem-text text-primary-foreground/90 whitespace-pre-wrap">
                        {entry.poem}
                      </p>
                      {entry.poem && (
                        <p className="text-accent/80 text-sm mt-2 font-poem">
                          ~ Gorlea
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <p className="mt-3 text-sm text-primary-foreground/60">
                  {formatDate(entry.created_at)}
                </p>
              </CardContent>
            </Card>
            </motion.div>
          );
        })
        )}
      </motion.div>

      {/* New Entry Button - Disabled while recording */}
      <Button
        size="icon"
        className={cn(
          "fixed bottom-24 right-6 h-14 w-14 rounded-full transition-all duration-300 shadow-md",
          isRecording
            ? "bg-accent/40 cursor-not-allowed"
            : "bg-accent hover:bg-accent/90 hover:shadow-lg"
        )}
        onClick={() => !isRecording && setModalOpen(true)}
        disabled={isRecording}
        aria-disabled={isRecording}
        title={isRecording ? "Finish recording first" : "Add new entry"}
      >
        <Plus className={cn("h-6 w-6 text-primary", isRecording && "opacity-50")} />
      </Button>

      {/* Voice Recording Button */}
      <div className="fixed bottom-6 right-6 flex items-center space-x-4">
        {/* Timer Display - Appears when recording */}
        <AnimatePresence>
          {isRecording && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="flex items-center bg-secondary/90 rounded-full px-3 py-1 shadow-md"
            >
              <Timer className="h-4 w-4 mr-1 text-primary" />
              <motion.div
                className="text-primary font-medium"
                key={recordingTime} // Force re-render on time change for animation
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {Math.floor(recordingTime / 60)}:{recordingTime % 60 < 10 ? '0' : ''}{recordingTime % 60}
              </motion.div>
              <motion.div
                className="w-full h-1 bg-primary/20 rounded-full mt-1 ml-2 overflow-hidden"
                style={{ width: '40px' }}
              >
                <motion.div
                  className="h-full bg-accent"
                  style={{
                    width: `${(recordingTime / 60) * 100}%`,
                    transition: 'width 1s linear'
                  }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cancel Recording Button - Appears when recording */}
        <AnimatePresence>
          {isRecording && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                size="icon"
                className="h-14 w-14 rounded-full bg-accent/80 hover:bg-accent transition-all duration-300 shadow-md hover:shadow-lg"
                onClick={() => {
                  // Cancel recording without saving
                  if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                    // Stop the media recorder
                    mediaRecorderRef.current.stop();
                    // Clear the recorded chunks
                    chunksRef.current = [];
                    // Reset recording state
                    setIsRecording(false);
                    // Stop the timer
                    setTimerActive(false);
                    // Notify user
                    toast.info("Recording canceled");

                    // Override the onstop handler to do nothing
                    mediaRecorderRef.current.onstop = () => {};
                  }
                }}
              >
                <X className="h-6 w-6 text-primary" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Recording Button */}
        <Button
          size="icon"
          className={cn(
            "h-14 w-14 rounded-full transition-all duration-300 shadow-md hover:shadow-lg",
            isRecording
              ? "bg-red-500 hover:bg-red-600 animate-pulse"
              : "bg-accent hover:bg-accent/90"
          )}
          onClick={async () => {
            if (!isRecording) {
              // Start recording
              const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
              const mr = new MediaRecorder(stream);
              mediaRecorderRef.current = mr;
              chunksRef.current = [];
              mr.ondataavailable = (e) => chunksRef.current.push(e.data);
              mr.start();
              toast.info("Recording started (1 minute limit)");
              setIsRecording(true);
              // Reset and start the timer
              setRecordingTime(60);
              setTimerActive(true);
            } else {
              // Stop and process recording
              mediaRecorderRef.current?.stop();
              setIsRecording(false);
              setTimerActive(false);
              toast.success("Recording stopped");
              mediaRecorderRef.current!.onstop = async () => {
                toast.loading("Transcribing voice note...");
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                try {
                  const entryContent = await transcribeAudio(blob);
                  toast.dismiss();
                  toast.success("Voice note transcribed!");
                  if (user) {
                    const userId = user.uid;
                    toast.loading("Gorlea is writing your poem...");
                    let poem = "";
                    try {
                      poem = await generatePoem(entryContent, userId); // Call generatePoem with userId
                      toast.dismiss();
                      toast.success("Poem generated!");
                    } catch (err) {
                      toast.dismiss();
                      toast.error("Failed to generate poem. Saving entry without poem.");
                    }
                    await saveEntry(entryContent, poem, userId);
                    toast.success("Entry saved successfully!");
                    await refreshEntries();
                  }
                } catch (err) {
                  toast.dismiss();
                  toast.error("Transcription failed");
                }
              };
            }
          }}
        >
          {isRecording ? (
            <MicOff className="h-6 w-6 text-primary animate-pulse" />
          ) : (
            <Mic className="h-6 w-6 text-primary" />
          )}
        </Button>
      </div>

      <NewEntryModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSave={handleNewTextEntry}
      />
      {/* Delete Entry Modal for mobile long-press */}
      <DeleteEntryModal
        open={deleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        onConfirm={async () => {
          if (entryToDelete && user) {
            await deleteEntry(entryToDelete, user.uid);
            toast.success("Entry deleted.");
            await refreshEntries();
          }
          setDeleteModalOpen(false);
        }}
      />
    </div>
  );
};

export default EntriesList;
