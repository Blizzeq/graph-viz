import { create } from "zustand";
import { Graph, Node, Edge, EditMode } from "@/types/graph";
import { GraphManager } from "@/lib/graph/graph-class";

interface GraphStore {
  graph: Graph;
  graphManager: GraphManager;
  editMode: EditMode;
  selectedNodes: string[];
  selectedEdges: string[];

  // Graph mutations
  setGraph: (graph: Graph) => void;
  addNode: (node: Node) => void;
  removeNode: (nodeId: string) => void;
  updateNode: (nodeId: string, updates: Partial<Node>) => void;
  addEdge: (edge: Edge) => void;
  removeEdge: (edgeId: string) => void;
  updateEdge: (edgeId: string, updates: Partial<Edge>) => void;
  clearGraph: () => void;
  setDirected: (directed: boolean) => void;

  // Selection
  selectNode: (nodeId: string) => void;
  deselectNode: (nodeId: string) => void;
  clearSelection: () => void;
  selectEdge: (edgeId: string) => void;
  deselectEdge: (edgeId: string) => void;

  // Edit mode
  setEditMode: (mode: EditMode) => void;
}

export const useGraphStore = create<GraphStore>((set, get) => {
  const initialGraph: Graph = {
    nodes: [],
    edges: [],
    directed: false,
  };

  const graphManager = new GraphManager(initialGraph);

  return {
    graph: initialGraph,
    graphManager,
    editMode: "select",
    selectedNodes: [],
    selectedEdges: [],

    setGraph: (graph) => {
      graphManager.setGraph(graph);
      set({ graph: graphManager.getGraph() });
    },

    addNode: (node) => {
      graphManager.addNode(node);
      set({ graph: graphManager.getGraph() });
    },

    removeNode: (nodeId) => {
      graphManager.removeNode(nodeId);
      set({
        graph: graphManager.getGraph(),
        selectedNodes: get().selectedNodes.filter((id) => id !== nodeId),
      });
    },

    updateNode: (nodeId, updates) => {
      graphManager.updateNode(nodeId, updates);
      set({ graph: graphManager.getGraph() });
    },

    addEdge: (edge) => {
      graphManager.addEdge(edge);
      set({ graph: graphManager.getGraph() });
    },

    removeEdge: (edgeId) => {
      graphManager.removeEdge(edgeId);
      set({
        graph: graphManager.getGraph(),
        selectedEdges: get().selectedEdges.filter((id) => id !== edgeId),
      });
    },

    updateEdge: (edgeId, updates) => {
      graphManager.updateEdge(edgeId, updates);
      set({ graph: graphManager.getGraph() });
    },

    clearGraph: () => {
      graphManager.clear();
      set({
        graph: graphManager.getGraph(),
        selectedNodes: [],
        selectedEdges: [],
      });
    },

    setDirected: (directed) => {
      graphManager.setDirected(directed);
      set({ graph: graphManager.getGraph() });
    },

    selectNode: (nodeId) => {
      set((state) => ({
        selectedNodes: [...state.selectedNodes, nodeId],
      }));
    },

    deselectNode: (nodeId) => {
      set((state) => ({
        selectedNodes: state.selectedNodes.filter((id) => id !== nodeId),
      }));
    },

    clearSelection: () => {
      set({ selectedNodes: [], selectedEdges: [] });
    },

    selectEdge: (edgeId) => {
      set((state) => ({
        selectedEdges: [...state.selectedEdges, edgeId],
      }));
    },

    deselectEdge: (edgeId) => {
      set((state) => ({
        selectedEdges: state.selectedEdges.filter((id) => id !== edgeId),
      }));
    },

    setEditMode: (mode) => {
      set({ editMode: mode, selectedNodes: [], selectedEdges: [] });
    },
  };
});