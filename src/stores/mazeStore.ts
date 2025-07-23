import { coordinatesToIndex, initializeMaze } from "../util"
import * as THREE from "three"
import { proxy, snapshot } from "valtio"
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
  isDirty: boolean // if one of the algorithm has been run then isDirty = true
  isMazeEditable: boolean
  rank: number // The dimension of the maze. Ex: a 3x3x3 maze will have a rank of 3
}

export const mazeProxy = proxy<MazeProxy>({
  rank: 5,
  nodes: initializeMaze(),
  searchStaus: "waiting to start",
  isDirty: false,
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
  // if (!mazeProxy.isMazeEditable) return
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
  mazeProxy.isMazeEditable = false

  const startNode = getStartNode()
  const endNode = getEndNode()
  if (!startNode || !endNode) {
    notify("Starting and Ending nodes must be selected before running the algorithm.", "alert")
    return
  }

  const stack = [startNode]
  let endNodeFound = false

  function logic() {
    const currNode = stack.pop()
    if (!currNode) return

    const { state, position: pos } = currNode
    if (state === "end") {
      endNodeFound = true
      return true
    }

    if (state === "blocked" || state === "visited") {
      if (stack.length > 0 && !endNodeFound) requestAnimationFrame(logic)
      return
    }

    if (currNode.state !== "start") currNode.state = "visited"

    // prettier-ignore
    const directions = [ [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1] ]

    for (const dir of directions) {
      const vec1 = new THREE.Vector3(...dir)
      const vec2 = new THREE.Vector3(...pos)
      const result = vec1.add(vec2).toArray()

      const node = getNode(result)
      if (node && (node.state === "end" || node.state === "open")) stack.push(node)
    }

    if (stack.length > 0 && !endNodeFound) requestAnimationFrame(logic)
  }

  startNode.state = "start"
  requestAnimationFrame(logic)
}

export const runBfs = () => {
  mazeProxy.isMazeEditable = false

  const startNode = getStartNode()
  const endNode = getEndNode()
  if (!startNode || !endNode) {
    notify("Starting and Ending nodes must be selected before running the algorithm.", "alert")
    return
  }

  const q: Node[] = [startNode]
  let endNodeFound = false

  function logic() {
    const currNode = q.shift()
    if (!currNode) {
      if (q.length > 0 && !endNodeFound) requestAnimationFrame(logic)
      return
    }
    if (currNode.state === "visited") {
      if (q.length > 0 && !endNodeFound) requestAnimationFrame(logic)
      return
    }
    if (currNode.state === "end") {
      endNodeFound = true
      return true
    }
    if (currNode.state !== "start") setNodeState(currNode.index, "visited")

    // prettier-ignore
    const directions = [ [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1] ]

    for (const dir of directions) {
      const vec1 = new THREE.Vector3(...dir)
      const vec2 = new THREE.Vector3(...currNode.position)
      const result = vec1.add(vec2).toArray()

      const node = getNode(result)
      if (!node) continue

      if (node.state === "end" || node.state === "open") q.push(node)
    }

    if (q.length > 0 && !endNodeFound) requestAnimationFrame(logic)
  }

  requestAnimationFrame(logic)
}

if (import.meta.env.DEV) {
  const unsub = devtools(mazeProxy, { name: "MAZE", enabled: true })

  // Put a start and end node for easy develpment
  let node = mazeProxy.nodes.at(-1)
  if (node) node.state = "end"
  node = mazeProxy.nodes.at(0)
  if (node) node.state = "start"
}
