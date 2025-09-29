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

// Helper function: check if position is too close to existing nodes
function isTooClose(x: number, y: number, existingNodes: Node[], minDistance: number): boolean {
  for (const node of existingNodes) {
    const dx = x - node.x;
    const dy = y - node.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < minDistance) {
      return true;
    }
  }
  return false;
}

// Helper function: generate random nodes with minimum distance constraint
function generateRandomNodesWithMinDistance(
  nodeCount: number,
  canvasWidth: number,
  canvasHeight: number,
  baseMinDistance: number
): Node[] {
  const nodes: Node[] = [];
  const margin = 80;
  const maxAttemptsPerNode = 100;
  let currentMinDistance = baseMinDistance;

  for (let i = 0; i < nodeCount; i++) {
    // Generate ID: A-Z, then AA-ZZ for 27-50 nodes
    const id = i < 26
      ? String.fromCharCode(65 + i)
      : String.fromCharCode(65 + Math.floor((i - 26) / 26)) + String.fromCharCode(65 + ((i - 26) % 26));
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < maxAttemptsPerNode) {
      const x = Math.random() * (canvasWidth - 2 * margin) + margin;
      const y = Math.random() * (canvasHeight - 2 * margin) + margin;

      if (!isTooClose(x, y, nodes, currentMinDistance)) {
        nodes.push({ id, label: id, x, y });
        placed = true;
      }
      attempts++;
    }

    // If couldn't place after max attempts, reduce minimum distance and try again
    if (!placed) {
      currentMinDistance = Math.max(currentMinDistance - 10, 40);
      i--; // Retry this node
    }
  }

  return nodes;
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

  const edges: Edge[] = [];

  // Adjust canvas size and minimum distance based on node count
  let actualCanvasWidth = canvasWidth;
  let actualCanvasHeight = canvasHeight;
  let minDistance = 100;

  if (nodeCount <= 8) {
    minDistance = 100;
  } else if (nodeCount <= 15) {
    minDistance = 80;
    actualCanvasWidth = 1000;
    actualCanvasHeight = 700;
  } else if (nodeCount <= 26) {
    minDistance = 60;
    actualCanvasWidth = 1200;
    actualCanvasHeight = 800;
  } else {
    minDistance = 50;
    actualCanvasWidth = 1600;
    actualCanvasHeight = 1000;
  }

  // Generate nodes with minimum distance constraint
  const nodes = generateRandomNodesWithMinDistance(
    nodeCount,
    actualCanvasWidth,
    actualCanvasHeight,
    minDistance
  );

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