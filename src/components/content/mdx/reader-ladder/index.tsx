'use client'

import { useEffect, useRef, useState } from 'react'
import { IconSwap, IconSwapItem } from '@/components/icon-swap'
import { Icons } from '@/components/icons/icons'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/lib/utils'
import { DemoCard, DemoCardButton } from '../demo-card'
import {
  RUNGS,
  type RungId,
  readerJson,
  rungLabel,
  SHOPS,
  type Shop,
  type ShopId,
} from './data'

type RungState = 'fail' | 'idle' | 'ok' | 'running' | 'skipped'
// The site changes under a saved reader: v1 breaks, the repair agent writes
// v2, v2 runs a live test, and only then takes over
type Heal = 'broken' | 'healed' | 'none' | 'repairing' | 'testing'

interface Scene {
  heal: Heal
  rungs: Record<RungId, RungState>
  shop: ShopId
}

const STEP_MS = 900
const GAP_MS = 250
const HEAL_STEPS: [Heal, number][] = [
  ['broken', 0],
  ['repairing', 1100],
  ['testing', 2400],
  ['healed', 3800],
]

const getShop = (id: ShopId) => SHOPS.find((shop) => shop.id === id) as Shop

// Every rung the shop reached, with its result, and the rest not needed
function finalRungs(shop: Shop) {
  return Object.fromEntries(
    RUNGS.map(({ id }) => {
      if (!shop.notes[id]) {
        return [id, 'skipped']
      }
      return [id, id === shop.winner ? 'ok' : 'fail']
    })
  ) as Record<RungId, RungState>
}

const idleRungs = () =>
  Object.fromEntries(RUNGS.map(({ id }) => [id, 'idle'])) as Record<
    RungId,
    RungState
  >

const finalScene = (id: ShopId): Scene => ({
  heal: 'none',
  rungs: finalRungs(getShop(id)),
  shop: id,
})

const clearTimers = (list: number[]) => {
  for (const timer of list) {
    window.clearTimeout(timer)
  }
}

const isBusy = (scene: Scene) =>
  Object.values(scene.rungs).some((state) => state === 'running') ||
  scene.heal === 'broken' ||
  scene.heal === 'repairing' ||
  scene.heal === 'testing'

