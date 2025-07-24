import { asyncRAF, coordinatesToIndex, getAdjacentNodesCoords, initializeMaze } from "../util"
import { proxy, snapshot, subscribe } from "valtio"
import { devtools } from "valtio/utils"
import { notify } from "./alertQueueStore"

export type SearchStaus = "searching" | "path found" | "path not found" | "waiting to start"
export type Position = readonly [x: number, y: number, z: number]
export type State = "blocked" | "open" | "start" | "end" | "visited"
export type PossibleAlgorithms = "dfs" | "bfs"

export type Node = {
  position: Position
  state: State
  index: number
}
export type Maze = (Node | null)[]

export type MazeProxy = {
  nodes: Maze
  searchStaus: SearchStaus
  isMazeEditable: boolean
  rank: number // The dimension of the maze. Ex: a 3x3x3 maze will have a rank of 3
}

export const mazeProxy = proxy<MazeProxy>({
  rank: 5,
  nodes: initializeMaze(5),
  searchStaus: "waiting to start",
  isMazeEditable: true,
})

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

  // Put a start and end node for easy develpment
  let node = mazeProxy.nodes.at(-1)
  if (node) node.state = "end"
  node = mazeProxy.nodes.at(0)
  if (node) node.state = "start"
}
