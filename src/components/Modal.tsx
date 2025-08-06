import { useEffect, useRef, useState } from "react"
import Button from "./Button"
import { createPortal } from "react-dom"

export default function Modal() {
  const initial = localStorage.getItem("modal on startup") === "true"

  const ref = useRef<HTMLDialogElement>(null)

  const [showOnStartup, setShowOnStartup] = useState(initial)

  const [open, setOpen] = useState(initial)

  useEffect(() => {
    localStorage.setItem("modal on startup", String(showOnStartup))
  }, [showOnStartup])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    open ? el.showModal() : el.close()
  }, [open])

  if (!open) return null

  return createPortal(
    <dialog
      ref={ref}
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false)
      }}
      className="top-1/2 z-50 mx-auto grid max-h-11/12 max-w-[70ch] -translate-y-1/2 grid-rows-[min-content_1fr_min-content] gap-3 rounded-lg bg-neutral-200 p-2 backdrop:backdrop-blur-sm backdrop:backdrop-grayscale-100 sm:p-4"
    >
      <h1 className="text-lg font-semibold sm:text-2xl">
        Instructions
        <hr />
      </h1>

      <Instructions />

      <hr />
      <div className="flex items-center justify-between gap-3">
        <label autoFocus className="flex gap-2">
          <span>Show the instructions again</span>
          <input
            type="checkbox"
            className="accent-neutral-800"
            onChange={(e) => setShowOnStartup(e.target.checked)}
            checked={showOnStartup}
          />
        </label>

        <Button className="sm:px-10" onClick={() => setOpen(false)}>Close</Button>
      </div>
    </dialog>,

    document.body
  )
}

const Instructions = () => {
  return (
    <article className="prose overflow-y-scroll">
      <h2>🖱️ Navigating the 3D Scene</h2>
      <ul>
        <li>
          <strong>Rotate View:</strong> Hold <em>Left Click</em> and move your mouse.
        </li>
        <li>
          <strong>Pan Scene:</strong> Hold <em>Right Click</em> and drag the cursor.
        </li>
        <li>
          <strong>Zoom:</strong> Use your <em>scroll wheel</em> to zoom in and out.
        </li>
      </ul>

      <h2>⚙️ Using the Settings Panel</h2>
      <p>The Settings Panel allows you to customize and interact with the maze:</p>

      <h3>1. Select Cube Size</h3>
      <p>Choose the size (dimensions) of the cube maze.</p>
      <div className="warning">
        ⚠️ <strong>Note:</strong> Larger cubes may reduce performance on slower systems.
      </div>

      <h3>2. Choose Click Action</h3>
      <p>Select what happens when you click a node in the maze:</p>
      <ul>
        <li>
          <strong>Start Node</strong> – Set the starting point.
        </li>
        <li>
          <strong>End Node</strong> – Set the destination.
        </li>
        <li>
          <strong>Wall</strong> – Add an obstacle (cannot be crossed).
        </li>
        <li>
          <strong>Open</strong> – Remove wall or clear a node.
        </li>
      </ul>

      <h3>3. Click and Drag Behavior</h3>
      <p>
        Hold <em>left click</em> and drag the cursor to apply changes to multiple nodes quickly,
        useful for placing or removing multiple walls at once.
      </p>

      <h2>🚧 Designing Your Maze</h2>
      <ol>
        <li>
          <strong>Set the Start and End Points</strong>
          <br />
          Use the click tool to place exactly one Start and one End node.
        </li>
        <li>
          <strong>Add Walls (Optional)</strong>
          <br />
          Place walls to block certain paths and add complexity to the maze.
        </li>
        <li>
          <strong>Open Nodes (Optional)</strong>
          <br />
          Use the "Open" tool to remove walls or reset special nodes.
        </li>
      </ol>

      <h2>🧮 Running the Pathfinding Algorithm</h2>
      <ol>
        <li>Ensure you’ve placed a Start and End node.</li>
        <li>
          Open the <strong>Settings Panel</strong>.
        </li>
        <li>
          Click the <strong>“Compute”</strong> button to start the search.
        </li>
      </ol>
      <p>The algorithm will try to find a path from Start to End, avoiding any placed walls.</p>

      <h2>💡 Tips & Notes</h2>
      <ul>
        <li>Start and End nodes are required to begin pathfinding.</li>
        <li>Dragging with the left mouse button speeds up placing or removing multiple nodes.</li>
        <li>Try different cube sizes and layouts to see how performance and behavior change.</li>
      </ul>
    </article>
  )
}
