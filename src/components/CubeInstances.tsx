import { useSnapshot } from "valtio"
import { uiProxy } from "../stores/uiStore"
import * as mazeActions from "../stores/mazeStore"
import { mazeProxy } from "../stores/mazeStore"
import { Instance, Instances } from "@react-three/drei"

export const Cubes = () => {
  const { clickBehavior, dragBehavior, orbitControlsEnabled } = useSnapshot(uiProxy)
  const maze = useSnapshot(mazeProxy)
  const size = maze.nodes.length
  console.log("Rerendering!", mazeProxy.nodes.length, size)

  return (
    <Instances
      limit={size}
      onPointerDown={(e) => {
        e.stopPropagation()
        uiProxy.orbitControlsEnabled = false
      }}
    >
      <boxGeometry />
      <meshStandardMaterial />
      {maze.nodes.map((node) => {
        if (!node) return null
        const { position, state, index } = node
        const [x, y, z] = position
        const gap = 1.1

        const color = (() => {
          if (state === "visited") return "red"
          if (state === "open") return "blue"
          if (state === "blocked") return "purple"
          if (state === "end") return "yellow"
          if (state === "start") return "lime"
          return "black"
        })()

        return (
          <Instance
            key={index}
            color={color}
            scale={1}
            position={[x * gap, y * gap, z * gap]}
            userData={position}
            onClick={(e) => {
              e.stopPropagation()
              if (clickBehavior === "open node") mazeActions.setNodeState(position, "open")
              else if (clickBehavior === "place end node") mazeActions.setNodeStateToEnd(position)
              else if (clickBehavior === "block node") mazeActions.setNodeState(position, "blocked")
              else if (clickBehavior === "place start node")
                mazeActions.setNodeStateToStart(position)
            }}
            onPointerOver={(e) => {
              e.stopPropagation()

              // Checking for orbitControls enabled is important!
              // This event will fire when pointer is over a node while rotating the scene
              // When that happens, it will trigger the drag behavior which is not desired
              // because the intention was to rotate the scene and not cause the hover action
              if (orbitControlsEnabled) return

              if (e.buttons !== 1) return
              if (dragBehavior === "block node") mazeActions.setNodeState(position, "blocked")
              else if (dragBehavior === "open node") mazeActions.setNodeState(position, "open")
            }}
          />
        )
      })}
    </Instances>
  )
}
