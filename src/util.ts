import { type Position, type Maze, type Node } from "./store"

export const areArrayEqual = (a: Position, b: Position): boolean =>
  a[0] === b[0] && a[1] === b[1] && a[2] === b[2]

export const coordinatesToStr = ([x, y, z]: Position) => `${x},${y},${z}`

export const strToCoordinates = (position: string) => position.split(",")

export const coordinatesToIndex = ([x, y, z]: Position, rank: number) => {
  const result = x * rank * rank + y * rank + z
  return result
}

export const indexToCoordinates = (index: number, rank: number) => {
  const x = Math.floor(index / (rank * rank))
  const y = Math.floor((index / rank) % rank)
  const z = index % rank
  return [x, y, z]
}

export const initializeMaze = (rank = 5): Maze => {
  const length = rank * rank * rank //TODO: maybe optimize storage (rank - 1) * (rank - 1) * (rank - 1)
  const positions: Maze = Array(length)
  let index = 0

  for (let x = 0; x < rank; x++) {
    for (let y = 0; y < rank; y++) {
      for (let z = 0; z < rank; z++) {
        const isSurface =
          x === 0 || x === rank - 1 || y === 0 || y === rank - 1 || z === 0 || z === rank - 1

        console.log()
        if (isSurface) {
          const obj = {
            position: [x, y, z] as const,
            state: "open" as const,
            index: coordinatesToIndex([x, y, z], rank),
          } satisfies Node
          const i = coordinatesToIndex([x, y, z], rank)
          positions[i] = obj
          index++
        }
      }
    }
  }
  return positions
}