export function ReaderLadder() {
  const reducedMotion = useReducedMotion()
  // The first frame is the finished run, so the still (no JS yet, reduced
  // motion, a screenshot) already tells the whole story
  const [scene, setScene] = useState<Scene>(() => finalScene('next'))
  const timers = useRef<number[]>([])

  const clear = () => {
    clearTimers(timers.current)
    timers.current = []
  }
  // Nothing fires after the demo leaves the page
  useEffect(() => () => clearTimers(timers.current), [])

  const at = (ms: number, update: (scene: Scene) => Scene) => {
    timers.current.push(window.setTimeout(() => setScene(update), ms))
  }

  const run = (id: ShopId) => {
    clear()
    const shop = getShop(id)
    if (reducedMotion) {
      setScene(finalScene(id))
      return
    }
    setScene({ heal: 'none', rungs: idleRungs(), shop: id })
    const final = finalRungs(shop)
    let ms = GAP_MS
    for (const { id: rung } of RUNGS) {
      if (final[rung] === 'skipped') {
        break
      }
      at(ms, (s) => ({ ...s, rungs: { ...s.rungs, [rung]: 'running' } }))
      ms += STEP_MS
      at(ms, (s) => ({ ...s, rungs: { ...s.rungs, [rung]: final[rung] } }))
      ms += GAP_MS
    }
    at(ms, (s) => ({ ...s, rungs: final }))
  }

  const changeSite = () => {
    clear()
    if (reducedMotion) {
      setScene((s) => ({ ...s, heal: 'healed' }))
      return
    }
    for (const [heal, ms] of HEAL_STEPS) {
      at(ms, (s) => ({ ...s, heal }))
    }
  }

  const shop = getShop(scene.shop)
  const busy = isBusy(scene)
  const done = !Object.values(scene.rungs).some(
    (state) => state === 'idle' || state === 'running'
  )

  return (
    <DemoCard
      caption='An example with made up values. The learner tries each way in order and keeps the first one that works.'
      controls={
        // Two by two on phones with Replay across the bottom, one row wider
        <div className='grid w-full grid-cols-2 gap-1.5 sm:flex sm:flex-wrap'>
          {SHOPS.map((option) => (
            <DemoCardButton
              active={option.id === scene.shop}
              key={option.id}
              onClick={() => run(option.id)}
            >
              {option.label}
            </DemoCardButton>
          ))}
          <DemoCardButton
            aria-label={`Replay ${shop.label}`}
            className='col-span-2 sm:ml-auto'
            onClick={() => run(scene.shop)}
          >
            <Icons.refresh />
            Replay
          </DemoCardButton>
        </div>
      }
    >
      <div className='flex flex-col gap-5 p-5 sm:p-6' data-slot='reader-ladder'>
        <div className='flex items-center gap-2 text-muted-foreground text-sm'>
          <Icons.globe className='size-4' />
          <span>
            Learner agent on{' '}
            <span className='font-mono text-foreground'>{shop.site}</span>
          </span>
        </div>

        <ol className='grid gap-3 sm:grid-cols-3'>
          {RUNGS.map((rung, index) => (
            <RungTile
              index={index}
              key={rung.id}
              label={rung.label}
              note={shop.notes[rung.id]}
              state={scene.rungs[rung.id]}
              tries={rung.tries}
            />
          ))}
        </ol>

        <Outcome
          busy={busy}
          done={done}
          heal={scene.heal}
          onChangeSite={changeSite}
          shop={shop}
        />

        <p aria-live='polite' className='sr-only'>
          {statusText(shop, scene, done)}
        </p>
      </div>
    </DemoCard>
  )
}

function statusText(shop: Shop, scene: Scene, done: boolean) {
  if (!done) {
    const running = RUNGS.find(({ id }) => scene.rungs[id] === 'running')
    return running ? `Trying ${running.label} on ${shop.label}` : ''
  }
  if (!shop.winner) {
    return `Nothing worked on ${shop.label}, so the app says it can't read that site.`
  }
  return `${rungLabel(shop.winner)} worked on ${shop.label}. ${HEAL_TEXT[scene.heal]}`
}

const HEAL_TEXT: Record<Heal, string> = {
  broken: 'The site changed, so version 1 broke.',
  healed: 'Version 2 passed its live test, so it replaced version 1.',
  none: 'Saved as reader version 1. A plain runner replays it, no model.',
  repairing: 'The repair agent is writing version 2. Version 1 stays active.',
  testing: 'Testing version 2 live. Version 1 stays active until it passes.',
}

const RUNG_STYLES: Record<RungState, string> = {
  fail: 'border-border',
  idle: 'border-border',
  ok: 'border-success/40 bg-success/5',
  running: 'border-ring/50 ring-[3px] ring-ring/15',
  skipped: 'border-border border-dashed',
}

function RungTile({
  index,
  label,
  note,
  state,
  tries,
}: {
  index: number
  label: string
  note?: string
  state: RungState
  tries: string
}) {
  const result = {
    fail: note,
    idle: 'Waiting',
    ok: note,
    running: 'Trying',
    skipped: 'Not needed',
  }[state]

  return (
    <li
      className={cn(
        'flex min-w-0 flex-col gap-1 rounded-lg border bg-background p-4 transition-[border-color,background-color,box-shadow,opacity] duration-300 ease-out-strong motion-reduce:transition-none',
        RUNG_STYLES[state],
        (state === 'idle' || state === 'skipped') && 'opacity-60'
      )}
      data-state={state}
    >
      <div className='flex items-center gap-2'>
        <span className='font-mono text-muted-foreground text-xs tabular-nums'>
          {index + 1}
        </span>
        <span className='font-medium text-sm'>{label}</span>
        <span className='ml-auto flex size-5 items-center justify-center'>
          <IconSwap>
            <IconSwapItem key={state}>
              <RungIcon state={state} />
            </IconSwapItem>
          </IconSwap>
        </span>
      </div>
      <span className='text-pretty text-muted-foreground text-sm'>{tries}</span>
      <span
        className={cn(
          'mt-2 text-pretty border-border border-t border-dashed pt-2 text-sm',
          state === 'ok' && 'text-success',
          state === 'fail' && 'text-destructive',
          state !== 'ok' && state !== 'fail' && 'text-muted-foreground'
        )}
      >
        {result}
      </span>
    </li>
  )
}

