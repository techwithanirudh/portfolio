const handledCalls = new Set<string>()

/** True only the first time, so a remounted part never replays its side effect */
export const claimToolCall = (toolCallId: string) => {
  if (handledCalls.has(toolCallId)) {
    return false
  }
  handledCalls.add(toolCallId)
  return true
}
