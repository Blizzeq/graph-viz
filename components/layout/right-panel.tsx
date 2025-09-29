"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAlgorithmStore } from "@/lib/store/algorithm-store";
import { algorithmInfo } from "@/lib/utils/algorithm-info";

export function RightPanel() {
  const currentStep = useAlgorithmStore((state) => state.getCurrentStep());
  const algorithm = useAlgorithmStore((state) => state.algorithm);
  const currentStepIndex = useAlgorithmStore((state) => state.currentStepIndex);
  const steps = useAlgorithmStore((state) => state.steps);
  const endNode = useAlgorithmStore((state) => state.endNode);

  const getActionBadge = () => {
    if (!currentStep) return <Badge variant="outline">Ready</Badge>;

    const variantMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      visit: "default",
      check: "secondary",
      update: "secondary",
      finalize: "default",
      enqueue: "secondary",
      dequeue: "secondary",
    };

    return (
      <Badge variant={variantMap[currentStep.action] || "outline"}>
        {currentStep.action.toUpperCase()}
      </Badge>
    );
  };

  const getTotalCost = () => {
    // For MST algorithms, show MST cost
    if (currentStep?.mstCost !== undefined) {
      return currentStep.mstCost.toFixed(1);
    }
    // For pathfinding algorithms, show distance to end node
    if (!currentStep || !currentStep.distances || !endNode) return "-";
    const cost = currentStep.distances[endNode];
    return cost === Infinity ? "∞" : cost.toFixed(1);
  };

  const isMSTAlgorithm = algorithm === "prim" || algorithm === "kruskal";

  return (
    <div className="w-72 xl:w-80 border-l border-border bg-card p-3 xl:p-4 overflow-y-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Current Step</p>
              <p className="text-2xl font-bold">
                {currentStep ? currentStepIndex + 1 : 0} / {steps.length || 0}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Visited Nodes</p>
              <p className="text-2xl font-bold">
                {currentStep?.visitedNodes.length || 0}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">In Queue</p>
              <p className="text-2xl font-bold">
                {currentStep?.queuedNodes.length || 0}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">{isMSTAlgorithm ? "MST Cost" : "Path Cost"}</p>
              <p className="text-2xl font-bold">{getTotalCost()}</p>
            </div>
            {isMSTAlgorithm && currentStep?.mstEdges && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">MST Edges</p>
                <p className="text-2xl font-bold">{currentStep.mstEdges.length}</p>
              </div>
            )}
          </div>

          {algorithm && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-muted-foreground mb-1">Algorithm</p>
              <p className="text-sm font-medium">{algorithmInfo[algorithm].name}</p>
              <Badge variant="outline" className="mt-2">
                {algorithmInfo[algorithm].complexity}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-lg">Legend</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-slate-300 border border-slate-400" />
            <span className="text-sm">Unvisited</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-400 border border-amber-500" />
            <span className="text-sm">Currently Checking</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-400 border border-blue-500" />
            <span className="text-sm">Visited</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-300 border border-green-400" />
            <span className="text-sm">In Queue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-purple-600 border border-purple-700" />
            <span className="text-sm">Shortest Path</span>
          </div>
          {isMSTAlgorithm && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-1 bg-green-500" />
              <span className="text-sm">MST Edge</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-lg">Step Explanation</CardTitle>
        </CardHeader>
        <CardContent>
          {getActionBadge()}
          <p className="text-sm mt-3 leading-relaxed">
            {currentStep?.explanation || "Select a graph and algorithm to begin visualization"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}