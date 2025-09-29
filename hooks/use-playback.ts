import { useEffect, useRef } from "react";
import { useAlgorithmStore } from "@/lib/store/algorithm-store";

export function usePlayback() {
  const isPlaying = useAlgorithmStore((state) => state.isPlaying);
  const speed = useAlgorithmStore((state) => state.speed);
  const currentStepIndex = useAlgorithmStore((state) => state.currentStepIndex);
  const steps = useAlgorithmStore((state) => state.steps);
  const setPlaying = useAlgorithmStore((state) => state.setPlaying);
  const setCurrentStepIndex = useAlgorithmStore((state) => state.setCurrentStepIndex);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      // Check if we're already at the end before starting
      if (currentStepIndex >= steps.length - 1) {
        setPlaying(false);
        return;
      }

      intervalRef.current = setInterval(() => {
        const nextIndex = currentStepIndex + 1;

        // If we're about to reach the end, stop there
        if (nextIndex >= steps.length - 1) {
          setCurrentStepIndex(steps.length - 1);
          setPlaying(false);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        } else {
          setCurrentStepIndex(nextIndex);
        }
      }, 1000 / speed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, speed, currentStepIndex, steps.length, setPlaying, setCurrentStepIndex]);
}