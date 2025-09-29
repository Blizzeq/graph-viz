"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { useGraphStore } from "@/lib/store/graph-store";
import { useAlgorithmStore } from "@/lib/store/algorithm-store";
import { algorithmInfo } from "@/lib/utils/algorithm-info";
import { AlgorithmType } from "@/types/algorithm";

export function AlgorithmSelector() {
  const graph = useGraphStore((state) => state.graph);
  const algorithm = useAlgorithmStore((state) => state.algorithm);
  const setAlgorithm = useAlgorithmStore((state) => state.setAlgorithm);
  const startNode = useAlgorithmStore((state) => state.startNode);
  const endNode = useAlgorithmStore((state) => state.endNode);
  const setStartNode = useAlgorithmStore((state) => state.setStartNode);
  const setEndNode = useAlgorithmStore((state) => state.setEndNode);

  const availableAlgorithms: AlgorithmType[] = [
    "dijkstra",
    "astar",
    "bellman-ford",
    "bfs",
    "dfs",
    "prim",
    "kruskal",
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Algorithm</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm font-medium mb-2 block">
            Select Algorithm
          </Label>
          <RadioGroup
            value={algorithm || ""}
            onValueChange={(value) => setAlgorithm(value as AlgorithmType)}
          >
            {availableAlgorithms.map((alg) => (
              <div key={alg} className="flex items-center space-x-2">
                <RadioGroupItem value={alg} id={alg} />
                <Label htmlFor={alg} className="font-normal cursor-pointer">
                  {algorithmInfo[alg].name}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {algorithm && (
          <>
            <div className="text-xs text-muted-foreground p-3 bg-slate-100 dark:bg-slate-800 rounded">
              {algorithmInfo[algorithm].description}
            </div>

            <Badge variant="outline">{algorithmInfo[algorithm].complexity}</Badge>

            <div>
              <Label htmlFor="start-node">Start Node</Label>
              <Select value={startNode || ""} onValueChange={setStartNode}>
                <SelectTrigger id="start-node">
                  <SelectValue placeholder="Select start node" />
                </SelectTrigger>
                <SelectContent>
                  {graph.nodes.map((node) => (
                    <SelectItem key={node.id} value={node.id}>
                      {node.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {algorithmInfo[algorithm].requiresEndNode && (
              <div>
                <Label htmlFor="end-node">End Node</Label>
                <Select value={endNode || ""} onValueChange={setEndNode}>
                  <SelectTrigger id="end-node">
                    <SelectValue placeholder="Select end node" />
                  </SelectTrigger>
                  <SelectContent>
                    {graph.nodes.map((node) => (
                      <SelectItem key={node.id} value={node.id}>
                        {node.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="text-xs text-muted-foreground mt-4 p-2 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-800">
              💡 Use the Play button in the bottom controls to start the visualization
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}