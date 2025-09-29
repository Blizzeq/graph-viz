import { Graph } from "@/types/graph";
import { AlgorithmStep } from "@/types/algorithm";

export function* primGenerator(
  graph: Graph,
  startNode: string,
  endNode: string | null
): Generator<AlgorithmStep> {
  const inMST = new Set<string>([startNode]);
  const notInMST = new Set(graph.nodes.map(n => n.id).filter(id => id !== startNode));
  const mstEdges: string[] = [];
  const visited: string[] = [startNode];
  let totalCost = 0;

  yield {
    stepNumber: 0,
    action: "visit",
    currentNode: startNode,
    visitedNodes: [startNode],
    queuedNodes: Array.from(notInMST),
    activeEdges: [],
    explanation: `Starting Prim's MST algorithm from node ${startNode}. Building minimum spanning tree...`,
  };

  let stepNum = 1;

  while (notInMST.size > 0) {
    let minEdge: { source: string; target: string; weight: number; id: string } | null = null;
    let minWeight = Infinity;

    // Find the minimum weight edge connecting MST to non-MST
    for (const edge of graph.edges) {
      const { source, target, weight } = edge;

      // Check both directions for undirected graphs
      if (inMST.has(source) && notInMST.has(target)) {
        if (weight < minWeight) {
          minWeight = weight;
          minEdge = { source, target, weight, id: edge.id };
        }
      } else if (inMST.has(target) && notInMST.has(source)) {
        if (weight < minWeight) {
          minWeight = weight;
          minEdge = { source: target, target: source, weight, id: edge.id };
        }
      }
    }

    if (minEdge === null) {
      // Graph is disconnected
      yield {
        stepNumber: stepNum++,
        action: "finalize",
        currentNode: null,
        visitedNodes: visited,
        queuedNodes: Array.from(notInMST),
        activeEdges: mstEdges,
        explanation: `⚠️ Graph is disconnected. MST only includes ${inMST.size} nodes. Total cost: ${totalCost.toFixed(2)}`,
      };
      return;
    }

    // Add the edge to MST
    inMST.add(minEdge.target);
    notInMST.delete(minEdge.target);
    mstEdges.push(minEdge.id);
    visited.push(minEdge.target);
    totalCost += minEdge.weight;

    yield {
      stepNumber: stepNum++,
      action: "update",
      currentNode: minEdge.target,
      visitedNodes: [...visited],
      queuedNodes: Array.from(notInMST),
      activeEdges: [...mstEdges],
      explanation: `Added edge ${minEdge.source}→${minEdge.target} (weight ${minEdge.weight}) to MST. Total cost: ${totalCost.toFixed(2)}`,
    };

    // If all nodes are in MST, we're done
    if (notInMST.size === 0) {
      yield {
        stepNumber: stepNum++,
        action: "finalize",
        currentNode: null,
        visitedNodes: visited,
        queuedNodes: [],
        activeEdges: mstEdges,
        explanation: `✓ Minimum Spanning Tree complete! Total cost: ${totalCost.toFixed(2)}. Edges: ${mstEdges.length}`,
      };
      return;
    }

    // Show all candidate edges for next iteration
    const candidateEdges: string[] = [];
    for (const edge of graph.edges) {
      const { source, target } = edge;
      if ((inMST.has(source) && notInMST.has(target)) ||
          (inMST.has(target) && notInMST.has(source))) {
        candidateEdges.push(edge.id);
      }
    }

    yield {
      stepNumber: stepNum++,
      action: "check",
      currentNode: minEdge.target,
      visitedNodes: [...visited],
      queuedNodes: Array.from(notInMST),
      activeEdges: [...mstEdges, ...candidateEdges],
      explanation: `Checking ${candidateEdges.length} candidate edges connecting MST to remaining nodes...`,
    };
  }

  yield {
    stepNumber: stepNum++,
    action: "finalize",
    currentNode: null,
    visitedNodes: visited,
    queuedNodes: [],
    activeEdges: mstEdges,
    explanation: `✓ Minimum Spanning Tree complete! Total cost: ${totalCost.toFixed(2)}`,
  };
}