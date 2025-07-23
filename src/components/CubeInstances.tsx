import { useSnapshot } from "valtio";
import { uiProxy } from "../stores/uiStore";
import * as mazeProxy from "../stores/mazeStore"
import { Instance, Instances } from "@react-three/drei";

export const Cubes = () => {
  const ui = useSnapshot(uiProxy)
  const { clickBehavior, dragBehavior } = ui
  const nodes = useSnapshot(mazeProxy.mazeProxy.nodes)
  const size = nodes.length

  return (
    <Instances limit={size} onPointerDown={() => (uiProxy.orbitControlsEnabled = false)}>
      <boxGeometry />
      <meshStandardMaterial />
      {nodes.map((node) => {
        if (!node) return null
        const { position, state, index } = node
        const [x, y, z] = position
        const gap = 1.1

        const color = (() => {
          let color = "pink"
          switch (state) {
            case "visited":
              color = "red"
              break
            case "open":
              color = "blue"
              break
            case "blocked":
              color = "purple"
              break
            case "end":
              color = "yellow"
              break
            case "start":
              color = "white"
              break
            default:
              color = "black"
              break
          }
          return color
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
              if (clickBehavior === "open node") mazeProxy.setNodeState(position, "open")
              else if (clickBehavior === "place end node") mazeProxy.setNodeStateToEnd(position)
              else if (clickBehavior === "block node") mazeProxy.setNodeState(position, "blocked")
              else if (clickBehavior === "place start node") mazeProxy.setNodeStateToStart(position)
            }}
            onPointerOver={(e) => {
              e.stopPropagation()
              if (e.buttons !== 1) return
              if (dragBehavior === "block node") mazeProxy.setNodeState(position, "blocked")
              else if (dragBehavior === "open node") mazeProxy.setNodeState(position, "open")
            }}
          />
        )
      })}
    </Instances>
  )
}
