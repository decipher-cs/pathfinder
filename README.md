> [!IMPORTANT]  
> Superseded by a new implementation which uses three.js and valtio. Check the main branch.

# Trailblazer v2.0

Faster and cleaner looking implementation of traillblazer v1. Better than its ancestor in every regard.

## Table of Contents

-   [Preview](#)
-   [Features](#)
-   [What has Improved](#)
-   [Installation](#)
-   [Tech Used](#tech-used)
-   [Goals](#)
-   [Known Issues](#known-issues)
-   [Acknowledgment](#)
-   [License](#license)

## Preview

New version:
![preview video](public/v2-demo.mp4)

Old version:
![preview gif](public/trailblazer.gif)

## Features

-   Highly performant.
-   Support for various algorithms.
-   Soft design.
-   Web workers to free the main thread while solving the 'maze'

## What has Improved

-   Added framer motion for better animation
-   Included zustand for state management

## Installation

`pnpn i && pnpm dev`

## Tech Used

-   Typescript
-   React
-   MUI
-   Vite
-   Framer Motion
-   Zustand

## Goals

-   [x] Support dynamic sized grids.
-   [x] Improve recursive DFS algorithm using DP.
-   [ ] Respect user's "prefers-reduced-motion" settings using useReducedMotion from framer-motion.
-   [ ] Add new input to tweak the chances of a wall getting places when running `Math.floor(Math.random() * 3.5)`. Replace `3.5` with variable.

## Known Issues

## Acknowledgment

-   See [Maze-solving algorithms on wikipedia](https://en.wikipedia.org/wiki/Maze-solving_algorithm)
-   [Spanning Tree Youtube channel - Dijkstra's algorithm](https://www.youtube.com/watch?v=EFg3u_E6eHU)
-   [Texicab Geometry](https://en.wikipedia.org/wiki/Taxicab_geometry)
-   [Astar search algorithm](https://briangrinstead.com/blog/astar-search-algorithm-in-javascript/)
-   [CSS dot pattern background](https://codepen.io/edmundojr/pen/xOYJGw)
-   You can destructure using commas. [[, , value]](https://github.com/microsoft/TypeScript/issues/10571#issuecomment-242913490)

## License

GNU GENERAL PUBLIC LICENSE
