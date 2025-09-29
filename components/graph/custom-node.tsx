"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { useAlgorithmStore } from "@/lib/store/algorithm-store";

function CustomNodeComponent({ data, id }: NodeProps) {
  const currentStep = useAlgorithmStore((state) => state.getCurrentStep());

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

  return (
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
}

export const CustomNode = memo(CustomNodeComponent);