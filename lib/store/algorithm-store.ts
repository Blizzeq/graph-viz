import { create } from "zustand";
import { AlgorithmState, AlgorithmType, AlgorithmStep } from "@/types/algorithm";

interface AlgorithmStore extends AlgorithmState {
  // Actions
  setAlgorithm: (algo: AlgorithmType | null) => void;
  setStartNode: (nodeId: string | null) => void;
  setEndNode: (nodeId: string | null) => void;
  setSteps: (steps: AlgorithmStep[]) => void;
  setCurrentStepIndex: (index: number) => void;
  setPlaying: (playing: boolean) => void;
  setSpeed: (speed: number) => void;
  reset: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  skipToEnd: () => void;
  skipToStart: () => void;

  // Getters
  getCurrentStep: () => AlgorithmStep | null;
  getProgress: () => number;
}

const initialState: AlgorithmState = {
  algorithm: null,
  steps: [],
  currentStepIndex: -1,
  isPlaying: false,
  speed: 1,
  startNode: null,
  endNode: null,
  result: undefined,
};

export const useAlgorithmStore = create<AlgorithmStore>((set, get) => ({
  ...initialState,

  setAlgorithm: (algo) => set({ algorithm: algo }),

  setStartNode: (nodeId) => set({ startNode: nodeId }),

  setEndNode: (nodeId) => set({ endNode: nodeId }),

  setSteps: (steps) => set({ steps, currentStepIndex: steps.length > 0 ? 0 : -1 }),

  setCurrentStepIndex: (index) => set({ currentStepIndex: index }),

  setPlaying: (playing) => set({ isPlaying: playing }),

  setSpeed: (speed) => set({ speed }),

  reset: () =>
    set({
      currentStepIndex: 0,
      isPlaying: false,
      result: undefined,
    }),

  stepForward: () =>
    set((state) => ({
      currentStepIndex: Math.min(state.currentStepIndex + 1, state.steps.length - 1),
      isPlaying: false,
    })),

  stepBackward: () =>
    set((state) => ({
      currentStepIndex: Math.max(state.currentStepIndex - 1, 0),
      isPlaying: false,
    })),

  skipToEnd: () =>
    set((state) => ({
      currentStepIndex: state.steps.length - 1,
      isPlaying: false,
    })),

  skipToStart: () =>
    set({
      currentStepIndex: 0,
      isPlaying: false,
    }),

  getCurrentStep: () => {
    const { steps, currentStepIndex } = get();
    return steps[currentStepIndex] || null;
  },

  getProgress: () => {
    const { steps, currentStepIndex } = get();
    if (steps.length === 0) return 0;
    return (currentStepIndex / (steps.length - 1)) * 100;
  },
}));