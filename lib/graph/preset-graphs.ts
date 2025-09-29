import { Graph } from "@/types/graph";

export interface PresetGraph {
  id: string;
  name: string;
  description: string;
  graph: Graph;
}

export const presetGraphs: PresetGraph[] = [
  {
    id: "simple",
    name: "Simple Graph",
    description: "A simple graph with 5 nodes for basic demonstrations",
    graph: {
      nodes: [
        { id: "A", label: "A", x: 150, y: 250 },
        { id: "B", label: "B", x: 350, y: 150 },
        { id: "C", label: "C", x: 350, y: 350 },
        { id: "D", label: "D", x: 550, y: 200 },
        { id: "E", label: "E", x: 550, y: 300 },
      ],
      edges: [
        { id: "AB", source: "A", target: "B", weight: 4 },
        { id: "AC", source: "A", target: "C", weight: 2 },
        { id: "BC", source: "B", target: "C", weight: 1 },
        { id: "BD", source: "B", target: "D", weight: 5 },
        { id: "CD", source: "C", target: "D", weight: 8 },
        { id: "CE", source: "C", target: "E", weight: 10 },
        { id: "DE", source: "D", target: "E", weight: 2 },
      ],
      directed: false,
    },
  },
  {
    id: "city-network",
    name: "City Network",
    description: "A graph representing a small city road network",
    graph: {
      nodes: [
        { id: "A", label: "Downtown", x: 200, y: 200 },
        { id: "B", label: "Mall", x: 400, y: 150 },
        { id: "C", label: "Park", x: 300, y: 350 },
        { id: "D", label: "Airport", x: 600, y: 200 },
        { id: "E", label: "School", x: 500, y: 350 },
        { id: "F", label: "Hospital", x: 400, y: 450 },
        { id: "G", label: "Stadium", x: 200, y: 450 },
        { id: "H", label: "Beach", x: 650, y: 350 },
      ],
      edges: [
        { id: "AB", source: "A", target: "B", weight: 3 },
        { id: "AC", source: "A", target: "C", weight: 2 },
        { id: "AG", source: "A", target: "G", weight: 4 },
        { id: "BD", source: "B", target: "D", weight: 6 },
        { id: "BC", source: "B", target: "C", weight: 3 },
        { id: "CD", source: "C", target: "D", weight: 8 },
        { id: "CE", source: "C", target: "E", weight: 4 },
        { id: "CF", source: "C", target: "F", weight: 3 },
        { id: "CG", source: "C", target: "G", weight: 5 },
        { id: "DE", source: "D", target: "E", weight: 2 },
        { id: "DH", source: "D", target: "H", weight: 3 },
        { id: "EF", source: "E", target: "F", weight: 2 },
        { id: "EH", source: "E", target: "H", weight: 4 },
        { id: "FG", source: "F", target: "G", weight: 5 },
      ],
      directed: false,
    },
  },
  {
    id: "binary-tree",
    name: "Binary Tree",
    description: "A binary tree structure, perfect for DFS/BFS visualization",
    graph: {
      nodes: [
        { id: "1", label: "1", x: 400, y: 100 },
        { id: "2", label: "2", x: 250, y: 200 },
        { id: "3", label: "3", x: 550, y: 200 },
        { id: "4", label: "4", x: 150, y: 300 },
        { id: "5", label: "5", x: 350, y: 300 },
        { id: "6", label: "6", x: 450, y: 300 },
        { id: "7", label: "7", x: 650, y: 300 },
      ],
      edges: [
        { id: "12", source: "1", target: "2", weight: 1 },
        { id: "13", source: "1", target: "3", weight: 1 },
        { id: "24", source: "2", target: "4", weight: 1 },
        { id: "25", source: "2", target: "5", weight: 1 },
        { id: "36", source: "3", target: "6", weight: 1 },
        { id: "37", source: "3", target: "7", weight: 1 },
      ],
      directed: true,
    },
  },
  {
    id: "weighted-dag",
    name: "Weighted DAG",
    description: "Directed Acyclic Graph with varying weights",
    graph: {
      nodes: [
        { id: "S", label: "Start", x: 150, y: 250 },
        { id: "A", label: "A", x: 300, y: 150 },
        { id: "B", label: "B", x: 300, y: 350 },
        { id: "C", label: "C", x: 450, y: 200 },
        { id: "D", label: "D", x: 450, y: 300 },
        { id: "E", label: "E", x: 600, y: 250 },
      ],
      edges: [
        { id: "SA", source: "S", target: "A", weight: 7 },
        { id: "SB", source: "S", target: "B", weight: 2 },
        { id: "AC", source: "A", target: "C", weight: 3 },
        { id: "AD", source: "A", target: "D", weight: 4 },
        { id: "BC", source: "B", target: "C", weight: 8 },
        { id: "BD", source: "B", target: "D", weight: 1 },
        { id: "CE", source: "C", target: "E", weight: 2 },
        { id: "DE", source: "D", target: "E", weight: 5 },
      ],
      directed: true,
    },
  },
  {
    id: "grid",
    name: "Grid Graph",
    description: "A 4x4 grid, useful for maze-like pathfinding",
    graph: {
      nodes: [
        { id: "00", label: "0,0", x: 150, y: 150 },
        { id: "01", label: "0,1", x: 250, y: 150 },
        { id: "02", label: "0,2", x: 350, y: 150 },
        { id: "03", label: "0,3", x: 450, y: 150 },
        { id: "10", label: "1,0", x: 150, y: 250 },
        { id: "11", label: "1,1", x: 250, y: 250 },
        { id: "12", label: "1,2", x: 350, y: 250 },
        { id: "13", label: "1,3", x: 450, y: 250 },
        { id: "20", label: "2,0", x: 150, y: 350 },
        { id: "21", label: "2,1", x: 250, y: 350 },
        { id: "22", label: "2,2", x: 350, y: 350 },
        { id: "23", label: "2,3", x: 450, y: 350 },
        { id: "30", label: "3,0", x: 150, y: 450 },
        { id: "31", label: "3,1", x: 250, y: 450 },
        { id: "32", label: "3,2", x: 350, y: 450 },
        { id: "33", label: "3,3", x: 450, y: 450 },
      ],
      edges: [
        // Row 0
        { id: "00-01", source: "00", target: "01", weight: 1 },
        { id: "01-02", source: "01", target: "02", weight: 1 },
        { id: "02-03", source: "02", target: "03", weight: 1 },
        // Row 1
        { id: "10-11", source: "10", target: "11", weight: 1 },
        { id: "11-12", source: "11", target: "12", weight: 1 },
        { id: "12-13", source: "12", target: "13", weight: 1 },
        // Row 2
        { id: "20-21", source: "20", target: "21", weight: 1 },
        { id: "21-22", source: "21", target: "22", weight: 1 },
        { id: "22-23", source: "22", target: "23", weight: 1 },
        // Row 3
        { id: "30-31", source: "30", target: "31", weight: 1 },
        { id: "31-32", source: "31", target: "32", weight: 1 },
        { id: "32-33", source: "32", target: "33", weight: 1 },
        // Columns
        { id: "00-10", source: "00", target: "10", weight: 1 },
        { id: "10-20", source: "10", target: "20", weight: 1 },
        { id: "20-30", source: "20", target: "30", weight: 1 },
        { id: "01-11", source: "01", target: "11", weight: 1 },
        { id: "11-21", source: "11", target: "21", weight: 1 },
        { id: "21-31", source: "21", target: "31", weight: 1 },
        { id: "02-12", source: "02", target: "12", weight: 1 },
        { id: "12-22", source: "12", target: "22", weight: 1 },
        { id: "22-32", source: "22", target: "32", weight: 1 },
        { id: "03-13", source: "03", target: "13", weight: 1 },
        { id: "13-23", source: "13", target: "23", weight: 1 },
        { id: "23-33", source: "23", target: "33", weight: 1 },
      ],
      directed: false,
    },
  },
];