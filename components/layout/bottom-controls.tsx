"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import {
  SkipBack,
  ChevronLeft,
  Play,
  Pause,
  ChevronRight,
  SkipForward,
  RotateCcw,
  Zap,
  Loader2
} from "lucide-react";
import { useAlgorithmStore } from "@/lib/store/algorithm-store";
import { useGraphStore } from "@/lib/store/graph-store";
import { usePlayback } from "@/hooks/use-playback";
import { runAlgorithm } from "@/lib/algorithms";
import { algorithmInfo } from "@/lib/utils/algorithm-info";

export function BottomControls() {
  const graph = useGraphStore((state) => state.graph);
  const algorithm = useAlgorithmStore((state) => state.algorithm);
  const startNode = useAlgorithmStore((state) => state.startNode);
  const endNode = useAlgorithmStore((state) => state.endNode);
  const isPlaying = useAlgorithmStore((state) => state.isPlaying);
  const speed = useAlgorithmStore((state) => state.speed);
  const currentStepIndex = useAlgorithmStore((state) => state.currentStepIndex);
  const steps = useAlgorithmStore((state) => state.steps);
  const setPlaying = useAlgorithmStore((state) => state.setPlaying);
  const setSpeed = useAlgorithmStore((state) => state.setSpeed);
  const setSteps = useAlgorithmStore((state) => state.setSteps);
  const stepForward = useAlgorithmStore((state) => state.stepForward);
  const stepBackward = useAlgorithmStore((state) => state.stepBackward);
  const skipToStart = useAlgorithmStore((state) => state.skipToStart);
  const skipToEnd = useAlgorithmStore((state) => state.skipToEnd);
  const reset = useAlgorithmStore((state) => state.reset);

  const [isInstantLoading, setIsInstantLoading] = useState(false);

  usePlayback();

  const hasSteps = steps.length > 0;
  const isAtStart = currentStepIndex === 0;
  const isAtEnd = currentStepIndex === steps.length - 1;

  // Check if we can run the algorithm
  const canRun =
    graph.nodes.length > 0 &&
    algorithm &&
    startNode &&
    (!algorithm || !algorithmInfo[algorithm]?.requiresEndNode || endNode);

  const handlePlayPause = () => {
    // If no steps yet, generate them first
    if (!hasSteps && canRun && algorithm && startNode) {
      const newSteps = runAlgorithm(algorithm, graph, startNode, endNode);
      setSteps(newSteps);
      setPlaying(true);
    } else {
      setPlaying(!isPlaying);
    }
  };

  const getStatus = () => {
    if (!hasSteps) return "Ready";
    if (isPlaying) return "Playing...";
    if (isAtEnd) return "Complete";
    return "Paused";
  };

  const handleInstantSolve = () => {
    // If no steps yet, generate them first
    if (!hasSteps && canRun && algorithm && startNode) {
      setIsInstantLoading(true);
      // Use setTimeout to allow UI to update with loading state
      setTimeout(() => {
        const newSteps = runAlgorithm(algorithm, graph, startNode, endNode);
        setSteps(newSteps);
        // Skip to end immediately
        if (newSteps.length > 0) {
          setPlaying(false);
          setTimeout(() => {
            skipToEnd();
            setIsInstantLoading(false);
          }, 0);
        } else {
          setIsInstantLoading(false);
        }
      }, 10);
    } else if (hasSteps) {
      // If already have steps, just skip to end
      skipToEnd();
    }
  };

  return (
    <div className="h-20 border-t border-border bg-card px-4 xl:px-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          disabled={!hasSteps || isAtStart}
          onClick={skipToStart}
        >
          <SkipBack className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          disabled={!hasSteps || isAtStart}
          onClick={stepBackward}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="default"
          size="icon"
          disabled={!canRun && !hasSteps}
          onClick={handlePlayPause}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="outline"
          size="icon"
          disabled={!hasSteps || isAtEnd}
          onClick={stepForward}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          disabled={!hasSteps || isAtEnd}
          onClick={skipToEnd}
        >
          <SkipForward className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="mx-2 h-8" />

        <Button
          variant="outline"
          size="icon"
          disabled={!hasSteps}
          onClick={() => {
            setSteps([]);
            setPlaying(false);
          }}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-3 xl:gap-4">
        <div className="flex items-center gap-2 xl:gap-3">
          <span className="text-sm text-muted-foreground hidden lg:inline">Speed:</span>
          <Slider
            value={[speed]}
            onValueChange={(values) => setSpeed(values[0])}
            min={0.5}
            max={10}
            step={0.1}
            className="w-24 xl:w-32"
          />
          <span className="text-sm font-medium w-10 xl:w-12">{speed.toFixed(1)}x</span>
          <Button
            variant="secondary"
            size="sm"
            className="gap-1.5 ml-1 xl:ml-2"
            disabled={(!canRun && !hasSteps) || isInstantLoading}
            onClick={handleInstantSolve}
          >
            {isInstantLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span className="hidden lg:inline">Solving...</span>
              </>
            ) : (
              <>
                <Zap className="h-3.5 w-3.5" />
                <span className="hidden lg:inline">Instant</span>
              </>
            )}
          </Button>
        </div>

        <Separator orientation="vertical" className="h-8 hidden lg:block" />

        <div className="text-sm min-w-[120px] xl:min-w-[150px] hidden lg:block">
          <span className="text-muted-foreground">Status: </span>
          <span className="font-medium">{getStatus()}</span>
        </div>

        {hasSteps && (
          <>
            <Separator orientation="vertical" className="h-8" />
            <div className="text-sm min-w-[80px] xl:min-w-[100px]">
              <span className="text-muted-foreground hidden xl:inline">Step: </span>
              <span className="font-medium">
                {currentStepIndex + 1} / {steps.length}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}