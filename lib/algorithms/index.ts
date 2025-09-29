import { Graph } from "@/types/graph";
import { AlgorithmStep, AlgorithmType } from "@/types/algorithm";
import { dijkstraGenerator } from "./dijkstra";
import { bfsGenerator } from "./bfs";
import { dfsGenerator } from "./dfs";

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