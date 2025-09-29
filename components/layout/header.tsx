import { Network } from "lucide-react";

export function Header() {
  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Network className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-xl font-bold text-foreground">
            Graph Algorithm Visualizer
          </h1>
          <p className="text-xs text-muted-foreground">
            Interactive visualization of graph algorithms
          </p>
        </div>
      </div>
    </header>
  );
}