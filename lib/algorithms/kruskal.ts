import { Graph } from "@/types/graph";
import { AlgorithmStep } from "@/types/algorithm";

// Union-Find (Disjoint Set) data structure
class UnionFind {
  private parent: Map<string, string>;
  private rank: Map<string, number>;

  constructor(nodes: string[]) {
    this.parent = new Map();
    this.rank = new Map();

    for (const node of nodes) {
      this.parent.set(node, node);
      this.rank.set(node, 0);
    }
  }

  find(node: string): string {
    if (this.parent.get(node) !== node) {
      this.parent.set(node, this.find(this.parent.get(node)!));
    }
    return this.parent.get(node)!;
  }

  union(node1: string, node2: string): boolean {
    const root1 = this.find(node1);
    const root2 = this.find(node2);

    if (root1 === root2) return false; // Already in same set

    const rank1 = this.rank.get(root1)!;
    const rank2 = this.rank.get(root2)!;

    if (rank1 < rank2) {
      this.parent.set(root1, root2);
    } else if (rank1 > rank2) {
      this.parent.set(root2, root1);
    } else {
      this.parent.set(root2, root1);
      this.rank.set(root1, rank1 + 1);
    }

    return true;
  }
}

export function* kruskalGenerator(
  graph: Graph,
  startNode: string,
  endNode: string | null
): Generator<AlgorithmStep> {
  const nodeIds = graph.nodes.map(n => n.id);
  const uf = new UnionFind(nodeIds);
  const mstEdges: string[] = [];
  const visited: string[] = [];
  let totalCost = 0;

  // Sort edges by weight
  const sortedEdges = [...graph.edges].sort((a, b) => a.weight - b.weight);

  yield {
    stepNumber: 0,
    action: "visit",
    currentNode: null,
    visitedNodes: [],
    queuedNodes: nodeIds,
    activeEdges: [],
    mstEdges: [],
    mstCost: 0,
    explanation: `🌳 Starting Kruskal's MST algorithm. Sorted ${sortedEdges.length} edges by weight.`,
  };

  let stepNum = 1;
  let edgesAdded = 0;
  const targetEdges = nodeIds.length - 1; // MST has |V| - 1 edges

  for (let i = 0; i < sortedEdges.length && edgesAdded < targetEdges; i++) {
    const edge = sortedEdges[i];
    const { source, target, weight, id } = edge;

    yield {
      stepNumber: stepNum++,
      action: "check",
      currentNode: source,
      visitedNodes: visited,
      queuedNodes: [],
      activeEdges: [id],
      mstEdges: [...mstEdges],
      mstCost: totalCost,
      explanation: `🔍 Checking edge ${source}→${target} (weight ${weight}). Does it create a cycle?`,
    };

    // Check if adding this edge creates a cycle
    if (uf.union(source, target)) {
      // No cycle - add to MST
      mstEdges.push(id);
      if (!visited.includes(source)) visited.push(source);
      if (!visited.includes(target)) visited.push(target);
      totalCost += weight;
      edgesAdded++;

      yield {
        stepNumber: stepNum++,
        action: "update",
        currentNode: target,
        visitedNodes: [...visited],
        queuedNodes: [],
        activeEdges: [id],
        mstEdges: [...mstEdges],
        mstCost: totalCost,
        explanation: `✅ Added edge ${source}→${target} (weight ${weight}) to MST. Total cost: ${totalCost.toFixed(2)}. Edges: ${edgesAdded}/${targetEdges}`,
      };
    } else {
      // Creates cycle - skip
      yield {
        stepNumber: stepNum++,
        action: "check",
        currentNode: null,
        visitedNodes: visited,
        queuedNodes: [],
        activeEdges: [],
        mstEdges: [...mstEdges],
        mstCost: totalCost,
        explanation: `❌ Skipped edge ${source}→${target} - would create a cycle.`,
      };
    }
  }

  if (edgesAdded === targetEdges) {
    yield {
      stepNumber: stepNum++,
      action: "finalize",
      currentNode: null,
      visitedNodes: visited,
      queuedNodes: [],
      activeEdges: [],
      mstEdges: [...mstEdges],
      mstCost: totalCost,
      explanation: `✅ Minimum Spanning Tree complete! Total cost: ${totalCost.toFixed(2)}. Edges: ${mstEdges.length}`,
    };
  } else {
    yield {
      stepNumber: stepNum++,
      action: "finalize",
      currentNode: null,
      visitedNodes: visited,
      queuedNodes: [],
      activeEdges: [],
      mstEdges: [...mstEdges],
      mstCost: totalCost,
      explanation: `⚠️ Graph is disconnected. MST only includes ${edgesAdded + 1} components. Total cost: ${totalCost.toFixed(2)}`,
    };
  }
}