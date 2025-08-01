import { proxy } from "valtio"

export const idleProxy = proxy({ timeSinceLastInteraction: 0, isIdle: false })

function updateLastInteractionTime() {
  const time = 50
  setInterval(() => {
    idleProxy.timeSinceLastInteraction += time

    if (idleProxy.timeSinceLastInteraction > 1000 * 10) idleProxy.isIdle = true
  }, time)
}

updateLastInteractionTime()

function reset() {
  idleProxy.timeSinceLastInteraction = 0
  idleProxy.isIdle = false
}

const events: (keyof DocumentEventMap)[] = ["mousemove", "touchstart", "scroll"]

events.forEach((evnt) => {
  document.addEventListener(evnt, reset)
})
