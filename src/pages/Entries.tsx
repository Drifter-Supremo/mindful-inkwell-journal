
import { useState } from "react";
import AppBar from "@/components/AppBar";
import FilterDrawer from "@/components/FilterDrawer";
import EntriesList from "@/components/EntriesList";

const Entries = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  return (
    <div className="min-h-screen">
      <AppBar onMenuClick={() => setDrawerOpen(true)} />
      <FilterDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />
      <EntriesList activeFilter={activeFilter} />
    </div>
  );
};

export default Entries;
