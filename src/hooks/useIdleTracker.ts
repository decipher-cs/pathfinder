import { useEffect } from "react"
import { proxy, useSnapshot } from "valtio"

const idleProxy = proxy({ timeSinceLastInteraction: 0, isIdle: false })

function updateLastInteractionTime() {
  const time = 50
  setInterval(() => {
    idleProxy.timeSinceLastInteraction += time

    if (idleProxy.timeSinceLastInteraction > 1000 * 10) idleProxy.isIdle = true
  }, time)
}

updateLastInteractionTime()

export default function useIdleTracker() {
  const { isIdle } = useSnapshot(idleProxy)

  useEffect(() => {
    function reset() {
      idleProxy.timeSinceLastInteraction = 0
      idleProxy.isIdle = false
    }

    document.addEventListener("mousemove", reset)

    return () => {
      document.removeEventListener("mousemove", reset)
    }
  }, [])

  return { isIdle }
}
