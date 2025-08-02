import { proxy, snapshot, subscribe } from "valtio"
import { getRandom } from "../util"

type Severity = "warn" | "alert" | "inform"
type Alert = { message: string; severity: Severity }
type AlertQProxy = { alerts: Alert[] }

export const createAlert = (
  message = "This is an example alert! " + getRandom(),
  severity?: Severity
): Alert => ({
  message,
  severity: severity ?? "inform",
})

export const alertQProxy = proxy<AlertQProxy>({
  alerts: import.meta.env.DEV ? [createAlert(), createAlert(), createAlert()] : [],
  // alerts: [],
})

export function removeAlert(index?: number) {
  if (index) alertQProxy.alerts.splice(index, 1)
  else alertQProxy.alerts.shift()
}

export function addAlert(alert: Alert) {
  alertQProxy.alerts.push(alert)
}

export function notify(
  msg?: string,
  severity?: Severity,
  autoDismiss = true,
  timeoutIn = 1000 * 8
) {
  addAlert(createAlert(msg, severity))

  if (autoDismiss) setTimeout(removeAlert, timeoutIn)
}
