
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
        <h1 className="text-xl font-semibold text-primary-foreground">Mindful Inkwell</h1>
        <div className="w-10" /> {/* Spacer for visual balance */}
      </div>
    </header>
  );
};

export default AppBar;
