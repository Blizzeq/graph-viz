"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EdgeWeightDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sourceNode: string;
  targetNode: string;
  onConfirm: (weight: number) => void;
}

export function EdgeWeightDialog({
  open,
  onOpenChange,
  sourceNode,
  targetNode,
  onConfirm,
}: EdgeWeightDialogProps) {
  const [weight, setWeight] = useState("1");

  useEffect(() => {
    if (open) {
      setWeight("1");
    }
  }, [open]);

  const handleConfirm = () => {
    const weightNum = parseInt(weight) || 1;
    onConfirm(weightNum);
    onOpenChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleConfirm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Edge Weight</DialogTitle>
          <DialogDescription>
            Enter the weight for the edge from <span className="font-semibold text-foreground">{sourceNode}</span> to{" "}
            <span className="font-semibold text-foreground">{targetNode}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="weight" className="text-right">
              Weight
            </Label>
            <Input
              id="weight"
              type="number"
              min="1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              onKeyDown={handleKeyDown}
              className="col-span-3"
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}