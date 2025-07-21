import { proxy } from "valtio"

export const possibleNodeInteractions = [
  "place start node",
  "place end node",
  "block node",
  "open node",
] as const
export type PossibleNodeInteractions = (typeof possibleNodeInteractions)[number]
export type ProxyOptions = {
  orbitControlsEnabled: boolean
  clickBehavior: PossibleNodeInteractions
  dragBehavior: Extract<PossibleNodeInteractions, "block node" | "open node">
  // mazeEditable: boolean
}

export const uiProxy = proxy<ProxyOptions>({
  orbitControlsEnabled: true,
  clickBehavior: "place start node",
  dragBehavior: "block node",
})
