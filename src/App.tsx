import GripHorizontalIcon from "./assets/grab-handles.svg"
import {
  GizmoHelper,
  GizmoViewport,
  Grid,
  Environment,
  OrbitControls,
  Instances,
  Instance,
  Text,
} from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import * as mazeProxy from "./stores/mazeStore"
import {
  availableAlgorithms,
  possibleNodeInteractions,
  uiProxy,
  type PossibleNodeInteractions,
} from "./stores/uiStore"
import { useRef, useState, type MouseEventHandler, Suspense } from "react"
import { useSnapshot } from "valtio"

function App() {
  return (
    <main className="min-w-full min-h-svh bg-gray-500 grid *:outline grid-rows-[1fr_auto] grid-cols-1">
      <div className="">
        <Canvas
          gl={{ antialias: true }}
          camera={{ position: [0, 0, 20] }}
          onPointerUp={() => (uiProxy.orbitControlsEnabled = true)}
        >
          <Suspense
            fallback={
              <Text>
                Building the scene. It takes a while on slower systems. Please hold your horses
              </Text>
            }
          >
            <Scene />
          </Suspense>
        </Canvas>
      </div>
      <DraggableSettings />
    </main>
  )
}

const Scene = () => {
  const { orbitControlsEnabled } = useSnapshot(uiProxy)

  return (
    <>
      <OrbitControls enabled={orbitControlsEnabled} makeDefault />
      <ambientLight />
      <Cubes />

      <Grid
        position={[0, -0.01, 0]}
        receiveShadow
        args={[10.5, 10.5]}
        infiniteGrid
        fadeDistance={50}
        fadeStrength={1}
        sectionColor={"#a78bfa"}
        sectionSize={4}
        sectionThickness={1.5}
        cellColor={"#f5f3ff"}
        cellSize={1}
        cellThickness={1}
      />

      <Environment preset="city" />
      <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
        <GizmoViewport axisColors={["#9d4b4b", "#2f7f4f", "#3b5b9d"]} labelColor="white" />
      </GizmoHelper>
    </>
  )
}

function Cubes() {
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
              console.log("clicked", index, position.toString(), state)
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

function DraggableSettings() {
  const [position, setPosition] = useState({ x: 10, y: 10 })
  const offsetRef = useRef({ x: 0, y: 0 })
  const isDragging = useRef(false)

  const handleMouseDown: MouseEventHandler<HTMLDivElement> = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()

    offsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }

    isDragging.current = true

    document.addEventListener("mousemove", handleMouseMove)

    document.addEventListener("mouseup", handleMouseUp)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return
    setPosition({
      x: e.clientX - offsetRef.current.x,
      y: e.clientY - offsetRef.current.y,
    })
  }

  const handleMouseUp = () => {
    isDragging.current = false
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)
  }

  const { dragBehavior, clickBehavior, selectedAlgorithm } = useSnapshot(uiProxy)

  return (
    <div
      className="absolute z-50 bg-white shadow-lg rounded p-3 w-[30ch] divide-y resize overflow-auto"
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
    >
      <div onMouseDown={handleMouseDown} className="select-none cursor-move">
        <img src={GripHorizontalIcon} />
      </div>

      <div className="grid *:border *:cursor-pointer">
        <button onClick={() => mazeProxy.logMaze()}>LOG</button>
        <button
          onClick={() => {
            mazeProxy.mazeProxy.nodes.forEach((node) => {
              if (node?.state === "visited") node.state = "open"
            })
            mazeProxy.setIsMazeEditable(true)
          }}
        >
          RESET VISITED
        </button>
        <button
          onClick={() => {
            mazeProxy.resetAllNodesToOpen()
            mazeProxy.setIsMazeEditable(true)
          }}
        >
          RESET
        </button>
        <button
          onClick={() => {
            if (selectedAlgorithm === "dfs") mazeProxy.runDfs()
            if (selectedAlgorithm === "bfs") mazeProxy.runBfs()
          }}
        >
          COMPUTE
        </button>
      </div>

      <fieldset>
        <legend>Choose what happens when you drag the cursor across the cube</legend>

        <div className="grid">
          {(["block node", "open node"] satisfies PossibleNodeInteractions[]).map((label) => (
            <label key={label}>
              <input
                type="radio"
                name={"drag action"}
                value={label}
                checked={label === dragBehavior}
                onChange={(e) => {
                  const value = e.target.value
                  possibleNodeInteractions.forEach((v) => {
                    if (v === "block node" || v === "open node") {
                      if (v === value) uiProxy.dragBehavior = value
                    }
                  })
                }}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>Left click behaviour</legend>

        <div className="grid">
          {possibleNodeInteractions.map((label) => (
            <label key={label}>
              <input
                type="radio"
                name={"click action"}
                value={label}
                checked={label === clickBehavior}
                onChange={(e) => {
                  const value = e.target.value
                  possibleNodeInteractions.forEach((v) => {
                    if (v === value) uiProxy.clickBehavior = value
                  })
                }}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>Select the algorithm</legend>

        <div className="grid">
          {availableAlgorithms.map((label) => (
            <label key={label}>
              <input
                type="radio"
                name={"selected algorithm"}
                value={label}
                checked={label === selectedAlgorithm}
                onChange={(e) => {
                  const value = e.target.value
                  availableAlgorithms.forEach((v) => {
                    if (v === value) uiProxy.selectedAlgorithm = value
                  })
                }}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  )
}

export default App
