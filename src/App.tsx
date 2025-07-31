import { GizmoHelper, GizmoViewport, Grid, OrbitControls, Stats, Text } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { uiProxy } from "./stores/uiStore"
import { Suspense, useEffect, useRef } from "react"
import { useSnapshot } from "valtio"
import { DraggableSettings } from "./components/DraggableSettings"
import { Alerts } from "./components/Alerts"
import { Cubes } from "./components/CubeInstances"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import sound from "./assets/sounds/startup.mp3"

function App() {
  return (
    <main className="grid min-h-svh min-w-full grid-cols-1 grid-rows-[1fr_auto] bg-[#303035]">
      <div className="">
        <Canvas
          gl={{ antialias: true }}
          camera={{ position: [2, 10, 15] }}
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
  const audioRef = useRef<HTMLAudioElement>(null)
  if (!audioRef?.current) audioRef.current = new Audio(sound)

  const { orbitControlsEnabled, showGridLines, ambientLight } = useSnapshot(uiProxy)

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = 0.5
    const res = audioRef.current?.play()

    // supress the "play() failed because the user didn't interact with the document first" error
    res?.catch(() => {})
  }, [])

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

      <GizmoHelper alignment="bottom-right" margin={[80, 80]} renderPriority={2}>
        <GizmoViewport axisColors={["#9d4b4b", "#2f7f4f", "#3b5b9d"]} labelColor="white" />
      </GizmoHelper>

      {/* Postprocessing bloom */}
      <EffectComposer>
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} />
      </EffectComposer>
    </>
  )
}

export default App
