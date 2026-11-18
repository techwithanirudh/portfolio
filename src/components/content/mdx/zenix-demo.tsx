'use client'

// cspell:ignore dont evry lief mann mika techy valorant

import { Meter } from '@base-ui/react/meter'
import { Radio } from '@base-ui/react/radio'
import { RadioGroup } from '@base-ui/react/radio-group'
import { Tabs } from '@base-ui/react/tabs'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import { Icons } from '@/components/icons/icons'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/lib/utils'
import { DemoCard, DemoCardButton } from './demo-card'

// A mock Discord channel showing two things Zenix (the Discord AI Bot project)
// does to pass as a person. Everything here mirrors the bot's repo:
// src/utils/delay.ts, src/utils/tokenize-messages.ts, src/utils/triggers.ts,
// src/config.ts and the relevance check in src/events/message-create.

// src/config.ts `speed`
const MIN_PAUSE_S = 5
const MAX_PAUSE_S = 15
const SPEED_FACTOR = 180
const KEYWORDS = ['zenix', 'zenith', 'gpt', 'llm', 'ai', 'bot']

// The demo plays the pauses 5x faster, and holds the typing dots long enough
// to see them (the real ones last a fraction of a second)
const PAUSE_SPEEDUP = 5
const MIN_SHOWN_TYPING_MS = 900
const MAX_MESSAGES = 12

const ENDS_IN_PUNCTUATION = /[.!?]$/
const SENTENCE_BREAK = /(?<=[.!?])\s+/
const END_PUNCTUATION = /[.!?]+$/g
const TRAILING_FULL_STOP = /\.$/
const WHITESPACE = /\s+/

// calculateDelay() in delay.ts: length / 180 seconds, plus half a second per
// word that ends in . ! or ?, never under 100ms
const typingMs = (text: string) => {
  const punctuation = text
    .split(' ')
    .filter((w) => ENDS_IN_PUNCTUATION.test(w)).length
  return Math.max((text.length / SPEED_FACTOR) * 1000 + punctuation * 500, 100)
}

// sentences() + normalize() in tokenize-messages.ts, then the trailing full
// stop strip in reply(): one message per sentence, end punctuation gone
const toMessages = (reply: string) =>
  reply
    .split(SENTENCE_BREAK)
    .map((s) =>
      s.replace(END_PUNCTUATION, '').trim().replace(TRAILING_FULL_STOP, '')
    )
    .filter(Boolean)

type Author = 'ash' | 'mika' | 'tom' | 'zenix'

interface ChatMessage {
  author: Author
  id: number
  mention?: boolean
  /** What the message quotes when it goes out as a Discord reply */
  replyTo?: string
  text: string
  time: string
  /** The real pause and typing time, in seconds, before it was sent */
  timing?: { pause: number; typing: number }
}

// What tom_techy sends, and the reply Zenix's model writes. The prompt asks
// him for short sentences with full stops so the splitter has something to
// cut on, and for spelling mistakes on purpose.
interface Prompt {
  mention: boolean
  reply: string
  text: string
}

const ASK_IF_BOT: Prompt = {
  mention: true,
  reply:
    'no. why does evry1 keep asking me that. im literally just a guy in athens.',
  text: 'are u a bot',
}

const PROMPTS: Prompt[] = [
  ASK_IF_BOT,
  {
    mention: false,
    reply: 'coding some stuff. idk how it works tbh. dont ask lol.',
    text: 'zenix what are u even doing rn',
  },
  {
    mention: true,
    reply:
      'rust obviously. jk its whatever u actually finish stuff in. stop overthinking it bro.',
    text: 'whats the best language to learn',
  },
]

