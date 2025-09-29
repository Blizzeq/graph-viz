# Graph Algorithm Visualizer

An interactive web application for visualizing graph algorithms in real-time. Built with Next.js, TypeScript, and React Flow.

![Main Interface](screenshots/Zrzut%20ekranu%202025-09-29%20225705.png)

## Features

### ✏️ Interactive Graph Editor

- Add and remove nodes
- Create weighted edges
- Drag nodes to reposition
- Support for directed and undirected graphs
- Preset graph configurations
- Random graph generation (up to 50 nodes)

![Graph Editing](screenshots/Zrzut%20ekranu%202025-09-29%20225749.png)

### 🎬 Visualization Controls

- **Play/Pause** - Control animation playback
- **Step-by-step** - Navigate through algorithm execution
- **Speed control** - Adjust from 0.5x to 10x speed
- **Instant mode** - Jump to final result immediately
- **Reset** - Clear visualization and start over

![Visualization](screenshots/Zrzut%20ekranu%202025-09-29%20225819.png)

### ⌨️ Keyboard Shortcuts

- `Space` - Play/Pause
- `←/→` - Previous/Next step
- `R` - Reset visualization
- `Esc` - Clear selection

## Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **UI Library:** Shadcn UI + Radix UI
- **Graph Rendering:** React Flow
- **State Management:** Zustand
- **Styling:** Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd graph-viz

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
npm run build
npm start
```

## Usage

1. **Choose a graph** - Select a preset or generate a random graph
2. **Select an algorithm** - Pick from 7 different algorithms
3. **Set nodes** - Choose start node (and end node for pathfinding)
4. **Visualize** - Click Play to watch the algorithm in action
5. **Explore** - Use tooltips, controls, and step-by-step mode to learn

## Project Structure

```
graph-viz/
├── app/                    # Next.js app directory
├── components/             # React components
│   ├── algorithm/          # Algorithm selector
│   ├── graph/              # Graph canvas and nodes
│   ├── layout/             # Layout components
│   └── ui/                 # Shadcn UI components
├── lib/                    # Core logic
│   ├── algorithms/         # Algorithm implementations
│   ├── graph/              # Graph data structures
│   ├── store/              # Zustand stores
│   └── utils/              # Utility functions
├── hooks/                  # Custom React hooks
└── types/                  # TypeScript type definitions
```

## Author

Created by **Jakub Krasuski**
