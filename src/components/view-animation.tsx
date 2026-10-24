'use client'

import { animate } from 'motion/mini'
import { type ReactNode, type Ref, useLayoutEffect, useRef } from 'react'

interface ViewAnimationProps {
  as?: 'div' | 'li'
  children: ReactNode
  className?: string
  delay?: number
}

const SHIFT_PX = 6
const DURATION_S = 0.45
const EASE = [0.2, 0.7, 0.2, 1] as const

const reveals = new WeakMap<Element, () => void>()
let observer: IntersectionObserver | undefined

const getObserver = () => {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const { isIntersecting, target } of entries) {
        if (!isIntersecting) {
          continue
        }
        observer?.unobserve(target)
        reveals.get(target)?.()
        reveals.delete(target)
      }
    },
    { threshold: 0.1 }
  )
  return observer
}

export const ViewAnimation = ({
  as: Tag = 'div',
  delay = 0,
  className,
  children,
}: ViewAnimationProps) => {
  const ref = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const element = ref.current
    if (
      !element ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      element.getBoundingClientRect().top < window.innerHeight
    ) {
      return
    }

    const clear = () => {
      element.style.opacity = ''
      element.style.transform = ''
    }

    let animation: ReturnType<typeof animate> | undefined
    element.style.opacity = '0'
    element.style.transform = `translateY(${SHIFT_PX}px)`
    reveals.set(element, () => {
      animation = animate(
        element,
        {
          opacity: [0, 1],
          transform: [`translateY(${SHIFT_PX}px)`, 'none'],
        },
        { delay: Math.min(delay, 0.2), duration: DURATION_S, ease: EASE }
      )
      animation.finished.then(clear, clear)
    })
    const io = getObserver()
    io.observe(element)

    return () => {
      io.unobserve(element)
      reveals.delete(element)
      animation?.stop()
      clear()
    }
  }, [delay])

  return (
    <Tag
      className={className}
      data-reveal-item
      ref={ref as Ref<HTMLDivElement & HTMLLIElement>}
    >
      {children}
    </Tag>
  )
}