// A bit of scrollback, then the few-shot examples from config.ts, already
// split the way he'd send them
const SEED: ChatMessage[] = [
  {
    author: 'mika',
    id: -6,
    text: 'anyone around',
    time: 'Yesterday at 9:31 PM',
  },
  { author: 'ash', id: -5, text: 'ya', time: 'Yesterday at 9:33 PM' },
  {
    author: 'ash',
    id: -4,
    text: 'just got back',
    time: 'Yesterday at 9:33 PM',
  },
  { author: 'tom', id: -3, text: 'how ru', time: 'Yesterday at 9:38 PM' },
  {
    author: 'zenix',
    id: -2,
    text: 'the normal lief bro',
    time: 'Yesterday at 9:38 PM',
  },
  {
    author: 'zenix',
    id: -1,
    text: 'how ru mann',
    time: 'Yesterday at 9:38 PM',
  },
]

// Everyone else gets a quiet neutral chip, so the one tinted avatar in the
// channel is always the bot
const PEOPLE: Record<Author, { initial: string; name: string }> = {
  ash: { initial: 'A', name: 'dev_ash' },
  mika: { initial: 'M', name: 'mika' },
  tom: { initial: 'T', name: 'tom_techy' },
  zenix: { initial: 'Z', name: 'Zenix' },
}

