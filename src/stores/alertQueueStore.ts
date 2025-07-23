import { proxy, snapshot, subscribe } from "valtio"

type Severity = "warn" | "alert" | "inform"
type Alert = { message: string; severity: Severity }
type AlertQProxy = { alerts: Alert[] }

export const createAlert = (message = "This is an example alert!", severity?: Severity): Alert => ({
  message,
  severity: severity ?? "inform",
})

export const alertQProxy = proxy<AlertQProxy>({
  // alerts: import.meta.env.DEV ? [createAlert(), createAlert(), createAlert()] : [],
  alerts: [],
})

export function removeAlert() {
  alertQProxy.alerts.shift()
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
