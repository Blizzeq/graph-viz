"use client";

import { memo } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  getStraightPath,
  MarkerType,
} from "@xyflow/react";
import { useAlgorithmStore } from "@/lib/store/algorithm-store";
import { useGraphStore } from "@/lib/store/graph-store";

function CustomEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
}: EdgeProps) {
  const currentStep = useAlgorithmStore((state) => state.getCurrentStep());
  const graph = useGraphStore((state) => state.graph);

  const isActive = currentStep?.activeEdges.includes(id);
  const isInPath = currentStep?.pathSoFar && currentStep.pathSoFar.length > 1;
  const isInMST = currentStep?.mstEdges?.includes(id);

  // Calculate if edge is part of the path
  let isPartOfPath = false;
  if (isInPath && currentStep?.pathSoFar) {
    const path = currentStep.pathSoFar;
    for (let i = 0; i < path.length - 1; i++) {
      if (
        (id.includes(path[i]) && id.includes(path[i + 1])) ||
        (id === `${path[i]}${path[i + 1]}`) ||
        (id === `${path[i + 1]}${path[i]}`)
      ) {
        isPartOfPath = true;
        break;
      }
    }
  }

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const edgeColor = isPartOfPath
    ? "#9333ea" // Purple for shortest path
    : isInMST
    ? "#10b981" // Green for MST edges
    : isActive
    ? "#fbbf24" // Amber for currently checking
    : "#94a3b8"; // Gray for default

  const edgeWidth = isPartOfPath ? 3 : isInMST ? 3 : isActive ? 2 : 1.5;

  return (
    <>
      <defs>
        <marker
          id={`arrow-${id}`}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path
            d="M 0 0 L 10 5 L 0 10 z"
            fill={edgeColor}
            stroke="none"
          />
        </marker>
      </defs>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={graph.directed ? `url(#arrow-${id})` : undefined}
        style={{
          stroke: edgeColor,
          strokeWidth: edgeWidth,
          transition: "all 0.3s",
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: "all",
          }}
          className="nodrag nopan bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-300 dark:border-slate-600 font-semibold"
        >
          {data?.weight || 1}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export const CustomEdge = memo(CustomEdgeComponent);