const clock = () =>
  `Today at ${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

type Phase =
  | { kind: 'idle' }
  | { kind: 'pausing'; seconds: number }
  | { kind: 'typing' }

export function ZenixDemo({ caption }: { caption?: ReactNode }) {
  const [tab, setTab] = useState<'typing' | 'talk'>('typing')
  const [messages, setMessages] = useState<ChatMessage[]>(SEED)
  const [phase, setPhase] = useState<Phase>({ kind: 'idle' })
  const [next, setNext] = useState(ASK_IF_BOT)
  // Bumped on reset and unmount, so a reply still in flight stops sending
  const run = useRef(0)
  const nextId = useRef(0)

  useEffect(
    () => () => {
      run.current++
    },
    []
  )

  const push = (message: Omit<ChatMessage, 'id' | 'time'>) =>
    setMessages((current) =>
      [...current, { ...message, id: nextId.current++, time: clock() }].slice(
        -MAX_MESSAGES
      )
    )

  const send = async () => {
    if (phase.kind !== 'idle') {
      return
    }
    const id = ++run.current
    const prompt = next
    push({ author: 'tom', mention: prompt.mention, text: prompt.text })
    setNext(PROMPTS[(PROMPTS.indexOf(next) + 1) % PROMPTS.length] ?? ASK_IF_BOT)

    // reply() in delay.ts. `isFirst` only flips once a message goes out as a
    // Discord reply, so every message gets the coin flip until one does.
    let isFirst = true
    for (const text of toMessages(prompt.reply)) {
      const pause = Math.random() * (MAX_PAUSE_S - MIN_PAUSE_S) + MIN_PAUSE_S
      setPhase({ kind: 'pausing', seconds: pause })
      await wait((pause * 1000) / PAUSE_SPEEDUP)
      if (id !== run.current) {
        return
      }

      const typing = typingMs(text)
      setPhase({ kind: 'typing' })
      await wait(Math.max(typing, MIN_SHOWN_TYPING_MS))
      if (id !== run.current) {
        return
      }

      const asReply = isFirst && Math.random() < 0.5
      if (asReply) {
        isFirst = false
      }
      push({
        author: 'zenix',
        replyTo: asReply ? prompt.text : undefined,
        text,
        timing: { pause, typing: typing / 1000 },
      })
    }
    setPhase({ kind: 'idle' })
  }

  const reset = () => {
    run.current++
    setMessages(SEED)
    setPhase({ kind: 'idle' })
    setNext(ASK_IF_BOT)
  }

  const busy = phase.kind !== 'idle'

  return (
    <Tabs.Root
      onValueChange={(value) => setTab(value as typeof tab)}
      value={tab}
    >
      <DemoCard
        caption={caption}
        controls={
          <Tabs.List aria-label='What the demo shows' className='flex gap-1.5'>
            <Tabs.Tab render={<DemoCardButton />} value='typing'>
              Typing
            </Tabs.Tab>
            <Tabs.Tab render={<DemoCardButton />} value='talk'>
              When to talk
            </Tabs.Tab>
          </Tabs.List>
        }
      >
        <Tabs.Panel className='outline-none' value='typing'>
          <TypingChannel
            busy={busy}
            canReset={busy || messages !== SEED}
            messages={messages}
            next={next}
            onReset={reset}
            onSend={send}
            phase={phase}
          />
        </Tabs.Panel>
        <Tabs.Panel className='outline-none' value='talk'>
          <WhenToTalk />
        </Tabs.Panel>
      </DemoCard>
    </Tabs.Root>
  )
}

function TypingChannel({
  busy,
  canReset,
  messages,
  next,
  onReset,
  onSend,
  phase,
}: {
  busy: boolean
  canReset: boolean
  messages: ChatMessage[]
  next: Prompt
  onReset: () => void
  onSend: () => void
  phase: Phase
}) {
  return (
    <div className='flex h-[23.5rem] flex-col'>
      <ChannelHeader>
        <span className='text-muted-foreground text-xs'>Sped up 5x</span>
        {/* Clearing belongs to the channel, so it lives in its header */}
        <button
          aria-label='Clear the channel'
          className='-mr-1.5 inline-flex size-11 items-center justify-center rounded-lg text-muted-foreground outline-none transition-[color,background-color,scale,opacity] duration-150 ease-out-strong hover:bg-foreground/5 hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 active:scale-[0.96] disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4'
          disabled={!canReset}
          onClick={onReset}
          type='button'
        >
          <Icons.undo />
        </button>
      </ChannelHeader>
      <ol
        aria-label='Messages in #general'
        aria-live='polite'
        className='flex min-h-0 flex-1 flex-col justify-end overflow-hidden pb-1 [mask-image:linear-gradient(to_bottom,transparent,black_2.5rem)]'
      >
        {messages.map((message, index) => (
          <MessageRow
            grouped={
              !message.replyTo && messages[index - 1]?.author === message.author
            }
            key={message.id}
            message={message}
          />
        ))}
      </ol>

      <TypingStatus phase={phase} />
      <div className='px-2.5 pb-2.5'>
        <div className='flex h-11 items-center gap-2 rounded-xl bg-background pr-1.5 pl-3.5 ring-1 ring-black/[0.08] ring-inset dark:ring-white/[0.08]'>
          {/* While he's replying the box goes back to its placeholder, and
              the next message waits its turn */}
          <p className='min-w-0 flex-1 truncate text-sm'>
            {busy ? (
              <span className='text-muted-foreground'>Message #general</span>
            ) : (
              <>
                <span className='sr-only'>Next message: </span>
                {next.mention && <Mention />}
                {next.text}
              </>
            )}
          </p>
          {/* 32px to look at, 44px to hit */}
          <button
            aria-label={busy ? 'Zenix is still replying' : 'Send'}
            className='relative inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground outline-none transition-[opacity,scale] duration-150 ease-out-strong after:absolute after:-inset-1.5 focus-visible:ring-[3px] focus-visible:ring-ring/50 active:scale-[0.96] aria-disabled:opacity-35 aria-disabled:active:scale-100 [&_svg]:size-4'
            onClick={onSend}
            type='button'
            {...(busy && { 'aria-disabled': true })}
          >
            <Icons.send />
          </button>
        </div>
      </div>
    </div>
  )
}

function ChannelHeader({ children }: { children?: ReactNode }) {
  return (
    <div className='flex h-11 shrink-0 items-center gap-2 border-border border-b pr-1.5 pl-3.5'>
      <span className='flex min-w-0 flex-1 items-center gap-1 font-medium text-[0.8125rem]'>
        <span aria-hidden className='text-base text-muted-foreground/70'>
          #
        </span>
        general
      </span>
      {children}
    </div>
  )
}

function Mention() {
  return (
    <span className='mr-1 rounded-[4px] bg-primary/12 px-0.5 font-medium text-primary dark:bg-primary/15'>
      @Zenix
    </span>
  )
}

function Avatar({ who }: { who: Author }) {
  return (
    <span
      aria-hidden
      className={cn(
        'flex size-8 shrink-0 select-none items-center justify-center rounded-full font-semibold text-xs [text-box:trim-both_cap_alphabetic]',
        who === 'zenix'
          ? 'bg-primary text-primary-foreground'
          : 'bg-foreground/[0.07] text-foreground/60 ring-1 ring-foreground/[0.06] ring-inset'
      )}
    >
      {PEOPLE[who].initial}
    </span>
  )
}

function MessageRow({
  grouped,
  message,
}: {
  grouped: boolean
  message: ChatMessage
}) {
  const person = PEOPLE[message.author]
  const isNew = message.id >= 0

  return (
    <li
      className={cn(
        'grid grid-cols-[2rem_minmax(0,1fr)] gap-x-2.5 px-3.5',
        grouped ? 'pt-0.5' : 'pt-3',
        isNew &&
          'fade-in slide-in-from-bottom-1 motion-reduce:slide-in-from-bottom-0 animate-in duration-200 ease-out-strong'
      )}
    >
      {message.replyTo && (
        <div className='col-span-2 mb-1 flex min-w-0 items-center gap-1.5 text-muted-foreground text-xs'>
          {/* The elbow that ties a Discord reply to what it quotes */}
          <span
            aria-hidden
            className='mt-2 ml-4 h-2 w-5 shrink-0 rounded-tl-md border-foreground/20 border-t-[1.5px] border-l-[1.5px]'
          />
          <span className='sr-only'>Replying to </span>
          <span className='shrink-0 font-medium text-foreground/70'>
            @tom_techy
          </span>
          <span className='truncate'>{message.replyTo}</span>
        </div>
      )}
      {grouped ? <span /> : <Avatar who={message.author} />}
      <div className='min-w-0'>
        {!grouped && (
          <p className='flex items-baseline gap-1.5 text-[0.8125rem] leading-5'>
            <span className='font-medium'>{person.name}</span>
            <span className='text-[0.6875rem] text-muted-foreground'>
              {message.time}
            </span>
          </p>
        )}
        <p className='text-pretty text-foreground/85 text-sm leading-5'>
          {message.mention && <Mention />}
          {message.text}
          {/* A plain space rather than a margin, so a pill that wraps starts
              flush with the text above it */}
          {message.timing && ' '}
          {message.timing && (
            <span className='relative -top-px inline-block whitespace-nowrap rounded-full bg-foreground/[0.06] px-1.5 align-middle font-mono text-[0.6875rem] text-muted-foreground tabular-nums leading-4'>
              <span className='sr-only'>
                (waited {message.timing.pause.toFixed(1)} seconds, typed for{' '}
                {message.timing.typing.toFixed(1)} seconds)
              </span>
              <span aria-hidden>
                {message.timing.pause.toFixed(1)}s +{' '}
                {message.timing.typing.toFixed(1)}s
              </span>
            </span>
          )}
        </p>
      </div>
    </li>
  )
}

function TypingStatus({ phase }: { phase: Phase }) {
  return (
    <p
      className='flex h-6 shrink-0 items-center gap-2 px-3.5 text-muted-foreground text-xs'
      role='status'
    >
      {phase.kind === 'typing' && (
        <>
          <span aria-hidden className='flex w-8 justify-center gap-[3px]'>
            {[0, 160, 320].map((delay) => (
              <span
                className='size-[5px] animate-pulse rounded-full bg-foreground/60 motion-reduce:animate-none'
                key={delay}
                style={{ animationDelay: `${delay}ms` }}
              />
            ))}
          </span>
          <span>
            <span className='font-medium text-foreground'>Zenix</span> is
            typing…
          </span>
        </>
      )}
      {phase.kind === 'pausing' && (
        <>
          <WaitBar
            key={phase.seconds}
            ms={(phase.seconds * 1000) / PAUSE_SPEEDUP}
          />
          <span className='tabular-nums'>
            Waiting {phase.seconds.toFixed(1)}s before typing
          </span>
        </>
      )}
    </p>
  )
}

// A short bar that fills over the (sped up) pause, so the wait reads as time
// passing rather than a frozen label. Under reduced motion it stays empty
function WaitBar({ ms }: { ms: number }) {
  const fill = useRef<HTMLSpanElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) {
      return
    }
    const animation = fill.current?.animate(
      [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }],
      { duration: ms, easing: 'linear', fill: 'forwards' }
    )
    return () => animation?.cancel()
  }, [ms, reducedMotion])

  return (
    <span
      aria-hidden
      className='flex w-8 overflow-hidden rounded-full bg-foreground/10'
    >
      <span
        className='h-1 w-full origin-left rounded-full bg-foreground/45'
        ref={fill}
        style={{ transform: 'scaleX(0)' }}
      />
    </span>
  )
}

// When to talk: getTrigger() in triggers.ts, then the relevance check

type Trigger =
  | { kind: 'ping' }
  /** `inside` is the word it hid in, when it isn't a whole word itself */
  | { inside?: string; kind: 'keyword'; word: string }
  | null

// The same check as getTrigger(): a ping first, then a plain substring match
// on the lowercased text, so "wait" counts as "ai"
const triggerFor = (sample: Sample): Trigger => {
  if (sample.mention) {
    return { kind: 'ping' }
  }
  const content = sample.text.toLowerCase()
  const word = KEYWORDS.find((k) => content.includes(k))
  if (!word) {
    return null
  }
  const words = content.split(WHITESPACE)
  return words.includes(word)
    ? { kind: 'keyword', word }
    : { inside: words.find((w) => w.includes(word)), kind: 'keyword', word }
}

interface Sample {
  author: 'ash' | 'mika' | 'tom'
  /** What came right before it in the channel */
  context?: string
  /** An example guess from the relevance model, 0 to 1 */
  guess?: { probability: number; reason: string }
  id: string
  mention?: boolean
  text: string
}

const RANDOM_CHAT: Sample = {
  author: 'mika',
  guess: {
    probability: 0.08,
    reason: 'they are planning a game, nobody is talking to me',
  },
  id: 'chat',
  text: 'anyone up for valorant tonight',
}

const SAMPLES: Sample[] = [
  { author: 'tom', id: 'ping', mention: true, text: 'u up?' },
  { author: 'mika', id: 'keyword', text: 'does zenix ever sleep' },
  { author: 'ash', id: 'substring', text: 'wait who made this playlist' },
  RANDOM_CHAT,
  {
    author: 'tom',
    context: 'right after Zenix said “just pick rust lol”',
    guess: {
      probability: 0.81,
      reason: 'follow-up to what i just said about rust',
    },
    id: 'follow-up',
    text: 'ok but is it hard to learn',
  },
]

function WhenToTalk() {
  const [sample, setSample] = useState(RANDOM_CHAT)
  const trigger = triggerFor(sample)
  const probability = trigger ? 0 : (sample.guess?.probability ?? 0)
  // index.ts ignores anything at or under 0.5
  const replies = trigger !== null || probability > 0.5

  return (
    <div className='flex flex-col sm:grid sm:min-h-[23.5rem] sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]'>
      <div className='flex flex-col sm:border-border sm:border-r'>
        <ChannelHeader>
          <span className='pr-2 text-muted-foreground text-xs'>
            Pick a message
          </span>
        </ChannelHeader>
        <RadioGroup
          aria-label='Pick a message'
          className='flex flex-col gap-0.5 p-1.5'
          onValueChange={(value) =>
            setSample(
              (current) => SAMPLES.find((s) => s.id === value) ?? current
            )
          }
          value={sample.id}
        >
          {SAMPLES.map((s) => (
            <Radio.Root
              className='group/sample grid min-h-12 w-full select-none grid-cols-[2rem_minmax(0,1fr)_1rem] items-center gap-x-2.5 rounded-lg px-2 py-2 text-left outline-none transition-[background-color] duration-150 ease-out-strong hover:bg-foreground/[0.03] focus-visible:ring-[3px] focus-visible:ring-ring/50 data-checked:bg-primary/[0.07] dark:data-checked:bg-primary/15'
              key={s.id}
              value={s.id}
            >
              <Avatar who={s.author} />
              <span className='min-w-0'>
                {s.context && (
                  <span className='block truncate text-[0.6875rem] text-muted-foreground leading-4'>
                    {s.context}
                  </span>
                )}
                <span className='block font-medium text-[0.8125rem] leading-5'>
                  {PEOPLE[s.author].name}
                </span>
                <span className='block text-foreground/85 text-sm leading-5'>
                  {s.mention && <Mention />}
                  {s.text}
                </span>
              </span>
              {/* A real radio dot, so the rows read as a choice */}
              <span className='flex size-4 items-center justify-center rounded-full ring-1 ring-foreground/20 ring-inset transition-[background-color,box-shadow] duration-150 group-data-checked/sample:bg-primary group-data-checked/sample:ring-primary'>
                <Radio.Indicator className='size-1.5 rounded-full bg-primary-foreground' />
              </span>
            </Radio.Root>
          ))}
        </RadioGroup>
      </div>

      <Decision
        probability={probability}
        replies={replies}
        sample={sample}
        trigger={trigger}
      />
    </div>
  )
}

type CheckState = 'no' | 'skipped' | 'yes'

function Decision({
  probability,
  replies,
  sample,
  trigger,
}: {
  probability: number
  replies: boolean
  sample: Sample
  trigger: Trigger
}) {
  const percent = Math.round(probability * 100)
  let guessState: CheckState = 'no'
  if (trigger) {
    guessState = 'skipped'
  } else if (probability > 0.5) {
    guessState = 'yes'
  }

  return (
    <div
      aria-live='polite'
      className='flex flex-col gap-5 border-border border-t p-4 sm:justify-center sm:gap-6 sm:border-t-0 sm:p-6'
    >
      <ol className='flex flex-col'>
        <Check state={trigger ? 'yes' : 'no'} title='Ping, DM or keyword?'>
          <p className='text-pretty text-muted-foreground text-sm leading-5'>
            {trigger?.kind === 'ping' &&
              'Yes, a ping. He always answers those.'}
            {trigger?.kind === 'keyword' &&
              (trigger.inside ? (
                <>
                  Yes, <Keyword>{trigger.word}</Keyword> is hiding inside{' '}
                  <Keyword>{trigger.inside}</Keyword>. It&apos;s a plain text
                  match.
                </>
              ) : (
                <>
                  Yes, it says <Keyword>{trigger.word}</Keyword>.
                </>
              ))}
            {!trigger && 'No, so a small model has to guess.'}
          </p>
        </Check>

        <Check
          last
          meta='gpt-4.1-nano'
          state={guessState}
          title='Is it for me?'
        >
          <Meter.Root
            aria-label='How likely the message is for Zenix'
            className={cn(
              'flex flex-col gap-1.5 transition-opacity duration-200',
              trigger && 'opacity-50'
            )}
            value={percent}
          >
            <div className='flex items-baseline justify-between text-xs'>
              <span className='text-muted-foreground'>
                {trigger ? 'Skipped, no need to ask' : 'Example guess'}
              </span>
              <Meter.Value className='font-medium font-mono text-foreground tabular-nums'>
                {(_, value) => (trigger ? '' : `${value}%`)}
              </Meter.Value>
            </div>
            <div className='relative py-1'>
              <Meter.Track className='relative block h-1.5 overflow-hidden rounded-full bg-foreground/[0.08]'>
                <span
                  aria-hidden
                  className={cn(
                    'absolute inset-0 rounded-full transition-[clip-path,background-color] duration-300 ease-out-strong motion-reduce:transition-none',
                    probability > 0.5 ? 'bg-success' : 'bg-foreground/35'
                  )}
                  style={{
                    clipPath: `inset(0 ${100 - percent}% 0 0 round 999px)`,
                  }}
                />
              </Meter.Track>
              {/* The line he has to clear */}
              <span
                aria-hidden
                className='absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 rounded-full bg-foreground/60'
              />
            </div>
            <span className='self-center text-[0.6875rem] text-muted-foreground'>
              50% line
            </span>
          </Meter.Root>
          {!trigger && sample.guess && (
            <p className='mt-2 text-pretty text-muted-foreground text-xs leading-4'>
              Its reason: “{sample.guess.reason}”
            </p>
          )}
        </Check>
      </ol>

      <Verdict replies={replies} trigger={trigger} />
    </div>
  )
}

const CHECK_NODE: Record<CheckState, string> = {
  no: 'bg-card text-muted-foreground ring-1 ring-border ring-inset',
  skipped: 'border border-foreground/25 border-dashed [&>svg]:hidden',
  yes: 'bg-success text-white dark:text-background',
}

// One step of the decision, hung on a thin rail so the two checks read as a
// sequence instead of two loose numbers
function Check({
  children,
  last,
  meta,
  state,
  title,
}: {
  children: ReactNode
  last?: boolean
  meta?: string
  state: CheckState
  title: string
}) {
  return (
    <li className='grid grid-cols-[1.25rem_minmax(0,1fr)] gap-x-3'>
      <span className='flex flex-col items-center'>
        <span
          aria-hidden
          className={cn(
            'mt-px flex size-5 shrink-0 items-center justify-center rounded-full transition-[background-color,color,box-shadow] duration-200 [&>svg]:size-3',
            CHECK_NODE[state]
          )}
        >
          {/* The answer is spelled out beside it, so the mark stays silent */}
          {state === 'yes' ? (
            <Icons.check strokeWidth={2.5} />
          ) : (
            <Icons.close strokeWidth={2.5} />
          )}
        </span>
        {!last && <span aria-hidden className='my-1 w-px flex-1 bg-border' />}
      </span>
      <div className={cn('flex min-w-0 flex-col gap-1.5', !last && 'pb-5')}>
        <p className='flex items-baseline gap-2 text-[0.8125rem] leading-5'>
          <span className='font-medium'>{title}</span>
          {meta && (
            <span className='ml-auto font-mono text-[0.6875rem] text-muted-foreground'>
              {meta}
            </span>
          )}
        </p>
        {children}
      </div>
    </li>
  )
}

function Verdict({ replies, trigger }: { replies: boolean; trigger: Trigger }) {
  let why = 'The guess didn’t clear 50%'
  if (trigger) {
    why = 'Pings and keywords always get a reply'
  } else if (replies) {
    why = 'The guess cleared 50%'
  }

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-200',
        replies
          ? 'bg-success/8 ring-1 ring-success/15 ring-inset dark:bg-success/15 dark:ring-success/25'
          : 'bg-foreground/[0.04] ring-1 ring-foreground/[0.06] ring-inset'
      )}
    >
      <span
        className={cn(
          'flex size-8 shrink-0 items-center justify-center rounded-full [&>svg]:size-4',
          replies
            ? 'bg-success text-white dark:text-background'
            : 'bg-foreground/[0.07] text-muted-foreground'
        )}
      >
        {replies ? <Icons.send aria-hidden /> : <Icons.ban aria-hidden />}
      </span>
      <span className='flex min-w-0 flex-col'>
        <span
          className={cn(
            'font-medium text-sm leading-5',
            replies ? 'text-success' : 'text-foreground'
          )}
        >
          {replies ? 'Zenix jumps in' : 'Zenix stays quiet'}
        </span>
        <span className='text-muted-foreground text-xs leading-4'>{why}</span>
      </span>
    </div>
  )
}

function Keyword({ children }: { children: ReactNode }) {
  return (
    <span className='rounded-[4px] bg-foreground/[0.06] px-1 py-px font-mono text-[0.8125rem] text-foreground'>
      {children}
    </span>
  )
}
