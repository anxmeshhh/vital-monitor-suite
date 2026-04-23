import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { VitalsProvider } from "@/context/VitalsContext";
import { NavBar } from "@/components/NavBar";
import Patient from "./pages/Patient";
import Doctor from "./pages/Doctor";
import Emergency from "./pages/Emergency";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <VitalsProvider>
          <NavBar />
          <Routes>
            <Route path="/" element={<Patient />} />
            <Route path="/doctor" element={<Doctor />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </VitalsProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
