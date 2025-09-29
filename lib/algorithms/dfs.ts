import { Graph } from "@/types/graph";
import { AlgorithmStep } from "@/types/algorithm";

export function* dfsGenerator(
  graph: Graph,
  startNode: string,
  endNode: string | null
): Generator<AlgorithmStep> {
  const visited = new Set<string>();
  const stack: string[] = [startNode];
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
    explanation: `Starting DFS from node ${startNode}. Added to stack.`,
  };

  let stepNum = 1;

  while (stack.length > 0) {
    const current = stack.pop()!;

    if (visited.has(current)) continue;

    visited.add(current);

    yield {
      stepNumber: stepNum++,
      action: "visit",
      currentNode: current,
      visitedNodes: Array.from(visited),
      queuedNodes: [...stack],
      activeEdges: [],
      distances: { ...distances },
      previous: { ...previous },
      explanation: `Visiting node ${current}. Depth: ${distances[current]}`,
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

    // Get neighbors (push in reverse order for consistent traversal)
    const neighborEdges = graph.edges.filter((edge) => {
      if (graph.directed) {
        return edge.source === current;
      } else {
        return edge.source === current || edge.target === current;
      }
    });

    // Reverse to maintain consistent order (left-to-right in tree)
    const sortedEdges = [...neighborEdges].reverse();

    for (const edge of sortedEdges) {
      const neighbor = graph.directed
        ? edge.target
        : edge.source === current
        ? edge.target
        : edge.source;

      if (!visited.has(neighbor) && !stack.includes(neighbor)) {
        stack.push(neighbor);
        previous[neighbor] = current;
        distances[neighbor] = distances[current] + 1;

        yield {
          stepNumber: stepNum++,
          action: "enqueue",
          currentNode: current,
          visitedNodes: Array.from(visited),
          queuedNodes: [...stack],
          activeEdges: [edge.id],
          distances: { ...distances },
          previous: { ...previous },
          explanation: `Added ${neighbor} to stack via edge ${current} → ${neighbor}`,
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
      ? `✅ DFS complete! Path: ${finalPath.join(" → ")}`
      : `✅ DFS complete! Explored ${visited.size} nodes from ${startNode}.`,
  };
}