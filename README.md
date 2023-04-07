
# Trailblazer-Pathfinder-Visualizer

Visialise various pathfinding algorithms

## Description

- Use algorithms like DFS, BFD, Dijkstra, and Astart to find the path to the destination.
- See how they work with a visual representation.

## Demo

![demo gif](./public/trailblazer.gif)

## Table of Contents (Optional)

If your README is long, add a table of contents to make it easy for users to find what they need.

- [Installation](#installation)
- [Usage](#usage)
- [Credits](#credits)
- [License](#license)

## Installation

You can start the dev server with `yarn dev` and try out the project in your browser. You can also build the binaries with electron forge using `yarn make`. You'll find the binaries inside `/out/make/[your os]/`. Ones inside the directory, choose the rpm/ deb/ exe file and install it. The package is called pathfinder.

## Usage

Drag your cursor on the grid to place walls which cannot be crossed by the algorithm. Then place the start and end block anywhere on the grid. Now just click `run` and watch the algorithm find its way to the end.


## Things I learned

- Plan things ahead. Have an outline ready before starting the project.
- Refactor often

## Known Issues

- [ ] Running new instance of the algorithm should not be possible if prevous algorithm is not completed. -> animatePath

## Credits

See [Maze-solving algorithms on wikipedia](https://en.wikipedia.org/wiki/Maze-solving_algorithm)
[Spanning Tree Youtube channel - Dijkstra's algorithm](https://www.youtube.com/watch?v=EFg3u_E6eHU)
[Texicab Geometry](https://en.wikipedia.org/wiki/Taxicab_geometry)
[Astar search algorithm](https://briangrinstead.com/blog/astar-search-algorithm-in-javascript/)

## License

The last section of a high-quality README file is the license. This lets other developers know what they can and cannot do with your project. If you need help choosing a license, refer to [https://choosealicense.com/](https://choosealicense.com/).

---
