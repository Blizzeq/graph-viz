import { Graph } from "@/types/graph";
import { AlgorithmStep } from "@/types/algorithm";

export function* bfsGenerator(
  graph: Graph,
  startNode: string,
  endNode: string | null
): Generator<AlgorithmStep> {
  const visited = new Set<string>();
  const queue: string[] = [startNode];
  const previous: Record<string, string | null> = {};
  const distances: Record<string, number> = {};

  // Initialize
  graph.nodes.forEach((node) => {
    previous[node.id] = null;
    distances[node.id] = node.id === startNode ? 0 : Infinity;
  });

  distances[startNode] = 0;

  yield {
    stepNumber: 0,
    action: "enqueue",
    currentNode: startNode,
    visitedNodes: [],
    queuedNodes: [startNode],
    activeEdges: [],
    distances: { ...distances },
    previous: { ...previous },
    explanation: `Starting BFS from node ${startNode}. Added to queue.`,
  };

  let stepNum = 1;

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (visited.has(current)) continue;

    visited.add(current);

    yield {
      stepNumber: stepNum++,
      action: "visit",
      currentNode: current,
      visitedNodes: Array.from(visited),
      queuedNodes: [...queue],
      activeEdges: [],
      distances: { ...distances },
      previous: { ...previous },
      explanation: `Visiting node ${current}. Distance from start: ${distances[current]}`,
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
        visitedNodes: Array.from(visited),
        queuedNodes: [],
        activeEdges: [],
        distances: { ...distances },
        previous: { ...previous },
        pathSoFar: path,
        explanation: `✅ Found path to ${endNode}! Path: ${path.join(" → ")} (${path.length - 1} edges)`,
      };
      return;
    }

    // Get neighbors
    const neighborEdges = graph.edges.filter((edge) => {
      if (graph.directed) {
        return edge.source === current;
      } else {
        return edge.source === current || edge.target === current;
      }
    });

    for (const edge of neighborEdges) {
      const neighbor = graph.directed
        ? edge.target
        : edge.source === current
        ? edge.target
        : edge.source;

      if (!visited.has(neighbor) && !queue.includes(neighbor)) {
        queue.push(neighbor);
        previous[neighbor] = current;
        distances[neighbor] = distances[current] + 1;

        yield {
          stepNumber: stepNum++,
          action: "enqueue",
          currentNode: current,
          visitedNodes: Array.from(visited),
          queuedNodes: [...queue],
          activeEdges: [edge.id],
          distances: { ...distances },
          previous: { ...previous },
          explanation: `Added ${neighbor} to queue via edge ${current} → ${neighbor}`,
        };
      }
    }
  }

  // Final step
  let finalPath: string[] = [];
  if (endNode && previous[endNode] !== undefined && previous[endNode] !== null) {
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
    visitedNodes: Array.from(visited),
    queuedNodes: [],
    activeEdges: [],
    distances: { ...distances },
    previous: { ...previous },
    pathSoFar: finalPath.length > 0 ? finalPath : undefined,
    explanation: endNode && finalPath.length === 0
      ? `❌ No path exists from ${startNode} to ${endNode}`
      : endNode
      ? `✅ BFS complete! Path: ${finalPath.join(" → ")}`
      : `✅ BFS complete! Explored ${visited.size} nodes from ${startNode}.`,
  };
}