
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { Button } from "./ui/button";

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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[280px] bg-secondary">
        <SheetHeader>
          <SheetTitle className="text-primary">Filters</SheetTitle>
        </SheetHeader>
        <div className="mt-4 flex flex-col gap-2">
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
      </SheetContent>
    </Sheet>
  );
};

export default FilterDrawer;
