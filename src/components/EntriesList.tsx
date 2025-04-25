
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Mic } from "lucide-react";

const mockEntries = [
  {
    id: "1",
    content: "Today was a wonderful day. I spent time in nature...",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    content: "Reflecting on my goals and aspirations...",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const EntriesList = () => {
  const handleRecord = async () => {
    // Stub for voice recording functionality
    console.log("Initiating voice recording...");
    // await callFirebaseFunction("transcribe");
    // await callFirebaseFunction("enrich");
  };

  return (
    <div className="relative min-h-screen bg-secondary/20 p-4">
      <div className="grid gap-4">
        {mockEntries.map((entry) => (
          <Card key={entry.id} className="bg-white/80 backdrop-blur">
            <CardContent className="p-4">
              <p className="text-primary">{entry.content.slice(0, 40)}...</p>
              <p className="mt-2 text-sm text-primary/60">
                {new Date(entry.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Button
        size="icon"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-accent hover:bg-accent/90"
        onClick={handleRecord}
      >
        <Mic className="h-6 w-6 text-white" />
      </Button>
    </div>
  );
};

export default EntriesList;
