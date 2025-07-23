import { proxy } from "valtio"

export const possibleNodeInteractions = [
  "place start node",
  "place end node",
  "block node",
  "open node",
] as const

export const availableAlgorithms = ["dfs", "bfs"] as const

export type PossibleNodeInteractions = (typeof possibleNodeInteractions)[number]
export type AvailableAlgorithms = (typeof availableAlgorithms)[number]

export type ProxyOptions = {
  orbitControlsEnabled: boolean
  clickBehavior: PossibleNodeInteractions
  dragBehavior: Extract<PossibleNodeInteractions, "block node" | "open node">
  selectedAlgorithm: AvailableAlgorithms
}

export const uiProxy = proxy<ProxyOptions>({
  orbitControlsEnabled: true,
  clickBehavior: "place start node",
  dragBehavior: "block node",
  selectedAlgorithm: availableAlgorithms[1],
})
