"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Connection,
  NodeTypes,
  EdgeTypes,
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useGraphStore } from "@/lib/store/graph-store";
import { graphToReactFlow, reactFlowToGraph } from "@/lib/utils/graph-to-reactflow";
import { CustomNode } from "./custom-node";
import { CustomEdge } from "./custom-edge";
import { EditToolbar } from "./edit-toolbar";
import { EdgeWeightDialog } from "./edge-weight-dialog";

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
};

function GraphCanvasInner() {
  const graph = useGraphStore((state) => state.graph);
  const setGraph = useGraphStore((state) => state.setGraph);
  const editMode = useGraphStore((state) => state.editMode);
  const addNodeToStore = useGraphStore((state) => state.addNode);
  const removeNode = useGraphStore((state) => state.removeNode);
  const addEdgeToStore = useGraphStore((state) => state.addEdge);
  const removeEdge = useGraphStore((state) => state.removeEdge);
  const shouldFitView = useGraphStore((state) => state.shouldFitView);
  const resetFitView = useGraphStore((state) => state.resetFitView);

  const [tempEdgeStart, setTempEdgeStart] = useState<string | null>(null);
  const [tempEdgeEnd, setTempEdgeEnd] = useState<string | null>(null);
  const [showWeightDialog, setShowWeightDialog] = useState(false);
  const { screenToFlowPosition, fitView } = useReactFlow();

  // Reset temp edge state when mode changes
  useEffect(() => {
    setTempEdgeStart(null);
    setTempEdgeEnd(null);
    setShowWeightDialog(false);
  }, [editMode]);

  // Reset temp edge state when graph changes (e.g., new preset loaded)
  useEffect(() => {
    setTempEdgeStart(null);
    setTempEdgeEnd(null);
    setShowWeightDialog(false);
  }, [graph.nodes.length]);

  // Trigger fit view when requested
  useEffect(() => {
    if (shouldFitView) {
      setTimeout(() => {
        fitView({ padding: 0.2, duration: 300 });
        resetFitView();
      }, 0);
    }
  }, [shouldFitView, fitView, resetFitView]);

  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => graphToReactFlow(graph),
    [graph]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update React Flow when graph changes
  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = graphToReactFlow(graph);

    // Highlight the first node if in edge creation mode
    if (tempEdgeStart && editMode === "add-edge") {
      const highlightedNodes = newNodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          isEdgeStart: node.id === tempEdgeStart
        }
      }));
      setNodes(highlightedNodes);
    } else {
      setNodes(newNodes);
    }

    setEdges(newEdges);
  }, [graph, tempEdgeStart, editMode]);

  const onConnect = useCallback(
    (params: Connection) => {
      if (params.source && params.target) {
        addEdgeToStore({
          id: `${params.source}-${params.target}`,
          source: params.source,
          target: params.target,
          weight: 1,
        });
      }
    },
    [addEdgeToStore]
  );

  // Sync node positions back to store when dragging
  const onNodeDragStop = useCallback(
    (_event: React.MouseEvent, node: any) => {
      const updatedGraph = reactFlowToGraph(nodes, edges, graph.directed);
      setGraph(updatedGraph);
    },
    [nodes, edges, graph.directed, setGraph]
  );

  // Handle canvas click for adding nodes
  const onPaneClick = useCallback(
    (event: React.MouseEvent) => {
      console.log("onPaneClick triggered, editMode:", editMode);

      // If in add-edge mode and user clicks on empty space, reset edge creation
      if (editMode === "add-edge" && tempEdgeStart) {
        console.log("Cancelled edge creation by clicking on empty space");
        setTempEdgeStart(null);
        return;
      }

      if (editMode === "add-node") {
        // Convert screen coordinates to flow coordinates
        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        console.log("Adding node at position:", position);

        // Generate unique node ID
        const newNodeId = String.fromCharCode(65 + graph.nodes.length);

        console.log("New node ID:", newNodeId);

        addNodeToStore({
          id: newNodeId,
          label: newNodeId,
          x: position.x,
          y: position.y,
        });

        console.log("Node added to store, current nodes:", graph.nodes);
      }
    },
    [editMode, graph.nodes.length, addNodeToStore, screenToFlowPosition, tempEdgeStart]
  );

  // Handle node click for various modes
  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: any) => {
      if (editMode === "delete") {
        removeNode(node.id);
      } else if (editMode === "add-edge") {
        if (!tempEdgeStart) {
          setTempEdgeStart(node.id);
        } else {
          // Prevent self-loops
          if (tempEdgeStart === node.id) {
            console.warn("Cannot create edge from node to itself");
            setTempEdgeStart(null);
            return;
          }
          // Show dialog for weight
          setTempEdgeEnd(node.id);
          setShowWeightDialog(true);
        }
      }
    },
    [editMode, tempEdgeStart, removeNode]
  );

  const handleWeightConfirm = useCallback(
    (weight: number) => {
      if (tempEdgeStart && tempEdgeEnd) {
        addEdgeToStore({
          id: `${tempEdgeStart}-${tempEdgeEnd}`,
          source: tempEdgeStart,
          target: tempEdgeEnd,
          weight: weight,
        });
      }
      setTempEdgeStart(null);
      setTempEdgeEnd(null);
    },
    [tempEdgeStart, tempEdgeEnd, addEdgeToStore]
  );

  const handleWeightDialogClose = useCallback((open: boolean) => {
    setShowWeightDialog(open);
    if (!open) {
      // Dialog was closed/cancelled - reset state
      setTempEdgeStart(null);
      setTempEdgeEnd(null);
    }
  }, []);

  // Handle edge click for deletion
  const onEdgeClick = useCallback(
    (_event: React.MouseEvent, edge: any) => {
      if (editMode === "delete") {
        removeEdge(edge.id);
      }
    },
    [editMode, removeEdge]
  );

  return (
    <div className="flex-1 relative bg-slate-50 dark:bg-slate-900">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        onPaneClick={onPaneClick}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        minZoom={0.2}
        maxZoom={2}
        defaultEdgeOptions={{
          type: "custom",
        }}
        nodesDraggable={editMode === "select"}
        nodesConnectable={editMode === "select"}
        elementsSelectable={editMode === "select"}
        panOnDrag={editMode === "select"}
        panOnScroll={true}
        zoomOnScroll={true}
        zoomOnPinch={true}
        zoomOnDoubleClick={false}
      >
        <Background />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            return "#cbd5e1";
          }}
          className="!bg-slate-100 dark:!bg-slate-800"
        />
        <EditToolbar />

        {graph.nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center space-y-2 bg-white/90 dark:bg-slate-900/90 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
              <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
                Empty Graph Canvas
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500">
                Use the toolbar above to add nodes ➕
              </p>
            </div>
          </div>
        )}
      </ReactFlow>

      <EdgeWeightDialog
        open={showWeightDialog}
        onOpenChange={handleWeightDialogClose}
        sourceNode={tempEdgeStart || ""}
        targetNode={tempEdgeEnd || ""}
        onConfirm={handleWeightConfirm}
      />
    </div>
  );
}

export function GraphCanvas() {
  return (
    <ReactFlowProvider>
      <GraphCanvasInner />
    </ReactFlowProvider>
  );
}