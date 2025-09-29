export interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  data?: Record<string, unknown>;
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  weight: number;
  directed?: boolean;
}

export interface Graph {
  nodes: Node[];
  edges: Edge[];
  directed: boolean;
}

export type EditMode = 'select' | 'add-node' | 'add-edge' | 'delete';