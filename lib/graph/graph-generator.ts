import { Graph, Node, Edge } from "@/types/graph";

export interface RandomGraphOptions {
  nodeCount: number;
  edgeDensity: number; // 0 to 1
  directed: boolean;
  minWeight?: number;
  maxWeight?: number;
  canvasWidth?: number;
  canvasHeight?: number;
}

export function generateRandomGraph(options: RandomGraphOptions): Graph {
  const {
    nodeCount,
    edgeDensity,
    directed,
    minWeight = 1,
    maxWeight = 10,
    canvasWidth = 800,
    canvasHeight = 600,
  } = options;

  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Generate nodes with random positions
  for (let i = 0; i < nodeCount; i++) {
    const id = String.fromCharCode(65 + i); // A, B, C, ...
    const x = Math.random() * (canvasWidth - 200) + 100; // Margin of 100px
    const y = Math.random() * (canvasHeight - 200) + 100;

    nodes.push({
      id,
      label: id,
      x,
      y,
    });
  }

  // Calculate maximum possible edges
  const maxEdges = directed
    ? nodeCount * (nodeCount - 1)
    : (nodeCount * (nodeCount - 1)) / 2;

  const targetEdgeCount = Math.floor(maxEdges * edgeDensity);

  // Generate edges
  const edgeSet = new Set<string>();
  let edgeCount = 0;

  while (edgeCount < targetEdgeCount) {
    const sourceIdx = Math.floor(Math.random() * nodeCount);
    let targetIdx = Math.floor(Math.random() * nodeCount);

    // Avoid self-loops
    if (sourceIdx === targetIdx) continue;

    const source = nodes[sourceIdx].id;
    const target = nodes[targetIdx].id;

    // Create unique edge identifier
    const edgeKey = directed
      ? `${source}-${target}`
      : [source, target].sort().join("-");

    if (edgeSet.has(edgeKey)) continue;

    edgeSet.add(edgeKey);

    const weight = Math.floor(Math.random() * (maxWeight - minWeight + 1)) + minWeight;

    edges.push({
      id: `${source}${target}`,
      source,
      target,
      weight,
    });

    edgeCount++;
  }

  return {
    nodes,
    edges,
    directed,
  };
}

export function generateEmptyGraph(): Graph {
  return {
    nodes: [],
    edges: [],
    directed: false,
  };
}