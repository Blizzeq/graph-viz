"use client";

import { Header } from "@/components/layout/header";
import { LeftPanel } from "@/components/layout/left-panel";
import { RightPanel } from "@/components/layout/right-panel";
import { BottomControls } from "@/components/layout/bottom-controls";
import { GraphCanvas } from "@/components/graph/graph-canvas";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

export default function Home() {
  useKeyboardShortcuts();

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <LeftPanel />
        <GraphCanvas />
        <RightPanel />
      </div>
      <BottomControls />
    </div>
  );
}