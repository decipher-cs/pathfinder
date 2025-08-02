import { Vector3 } from "three"
import { type Position, type Maze, type Node } from "./stores/mazeStore"
import { proxy } from "valtio"

export const areArrayEqual = (a: Position, b: Position): boolean =>
  a[0] === b[0] && a[1] === b[1] && a[2] === b[2]

export const coordinatesToIndex = ([x, y, z]: Position, rank: number): number => {
  const result = x * rank * rank + y * rank + z
  return result
}

export const indexToCoordinates = (index: number, rank: number): Position => {
  const x = Math.floor(index / (rank * rank))
  const y = Math.floor((index / rank) % rank)
  const z = index % rank
  return [x, y, z]
}

export const initializeMaze = (rank = 5): Maze => {
  const length = rank * rank * rank //TODO: maybe optimize storage (rank - 1) * (rank - 1) * (rank - 1)
  const positions: Maze = Array(length).fill(null)
  let index = 0

  for (let x = 0; x < rank; x++) {
    for (let y = 0; y < rank; y++) {
      for (let z = 0; z < rank; z++) {
        const isSurface =
          x === 0 || x === rank - 1 || y === 0 || y === rank - 1 || z === 0 || z === rank - 1

        if (isSurface) {
          const obj = {
            position: [x, y, z] as const,
            state: "open" as const,
            index: coordinatesToIndex([x, y, z], rank),
          } satisfies Node
          const i = coordinatesToIndex([x, y, z], rank)
          positions[i] = proxy(obj)
          index++
        }
      }
    }
  }
  return proxy(positions)
}

export const getAdjacentNodesCoords = (position: Position): Position[] => {
  // prettier-ignore
  const directions = [ [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1] ]
  const result = []

  for (const dir of directions) {
    const vec1 = new Vector3(...dir)
    const vec2 = new Vector3(...position)
    result.push(vec1.add(vec2).toArray())
  }
  return result
}

export async function asyncRAF<T>(fn: () => Promise<T>) {
  return new Promise((res, rej) => {
    requestAnimationFrame(async () => {
      res(await fn())
    })
  })
}

export function getRandom(max = 100) {
  return Math.floor(Math.random() * max)
}
