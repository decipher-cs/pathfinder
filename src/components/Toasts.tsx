import { useSnapshot } from "valtio"
import { alertQProxy } from "../stores/alertQueueStore"

export const Toasts = () => {
  const alerts = useSnapshot(alertQProxy.alerts)

  return (
    <div className="absolute top-1 right-1 z-50 flex max-w-prose flex-col gap-2">
      {alerts.map(({ message, severity }, i) => {
        const color = (() => {
          if (severity === "inform") return "#3485ff"
          if (severity === "warn") return "green"
          if (severity === "alert") return "red"
          return "white"
        })()

        return (
          <div key={i} className={"rounded border p-3"} style={{ backgroundColor: color }}>
            {message}
          </div>
        )
      })}
    </div>
  )
}
