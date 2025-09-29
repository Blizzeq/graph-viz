"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Shuffle } from "lucide-react";
import { useGraphStore } from "@/lib/store/graph-store";
import { useAlgorithmStore } from "@/lib/store/algorithm-store";
import { presetGraphs } from "@/lib/graph/preset-graphs";
import { generateRandomGraph, generateEmptyGraph } from "@/lib/graph/graph-generator";
import { AlgorithmSelector } from "@/components/algorithm/algorithm-selector";

export function LeftPanel() {
  const setGraph = useGraphStore((state) => state.setGraph);
  const setSteps = useAlgorithmStore((state) => state.setSteps);
  const setPlaying = useAlgorithmStore((state) => state.setPlaying);

  const resetVisualization = () => {
    setSteps([]);
    setPlaying(false);
  };

  const handleLoadPreset = (presetId: string) => {
    const preset = presetGraphs.find((p) => p.id === presetId);
    if (preset) {
      resetVisualization();
      setGraph(preset.graph);
    }
  };

  const handleGenerateRandom = () => {
    const randomGraph = generateRandomGraph({
      nodeCount: 8,
      edgeDensity: 0.3,
      directed: false,
      minWeight: 1,
      maxWeight: 10,
      canvasWidth: 800,
      canvasHeight: 600,
    });
    resetVisualization();
    setGraph(randomGraph);
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