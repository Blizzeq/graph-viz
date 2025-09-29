"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { useAlgorithmStore } from "@/lib/store/algorithm-store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function CustomNodeComponent({ data, id }: NodeProps) {
  const currentStep = useAlgorithmStore((state) => state.getCurrentStep());
  const algorithm = useAlgorithmStore((state) => state.algorithm);

  const getNodeColor = () => {
    // Highlight if this is the start of an edge being created
    if (data.isEdgeStart) {
      return "bg-cyan-400 border-cyan-600 ring-4 ring-cyan-300 animate-pulse";
    }

    if (!currentStep) return "bg-slate-300 border-slate-400";

    if (currentStep.pathSoFar?.includes(id)) {
      return "bg-purple-600 border-purple-700 text-white";
    }
    if (currentStep.currentNode === id) {
      return "bg-amber-400 border-amber-500 animate-pulse";
    }
    if (currentStep.visitedNodes.includes(id)) {
      return "bg-blue-400 border-blue-500";
    }
    if (currentStep.queuedNodes.includes(id)) {
      return "bg-green-300 border-green-400";
    }

    return "bg-slate-300 border-slate-400";
  };

  const getTooltipContent = () => {
    if (!currentStep || !algorithm) return null;

    const parts: string[] = [`Node: ${data.label || id}`];

    // Distance/cost
    if (currentStep.distances && currentStep.distances[id] !== undefined) {
      const dist = currentStep.distances[id];
      parts.push(`Distance: ${dist === Infinity ? "∞" : dist.toFixed(1)}`);
    }

    // F-score for A*
    if (algorithm === "astar" && currentStep.fScores && currentStep.fScores[id] !== undefined) {
      parts.push(`F-score: ${currentStep.fScores[id].toFixed(1)}`);
    }

    // Status
    if (currentStep.currentNode === id) {
      parts.push("Status: Currently checking");
    } else if (currentStep.pathSoFar?.includes(id)) {
      parts.push("Status: In shortest path");
    } else if (currentStep.visitedNodes.includes(id)) {
      parts.push("Status: Visited");
    } else if (currentStep.queuedNodes.includes(id)) {
      parts.push("Status: In queue");
    }

    return parts.join("\n");
  };

  const tooltipContent = getTooltipContent();

  const nodeElement = (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-slate-600 !opacity-0"
        style={{ pointerEvents: 'none' }}
      />

      <div
        className={`
          flex items-center justify-center
          w-12 h-12 rounded-full
          border-2
          font-bold text-sm
          transition-all duration-300
          ${getNodeColor()}
        `}
      >
        {data.label || id}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-slate-600 !opacity-0"
        style={{ pointerEvents: 'none' }}
      />
    </div>
  );

  // Show tooltip only during algorithm visualization
  if (tooltipContent) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            {nodeElement}
          </TooltipTrigger>
          <TooltipContent className="whitespace-pre-line text-xs">
            {tooltipContent}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return nodeElement;
}

export const CustomNode = memo(CustomNodeComponent);