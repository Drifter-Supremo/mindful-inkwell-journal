
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";

type FilterDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const FilterDrawer = ({ open, onOpenChange }: FilterDrawerProps) => {
  const filters = [
    { name: "Today", type: "date" },
    { name: "This Week", type: "date" },
    { name: "Happy", type: "mood" },
    { name: "Reflective", type: "mood" },
    { name: "Important", type: "tag" },
    { name: "Personal", type: "tag" },
  ];

  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[280px] bg-secondary flex flex-col h-full">
        <SheetHeader>
          <SheetTitle className="text-primary">Filters</SheetTitle>
        </SheetHeader>
        <div className="mt-4 flex flex-col gap-2 flex-1">
          {filters.map((filter) => (
            <Button
              key={filter.name}
              variant="ghost"
              className="justify-start text-primary hover:bg-primary hover:text-white"
            >
              {filter.name}
            </Button>
          ))}
        </div>
        <Button
          className="mt-auto mb-2 bg-destructive text-primary hover:bg-destructive/90"
          onClick={handleLogout}
        >
          Log Out
        </Button>
      </SheetContent>
    </Sheet>
  );
};

export default FilterDrawer;
