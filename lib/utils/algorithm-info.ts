import { AlgorithmInfo, AlgorithmType } from "@/types/algorithm";

export const algorithmInfo: Record<AlgorithmType, AlgorithmInfo> = {
  dijkstra: {
    id: "dijkstra",
    name: "Dijkstra's Algorithm",
    description:
      "Finds the shortest path from a start node to all other nodes in a weighted graph with non-negative edge weights.",
    complexity: "O((V + E) log V)",
    requiresEndNode: true,
  },
  bfs: {
    id: "bfs",
    name: "Breadth-First Search (BFS)",
    description:
      "Explores the graph level by level, finding the shortest path in unweighted graphs.",
    complexity: "O(V + E)",
    requiresEndNode: false,
  },
  dfs: {
    id: "dfs",
    name: "Depth-First Search (DFS)",
    description:
      "Explores the graph by going as deep as possible along each branch before backtracking.",
    complexity: "O(V + E)",
    requiresEndNode: false,
  },
  astar: {
    id: "astar",
    name: "A* Algorithm",
    description:
      "A heuristic-based pathfinding algorithm that finds the shortest path more efficiently than Dijkstra.",
    complexity: "O(E)",
    requiresEndNode: true,
  },
  "bellman-ford": {
    id: "bellman-ford",
    name: "Bellman-Ford Algorithm",
    description:
      "Finds shortest paths from a source node, works with negative edge weights, and detects negative cycles.",
    complexity: "O(V × E)",
    requiresEndNode: false,
  },
  prim: {
    id: "prim",
    name: "Prim's Algorithm",
    description:
      "Finds a minimum spanning tree for a weighted undirected graph.",
    complexity: "O((V + E) log V)",
    requiresEndNode: false,
  },
  kruskal: {
    id: "kruskal",
    name: "Kruskal's Algorithm",
    description:
      "Finds a minimum spanning tree by sorting edges and adding them if they don't form a cycle.",
    complexity: "O(E log E)",
    requiresEndNode: false,
  },
};