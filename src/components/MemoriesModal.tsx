import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

// Define the Memory interface
export interface Memory {
  userId: string;
  namePreference?: string;
  personalDetails: {
    question: string;
    answer: string;
  }[];
  importantConnections: {
    name: string;
    relationship: string;
    details: string;
  }[];
  freeformMemories: string[];
  createdAt: string;
  updatedAt: string;
}

// Define the props for the MemoriesModal component
interface MemoriesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Define the questions for personal details
const personalQuestions = [
  "If you were a character in a story, how would you describe yourself?",
  "What's a small joy that always makes your day better?",
  "What's a memory that feels like home to you?"
];

const personalExamples = [
  "The underdog that wins it all in the end",
  "Listening to oldies on my drive to work",
  "The smell of pancakes in the morning"
];

const MemoriesModal = ({ open, onOpenChange }: MemoriesModalProps) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  // State for form fields
  const [namePreference, setNamePreference] = useState("");
  const [personalAnswers, setPersonalAnswers] = useState<string[]>(Array(personalQuestions.length).fill(""));
  const [connections, setConnections] = useState<{ name: string; relationship: string; details: string }[]>([
    { name: "", relationship: "", details: "" }
  ]);
  const [freeformMemory, setFreeformMemory] = useState("");

  // Load existing memories when the modal opens
  useEffect(() => {
    if (open && user) {
      loadMemories();
    }
  }, [open, user]);

  // Load memories from Firestore
  const loadMemories = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const memoryDoc = await getDoc(doc(db, "memories", user.uid));

      if (memoryDoc.exists()) {
        const data = memoryDoc.data() as Memory;

        // Set form values from loaded data
        setNamePreference(data.namePreference || "");

        // Set personal answers
        const loadedAnswers = Array(personalQuestions.length).fill("");
        data.personalDetails.forEach(detail => {
          const index = personalQuestions.indexOf(detail.question);
          if (index !== -1) {
            loadedAnswers[index] = detail.answer;
          }
        });
        setPersonalAnswers(loadedAnswers);

        // Set connections
        if (data.importantConnections.length > 0) {
          setConnections(data.importantConnections);
        }

        // Set freeform memories - use the first entry or empty string
        setFreeformMemory(data.freeformMemories.length > 0 ? data.freeformMemories[0] : "");
      }
    } catch (error) {
      console.error("Error loading memories:", error);
      toast.error("Failed to load your memories");
    } finally {
      setIsLoading(false);
    }
  };

  // Save memories to Firestore
  const saveMemories = async () => {
    if (!user) {
      toast.error("You must be signed in to save memories");
      return;
    }

    setIsSaving(true);
    try {
      // Format the data
      const personalDetails = personalQuestions.map((question, index) => ({
        question,
        answer: personalAnswers[index].trim()
      })).filter(detail => detail.answer !== "");

      const validConnections = connections.filter(
        conn => conn.name.trim() !== "" || conn.relationship.trim() !== "" || conn.details.trim() !== ""
      );

      // Process freeform memories as a single entry instead of splitting by blank lines
      const freeformMemories = freeformMemory.trim() !== ""
        ? [freeformMemory.trim()]
        : [];

      const memoryData: Memory = {
        userId: user.uid,
        namePreference: namePreference.trim() || undefined,
        personalDetails,
        importantConnections: validConnections,
        freeformMemories,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save to Firestore
      await setDoc(doc(db, "memories", user.uid), memoryData);

      toast.success("Your memories have been saved");
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving memories:", error);
      toast.error("Failed to save your memories");
    } finally {
      setIsSaving(false);
    }
  };

  // Add a new connection field
  const addConnection = () => {
    setConnections([...connections, { name: "", relationship: "", details: "" }]);
  };

  // Update a connection field
  const updateConnection = (index: number, field: keyof typeof connections[0], value: string) => {
    const newConnections = [...connections];
    newConnections[index][field] = value;
    setConnections(newConnections);
  };

  // Remove a connection field
  const removeConnection = (index: number) => {
    if (connections.length > 1) {
      const newConnections = [...connections];
      newConnections.splice(index, 1);
      setConnections(newConnections);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto bg-secondary border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-primary">
            Gorlea's Memory Bank
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-primary">Loading your memories...</span>
          </div>
        ) : (
          <>
            <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-4 bg-primary/10">
                <TabsTrigger value="personal" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-primary/20 data-[state=inactive]:text-primary">Personal</TabsTrigger>
                <TabsTrigger value="connections" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-primary/20 data-[state=inactive]:text-primary">Connections</TabsTrigger>
                <TabsTrigger value="freeform" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-primary/20 data-[state=inactive]:text-primary">Freeform</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="namePreference" className="text-primary">
                    What should Gorlea call you?
                  </Label>
                  <Input
                    id="namePreference"
                    value={namePreference}
                    onChange={(e) => setNamePreference(e.target.value)}
                    placeholder="e.g., Samurai Senny"
                    className="bg-secondary-foreground/10 text-primary"
                  />
                </div>

                {personalQuestions.map((question, index) => (
                  <div key={index} className="space-y-2">
                    <Label htmlFor={`personal-${index}`} className="text-primary">
                      {question}
                    </Label>
                    <Textarea
                      id={`personal-${index}`}
                      value={personalAnswers[index]}
                      onChange={(e) => {
                        const newAnswers = [...personalAnswers];
                        newAnswers[index] = e.target.value;
                        setPersonalAnswers(newAnswers);
                      }}
                      placeholder={`e.g., ${personalExamples[index]}`}
                      className="bg-secondary-foreground/10 min-h-[80px] text-primary"
                    />
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="connections" className="space-y-4">
                <p className="text-sm text-primary/70">
                  Tell Gorlea about important people, places, or things in your life.
                </p>

                <AnimatePresence>
                  {connections.map((connection, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3 p-3 border border-primary/10 rounded-md mb-3"
                    >
                      <div className="flex justify-between">
                        <Label className="text-primary font-medium">Connection {index + 1}</Label>
                        {connections.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeConnection(index)}
                            className="h-6 text-destructive hover:text-destructive/80"
                          >
                            Remove
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor={`name-${index}`} className="text-primary text-sm">
                            Name
                          </Label>
                          <Input
                            id={`name-${index}`}
                            value={connection.name}
                            onChange={(e) => updateConnection(index, "name", e.target.value)}
                            placeholder="e.g., Luna"
                            className="bg-secondary-foreground/10 text-primary"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor={`relationship-${index}`} className="text-primary text-sm">
                            Relationship
                          </Label>
                          <Input
                            id={`relationship-${index}`}
                            value={connection.relationship}
                            onChange={(e) => updateConnection(index, "relationship", e.target.value)}
                            placeholder="e.g., My cat"
                            className="bg-secondary-foreground/10 text-primary"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor={`details-${index}`} className="text-primary text-sm">
                          Details
                        </Label>
                        <Textarea
                          id={`details-${index}`}
                          value={connection.details}
                          onChange={(e) => updateConnection(index, "details", e.target.value)}
                          placeholder="e.g., She's a black cat who sleeps on my keyboard while I work"
                          className="bg-secondary-foreground/10 min-h-[60px] text-primary"
                        />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <Button
                  variant="outline"
                  onClick={addConnection}
                  className="w-full mt-2"
                >
                  Add Another Connection
                </Button>
              </TabsContent>

              <TabsContent value="freeform" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="freeform" className="text-primary">
                    What else should Gorlea know about you?
                  </Label>
                  <p className="text-sm text-primary/70 mb-2">
                    Share anything else you'd like Gorlea to subtly reference in your poems.
                  </p>
                  <Textarea
                    id="freeform"
                    value={freeformMemory}
                    onChange={(e) => setFreeformMemory(e.target.value)}
                    placeholder="e.g., I was born in Chicago and grew up in Oklahoma city. My mom passed away in 2019 and I miss her. My favorite color is dark green. I love to write movie scripts and learn about AI."
                    className="bg-secondary-foreground/10 min-h-[200px] text-primary"
                  />
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-6 flex-col sm:flex-row gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="w-full sm:w-auto sm:mr-2 order-2 sm:order-1"
              >
                Cancel
              </Button>
              <Button
                onClick={saveMemories}
                disabled={isSaving}
                className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 order-1 sm:order-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Memories"
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MemoriesModal;
