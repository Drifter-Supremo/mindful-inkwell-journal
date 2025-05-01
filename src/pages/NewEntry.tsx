
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const NewEntry = () => {
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSave = async () => {
    // Mock saving entry
    console.log("Saving entry:", content);
    toast.success("Entry saved successfully!");
    navigate("/entries");
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
        <div className="mt-4 flex justify-end">
          <Button 
            className="bg-accent text-primary hover:bg-accent/90" 
            onClick={handleSave}
          >
            Save Entry
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewEntry;
