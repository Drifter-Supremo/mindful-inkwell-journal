
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Entries from "./pages/Entries";
import NewEntry from "./pages/NewEntry";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "@/contexts/AuthContext";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/entries" replace />} />
          <Route path="/entries" element={<Entries />} />
          <Route path="/new" element={<NewEntry />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </TooltipProvider>
);

export default App;
