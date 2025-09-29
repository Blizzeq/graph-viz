export type AlgorithmType =
  | 'dijkstra'
  | 'bfs'
  | 'dfs'
  | 'astar'
  | 'bellman-ford'
  | 'prim'
  | 'kruskal';

export type StepAction = 'visit' | 'check' | 'update' | 'finalize' | 'enqueue' | 'dequeue';

export interface AlgorithmStep {
  stepNumber: number;
  action: StepAction;
  currentNode: string | null;
  visitedNodes: string[];
  queuedNodes: string[];
  activeEdges: string[];
  distances?: Record<string, number>;
  previous?: Record<string, string | null>;
  explanation: string;
  pathSoFar?: string[];
  // For A* algorithm - f-scores (g + h)
  fScores?: Record<string, number>;
  // For MST algorithms (Prim, Kruskal) - edges that are part of the MST
  mstEdges?: string[];
  // For MST algorithms - total cost of MST so far
  mstCost?: number;
}

export interface AlgorithmState {
  algorithm: AlgorithmType | null;
  steps: AlgorithmStep[];
  currentStepIndex: number;
  isPlaying: boolean;
  speed: number;
  startNode: string | null;
  endNode: string | null;
  result?: {
    path: string[];
    totalCost: number;
    nodesVisited: number;
  };
}

export interface AlgorithmInfo {
  id: AlgorithmType;
  name: string;
  description: string;
  complexity: string;
  requiresEndNode: boolean;
}