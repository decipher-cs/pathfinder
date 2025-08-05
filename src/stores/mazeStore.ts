import {
  asyncRAF,
  coordinatesToIndex,
  getAdjacentNodesCoords,
  getRandom,
  initializeMaze,
} from "../util"
import { proxy, snapshot, subscribe } from "valtio"
import { devtools } from "valtio/utils"
import { notify } from "./alertQueueStore"
import * as z from "zod"

// prettier-ignore
export const SearchStaus = z.literal(["searching", "path found", "path not found", "waiting to start", "loading"])
export type SearchStaus = z.infer<typeof SearchStaus>

export const Position = z.tuple([z.number(), z.number(), z.number()]).readonly()
export type Position = z.infer<typeof Position>

export const State = z.literal(["blocked", "open", "start", "end", "visited"])
export type State = z.infer<typeof State>

export const PossibleAlgorithms = z.literal(["dfs", "bfs"])
export type PossibleAlgorithms = z.infer<typeof PossibleAlgorithms>

export const Node = z.object({
  position: Position,
  state: State,
  index: z.number(),
})
export type Node = z.infer<typeof Node>

export const Maze = z.array(Node.nullable())
export type Maze = z.infer<typeof Maze>

export const MazeProxy = z.object({
  nodes: Maze,
  searchStaus: SearchStaus,
  isMazeEditable: z.boolean(),
  rank: z.number(), // The dimension of the maze. Ex: a 3x3x3 maze will have a rank of 3
})

const getLocalStorageData = () => {
  const unsafe = localStorage.getItem("MAZE")
  const { success, data } = MazeProxy.safeParse(unsafe && JSON.parse(unsafe))
  return success ? data : null
}

export const mazeProxy = proxy<z.infer<typeof MazeProxy>>(
  getLocalStorageData() ?? {
    rank: 5,
    nodes: initializeMaze(5),
    searchStaus: "waiting to start",
    isMazeEditable: true,
  }
)

export const getNode = (arg: Position | number) => {
  if (typeof arg === "number") {
    if (arg < 0) return
    return mazeProxy.nodes[arg]
  }

  if (Array.isArray(arg)) {
    const rank = mazeProxy.rank
    const [x, y, z] = arg
    if (x < 0 || y < 0 || z < 0) return
    return mazeProxy.nodes[coordinatesToIndex(arg, rank)]
  }

  throw new Error("Something went wrong while getting node. See getNode()")
}

export const setNodeState = (arg: Position | number, newState: State) => {
  if (!mazeProxy.isMazeEditable) return
  const node = getNode(arg)

  if (!node) return // TODO throw error

  node.state = newState
}

export const logMaze = () => {
  const res = snapshot(mazeProxy.nodes)
  // res.forEach((node) => {
  //   console.log(node)
  // })
  console.log(res)
}

export const resetAllNodesToOpen = () => {
  mazeProxy.nodes.forEach((node) => node?.state && (node.state = "open"))
}

export const setNodeStateToStart = (arg: Position | number) => {
  if (!mazeProxy.isMazeEditable) return

  mazeProxy.nodes.forEach((node) => {
    if (node?.state === "start") node.state = "open"
  })
  setNodeState(arg, "start")
}

export const setNodeStateToEnd = (arg: Position | number) => {
  if (!mazeProxy.isMazeEditable) return
  mazeProxy.nodes.forEach((node) => {
    if (node?.state === "end") node.state = "open"
  })
  setNodeState(arg, "end")
}

export const setIsMazeEditable = (is: boolean) => (mazeProxy.isMazeEditable = is)

export const getStartNode = () => mazeProxy.nodes.find((node) => node?.state === "start")

export const getEndNode = () => mazeProxy.nodes.find((node) => node?.state === "end")

export const resizeMaze = (rank: number) => {
  mazeProxy.nodes.length = 0
  mazeProxy.nodes.push(...initializeMaze(rank))
}

export const randomizeMaze = () => {
  mazeProxy.nodes.forEach((node, i) => {
    if (!node) return
    const rand = getRandom(1)
    node.state = rand === 1 ? "blocked" : "open"
  })

  // Recursively find index for a valid node
  function getValidNode() {
    const i = getRandom(mazeProxy.nodes.length - 1)
    const node = getNode(i)
    if (!node) return getValidNode()
    return i
  }
  const a = getValidNode()
  const b = getValidNode()

  setNodeState(a, "start")
  setNodeState(b, "end")
}

export const runDfs = () => {
  const startNode = getStartNode()
  const endNode = getEndNode()
  if (!startNode || !endNode) {
    notify("Starting and Ending nodes must be selected before running the algorithm.", "alert")
    return
  }

  const stack: Node[] = [startNode]
  let endNodeFound = false

  const bfs = () =>
    new Promise(async (res, rej) => {
      const currNode = stack.pop()

      if (!currNode) {
        if (stack.length > 0 && !endNodeFound) await asyncRAF(bfs)
        return res("")
      }

      if (currNode.state === "visited") {
        if (stack.length > 0 && !endNodeFound) await asyncRAF(bfs)
        return res("")
      }

      if (currNode.state === "end") {
        endNodeFound = true
        notify(
          "Found path between start and end node. End node at " + currNode.position.toString(),
          "inform"
        )
        return res("done")
      }

      if (currNode.state !== "start") currNode.state = "visited"

      getAdjacentNodesCoords(currNode.position).forEach((adjNode) => {
        const node = getNode(adjNode)
        if (!node) return
        if (node.state === "open" || node.state === "end") stack.push(node)
      })

      if (stack.length > 0 && !endNodeFound) await asyncRAF(bfs)
      return res("done")
    })

  asyncRAF(bfs).then(() => {
    if (!endNodeFound) notify("No path available between start and end nodes", "alert")
  })
}

export const runBfs = () => {
  const startNode = getStartNode()
  const endNode = getEndNode()
  if (!startNode || !endNode) {
    notify("Starting and Ending nodes must be selected before running the algorithm.", "alert")
    return
  }

  const q: Node[] = [startNode]
  let endNodeFound = false

  const bfs = () =>
    new Promise(async (res, rej) => {
      const currNode = q.shift()

      if (!currNode) {
        if (q.length > 0 && !endNodeFound) await asyncRAF(bfs)
        return res("")
      }

      if (currNode.state === "visited") {
        if (q.length > 0 && !endNodeFound) await asyncRAF(bfs)
        return res("")
      }

      if (currNode.state === "end") {
        endNodeFound = true
        notify(
          "Found path between start and end node. End node at " + currNode.position.toString(),
          "inform"
        )
        return res("done")
      }

      if (currNode.state !== "start") currNode.state = "visited"

      getAdjacentNodesCoords(currNode.position).forEach((adjNode) => {
        const node = getNode(adjNode)
        if (!node) return
        if (node.state === "open" || node.state === "end") q.push(node)
      })

      if (q.length > 0 && !endNodeFound) await asyncRAF(bfs)
      return res("done")
    })

  asyncRAF(bfs).then(() => {
    if (!endNodeFound) notify("No path available between start and end nodes", "alert")
  })
}

if (import.meta.env.DEV) {
  const unsub = devtools(mazeProxy, { name: "MAZE", enabled: true })

  subscribe(mazeProxy, () => {
    // console.log(mazeProxy.isMazeEditable)
  })
}

// Sync with localStorage
subscribe(mazeProxy, () => {
  localStorage.setItem("MAZE", JSON.stringify(mazeProxy))
})
