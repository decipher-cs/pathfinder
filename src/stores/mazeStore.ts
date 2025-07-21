import { coordinatesToIndex, indexToCoordinates, initializeMaze } from "../util"
import * as THREE from "three"
import { type RefObject } from "react"
import { proxy, useSnapshot } from "valtio"
import z from "zod"

export type SearchStaus = "searching" | "path found" | "path not found" | "waiting to start"
export type Position = readonly [x: number, y: number, z: number]
export type State = "blocked" | "open" | "start" | "end" | "visited"
export type PossibleAlgorithms = "dfs" | "bfs"

export type Node = {
  position: Position
  state: State
  index: number
}
export type Maze = Node[]

export type Foo = {
  nodes: Maze
  searchStaus: SearchStaus
  isDirty: boolean
  isMazeEditable: boolean
  rank: number // The dimension of the maze. Ex: a 3x3x3 maze will have a rank of 3
}

export const mazeProxy = proxy<Foo>({
  rank: 5,
  nodes: initializeMaze(),
  searchStaus: "waiting to start",
  isDirty: false,
  isMazeEditable: true,
})

export const getNode = (arg: Position | number) => {
  const rank = mazeProxy.rank

  if (typeof arg === "number") {
    return mazeProxy.nodes[arg]
  }

  if (Array.isArray(arg)) {
    return mazeProxy.nodes[coordinatesToIndex(arg, rank)]
  }

  throw new Error("Something went wrong while getting node. See getNode()")
}

export const setNodeState = (arg: Position | number, newState: State) => {
  if(!mazeProxy.isMazeEditable) return
  const node = getNode(arg)

  if (!node) return // TODO throw error

  node.state = newState
}

export const logMaze = () => {
  // mazeProxy.nodes.forEach((node) => console.log(node))
  const res = mazeProxy.nodes.length
  console.log(res)
}

export const resetAllNodesToOpen = () => {
  mazeProxy.nodes.forEach((node) => (node.state = "open"))
}

export const setNodeStateToStart = (arg: Position | number) => {
  if (!mazeProxy.isMazeEditable) return

  mazeProxy.nodes.forEach((node) => {
    if (node.state === "start") node.state = "open"
  })
  setNodeState(arg, "start")
}

export const setNodeStateToEnd = (arg: Position | number) => {
  if (!mazeProxy.isMazeEditable) return
  mazeProxy.nodes.forEach((node) => {
    if (node.state === "end") node.state = "open"
  })
  setNodeState(arg, "end")
}

export const setIsMazeEditable = (is: boolean) => (mazeProxy.isMazeEditable = is)

export const getStartNode = () => mazeProxy.nodes.find((node) => node?.state === "start")

export const getEndNode = () => mazeProxy.nodes.find((node) => node?.state === "end")

export const runDfs = () => {
  mazeProxy.isMazeEditable = false
  const nodes = mazeProxy.nodes

  const startNode = getStartNode()
  const endNode = getEndNode()
  if (!startNode || !endNode) {
    alert("Warning! Starting and Ending nodes must be placed before running the algorithm.")
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

    if (state === "blocked" || state === "visited") return

    currNode.state = "visited"

    // prettier-ignore
    const directions = [ [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1] ]

    for (const dir of directions) {
      const vec1 = new THREE.Vector3(...dir)
      const vec2 = new THREE.Vector3(...pos)
      const result = vec1.add(vec2).toArray()

      const node = nodes.at(coordinatesToIndex(result, mazeProxy.rank))
      if (node && (node.state === "end" || node.state === "open")) stack.push(node)
    }

    if (stack.length > 0 && !endNodeFound) requestAnimationFrame(logic)
  }

  startNode.state = "start"
  requestAnimationFrame(logic)
}

export const runBfs = () => {
  mazeProxy.isMazeEditable = false
  const nodes = mazeProxy.nodes

  const startNode = getStartNode()
  const endNode = getEndNode()
  if (!startNode || !endNode) {
    alert("Warning! Starting and Ending nodes must be placed before running the algorithm.")
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

    if (state === "blocked" || state === "visited") return

    currNode.state = "visited"

    // prettier-ignore
    const directions = [ [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1] ]

    for (const dir of directions) {
      const vec1 = new THREE.Vector3(...dir)
      const vec2 = new THREE.Vector3(...pos)
      const result = vec1.add(vec2).toArray()

      const node = nodes.at(coordinatesToIndex(result, mazeProxy.rank))
      if (node && (node.state === "end" || node.state === "open")) stack.push(node)
    }

    if (stack.length > 0 && !endNodeFound) requestAnimationFrame(logic)
  }

  startNode.state = "start"
  requestAnimationFrame(logic)
}
