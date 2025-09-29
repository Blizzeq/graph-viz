"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MousePointer2, PlusCircle, Link2, Trash2 } from "lucide-react";
import { useGraphStore } from "@/lib/store/graph-store";
import { EditMode } from "@/types/graph";

export function EditToolbar() {
  const editMode = useGraphStore((state) => state.editMode);
  const setEditMode = useGraphStore((state) => state.setEditMode);

  const modes: Array<{ value: EditMode; icon: any; label: string }> = [
    { value: "select", icon: MousePointer2, label: "Select & drag nodes" },
    { value: "add-node", icon: PlusCircle, label: "Click to add node" },
    { value: "add-edge", icon: Link2, label: "Click two nodes to connect" },
    { value: "delete", icon: Trash2, label: "Click to delete" },
  ];

  return (
    <div className="absolute top-4 left-4 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 p-3 z-10">
      <div className="flex gap-1">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isActive = editMode === mode.value;
          return (
            <Button
              key={mode.value}
              variant={isActive ? "default" : "outline"}
              size="icon"
              onClick={() => setEditMode(mode.value)}
              className={cn(
                "h-9 w-9",
                isActive && "bg-primary text-primary-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
            </Button>
          );
        })}
      </div>

      <div className="text-xs text-muted-foreground mt-2 text-center min-h-[16px]">
        {modes.find((m) => m.value === editMode)?.label}
      </div>
    </div>
  );
}