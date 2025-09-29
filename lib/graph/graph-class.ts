import { Graph, Node, Edge } from "@/types/graph";

export class GraphManager {
  private graph: Graph;

  constructor(initialGraph?: Graph) {
    this.graph = initialGraph || {
      nodes: [],
      edges: [],
      directed: false,
    };
  }

  getGraph(): Graph {
    // Return a new object to ensure React detects changes
    return {
      ...this.graph,
      nodes: [...this.graph.nodes],
      edges: [...this.graph.edges],
    };
  }

  setGraph(graph: Graph): void {
    this.graph = graph;
  }

  addNode(node: Node): void {
    if (this.findNode(node.id)) {
      throw new Error(`Node with id ${node.id} already exists`);
    }
    this.graph.nodes.push(node);
  }

  removeNode(nodeId: string): void {
    this.graph.nodes = this.graph.nodes.filter((n) => n.id !== nodeId);
    // Remove all edges connected to this node
    this.graph.edges = this.graph.edges.filter(
      (e) => e.source !== nodeId && e.target !== nodeId
    );
  }

  findNode(nodeId: string): Node | undefined {
    return this.graph.nodes.find((n) => n.id === nodeId);
  }

  updateNode(nodeId: string, updates: Partial<Node>): void {
    const node = this.findNode(nodeId);
    if (!node) {
      throw new Error(`Node with id ${nodeId} not found`);
    }
    Object.assign(node, updates);
  }

  addEdge(edge: Edge): void {
    if (this.findEdge(edge.id)) {
      return;
    }
    if (!this.findNode(edge.source) || !this.findNode(edge.target)) {
      return;
    }
    this.graph.edges.push(edge);
  }

  removeEdge(edgeId: string): void {
    this.graph.edges = this.graph.edges.filter((e) => e.id !== edgeId);
  }

  findEdge(edgeId: string): Edge | undefined {
    return this.graph.edges.find((e) => e.id === edgeId);
  }

  updateEdge(edgeId: string, updates: Partial<Edge>): void {
    const edge = this.findEdge(edgeId);
    if (!edge) {
      throw new Error(`Edge with id ${edgeId} not found`);
    }
    Object.assign(edge, updates);
  }

  getNeighbors(nodeId: string): Node[] {
    const neighbors: Node[] = [];

    this.graph.edges.forEach((edge) => {
      if (edge.source === nodeId) {
        const neighbor = this.findNode(edge.target);
        if (neighbor) neighbors.push(neighbor);
      } else if (!this.graph.directed && edge.target === nodeId) {
        const neighbor = this.findNode(edge.source);
        if (neighbor) neighbors.push(neighbor);
      }
    });

    return neighbors;
  }

  getOutgoingEdges(nodeId: string): Edge[] {
    return this.graph.edges.filter((edge) => edge.source === nodeId);
  }

  getIncomingEdges(nodeId: string): Edge[] {
    return this.graph.edges.filter((edge) => edge.target === nodeId);
  }

  getAllEdges(nodeId: string): Edge[] {
    if (this.graph.directed) {
      return [...this.getOutgoingEdges(nodeId), ...this.getIncomingEdges(nodeId)];
    }
    return this.graph.edges.filter(
      (edge) => edge.source === nodeId || edge.target === nodeId
    );
  }

  clear(): void {
    this.graph = {
      nodes: [],
      edges: [],
      directed: this.graph.directed,
    };
  }

  setDirected(directed: boolean): void {
    this.graph.directed = directed;
  }
}