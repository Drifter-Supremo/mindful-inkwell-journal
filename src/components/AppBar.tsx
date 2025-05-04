
import { Menu } from "lucide-react";
import { Button } from "./ui/button";

type AppBarProps = {
  onMenuClick: () => void;
};

const AppBar = ({ onMenuClick }: AppBarProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-primary px-4 py-3">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="text-primary-foreground">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex justify-center items-center">
          <img
            src="/Gorlea-logo.png"
            alt="Gorlea's Ink"
            className="h-10 object-contain"
          />
        </div>
        <div className="w-10" /> {/* Spacer for visual balance */}
      </div>
    </header>
  );
};

export default AppBar;
