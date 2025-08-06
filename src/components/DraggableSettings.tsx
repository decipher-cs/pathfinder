import { useRef, useState, type ComponentProps, type MouseEventHandler } from "react"
import { useSnapshot } from "valtio"
import {
  availableAlgorithms,
  possibleNodeInteractions,
  uiProxy,
  type PossibleNodeInteractions,
} from "../stores/uiStore"
import * as mazeProxy from "../stores/mazeStore"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { ChevronsDownUpIcon, ChevronsUpDownIcon, HandIcon } from "lucide-react"
import Button from "./Button"

export const DraggableSettings = () => {
  const [position, setPosition] = useState({ x: 3, y: 3 })

  // Store properties of the element used for dragging and the parent element that is being dragged.
  // settingsPanel is the element being dragged. Height/width are stored to make sure element cannot
  // be dragged beyond the inner dimensions of the viewport.
  // Offset is the distance between the settings panel and the coordinates of the cursor inside the said
  // panel when the first mouse down event fires.
  const dragStateRef = useRef({
    offsetX: 0,
    offsetY: 0,
    settingPanelWidth: 0,
    settingPanelHeight: 0,
  })
  const isDragging = useRef(false)

  // TODO: optimize: wrap in useCallback
  const handleMouseDown: MouseEventHandler<HTMLDivElement> = (e) => {
    const rectEl = e.currentTarget.getBoundingClientRect()
    const parent = e.currentTarget.parentElement?.parentElement

    dragStateRef.current = {
      offsetX: e.clientX - rectEl.left,
      offsetY: e.clientY - rectEl.top,
      settingPanelWidth: parent?.clientWidth ?? 0,
      settingPanelHeight: parent?.clientHeight ?? 0,
    }

    isDragging.current = true

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return

    const x = e.clientX - dragStateRef.current.offsetX
    const y = e.clientY - dragStateRef.current.offsetY

    const screenEdgeX = window.innerWidth
    const screenEdgeY = window.innerHeight

    setPosition((prev) => ({
      x: dragStateRef.current.settingPanelWidth + x > screenEdgeX || x < 0 ? prev.x : x,
      y: dragStateRef.current.settingPanelHeight + y > screenEdgeY || y < 0 ? prev.y : y,
    }))
  }

  const handleMouseUp = () => {
    isDragging.current = false
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)
  }

  const [isCollapsed, setCollapsed] = useState(false)

  const handleCollapse = () => setCollapsed((p) => !p)

  const {
    dragBehavior,
    clickBehavior,
    selectedAlgorithm,
    gap,
    ambientLight,
    soundOn,
    showGridLines,
  } = useSnapshot(uiProxy, { sync: true })

  const { rank } = useSnapshot(mazeProxy.mazeProxy)

  const inputs: { label: string; inputProps: ComponentProps<"input"> }[] = [
    {
      label: "Maze Dimensions",
      inputProps: {
        id: "Maze Dimensions",
        step: 1,
        min: 3,
        max: 15,
        value: rank,
        onChange: (e) => {
          const rawVal = Number(e.target.value)
          if (typeof rawVal !== "number" || rawVal < 3 || rawVal > 15) return
          mazeProxy.mazeProxy.rank = rawVal
        },
        onBlur: () => {
          mazeProxy.resizeMaze(mazeProxy.mazeProxy.rank)
        },
      },
    },
    {
      label: "gap",
      inputProps: {
        id: "gap",
        min: 1,
        max: 3,
        step: 0.1,
        value: gap,
        onChange: (e) => {
          const rawVal = Number(e.target.value)
          if (typeof rawVal !== "number" || rawVal < 1 || rawVal > 3) return
          uiProxy.gap = rawVal
        },
      },
    },
    {
      label: "Neon Intensity",
      inputProps: {
        id: "Neon Intensity",
        min: 0,
        max: 2,
        step: 0.1,
        value: ambientLight,
        onChange: (e) => {
          const rawVal = Number(e.target.value)
          if (typeof rawVal !== "number" || rawVal < 0 || rawVal > 2) return
          uiProxy.ambientLight = rawVal
        },
      },
    },
    {
      label: "Sound On",
      inputProps: {
        id: "Sound On",
        type: "checkbox",
        checked: soundOn,
        onChange: (e) => {
          const checked = e.target.checked
          uiProxy.soundOn = checked
        },
      },
    },
    {
      label: "Show Grid Lines",
      inputProps: {
        id: "Show Grid Lines",
        type: "checkbox",
        checked: showGridLines,
        onChange: (e) => {
          const checked = e.target.checked
          uiProxy.showGridLines = checked
        },
      },
    },
  ]

  const labelClassName = "flex gap-1 capitalize"
  const legendClassName = "grid grid-cols-2 items-center"

  return (
    <div
      className={"absolute z-50 w-[40ch] overflow-hidden rounded-xl bg-neutral-300 shadow-2xl"}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        resize: isCollapsed ? "none" : "both",
        height: isCollapsed ? "min-content" : "auto",
      }}
    >
      <div className="flex justify-between rounded-t-sm bg-neutral-800 px-3 py-2 text-neutral-300">
        <div
          onMouseDown={handleMouseDown}
          className="cursor-move select-none"
          aria-label="hold and drag to move the settings"
        >
          <HandIcon />
        </div>
        <span className="font-bold uppercase">Settings</span>
        <button onClick={handleCollapse} className="cursor-pointer">
          <span className="sr-only">collapse or open settings</span>
          {isCollapsed ? <ChevronsUpDownIcon /> : <ChevronsDownUpIcon />}
        </button>
      </div>

      <div
        className={twMerge(
          clsx(isCollapsed ? "h-0 py-0" : "h-auto py-3"),
          "max-h-full overflow-y-scroll px-3 accent-neutral-700"
        )}
        style={{ transition: "height 0.2s ease-in-out, padding 0.2s ease-in-out" }}
      >
        <div className="mb-4 flex flex-wrap place-content-center gap-2">
          <Button onClick={() => mazeProxy.logMaze()}>Log</Button>
          <Button
            onClick={() => {
              /*TODO open instructions modal*/
            }}
          >
            Instructions
          </Button>
          <Button onClick={() => mazeProxy.randomizeMaze()}>Randomize</Button>
          <Button
            onClick={() => {
              mazeProxy.mazeProxy.nodes.forEach((node) => {
                if (node?.state === "visited") node.state = "open"
              })
              mazeProxy.setIsMazeEditable(true)
            }}
          >
            reset visited
          </Button>
          <Button
            onClick={() => {
              mazeProxy.resetAllNodesToOpen()
              mazeProxy.setIsMazeEditable(true)
            }}
          >
            reset
          </Button>
          <Button
            onClick={() => {
              if (selectedAlgorithm === "dfs") mazeProxy.runDfs()
              if (selectedAlgorithm === "bfs") mazeProxy.runBfs()
            }}
          >
            compute
          </Button>
          <Button
            onClick={() => {
              mazeProxy.resetAllNodesToOpen()
              mazeProxy.setIsMazeEditable(true)
              window.localStorage.removeItem("UI")
              window.localStorage.removeItem("MAZE")
            }}
          >
            clear memory
          </Button>
        </div>

        <div className="grid gap-2">
          <fieldset>
            <legend className={legendClassName}>
              Mouse Drag Behavior
              <hr />
            </legend>

            <div className="grid">
              {(["block node", "open node"] satisfies PossibleNodeInteractions[]).map((label) => (
                <label key={label} className={labelClassName}>
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
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className={legendClassName}>
              Left Click Behaviour
              <hr />
            </legend>

            <div className="grid">
              {possibleNodeInteractions.map((label) => (
                <label key={label} className={labelClassName}>
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
            <legend className={legendClassName}>
              Algorithm
              <hr />
            </legend>

            <div className="grid">
              {availableAlgorithms.map((label) => (
                <label key={label} className={labelClassName}>
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

          {inputs.map(({ label, inputProps }) => (
            <div key={label} className="flex justify-between">
              <label htmlFor={label} className="capitalize">
                {label}
              </label>
              <input type="number" {...inputProps} className="py rounded-sm bg-neutral-200 px-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
