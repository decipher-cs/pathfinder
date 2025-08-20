import { Canvas } from "@react-three/fiber"
import { uiProxy } from "./stores/uiStore"
import { lazy, memo, Suspense } from "react"
import { DraggableSettings } from "./components/DraggableSettings"
import Modal from "./components/Modal"
import ViewportRestriction from "./components/ViewportRestriction"
const Scene = lazy(() => import("./components/Scene"))
const Toasts = lazy(() => import("./components/Toasts"))

function App() {
  return (
    <main className="relative grid min-h-svh min-w-full grid-cols-1 grid-rows-[1fr_auto] bg-[#303035]">
      <div className="">
        <Canvas
          gl={{ antialias: true }}
          camera={{ position: [2, 10, 15] }}
          onPointerUp={() => (uiProxy.orbitControlsEnabled = true)}
        >
          <Suspense>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      <Suspense>
        <Toasts />
        <DraggableSettings />
        <Modal />
        <ViewportRestriction />
      </Suspense>
    </main>
  )
}

export default memo(App)
