import { useSnapshot } from "valtio"
import { uiProxy } from "../stores/uiStore"
import * as mazeActions from "../stores/mazeStore"
import { mazeProxy, type Node, type State } from "../stores/mazeStore"
import { Instance, Instances } from "@react-three/drei"
import { memo, useCallback, useMemo, type MouseEventHandler, type PointerEventHandler } from "react"
import type { ThreeEvent } from "@react-three/fiber"

const STATE_COLORS: Record<State, string> = {
  visited: "red",
  open: "blue",
  blocked: "purple",
  end: "yellow",
  start: "lime",
}

export const Cubes = () => {
  const nodes = useSnapshot(mazeProxy.nodes)

  const handlePointDown = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    uiProxy.orbitControlsEnabled = false
  }, [])

  return (
    <Instances limit={100_000} onPointerDown={handlePointDown}>
      <boxGeometry />
      <meshStandardMaterial />

      {nodes.map((node) => {
        if (!node) return
        return <NodeInstance key={node.index} data={node} />
      })}
    </Instances>
  )
}
Cubes.displayName = "Cubes"

const gap = 1.1

const NodeInstance = memo(({ data: { index, position, state } }: { data: Node }) => {
  const [x, y, z] = position
  const pos = useMemo(() => [x * gap, y * gap, z * gap] as const, [x, y, z])

  const color = STATE_COLORS[state] ?? "black"

  const handleClick: MouseEventHandler = useCallback(
    (e) => {
      e.stopPropagation()
      if (uiProxy.clickBehavior === "open node") mazeActions.setNodeState(index, "open")
      else if (uiProxy.clickBehavior === "place end node") mazeActions.setNodeStateToEnd(index)
      else if (uiProxy.clickBehavior === "block node") mazeActions.setNodeState(index, "blocked")
      else if (uiProxy.clickBehavior === "place start node") mazeActions.setNodeStateToStart(index)
    },
    [index]
  )

  const handlePointer: PointerEventHandler = useCallback(
    (e) => {
      e.stopPropagation()

      // Checking for orbitControls enabled is important!
      // This event will fire when pointer is over a node while rotating the scene
      // When that happens, it will trigger the drag behavior which is not desired
      // because the intention was to rotate the scene and not cause the hover action.
      // btn != 1 for when left btn is not held down i.e. user is not dragging pointer.
      if (uiProxy.orbitControlsEnabled || e.buttons !== 1) return

      if (uiProxy.dragBehavior === "block node") mazeActions.setNodeState(index, "blocked")
      else if (uiProxy.dragBehavior === "open node") mazeActions.setNodeState(index, "open")
    },
    [index]
  )

  return (
    <Instance
      color={color}
      scale={1}
      position={pos}
      onClick={handleClick}
      onPointerOver={handlePointer}
    />
  )
})
NodeInstance.displayName = "NodeInstance"

// Use this if you want the state of each node to exist in the child.
// Considerebly slows down creation of new maze when the dimension changes
// and app needs to resize the current cube but the benifit is that
// the parent does not re-render for every change in the child
//
// const NodeInstance = memo(({ index }: { index: number }) => {
//   const nodes = useSnapshot(mazeProxy.nodes, { sync: true })
//   const node = nodes.at(index)
//   const state = node?.state ?? "open"
//   const position = node?.position ?? ([0, 0, 0] as const)
//   const gap = 1.1
//   const [x, y, z] = position
//
//   const color = STATE_COLORS[state] ?? "black"
//
//   const handleClick: MouseEventHandler = useCallback(
//     (e) => {
//       e.stopPropagation()
//       if (uiProxy.clickBehavior === "open node") mazeActions.setNodeState(index, "open")
//       else if (uiProxy.clickBehavior === "place end node") mazeActions.setNodeStateToEnd(index)
//       else if (uiProxy.clickBehavior === "block node") mazeActions.setNodeState(index, "blocked")
//       else if (uiProxy.clickBehavior === "place start node") mazeActions.setNodeStateToStart(index)
//     },
//     [index]
//   )
//
//   const handlePointer: PointerEventHandler = useCallback(
//     (e) => {
//       e.stopPropagation()
//
//       // Checking for orbitControls enabled is important!
//       // This event will fire when pointer is over a node while rotating the scene
//       // When that happens, it will trigger the drag behavior which is not desired
//       // because the intention was to rotate the scene and not cause the hover action.
//       // btn != 1 for when left btn is not held down i.e. user is not dragging pointer.
//       if (uiProxy.orbitControlsEnabled || e.buttons !== 1) return
//
//       if (uiProxy.dragBehavior === "block node") mazeActions.setNodeState(index, "blocked")
//       else if (uiProxy.dragBehavior === "open node") mazeActions.setNodeState(index, "open")
//     },
//     [position]
//   )
//
//   if (!node) return null
//   return (
//     <Instance
//       color={color}
//       scale={1}
//       position={[x * gap, y * gap, z * gap]}
//       onClick={handleClick}
//       onPointerOver={handlePointer}
//     />
//   )
// })
