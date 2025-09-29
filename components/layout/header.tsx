"use client";

import { useState } from "react";
import { Network, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function Header() {
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <header className="h-16 border-b border-border bg-card px-4 xl:px-6 flex items-center justify-between">
      <div className="flex items-center gap-2 xl:gap-3">
        <Network className="h-7 xl:h-8 w-7 xl:w-8 text-primary" />
        <div>
          <h1 className="text-lg xl:text-xl font-bold text-foreground">
            Graph Algorithm Visualizer
          </h1>
          <p className="text-xs text-muted-foreground hidden md:block">
            Interactive visualization of graph algorithms
          </p>
        </div>
      </div>

      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <HelpCircle className="h-4 w-4" />
            Help
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Quick Start Guide</DialogTitle>
            <DialogDescription>
              Learn how to use Graph Algorithm Visualizer
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 text-sm">
            <section>
              <h3 className="font-semibold text-base mb-2">🎯 Getting Started</h3>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Choose a preset graph or generate a random one</li>
                <li>Select an algorithm from the left panel</li>
                <li>Pick start node (and end node for pathfinding)</li>
                <li>Click Play ▶️ to start visualization</li>
              </ol>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">✏️ Editing Graph</h3>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Select Mode (🖱️):</strong> Click and drag nodes to reposition</p>
                <p><strong>Add Node (➕):</strong> Click anywhere on canvas to add a node</p>
                <p><strong>Add Edge (🔗):</strong> Click two nodes to connect them (cyan ring = selected)</p>
                <p><strong>Delete (🗑️):</strong> Click nodes or edges to remove them</p>
                <p className="text-xs italic">Tip: Click outside to cancel edge creation</p>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">🎨 Node Colors</h3>
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-300 border-2 border-slate-400" />
                  <span className="text-muted-foreground">Unvisited</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-400 border-2 border-amber-500" />
                  <span className="text-muted-foreground">Currently Checking</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-400 border-2 border-blue-500" />
                  <span className="text-muted-foreground">Visited</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-300 border-2 border-green-400" />
                  <span className="text-muted-foreground">In Queue</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-600 border-2 border-purple-700" />
                  <span className="text-white">Shortest Path</span>
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">⌨️ Keyboard Shortcuts</h3>
              <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                <div><kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs">Space</kbd> Play/Pause</div>
                <div><kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs">←</kbd> Previous Step</div>
                <div><kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs">→</kbd> Next Step</div>
                <div><kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs">R</kbd> Reset</div>
                <div><kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs">Esc</kbd> Clear Selection</div>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">⚡ Speed Controls</h3>
              <p className="text-muted-foreground">
                Use the slider to adjust playback speed from 0.5x to 10x, or click <strong>Instant</strong> to jump to the final result immediately.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">💡 Pro Tips</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Hover over nodes during visualization to see distance/f-score</li>
                <li>Generate up to 50 random nodes</li>
                <li>Use step-by-step controls to examine each algorithm step</li>
                <li>MST algorithms (Prim/Kruskal) show edges in green</li>
              </ul>
            </section>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}