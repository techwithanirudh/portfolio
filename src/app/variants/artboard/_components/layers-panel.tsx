'use client'

import {
  ChevronDown,
  ChevronRight,
  Component,
  EyeOff,
  Frame,
  Group,
  Image as ImageIcon,
  type LucideIcon,
  PenTool,
  Type,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { pages } from './nav'
import type { LayerType } from './selection'
import { useWorkspace } from './workspace'

export const layerIcons: Record<LayerType, LucideIcon> = {
  component: Component,
  frame: Frame,
  group: Group,
  image: ImageIcon,
  text: Type,
  vector: PenTool,
}

interface LayerNode {
  children: LayerNode[]
  el: HTMLElement
  hidden: boolean
  key: string
  name: string
  selectId?: string
  type: LayerType
}

/** Reads the layer tree straight from the canvas DOM, in document order. */
function scan(root: HTMLElement): LayerNode[] {
  const nodes = new Map<HTMLElement, LayerNode>()
  const top: LayerNode[] = []
  const els = root.querySelectorAll<HTMLElement>('[data-layer]')
  els.forEach((el, index) => {
    const node: LayerNode = {
      children: [],
      el,
      hidden: el.closest('[hidden]') !== null,
      key: `${index}:${el.dataset.layer}`,
      name: el.dataset.layer ?? 'Layer',
      selectId: el.dataset.selectId,
      type: (el.dataset.layerType as LayerType) ?? 'group',
    }
    nodes.set(el, node)
    const parentEl = el.parentElement?.closest<HTMLElement>('[data-layer]')
    const parent = parentEl ? nodes.get(parentEl) : undefined
    if (parent) {
      parent.children.push(node)
    } else {
      top.push(node)
    }
  })
  return top
}

function useLayerTree() {
  const pathname = usePathname()
  const [tree, setTree] = useState<LayerNode[]>([])

  // Rescan on every page: each page has its own canvas contents.
  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname is the trigger
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('.ab-canvas')
    if (!root) {
      return
    }
    let frame = 0
    const rescan = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setTree(scan(root)))
    }
    rescan()
    const observer = new MutationObserver(rescan)
    observer.observe(root, {
      attributeFilter: ['hidden'],
      attributes: true,
      childList: true,
      subtree: true,
    })
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [pathname])

  return tree
}

/** Scrollspy: the artboard nearest the top of the viewport. */
function useActiveArtboard(tree: LayerNode[]) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const boards = tree.map((n) => n.el).filter((el) => el.dataset.artboard)
    if (boards.length === 0) {
      return
    }
    const onScroll = () => {
      const line = window.innerHeight * 0.35
      let current = boards[0]
      for (const el of boards) {
        if (el.getBoundingClientRect().top <= line) {
          current = el
        }
      }
      setActive(current?.dataset.artboard ?? null)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [tree])

  return active
}