function RungIcon({ state }: { state: RungState }) {
  switch (state) {
    case 'ok':
      return (
        <Icons.success aria-label='Worked' className='size-5 text-success' />
      )
    case 'fail':
      return (
        <Icons.error aria-label='Failed' className='size-5 text-destructive' />
      )
    case 'running':
      return (
        <Icons.spinner
          aria-label='Trying'
          className='size-5 animate-spin text-muted-foreground motion-reduce:animate-none'
        />
      )
    default:
      return <span className='block size-2 rounded-full bg-border' />
  }
}

function Outcome({
  busy,
  done,
  heal,
  onChangeSite,
  shop,
}: {
  busy: boolean
  done: boolean
  heal: Heal
  onChangeSite: () => void
  shop: Shop
}) {
  const name = `${shop.id}.reader.json`

  if (!shop.winner) {
    return (
      <div className='flex min-h-44 flex-col items-center justify-center gap-2 rounded-lg border border-border border-dashed p-5 text-center'>
        {done ? (
          <div className='fade-in flex animate-in flex-col items-center gap-2 duration-300 motion-reduce:animate-none'>
            <Icons.ban className='size-5 text-muted-foreground' />
            <p className='font-medium text-sm'>Can't read that site</p>
            <p className='max-w-xs text-pretty text-muted-foreground text-sm'>
              Nothing worked, so the app says so instead of guessing.
            </p>
          </div>
        ) : (
          <p className='text-muted-foreground text-sm'>Nothing saved yet</p>
        )}
      </div>
    )
  }

  // While the learner works, a placeholder holds the reader's own height, so
  // nothing below the demo jumps when the result lands
  if (!done) {
    const lines = (readerJson(shop, 1) ?? '').split('\n')
    return (
      <ReaderPanel
        footer={
          <p className='text-pretty text-muted-foreground text-sm'>
            Nothing saved yet
          </p>
        }
        name={name}
      >
        <div aria-hidden className='py-3'>
          {lines.map((line, index) => (
            <span
              className='flex h-6 items-center px-4'
              // biome-ignore lint/suspicious/noArrayIndexKey: lines of a fixed snippet
              key={index}
            >
              <span
                className='h-2 rounded-full bg-foreground/8'
                style={{
                  marginLeft: `${line.search(NON_SPACE)}ch`,
                  width: `${Math.min(line.trim().length, 36)}ch`,
                }}
              />
            </span>
          ))}
        </div>
      </ReaderPanel>
    )
  }

  // v2 shows up once the repair agent has written it
  const version = heal === 'testing' || heal === 'healed' ? 2 : 1
  const changed = version === 2 ? shop.repair?.field : undefined
  const broken =
    heal === 'broken' || heal === 'repairing' ? shop.repair?.field : undefined

  return (
    <ReaderPanel
      className='fade-in animate-in duration-300 motion-reduce:animate-none'
      footer={
        <>
          <p className='text-pretty text-muted-foreground text-sm sm:flex-1'>
            {HEAL_TEXT[heal]}
          </p>
          <DemoCardButton
            className='self-start sm:self-auto'
            disabled={busy || heal === 'healed'}
            onClick={onChangeSite}
          >
            <Icons.wrench />
            Site changed
          </DemoCardButton>
        </>
      }
      name={name}
      pills={
        <>
          <VersionPill label='v1' status={V1_STATUS[heal]} />
          {V2_STATUS[heal] && (
            <VersionPill label='v2' status={V2_STATUS[heal]} />
          )}
        </>
      }
    >
      <JsonLines
        broken={broken}
        changed={changed}
        json={readerJson(shop, version) ?? ''}
      />
    </ReaderPanel>
  )
}

