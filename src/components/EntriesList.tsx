
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Mic } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";

const EntriesList = () => {
  const { user } = useAuth();

  const { data: entries = [] } = useQuery({
    queryKey: ["entries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("entries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleRecord = async () => {
    // Stub for voice recording functionality
    console.log("Initiating voice recording...");
    // await callFirebaseFunction("transcribe");
    // await callFirebaseFunction("enrich");
  };

  return (
    <div className="relative min-h-screen bg-secondary/20 p-4">
      <div className="grid gap-4">
        {entries.map((entry) => (
          <Card key={entry.id} className="bg-white/80 backdrop-blur">
            <CardContent className="p-4">
              <p className="text-primary">{entry.content.slice(0, 40)}...</p>
              <p className="mt-2 text-sm text-primary/60">
                {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
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
