"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Shuffle } from "lucide-react";
import { useGraphStore } from "@/lib/store/graph-store";
import { useAlgorithmStore } from "@/lib/store/algorithm-store";
import { presetGraphs } from "@/lib/graph/preset-graphs";
import { generateRandomGraph, generateEmptyGraph } from "@/lib/graph/graph-generator";
import { AlgorithmSelector } from "@/components/algorithm/algorithm-selector";

export function LeftPanel() {
  const graph = useGraphStore((state) => state.graph);
  const setGraph = useGraphStore((state) => state.setGraph);
  const setDirected = useGraphStore((state) => state.setDirected);
  const triggerFitView = useGraphStore((state) => state.triggerFitView);
  const setSteps = useAlgorithmStore((state) => state.setSteps);
  const setPlaying = useAlgorithmStore((state) => state.setPlaying);

  const [nodeCount, setNodeCount] = useState(8);

  const resetVisualization = () => {
    setSteps([]);
    setPlaying(false);
  };

  const handleLoadPreset = (presetId: string) => {
    const preset = presetGraphs.find((p) => p.id === presetId);
    if (preset) {
      resetVisualization();
      setGraph(preset.graph);
      triggerFitView();
    }
  };

  const handleGenerateRandom = () => {
    const actualNodeCount = Math.max(2, Math.min(nodeCount, 50));
    // Adjust edge density based on node count to avoid cluttered graphs
    const edgeDensity = actualNodeCount <= 10 ? 0.3 : actualNodeCount <= 15 ? 0.2 : 0.15;

    const randomGraph = generateRandomGraph({
      nodeCount: actualNodeCount,
      edgeDensity,
      directed: graph.directed,
      minWeight: 1,
      maxWeight: 10,
      // canvasWidth and canvasHeight will be automatically adjusted based on nodeCount
    });
    resetVisualization();
    setGraph(randomGraph);
    triggerFitView();
  };

  const handleCreateEmpty = () => {
    const emptyGraph = generateEmptyGraph();
    resetVisualization();
    setGraph(emptyGraph);
  };

  return (
    <div className="w-80 border-r border-border bg-card p-4 overflow-y-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Graph Setup</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Label htmlFor="directed-mode" className="text-sm">Directed Graph</Label>
            <Switch
              id="directed-mode"
              checked={graph.directed}
              onCheckedChange={(checked) => {
                resetVisualization();
                setDirected(checked);
              }}
            />
          </div>
          <Tabs defaultValue="presets" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="presets">Presets</TabsTrigger>
              <TabsTrigger value="random">Random</TabsTrigger>
            </TabsList>
            <TabsContent value="presets" className="space-y-2">
              <p className="text-sm text-muted-foreground mb-3">
                Choose a preset graph:
              </p>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleCreateEmpty}
              >
                Empty Graph
              </Button>
              {presetGraphs.map((preset) => (
                <Button
                  key={preset.id}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleLoadPreset(preset.id)}
                >
                  {preset.name}
                </Button>
              ))}
            </TabsContent>
            <TabsContent value="random" className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Generate random graph
              </p>
              <div className="space-y-2">
                <Label htmlFor="node-count">Number of Nodes (2-50)</Label>
                <Input
                  id="node-count"
                  type="number"
                  min="2"
                  max="50"
                  value={nodeCount}
                  onChange={(e) => setNodeCount(parseInt(e.target.value) || 8)}
                  className="w-full"
                />
              </div>
              <Button className="w-full" variant="default" onClick={handleGenerateRandom}>
                <Shuffle className="mr-2 h-4 w-4" />
                Generate Random Graph
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <AlgorithmSelector />
    </div>
  );
}