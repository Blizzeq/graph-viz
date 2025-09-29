import { Graph } from "@/types/graph";
import { AlgorithmStep } from "@/types/algorithm";

export function* dijkstraGenerator(
  graph: Graph,
  startNode: string,
  endNode: string | null
): Generator<AlgorithmStep> {
  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const unvisited = new Set(graph.nodes.map((n) => n.id));
  const visited: string[] = [];

  // Initialize distances
  graph.nodes.forEach((node) => {
    distances[node.id] = node.id === startNode ? 0 : Infinity;
    previous[node.id] = null;
  });

  yield {
    stepNumber: 0,
    action: "visit",
    currentNode: startNode,
    visitedNodes: [],
    queuedNodes: Array.from(unvisited),
    activeEdges: [],
    distances: { ...distances },
    previous: { ...previous },
    explanation: `Starting Dijkstra's algorithm from node ${startNode}. Set distance to 0, all others to ∞.`,
  };

  let stepNum = 1;

  while (unvisited.size > 0) {
    // Find node with minimum distance
    let current: string | null = null;
    let minDistance = Infinity;

    for (const nodeId of unvisited) {
      if (distances[nodeId] < minDistance) {
        minDistance = distances[nodeId];
        current = nodeId;
      }
    }

    if (current === null || minDistance === Infinity) break;

    unvisited.delete(current);
    visited.push(current);

    yield {
      stepNumber: stepNum++,
      action: "visit",
      currentNode: current,
      visitedNodes: [...visited],
      queuedNodes: Array.from(unvisited),
      activeEdges: [],
      distances: { ...distances },
      previous: { ...previous },
      explanation: `Visiting node ${current} with distance ${distances[current]}. This is the unvisited node with minimum distance.`,
    };

    if (endNode && current === endNode) {
      // Reconstruct path
      const path: string[] = [];
      let u: string | null = endNode;
      while (u) {
        path.unshift(u);
        u = previous[u];
      }

      yield {
        stepNumber: stepNum,
        action: "finalize",
        currentNode: endNode,
        visitedNodes: [...visited],
        queuedNodes: [],
        activeEdges: [],
        distances: { ...distances },
        previous: { ...previous },
        pathSoFar: path,
        explanation: `✅ Found shortest path to ${endNode}! Cost: ${distances[endNode]}, Path: ${path.join(" → ")}`,
      };
      return;
    }

    // Check all neighbors
    const neighbors = graph.edges.filter((edge) => {
      if (graph.directed) {
        return edge.source === current && unvisited.has(edge.target);
      } else {
        return (
          (edge.source === current && unvisited.has(edge.target)) ||
          (edge.target === current && unvisited.has(edge.source))
        );
      }
    });

    for (const edge of neighbors) {
      const neighbor = graph.directed
        ? edge.target
        : edge.source === current
        ? edge.target
        : edge.source;

      const alt = distances[current!] + edge.weight;

      yield {
        stepNumber: stepNum++,
        action: "check",
        currentNode: current,
        visitedNodes: [...visited],
        queuedNodes: Array.from(unvisited),
        activeEdges: [edge.id],
        distances: { ...distances },
        previous: { ...previous },
        explanation: `Checking edge ${current} → ${neighbor} (weight: ${edge.weight}). New distance: ${alt} vs current: ${
          distances[neighbor] === Infinity ? "∞" : distances[neighbor]
        }`,
      };

      if (alt < distances[neighbor]) {
        distances[neighbor] = alt;
        previous[neighbor] = current;

        yield {
          stepNumber: stepNum++,
          action: "update",
          currentNode: current,
          visitedNodes: [...visited],
          queuedNodes: Array.from(unvisited),
          activeEdges: [edge.id],
          distances: { ...distances },
          previous: { ...previous },
          explanation: `✓ Better path found! Updated distance to ${neighbor}: ${alt} (via ${current})`,
        };
      }
    }
  }

  // Final step if we processed all nodes
  let finalPath: string[] = [];
  if (endNode && previous[endNode] !== undefined) {
    let u: string | null = endNode;
    while (u) {
      finalPath.unshift(u);
      u = previous[u];
    }
  }

  yield {
    stepNumber: stepNum,
    action: "finalize",
    currentNode: null,
    visitedNodes: [...visited],
    queuedNodes: [],
    activeEdges: [],
    distances: { ...distances },
    previous: { ...previous },
    pathSoFar: finalPath.length > 0 ? finalPath : undefined,
    explanation: endNode
      ? distances[endNode] === Infinity
        ? `❌ No path exists from ${startNode} to ${endNode}`
        : `✅ Algorithm complete! Shortest path: ${finalPath.join(" → ")} (cost: ${distances[endNode]})`
      : `✅ Algorithm complete! All shortest paths from ${startNode} have been computed.`,
  };
}