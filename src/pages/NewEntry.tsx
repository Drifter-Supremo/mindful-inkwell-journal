
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const NewEntry = () => {
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSave = async () => {
    // Stub for saving entry
    console.log("Saving entry:", content);
    navigate("/entries");
  };

  return (
    <div className="min-h-screen bg-secondary/20 p-4">
      <div className="mx-auto max-w-2xl">
        <Textarea
          className="min-h-[300px] bg-white/80 backdrop-blur"
          placeholder="Write your thoughts..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="mt-4 flex justify-end">
          <Button className="bg-accent text-white hover:bg-accent/90" onClick={handleSave}>
            Save Entry
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewEntry;
