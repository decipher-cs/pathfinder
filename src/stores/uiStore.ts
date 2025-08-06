import { proxy, subscribe } from "valtio"
import * as z from "zod"

export const possibleNodeInteractions = [
  "place start node",
  "place end node",
  "block node",
  "open node",
] as const
export const PossibleNodeInteractions = z.enum(possibleNodeInteractions)
export type PossibleNodeInteractions = z.infer<typeof PossibleNodeInteractions>

export const availableAlgorithms = ["dfs", "bfs"] as const
export const AvailableAlgorithms = z.enum(availableAlgorithms)
export type AvailableAlgorithms = z.infer<typeof AvailableAlgorithms>

export const UiProxy = z.object({
  orbitControlsEnabled: z.boolean(),
  clickBehavior: PossibleNodeInteractions,
  dragBehavior: PossibleNodeInteractions.extract(["block node", "open node"]),
  selectedAlgorithm: AvailableAlgorithms,
  showGridLines: z.boolean(),
  gap: z.number(),
  ambientLight: z.number(),
  soundOn: z.boolean(),
})

const getLocalStorageData = () => {
  const unsafe = localStorage.getItem("UI")
  const { success, data } = UiProxy.safeParse(unsafe && JSON.parse(unsafe))
  return success ? data : null
}

export const uiProxy = proxy<z.infer<typeof UiProxy>>(
  getLocalStorageData() ?? {
    orbitControlsEnabled: true,
    clickBehavior: "place start node",
    dragBehavior: "block node",
    selectedAlgorithm: availableAlgorithms[1],
    showGridLines: true,
    gap: 1.1,
    ambientLight: 0.2,
    soundOn: true,
  }
)

subscribe(uiProxy, () => {
  localStorage.setItem("UI", JSON.stringify(uiProxy))
})
