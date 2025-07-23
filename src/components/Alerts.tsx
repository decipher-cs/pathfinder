import { useSnapshot } from "valtio"
import { alertQProxy } from "../stores/alertQueueStore"

export const Alerts = () => {
  const alerts = useSnapshot(alertQProxy.alerts)

  return (
    <div className="absolute z-50 right-1 top-1 gap-2 flex flex-col max-w-prose">
      {alerts.map(({ message, severity }, i) => {
        const color = (() => {
          if (severity === "inform") return "#3485ff"
          if (severity === "warn") return "green"
          if (severity === "alert") return "red"
          return "white"
        })()

        return (
          <div key={i} className={"p-3 border rounded"} style={{ backgroundColor: color }}>
            {message}
          </div>
        )
      })}
    </div>
  )
}
