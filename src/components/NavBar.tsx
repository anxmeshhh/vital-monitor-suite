import { NavLink } from "react-router-dom";
import { Activity } from "lucide-react";
import { useVitalsCtx } from "@/context/VitalsContext";
import { cn } from "@/lib/utils";

export function NavBar() {
  const { connected } = useVitalsCtx();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "px-3 py-2 rounded-md text-sm font-medium transition-colors",
      isActive
        ? "bg-secondary text-foreground"
        : "text-muted-foreground hover:text-foreground hover:bg-secondary/60",
    );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container flex h-14 items-center justify-between gap-4">
        <NavLink to="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
            <Activity className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <span className="font-semibold tracking-tight">
            Vital<span className="text-primary">Glove</span>
          </span>
        </NavLink>

        <nav className="flex items-center gap-1">
          <NavLink to="/" end className={linkClass}>Patient View</NavLink>
          <NavLink to="/doctor" className={linkClass}>Doctor View</NavLink>
          <NavLink to="/emergency" className={linkClass}>Emergency</NavLink>
        </nav>

        <div className="flex items-center gap-2 text-xs">
          <span
            className={cn(
              "inline-block h-2.5 w-2.5 rounded-full",
              connected ? "bg-safe shadow-glow-safe" : "bg-critical animate-blink",
            )}
            aria-hidden
          />
          <span className="text-muted-foreground hidden sm:inline">
            ESP32 {connected ? "Connected" : "Disconnected"}
          </span>
        </div>
      </div>
    </header>
  );
}
