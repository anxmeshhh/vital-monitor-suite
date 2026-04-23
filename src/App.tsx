import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { VitalsProvider } from "@/context/VitalsContext";
import { ConnectionProvider } from "@/context/ConnectionContext";
import { AuthProvider } from "@/context/AuthContext";
import { NavBar } from "@/components/NavBar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Patient from "./pages/Patient";
import Doctor from "./pages/Doctor";
import Emergency from "./pages/Emergency";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Settings from "./pages/Settings";
import FamilyHub from "./pages/FamilyHub";
import FamilyMembers from "./pages/FamilyMembers";
import Documents from "./pages/Documents";
import Appointments from "./pages/Appointments";
import Medications from "./pages/Medications";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const HIDE_NAV_ROUTES = new Set(["/login", "/signup"]);

function Shell() {
  const location = useLocation();
  const showNav = !HIDE_NAV_ROUTES.has(location.pathname);
  return (
    <>
      {showNav && <NavBar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route
          path="/"
          element={
            <ProtectedRoute allow={["patient"]}>
              <Patient />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor"
          element={
            <ProtectedRoute allow={["doctor"]}>
              <Doctor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/emergency"
          element={
            <ProtectedRoute>
              <Emergency />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ConnectionProvider>
            <VitalsProvider>
              <Shell />
            </VitalsProvider>
          </ConnectionProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
