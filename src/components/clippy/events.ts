import type { Agent } from 'clippyts'
import type { RefObject } from 'react'
import type { ClippyEventHandler } from './clippy-context'

export type ListenerRegistry = Map<
  string,
  Map<ClippyEventHandler, EventListener>
>

export function registerListener(
  registry: ListenerRegistry,
  element: HTMLElement | null,
  agentRef: RefObject<Agent | null>,
  eventName: string,
  handler: ClippyEventHandler
) {
  let eventMap = registry.get(eventName)
  if (!eventMap) {
    eventMap = new Map()
    registry.set(eventName, eventMap)
  }

  if (eventMap.has(handler)) {
    return
  }

  const wrapped: EventListener = (event) => {
    const agent = agentRef.current
    if (!agent) {
      return
    }
    handler(event, agent)
  }

  eventMap.set(handler, wrapped)
  element?.addEventListener(eventName, wrapped)
}

export function unregisterListener(
  registry: ListenerRegistry,
  element: HTMLElement | null,
  eventName: string,
  handler: ClippyEventHandler
) {
  const eventMap = registry.get(eventName)
  if (!eventMap) {
    return
  }

  const wrapped = eventMap.get(handler)
  if (!wrapped) {
    return
  }

  element?.removeEventListener(eventName, wrapped)
  eventMap.delete(handler)
  if (eventMap.size === 0) {
    registry.delete(eventName)
  }
}

export function syncListeners(
  registry: ListenerRegistry,
  element: HTMLElement | null
) {
  if (!element) {
    return
  }

  for (const [eventName, handlers] of registry) {
    for (const [, wrapped] of handlers) {
      element.removeEventListener(eventName, wrapped)
      element.addEventListener(eventName, wrapped)
    }
  }
}
