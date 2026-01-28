'use client'

import type { Agent } from 'clippyts'
import dynamic from 'next/dynamic'
import { useEffect, useRef } from 'react'
import { useAISearchContext } from './ai-search'

const AGENT_NAME = 'Rover'
const CLIPPY_SELECTOR = 'clippy-container'

const clippyStyle = `
.clippy, .clippy-balloon {
  position: fixed;
  z-index: 1000;
  cursor: pointer;
}

.clippy-balloon {
  background: #FFC;
  color: black;
  padding: 8px;
  border: 1px solid black;
  border-radius: 5px;
}

.clippy-content {
  max-width: 200px;
  min-width: 120px;
  font-family: "Microsoft Sans Serif", sans-serif;
  font-size: 10pt;
}

.clippy-tip {
  width: 10px;
  height: 16px;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAgCAMAAAAlvKiEAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAlQTFRF///MAAAA////52QwgAAAAAN0Uk5T//8A18oNQQAAAGxJREFUeNqs0kEOwCAIRFHn3//QTUU6xMyyxii+jQosrTPkyPEM6IN3FtzIRk1U4dFeKWQiH6pRRowMVKEmvronEynkwj0uZJgR22+YLopPSo9P34wJSamLSU7lSIWLJU7NkNomNlhqxUeAAQC+TQLZyEuJBwAAAABJRU5ErkJggg==) no-repeat;
  position: absolute;
}

.clippy-top-left .clippy-tip {
  top: 100%;
  margin-top: 0;
  left: 100%;
  margin-left: -50px;
}

.clippy-top-right .clippy-tip {
  top: 100%;
  margin-top: 0;
  left: 0;
  margin-left: 50px;
  background-position: -10px 0;
}

.clippy-bottom-right .clippy-tip {
  top: 0;
  margin-top: -16px;
  left: 0;
  margin-left: 50px;
  background-position: -10px -16px;
}

.clippy-bottom-left .clippy-tip {
  top: 0;
  margin-top: -16px;
  left: 100%;
  margin-left: -50px;
  background-position: 0 -16px;
}
`

function ClippyTriggerInner() {
  const { open, setOpen } = useAISearchContext()
  const agentRef = useRef<Agent | null>(null)
  const clickHandlerRef = useRef<(() => void) | null>(null)
  const styleRef = useRef<HTMLStyleElement | null>(null)

  useEffect(() => {
    clickHandlerRef.current = () => {
      setOpen(!open)
    }
  }, [open, setOpen])

  useEffect(() => {
    const style = document.createElement('style')
    style.appendChild(document.createTextNode(clippyStyle))
    document.head.appendChild(style)
    styleRef.current = style

    return () => {
      if (styleRef.current) {
        document.head.removeChild(styleRef.current)
      }
    }
  }, [])

  useEffect(() => {
    let mounted = true

    async function loadClippy() {
      const clippy = (await import('clippyts')).default

      clippy.load({
        name: AGENT_NAME,
        selector: CLIPPY_SELECTOR,
        successCb: (agent) => {
          if (!mounted) {
            agent.hide(true, () => {})
            return
          }

          agentRef.current = agent
          agent.show(true)

          const el = document.querySelector('.clippy') as HTMLElement | null
          if (el) {
            el.addEventListener('click', (e) => {
              e.stopPropagation()
              clickHandlerRef.current?.()
            })
          }
        },
        failCb: (err) => {
          console.error('Failed to load Clippy agent:', err)
        },
      })
    }

    loadClippy()

    return () => {
      mounted = false
      if (agentRef.current) {
        agentRef.current.hide(true, () => {})
      }
    }
  }, [])

  return <div className={CLIPPY_SELECTOR} />
}

export const AISearchTrigger = dynamic(
  () => Promise.resolve(ClippyTriggerInner),
  { ssr: false }
)