function LayerRow({
  activeBoard,
  depth,
  node,
  onPick,
}: {
  activeBoard: string | null
  depth: number
  node: LayerNode
  onPick?: () => void
}) {
  const { registry, select, selection, setSimba } = useWorkspace()
  const [open, setOpen] = useState(depth < 2)
  const Icon = layerIcons[node.type]
  const isBoard = Boolean(node.el.dataset.artboard)
  const selected = selection?.el === node.el
  const active = isBoard && activeBoard === node.el.dataset.artboard

  const peek = (on: boolean) => {
    const target = isBoard
      ? (node.el.querySelector<HTMLElement>('[data-frame]') ?? node.el)
      : node.el
    if (on) {
      target.setAttribute('data-peek', '')
    } else {
      target.removeAttribute('data-peek')
    }
  }

  const pick = () => {
    peek(false)
    if (node.selectId === 'simba') {
      setSimba(true)
    }
    const info = node.selectId ? registry.get(node.selectId) : undefined
    const target = isBoard
      ? (node.el.querySelector<HTMLElement>('[data-frame]') ?? node.el)
      : node.el
    select(
      info ?? {
        fields: [],
        id: `layer:${node.key}`,
        kind: isBoard ? 'Artboard' : 'Layer',
        name: node.name,
        type: isBoard ? 'frame' : node.type,
      },
      target
    )
    onPick?.()
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ;(isBoard ? node.el : target).scrollIntoView({
      behavior: reduce ? 'auto' : 'smooth',
      block: isBoard ? 'start' : 'center',
    })
  }

  const hasChildren = node.children.length > 0
  const Chevron = open ? ChevronDown : ChevronRight

  return (
    <li>
      <div className='relative flex items-center'>
        <button
          className='ab-layer'
          data-active={active || undefined}
          data-hidden={node.hidden || undefined}
          data-selected={selected || undefined}
          onBlur={() => peek(false)}
          onClick={pick}
          onFocus={() => peek(true)}
          onPointerEnter={() => peek(true)}
          onPointerLeave={() => peek(false)}
          style={{ paddingLeft: 22 + depth * 14 }}
          type='button'
        >
          <Icon
            aria-hidden
            className={cn(
              'size-3.5 flex-none',
              node.type === 'component' && 'text-(--component)',
              !(selected || node.type === 'component') && 'text-(--faint)'
            )}
            strokeWidth={1.75}
          />
          <span
            className={cn(
              'min-w-0 flex-1 truncate',
              node.type === 'component' && !selected && 'text-(--component)'
            )}
          >
            {node.name}
          </span>
          {node.hidden ? (
            <EyeOff aria-label='Hidden' className='size-3 flex-none' />
          ) : null}
        </button>
        {hasChildren ? (
          <button
            aria-expanded={open}
            aria-label={`${open ? 'Collapse' : 'Expand'} ${node.name}`}
            className='absolute grid size-5 place-items-center rounded text-(--faint) hover:text-(--ink)'
            onClick={() => setOpen((v) => !v)}
            style={{ left: 2 + depth * 14 }}
            type='button'
          >
            <Chevron aria-hidden className='size-3' />
          </button>
        ) : null}
      </div>
      {hasChildren && open ? (
        <ul>
          {node.children.map((child) => (
            <LayerRow
              activeBoard={activeBoard}
              depth={depth + 1}
              key={child.key}
              node={child}
              onPick={onPick}
            />
          ))}
        </ul>
      ) : null}
    </li>
  )
}

/**
 * The Layers panel: pages as frames, the current page's artboards as groups
 * and their contents as layers. Read from the DOM, so it never drifts from
 * what the canvas shows.
 */
export function LayersTree({ onPick }: { onPick?: () => void }) {
  const pathname = usePathname()
  const tree = useLayerTree()
  const active = useActiveArtboard(tree)

  const isCurrent = useCallback(
    (href: string) => pathname === href || pathname === `${href}/`,
    [pathname]
  )

  return (
    <nav aria-label='Layers' className='px-2 py-2'>
      <ul>
        {pages.map((page) => {
          const current = isCurrent(page.href)
          return (
            <li key={page.id}>
              <Link
                aria-current={current ? 'page' : undefined}
                className='ab-layer pl-1.5'
                data-active={current || undefined}
                href={page.href}
                onClick={onPick}
              >
                {current ? (
                  <ChevronDown
                    aria-hidden
                    className='size-3 flex-none text-(--faint)'
                  />
                ) : (
                  <ChevronRight
                    aria-hidden
                    className='size-3 flex-none text-(--faint)'
                  />
                )}
                <Frame
                  aria-hidden
                  className='size-3.5 flex-none text-(--faint)'
                  strokeWidth={1.75}
                />
                <span className='flex-1 truncate'>{page.label}</span>
                {current ? (
                  <span className='ab-t-label font-normal text-(--faint)'>
                    {tree.length}
                  </span>
                ) : null}
              </Link>
              {current ? (
                <ul>
                  {tree.map((node) => (
                    <LayerRow
                      activeBoard={active}
                      depth={1}
                      key={node.key}
                      node={node}
                      onPick={onPick}
                    />
                  ))}
                </ul>
              ) : null}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
