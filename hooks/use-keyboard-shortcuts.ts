import { useEffect } from "react";
import { useAlgorithmStore } from "@/lib/store/algorithm-store";
import { useGraphStore } from "@/lib/store/graph-store";

export function useKeyboardShortcuts() {
  const isPlaying = useAlgorithmStore((state) => state.isPlaying);
  const setPlaying = useAlgorithmStore((state) => state.setPlaying);
  const steps = useAlgorithmStore((state) => state.steps);
  const currentStepIndex = useAlgorithmStore((state) => state.currentStepIndex);
  const stepForward = useAlgorithmStore((state) => state.stepForward);
  const stepBackward = useAlgorithmStore((state) => state.stepBackward);
  const setSteps = useAlgorithmStore((state) => state.setSteps);
  const clearSelection = useGraphStore((state) => state.clearSelection);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      const hasSteps = steps.length > 0;

      switch (e.key) {
        case " ": // Space
          e.preventDefault();
          if (hasSteps) {
            setPlaying(!isPlaying);
          }
          break;

        case "ArrowLeft": // Previous step
          e.preventDefault();
          if (hasSteps && currentStepIndex > 0) {
            stepBackward();
          }
          break;

        case "ArrowRight": // Next step
          e.preventDefault();
          if (hasSteps && currentStepIndex < steps.length - 1) {
            stepForward();
          }
          break;

        case "r":
        case "R": // Reset
          e.preventDefault();
          if (hasSteps) {
            setSteps([]);
            setPlaying(false);
          }
          break;

        case "Escape": // Clear selection
          e.preventDefault();
          clearSelection();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isPlaying,
    setPlaying,
    steps,
    currentStepIndex,
    stepForward,
    stepBackward,
    setSteps,
    clearSelection,
  ]);
}