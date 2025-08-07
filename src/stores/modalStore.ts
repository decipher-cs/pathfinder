import { proxy, subscribe } from "valtio"

function fn() {
  const val = localStorage.getItem("instructions on startup")
  if (val === null) return true
  return val === "true"
}

export const modalProxy = proxy({ open: fn(), openOnStartup: fn() })

// Sync with localStorage
subscribe(modalProxy, () => {
  localStorage.setItem("instructions on startup", String(modalProxy.openOnStartup))
})
