import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Mic, MicOff, Plus, ChevronDown, ChevronUp, Trash } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import NewEntryModal from "./NewEntryModal";

import { getEntries } from "../getEntries";
import { saveEntry } from "../saveEntry";
import { useAuth } from "@/contexts/AuthContext";


import { deleteEntry } from "../deleteEntry";
import DeleteEntryModal from "./DeleteEntryModal";

const EntriesList = () => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
  const [longPressTimeout, setLongPressTimeout] = useState<NodeJS.Timeout | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [entries, setEntries] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);
  const { user } = useAuth();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

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
      <div className="grid gap-4 pb-20">
        {entries.map((entry) => {
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
                const updatedEntries = await getEntries(user.uid);
                setEntries(updatedEntries);
              }
            }
          };

          // Mobile long-press handlers
          const handleLongPressStart = (e: React.TouchEvent) => {
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
            <Card 
              key={entry.id} 
              className={cn(
                "bg-secondary/20 border-primary/20 transition-all duration-300",
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
                      <span className="text-accent text-sm">Click to read more</span>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
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
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label="Delete entry"
                      className="h-6 w-6 p-0 text-destructive hover:text-destructive/80 hidden md:inline-flex"
                      onClick={handleDelete}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
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
            // Start recording
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mr = new MediaRecorder(stream);
            mediaRecorderRef.current = mr;
            chunksRef.current = [];
            mr.ondataavailable = (e) => chunksRef.current.push(e.data);
            mr.start();
            toast.info("Recording started");
            setIsRecording(true);
          } else {
            // Stop and process recording
            mediaRecorderRef.current?.stop();
            setIsRecording(false);
            toast.success("Recording stopped");
            mediaRecorderRef.current!.onstop = async () => {
              toast.loading("Transcribing voice note...");
              const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
              try {
                const entryContent = await transcribeAudio(blob);
                toast.dismiss();
                toast.success("Voice note transcribed!");
                if (user) {
                  const poem = "When integrated with AI, a poem based on your journal entry will appear here.";
                  const userId = user.uid;
                  await saveEntry(entryContent, poem, userId);
                  toast.success("Entry saved successfully!");
                  const updatedEntries = await getEntries(userId);
                  setEntries(updatedEntries);
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
            const updatedEntries = await getEntries(user.uid);
            setEntries(updatedEntries);
          }
          setDeleteModalOpen(false);
        }}
      />
    </div>
  );
};

export default EntriesList;
