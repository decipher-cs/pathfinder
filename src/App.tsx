import {
  Center,
  GizmoHelper,
  GizmoViewport,
  Grid,
  OrbitControls,
  Stats,
  Text,
} from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import { uiProxy } from "./stores/uiStore"
import { Suspense, useEffect, useRef, type ComponentRef } from "react"
import { useSnapshot } from "valtio"
import { DraggableSettings } from "./components/DraggableSettings"
import { Cubes } from "./components/CubeInstances"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import sound from "./assets/sounds/startup.mp3"
import { idleProxy } from "./stores/idleTrackerStore"
import { Toasts } from "./components/Toasts"
import Modal from "./components/Modal"

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
      <Toasts />
      <DraggableSettings />
      <Modal />

      {import.meta.env.DEV && <Stats />}
    </main>
  )
}

const Scene = () => {
  const audioRef = useRef<HTMLAudioElement>(null)
  if (!audioRef?.current) audioRef.current = new Audio(sound)

  const { orbitControlsEnabled, showGridLines, ambientLight } = useSnapshot(uiProxy)

  useEffect(() => {
    if (!uiProxy.soundOn) return
    if (audioRef.current) audioRef.current.volume = 0.5
    const res = audioRef.current?.play()

    // supress the "play() failed because the user didn't interact with the document first" error
    res?.catch(() => {})
  }, [])

  const { isIdle } = useSnapshot(idleProxy)

  const ref = useRef<ComponentRef<typeof Center>>(null)
  useFrame(({}, delta) => {
    const el = ref.current
    if (!el) return

    if (isIdle) el.rotation.y += delta * 0.1
    else el.rotation.y = 0
  })

  return (
    <>
      <OrbitControls enableRotate={orbitControlsEnabled} enableDamping={true} makeDefault />

      <ambientLight intensity={ambientLight} />

      <Center ref={ref} top>
        <Cubes />
      </Center>

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
