import { Graph } from "@/types/graph";
import { AlgorithmStep, AlgorithmType } from "@/types/algorithm";
import { dijkstraGenerator } from "./dijkstra";
import { bfsGenerator } from "./bfs";
import { dfsGenerator } from "./dfs";
import { astarGenerator } from "./astar";
import { bellmanFordGenerator } from "./bellman-ford";
import { primGenerator } from "./prim";
import { kruskalGenerator } from "./kruskal";

export function getAlgorithmGenerator(
  algorithm: AlgorithmType,
  graph: Graph,
  startNode: string,
  endNode: string | null
): Generator<AlgorithmStep> {
  switch (algorithm) {
    case "dijkstra":
      return dijkstraGenerator(graph, startNode, endNode);
    case "bfs":
      return bfsGenerator(graph, startNode, endNode);
    case "dfs":
      return dfsGenerator(graph, startNode, endNode);
    case "astar":
      return astarGenerator(graph, startNode, endNode);
    case "bellman-ford":
      return bellmanFordGenerator(graph, startNode, endNode);
    case "prim":
      return primGenerator(graph, startNode, endNode);
    case "kruskal":
      return kruskalGenerator(graph, startNode, endNode);
    default:
      throw new Error(`Algorithm ${algorithm} not implemented yet`);
  }
}

export function runAlgorithm(
  algorithm: AlgorithmType,
  graph: Graph,
  startNode: string,
  endNode: string | null
): AlgorithmStep[] {
  const generator = getAlgorithmGenerator(algorithm, graph, startNode, endNode);
  const steps: AlgorithmStep[] = [];

  for (const step of generator) {
    steps.push(step);
  }

  return steps;
}