// The saved reader as a small file: its name and versions, the JSON, and a
// footer for what happens to it next
function ReaderPanel({
  children,
  className,
  footer,
  name,
  pills,
}: {
  children: React.ReactNode
  className?: string
  footer: React.ReactNode
  name: string
  pills?: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-lg border border-border bg-background',
        className
      )}
    >
      <div className='flex min-h-12 flex-wrap items-center gap-x-3 gap-y-2 border-border border-b px-4 py-3'>
        <Icons.page className='size-4 text-muted-foreground' />
        <span className='min-w-0 truncate font-mono text-sm'>{name}</span>
        <span className='ml-auto flex gap-1.5'>{pills}</span>
      </div>
      {children}
      <div className='flex min-h-17 flex-col justify-center gap-3 border-border border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-start'>
        {footer}
      </div>
    </div>
  )
}

type Status = 'active' | 'broken' | 'retired' | 'testing' | 'writing'

const V1_STATUS: Record<Heal, Status> = {
  broken: 'broken',
  healed: 'retired',
  none: 'active',
  repairing: 'broken',
  testing: 'broken',
}

const V2_STATUS: Record<Heal, Status | undefined> = {
  broken: undefined,
  healed: 'active',
  none: undefined,
  repairing: 'writing',
  testing: 'testing',
}

const STATUS: Record<Status, { label: string; tone: string }> = {
  active: { label: 'Active', tone: 'bg-success/10 text-success' },
  // Broken but still the one in use, until v2 passes
  broken: {
    label: 'Active, broken',
    tone: 'bg-destructive/10 text-destructive',
  },
  retired: {
    label: 'Retired',
    tone: 'bg-foreground/8 text-muted-foreground',
  },
  testing: {
    label: 'Live test',
    tone: 'bg-foreground/8 text-foreground',
  },
  writing: {
    label: 'Writing',
    tone: 'bg-foreground/8 text-muted-foreground',
  },
}

function VersionPill({ label, status }: { label: string; status: Status }) {
  return (
    <span
      className={cn(
        'inline-flex h-6 items-center gap-1 rounded-full px-2 font-medium text-xs',
        STATUS[status].tone
      )}
    >
      <span className='font-mono'>{label}</span>
      {STATUS[status].label}
    </span>
  )
}

const NON_SPACE = /\S/
const LINE = /^(\s*)("[^"]+")(: ?)?(.*)$/

function JsonLines({
  broken,
  changed,
  json,
}: {
  broken?: string
  changed?: string
  json: string
}) {
  return (
    <pre
      className='overflow-x-auto py-3 font-mono outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-inset'
      // biome-ignore lint/a11y/noNoninteractiveTabindex: long expressions scroll sideways, so keyboard users need to reach it
      tabIndex={0}
    >
      <code>
        {json.split('\n').map((line, index) => {
          const match = LINE.exec(line)
          const key = match?.[2]
          const isChanged = changed && key === `"${changed}"`
          const isBroken = broken && key === `"${broken}"`
          return (
            <span
              className={cn(
                'block px-4 text-xs leading-6 sm:text-[13px]',
                isChanged && 'bg-success/10',
                isBroken && 'bg-destructive/10'
              )}
              // biome-ignore lint/suspicious/noArrayIndexKey: lines of a fixed snippet
              key={index}
            >
              {match?.[3] ? (
                <>
                  {match[1]}
                  <span className='text-muted-foreground'>{match[2]}</span>
                  {match[3]}
                  <span
                    className={cn(
                      'text-foreground',
                      isBroken && 'text-destructive line-through',
                      isChanged && 'text-success'
                    )}
                  >
                    {match[4]}
                  </span>
                </>
              ) : (
                <span className='text-muted-foreground'>{line}</span>
              )}
            </span>
          )
        })}
      </code>
    </pre>
  )
}
