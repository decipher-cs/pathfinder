import { useRef, useState, type MouseEventHandler } from "react"
import { useSnapshot } from "valtio"
import {
  availableAlgorithms,
  possibleNodeInteractions,
  uiProxy,
  type PossibleNodeInteractions,
} from "../stores/uiStore"
import GripHorizontalIcon from "../assets/grab-handles.svg"
import * as mazeProxy from "../stores/mazeStore"
import { initializeMaze } from "../util"

export const DraggableSettings = () => {
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
  const { rank } = useSnapshot(mazeProxy.mazeProxy)

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

      <fieldset>
        <legend>Select maze dimensions</legend>

        <input
          type="number"
          min={3}
          max={15}
          value={rank}
          onChange={(e) => {
            const rawVal = Number(e.target.value)
            let val = 5
            if (typeof rawVal !== "number" || rawVal < 3 || rawVal > 15) val = val
            else val = rawVal

            mazeProxy.mazeProxy.rank = val
            mazeProxy.mazeProxy.nodes = initializeMaze(val)
          }}
        />
      </fieldset>
    </div>
  )
}
