import { Node as FlowNode, Edge as FlowEdge } from "@xyflow/react";
import { Graph, Node, Edge } from "@/types/graph";

export function graphToReactFlow(graph: Graph): {
  nodes: FlowNode[];
  edges: FlowEdge[];
} {
  const flowNodes: FlowNode[] = graph.nodes.map((node) => ({
    id: node.id,
    type: "custom",
    position: { x: node.x, y: node.y },
    data: { label: node.label, ...node.data },
  }));

  const flowEdges: FlowEdge[] = graph.edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    label: edge.weight.toString(),
    type: "custom",
    animated: false,
    data: { weight: edge.weight },
    markerEnd: graph.directed ? { type: "arrowclosed" as const } : undefined,
  }));

  return { nodes: flowNodes, edges: flowEdges };
}

export function reactFlowToGraph(
  nodes: FlowNode[],
  edges: FlowEdge[],
  directed: boolean
): Graph {
  const graphNodes: Node[] = nodes.map((node) => ({
    id: node.id,
    label: node.data.label || node.id,
    x: node.position.x,
    y: node.position.y,
    data: node.data,
  }));

  const graphEdges: Edge[] = edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    weight: edge.data?.weight || 1,
  }));

  return {
    nodes: graphNodes,
    edges: graphEdges,
    directed,
  };
}