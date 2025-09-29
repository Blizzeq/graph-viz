import { Graph } from "@/types/graph";
import { AlgorithmStep } from "@/types/algorithm";

// Heuristic: Euclidean distance between two nodes
function heuristic(nodeId: string, targetId: string, graph: Graph): number {
  const node = graph.nodes.find(n => n.id === nodeId);
  const target = graph.nodes.find(n => n.id === targetId);

  if (!node || !target) return 0;

  const dx = node.x - target.x;
  const dy = node.y - target.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function* astarGenerator(
  graph: Graph,
  startNode: string,
  endNode: string | null
): Generator<AlgorithmStep> {
  if (!endNode) {
    yield {
      stepNumber: 0,
      action: "finalize",
      currentNode: null,
      visitedNodes: [],
      queuedNodes: [],
      activeEdges: [],
      explanation: "A* requires both start and end nodes. Please select an end node.",
    };
    return;
  }

  const gScore: Record<string, number> = {}; // Cost from start to node
  const fScore: Record<string, number> = {}; // gScore + heuristic
  const previous: Record<string, string | null> = {};
  const openSet = new Set([startNode]);
  const closedSet = new Set<string>();
  const visited: string[] = [];

  // Initialize scores
  graph.nodes.forEach((node) => {
    gScore[node.id] = node.id === startNode ? 0 : Infinity;
    fScore[node.id] = node.id === startNode ? heuristic(startNode, endNode, graph) : Infinity;
    previous[node.id] = null;
  });

  yield {
    stepNumber: 0,
    action: "visit",
    currentNode: startNode,
    visitedNodes: [],
    queuedNodes: [startNode],
    activeEdges: [],
    distances: { ...gScore },
    previous: { ...previous },
    explanation: `Starting A* from ${startNode} to ${endNode}. Using Euclidean distance as heuristic.`,
  };

  let stepNum = 1;

  while (openSet.size > 0) {
    // Find node in openSet with lowest fScore
    let current: string | null = null;
    let minFScore = Infinity;

    for (const nodeId of openSet) {
      if (fScore[nodeId] < minFScore) {
        minFScore = fScore[nodeId];
        current = nodeId;
      }
    }

    if (current === null) break;

    // Check if we reached the goal
    if (current === endNode) {
      // Reconstruct path
      const path: string[] = [];
      let temp: string | null = current;
      while (temp !== null) {
        path.unshift(temp);
        temp = previous[temp];
      }

      yield {
        stepNumber: stepNum++,
        action: "finalize",
        currentNode: current,
        visitedNodes: visited,
        queuedNodes: [],
        activeEdges: [],
        distances: { ...gScore },
        previous: { ...previous },
        pathSoFar: path,
        explanation: `Found shortest path! Total cost: ${gScore[endNode].toFixed(2)}. Path: ${path.join(" → ")}`,
      };
      return;
    }

    openSet.delete(current);
    closedSet.add(current);
    visited.push(current);

    yield {
      stepNumber: stepNum++,
      action: "visit",
      currentNode: current,
      visitedNodes: [...visited],
      queuedNodes: Array.from(openSet),
      activeEdges: [],
      distances: { ...gScore },
      previous: { ...previous },
      explanation: `Visiting node ${current}. f(${current}) = g(${gScore[current].toFixed(1)}) + h(${(fScore[current] - gScore[current]).toFixed(1)}) = ${fScore[current].toFixed(1)}`,
    };

    // Check all neighbors
    const neighbors = graph.edges
      .filter(edge => edge.source === current || (!graph.directed && edge.target === current))
      .map(edge => ({
        nodeId: edge.source === current ? edge.target : edge.source,
        weight: edge.weight
      }));

    for (const neighbor of neighbors) {
      if (closedSet.has(neighbor.nodeId)) continue;

      const tentativeGScore = gScore[current] + neighbor.weight;

      if (!openSet.has(neighbor.nodeId)) {
        openSet.add(neighbor.nodeId);
      } else if (tentativeGScore >= gScore[neighbor.nodeId]) {
        continue; // Not a better path
      }

      // This is a better path
      previous[neighbor.nodeId] = current;
      gScore[neighbor.nodeId] = tentativeGScore;
      fScore[neighbor.nodeId] = tentativeGScore + heuristic(neighbor.nodeId, endNode, graph);

      yield {
        stepNumber: stepNum++,
        action: "update",
        currentNode: current,
        visitedNodes: [...visited],
        queuedNodes: Array.from(openSet),
        activeEdges: [`${current}-${neighbor.nodeId}`, `${neighbor.nodeId}-${current}`],
        distances: { ...gScore },
        previous: { ...previous },
        explanation: `Updated ${neighbor.nodeId}: g=${gScore[neighbor.nodeId].toFixed(1)}, h=${heuristic(neighbor.nodeId, endNode, graph).toFixed(1)}, f=${fScore[neighbor.nodeId].toFixed(1)}`,
      };
    }
  }

  // No path found
  yield {
    stepNumber: stepNum,
    action: "finalize",
    currentNode: null,
    visitedNodes: visited,
    queuedNodes: [],
    activeEdges: [],
    distances: { ...gScore },
    previous: { ...previous },
    explanation: `No path found from ${startNode} to ${endNode}.`,
  };
}