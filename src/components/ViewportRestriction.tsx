import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"

export default function ViewportRestriction() {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const fo = () => {
      const styles = getComputedStyle(document.documentElement)
      const smBreakpointRem = Number(
        styles.getPropertyValue("--breakpoint-sm").trim().replace("rem", "")
      )
      const smBreakpointPx = 16 * smBreakpointRem
      const winWidth = window.innerWidth

      if (winWidth < smBreakpointPx) el.showModal()
      else if (winWidth > smBreakpointPx) el.close()
    }

    window.addEventListener("resize", fo)
    return () => {
      window.removeEventListener("resize", fo)
    }
  }, [])

  return createPortal(
    <dialog
      ref={ref}
      className="m-auto max-w-none -translate-y-1/2 bg-neutral-900 text-white outline-none backdrop:bg-neutral-900"
    >
      <div className="prose-invert grid gap-2">
        <h2>⚠️ Screen too small</h2>
        <hr />
        <p>Your screen width is too small to display this app properly.</p>
        <ul>
          <li>
            On <strong>mobile</strong>: try switching to landscape mode or using a tablet/laptop.
          </li>
          <li>
            On <strong>desktop</strong>: try maximizing or expanding your browser window.
          </li>
        </ul>
      </div>
    </dialog>,
    document.body
  )
}
