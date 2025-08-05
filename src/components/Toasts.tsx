import { useSnapshot } from "valtio"
import { alertQProxy, removeAlert, type Alert } from "../stores/alertQueueStore"
import { XIcon } from "lucide-react"
import Button from "./Button"
import { memo } from "react"

const colors = {
  inform: "#3485ff",
  warn: "green",
  alert: "red",
}

export const Toasts = () => {
  const alerts = useSnapshot(alertQProxy.alerts)

  return (
    <ul className="absolute top-0 right-3 z-50 flex max-h-svh max-w-prose flex-col items-end gap-5 overflow-hidden">
      {alerts.map((alert, i) => (
        <Toast {...alert} index={i} key={i} />
      ))}
    </ul>
  )
}

export const Toast = memo(({ message, severity, index }: { index: number } & Alert) => {
  return (
    <li
      className={
        "test relative flex w-fit translate-x-0 items-center justify-between gap-8 rounded-lg border bg-white px-5 py-2 text-lg transition-[translate] starting:translate-x-full"
      }
    >
      <p className="">{message}</p>
      <Button
        className="aspect-square rounded-full p-1"
        onClick={() => {
          removeAlert(index)
        }}
      >
        <span className="sr-only">dismiss toast</span>
        <XIcon />
      </Button>
      <div
        className="absolute inset-y-0 left-0 w-2 rounded-l-lg"
        style={{ backgroundColor: colors[severity] }}
      >
        <span className="sr-only">{severity}</span>
      </div>
    </li>
  )
})
Toast.displayName = "Toast"
