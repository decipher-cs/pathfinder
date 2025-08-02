import { useSnapshot } from "valtio"
import { alertQProxy, removeAlert } from "../stores/alertQueueStore"
import { XIcon } from "lucide-react"
import Button from "./Button"

const colors = {
  inform: "#3485ff",
  warn: "green",
  alert: "red",
}

export const Toasts = () => {
  const alerts = useSnapshot(alertQProxy.alerts)

  return (
    <div className="absolute top-3 right-3 z-50 flex max-w-prose flex-col items-end gap-5">
      {alerts.map(({ message, severity }, i) => {
        return (
          <div
            key={i}
            className={
              "relative flex w-fit items-center justify-between gap-8 rounded-lg border bg-white px-5 py-2 text-lg"
            }
          >
            <p className="">{message}</p>
            <Button
              className="aspect-square rounded-full p-1"
              onClick={() => {
                removeAlert(i)
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
          </div>
        )
      })}
    </div>
  )
}
