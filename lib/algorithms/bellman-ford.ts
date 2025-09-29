import { Graph } from "@/types/graph";
import { AlgorithmStep } from "@/types/algorithm";

export function* bellmanFordGenerator(
  graph: Graph,
  startNode: string,
  endNode: string | null
): Generator<AlgorithmStep> {
  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
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
    queuedNodes: graph.nodes.map(n => n.id),
    activeEdges: [],
    distances: { ...distances },
    previous: { ...previous },
    explanation: `Starting Bellman-Ford from ${startNode}. Will relax all edges ${graph.nodes.length - 1} times.`,
  };

  let stepNum = 1;
  const nodeCount = graph.nodes.length;

  // Relax all edges |V| - 1 times
  for (let i = 0; i < nodeCount - 1; i++) {
    let updated = false;

    yield {
      stepNumber: stepNum++,
      action: "check",
      currentNode: null,
      visitedNodes: visited,
      queuedNodes: [],
      activeEdges: [],
      distances: { ...distances },
      previous: { ...previous },
      explanation: `Iteration ${i + 1}/${nodeCount - 1}: Relaxing all edges...`,
    };

    for (const edge of graph.edges) {
      const { source, target, weight } = edge;

      // Relax source -> target
      if (distances[source] !== Infinity && distances[source] + weight < distances[target]) {
        distances[target] = distances[source] + weight;
        previous[target] = source;
        updated = true;

        yield {
          stepNumber: stepNum++,
          action: "update",
          currentNode: target,
          visitedNodes: visited,
          queuedNodes: [],
          activeEdges: [`${source}-${target}`],
          distances: { ...distances },
          previous: { ...previous },
          explanation: `Relaxed edge ${source}→${target} (weight ${weight}). Distance to ${target} updated to ${distances[target].toFixed(1)}`,
        };
      }

      // For undirected graphs, also relax target -> source
      if (!graph.directed && distances[target] !== Infinity && distances[target] + weight < distances[source]) {
        distances[source] = distances[target] + weight;
        previous[source] = target;
        updated = true;

        yield {
          stepNumber: stepNum++,
          action: "update",
          currentNode: source,
          visitedNodes: visited,
          queuedNodes: [],
          activeEdges: [`${target}-${source}`],
          distances: { ...distances },
          previous: { ...previous },
          explanation: `Relaxed edge ${target}→${source} (weight ${weight}). Distance to ${source} updated to ${distances[source].toFixed(1)}`,
        };
      }
    }

    if (!updated) {
      yield {
        stepNumber: stepNum++,
        action: "check",
        currentNode: null,
        visitedNodes: visited,
        queuedNodes: [],
        activeEdges: [],
        distances: { ...distances },
        previous: { ...previous },
        explanation: `No updates in iteration ${i + 1}. Algorithm converged early!`,
      };
      break;
    }
  }

  // Check for negative-weight cycles
  yield {
    stepNumber: stepNum++,
    action: "check",
    currentNode: null,
    visitedNodes: visited,
    queuedNodes: [],
    activeEdges: [],
    distances: { ...distances },
    previous: { ...previous },
    explanation: "Checking for negative-weight cycles...",
  };

  for (const edge of graph.edges) {
    const { source, target, weight } = edge;

    if (distances[source] !== Infinity && distances[source] + weight < distances[target]) {
      yield {
        stepNumber: stepNum++,
        action: "finalize",
        currentNode: null,
        visitedNodes: visited,
        queuedNodes: [],
        activeEdges: [`${source}-${target}`],
        distances: { ...distances },
        previous: { ...previous },
        explanation: `⚠️ Negative-weight cycle detected! Edge ${source}→${target} can still be relaxed.`,
      };
      return;
    }
  }

  // Build final path if endNode specified
  if (endNode && distances[endNode] !== Infinity) {
    const path: string[] = [];
    let temp: string | null = endNode;
    while (temp !== null) {
      path.unshift(temp);
      temp = previous[temp];
    }

    yield {
      stepNumber: stepNum++,
      action: "finalize",
      currentNode: endNode,
      visitedNodes: visited,
      queuedNodes: [],
      activeEdges: [],
      distances: { ...distances },
      previous: { ...previous },
      pathSoFar: path,
      explanation: `✓ Shortest path found! Total cost: ${distances[endNode].toFixed(2)}. Path: ${path.join(" → ")}`,
    };
  } else {
    yield {
      stepNumber: stepNum++,
      action: "finalize",
      currentNode: null,
      visitedNodes: visited,
      queuedNodes: [],
      activeEdges: [],
      distances: { ...distances },
      previous: { ...previous },
      explanation: `✓ Algorithm complete. Shortest distances from ${startNode} calculated.`,
    };
  }
}