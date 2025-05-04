
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";
import { CalendarDays, Calendar, CalendarClock, CalendarRange, X } from "lucide-react";

type FilterDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeFilter: string | null;
  setActiveFilter: (filter: string | null) => void;
};

const FilterDrawer = ({ open, onOpenChange, activeFilter, setActiveFilter }: FilterDrawerProps) => {
  const filters = [
    { name: "Today", type: "date", icon: <CalendarDays className="mr-2 h-4 w-4" /> },
    { name: "This Week", type: "date", icon: <Calendar className="mr-2 h-4 w-4" /> },
    { name: "Last Month", type: "date", icon: <CalendarClock className="mr-2 h-4 w-4" /> },
    { name: "Last Year", type: "date", icon: <CalendarRange className="mr-2 h-4 w-4" /> },
  ];

  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    onOpenChange(false);
  };

  const handleFilterClick = (filterName: string) => {
    // If the filter is already active, clear it
    if (activeFilter === filterName) {
      setActiveFilter(null);
    } else {
      setActiveFilter(filterName);
    }
    onOpenChange(false); // Close drawer after selection
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[280px] bg-secondary flex flex-col h-full">
        {user && (
          <div className="py-4 border-b border-primary/10 mb-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-primary/20">
                <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium text-primary">{user.displayName}</span>
                <span className="text-xs text-primary/60">{user.email}</span>
              </div>
            </div>
          </div>
        )}
        <SheetHeader>
          <SheetTitle className="text-primary">Filters</SheetTitle>
        </SheetHeader>
        <div className="mt-4 flex flex-col gap-2 flex-1">
          {activeFilter && (
            <Button
              variant="ghost"
              className="justify-between text-primary mb-2 border-[#4CAF50] border-2 bg-transparent"
              onClick={() => {
                setActiveFilter(null);
                onOpenChange(false); // Close drawer after clearing filter
              }}
            >
              <span>Clear Filter: {activeFilter}</span>
              <X className="h-4 w-4 ml-2" />
            </Button>
          )}
          {filters.map((filter) => (
            <Button
              key={filter.name}
              variant="ghost"
              className={cn(
                "justify-start text-primary",
                activeFilter === filter.name && "border-[#4CAF50] border-2 bg-transparent"
              )}
              onClick={() => handleFilterClick(filter.name)}
            >
              {filter.icon}
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
