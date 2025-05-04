
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";
import { CalendarDays, Calendar, CalendarClock, CalendarRange, X, LogOut, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { drawerItemVariants, fadeInVariants } from "@/lib/animations";

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

  const { user, signOut, isSigningOut } = useAuth();

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
        <AnimatePresence>
          {user && (
            <motion.div
              className="py-4 border-b border-primary/10 mb-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="flex items-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Avatar className="h-12 w-12 border-2 border-primary/20">
                    <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
                <motion.div
                  className="flex flex-col"
                  variants={fadeInVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.3 }}
                >
                  <span className="font-medium text-primary">{user.displayName}</span>
                  <span className="text-xs text-primary/60">{user.email}</span>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <SheetHeader>
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <SheetTitle className="text-primary">Filters</SheetTitle>
          </motion.div>
        </SheetHeader>

        <motion.div
          className="mt-4 flex flex-col gap-2 flex-1"
          variants={drawerItemVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {activeFilter && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="ghost"
                  className="justify-between text-primary mb-2 border-[#4CAF50] border-2 bg-transparent w-full"
                  onClick={() => {
                    setActiveFilter(null);
                    onOpenChange(false); // Close drawer after clearing filter
                  }}
                >
                  <span>Clear Filter: {activeFilter}</span>
                  <X className="h-4 w-4 ml-2" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {filters.map((filter, index) => (
            <motion.div
              key={filter.name}
              variants={drawerItemVariants}
              custom={index}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.02 }}
              transition={{ delay: 0.1 * index }}
            >
              <Button
                variant="ghost"
                className={cn(
                  "justify-start text-primary w-full",
                  activeFilter === filter.name && "border-[#4CAF50] border-2 bg-transparent"
                )}
                onClick={() => handleFilterClick(filter.name)}
              >
                {filter.icon}
                {filter.name}
              </Button>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-auto mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <Button
            className="bg-destructive text-primary hover:bg-destructive/90 w-full"
            onClick={handleLogout}
            disabled={isSigningOut}
          >
            {isSigningOut ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="mr-2"
                >
                  <Loader2 className="h-4 w-4" />
                </motion.div>
                Signing Out...
              </>
            ) : (
              <>
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </>
            )}
          </Button>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
};

export default FilterDrawer;
