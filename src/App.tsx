// prettier-ignore
import { GizmoHelper, GizmoViewport, Grid, OrbitControls, Text, Stats } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { uiProxy } from "./stores/uiStore"
import { Suspense } from "react"
import { useSnapshot } from "valtio"
import { DraggableSettings } from "./components/DraggableSettings"
import { Alerts } from "./components/Alerts"
import { Cubes } from "./components/CubeInstances"

function App() {
  return (
    <main className="min-w-full min-h-svh bg-gray-500 grid *:outline grid-rows-[1fr_auto] grid-cols-1">
      <div className="">
        <Canvas
          gl={{ antialias: true }}
          camera={{ position: [0, 0, 20] }}
          onPointerUp={() => (uiProxy.orbitControlsEnabled = true)}
        >
          <Suspense
            fallback={
              <Text>
                Building the scene. It takes a while on slower systems. Please hold your horses
              </Text>
            }
          >
            <Scene />
          </Suspense>
        </Canvas>
      </div>
      <Alerts />
      <DraggableSettings />

      {import.meta.env.DEV && <Stats />}
    </main>
  )
}

const Scene = () => {
  const { orbitControlsEnabled } = useSnapshot(uiProxy)

  return (
    <>
      <OrbitControls enableRotate={orbitControlsEnabled} enableDamping={true} makeDefault />

      <ambientLight intensity={ambientLight} />

      <Cubes />

      {showGridLines && (
        <Grid
          position={[0, 0, 0]}
          receiveShadow
          args={[10, 10]}
          infiniteGrid
          fadeDistance={50}
          fadeStrength={1}
          sectionColor={"#9d4b4b"}
          sectionSize={4}
          sectionThickness={1.5}
          cellSize={1}
          cellThickness={1}
          side={2}
        />
      )}

      <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
        <GizmoViewport axisColors={["#9d4b4b", "#2f7f4f", "#3b5b9d"]} labelColor="white" />
      </GizmoHelper>
    </>
  )
}

export default App
