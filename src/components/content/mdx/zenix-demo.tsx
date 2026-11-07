'use client'

// cspell:ignore dont evry lief mann mika techy valorant

import { Meter } from '@base-ui/react/meter'
import { Radio } from '@base-ui/react/radio'
import { RadioGroup } from '@base-ui/react/radio-group'
import { Tabs } from '@base-ui/react/tabs'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import { Icons } from '@/components/icons/icons'
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

const PEOPLE: Record<Author, { color: string; initial: string; name: string }> =
  {
    ash: { color: 'bg-rose-500', initial: 'A', name: 'dev_ash' },
    mika: { color: 'bg-teal-600', initial: 'M', name: 'mika' },
    tom: { color: 'bg-amber-500', initial: 'T', name: 'tom_techy' },
    zenix: { color: 'bg-primary', initial: 'Z', name: 'Zenix' },
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
          <>
            <Tabs.List
              aria-label='What the demo shows'
              className='flex gap-1.5'
            >
              <Tabs.Tab
                render={<DemoCardButton className={tabClass} />}
                value='typing'
              >
                Typing
              </Tabs.Tab>
              <Tabs.Tab
                render={<DemoCardButton className={tabClass} />}
                value='talk'
              >
                When to talk
              </Tabs.Tab>
            </Tabs.List>
            {tab === 'typing' && (
              <DemoCardButton
                aria-label='Clear the channel'
                className='ml-auto'
                disabled={!busy && messages === SEED}
                onClick={reset}
              >
                <Icons.undo />
              </DemoCardButton>
            )}
          </>
        }
      >
        <Tabs.Panel className='outline-none' value='typing'>
          <TypingChannel
            busy={busy}
            messages={messages}
            next={next}
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

const tabClass =
  'data-active:bg-foreground data-active:text-background data-active:ring-transparent'

function TypingChannel({
  busy,
  messages,
  next,
  onSend,
  phase,
}: {
  busy: boolean
  messages: ChatMessage[]
  next: Prompt
  onSend: () => void
  phase: Phase
}) {
  return (
    <div className='flex h-[24rem] flex-col sm:h-[22.5rem]'>
      <ChannelHeader />
      <ol
        aria-label='Messages in #general'
        aria-live='polite'
        className='flex min-h-0 flex-1 flex-col justify-end overflow-hidden px-1 pb-1 [mask-image:linear-gradient(to_bottom,transparent,black_3rem)]'
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
      <div className='px-3 pb-3'>
        <div className='flex items-center gap-2 rounded-[10px] bg-muted py-1 pr-1 pl-3.5 ring-1 ring-black/5 dark:ring-white/5'>
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
          <button
            aria-label={busy ? 'Zenix is still replying' : 'Send'}
            className='inline-flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground outline-none transition-[opacity,scale] duration-150 ease-out-strong focus-visible:ring-[3px] focus-visible:ring-ring/50 active:scale-[0.94] aria-disabled:opacity-40 [&_svg]:size-[1.125rem]'
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

function ChannelHeader() {
  return (
    <div className='flex h-11 shrink-0 items-center gap-1.5 border-border/60 border-b px-3.5 text-sm'>
      <span aria-hidden className='font-medium text-lg text-muted-foreground'>
        #
      </span>
      <span className='font-medium'>general</span>
    </div>
  )
}

function Mention() {
  return (
    <span className='mr-1 rounded-[4px] bg-primary/15 px-0.5 font-medium text-primary'>
      @Zenix
    </span>
  )
}

function Avatar({ who }: { who: keyof typeof PEOPLE }) {
  const person = PEOPLE[who]
  return (
    <span
      aria-hidden
      className={cn(
        'flex size-9 shrink-0 items-center justify-center rounded-full font-semibold text-sm text-white [text-box:trim-both_cap_alphabetic]',
        who === 'zenix' && 'text-primary-foreground',
        person.color
      )}
    >
      {person.initial}
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
        'grid grid-cols-[2.25rem_1fr] gap-x-3 rounded-md px-2.5',
        grouped ? 'pt-0.5' : 'pt-3',
        isNew &&
          'fade-in slide-in-from-bottom-1 animate-in duration-300 ease-out-strong motion-reduce:animate-none'
      )}
    >
      {message.replyTo && (
        <div className='col-span-2 col-start-1 mb-1 flex min-w-0 items-center gap-1.5 text-muted-foreground text-xs'>
          {/* The elbow that ties a Discord reply to what it quotes */}
          <span
            aria-hidden
            className='mt-1.5 ml-[1.0625rem] h-2 w-6 shrink-0 rounded-tl-md border-muted-foreground/40 border-t-2 border-l-2'
          />
          <span className='sr-only'>Replying to </span>
          <span className='shrink-0 font-medium'>@tom_techy</span>
          <span className='truncate'>{message.replyTo}</span>
        </div>
      )}
      {grouped ? <span /> : <Avatar who={message.author} />}
      <div className='min-w-0'>
        {!grouped && (
          <p className='flex items-baseline gap-2 text-sm leading-tight'>
            <span className='font-medium'>{person.name}</span>
            <span className='text-muted-foreground text-xs'>
              {message.time}
            </span>
          </p>
        )}
        <p className='text-[0.9375rem] text-foreground/90 leading-snug'>
          {message.mention && <Mention />}
          {message.text}
          {message.timing && (
            <span className='ml-2 whitespace-nowrap font-mono text-[0.6875rem] text-muted-foreground tabular-nums'>
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
      className='flex h-7 shrink-0 items-center gap-1.5 px-4 text-muted-foreground text-xs'
      role='status'
    >
      {phase.kind === 'typing' && (
        <>
          <span aria-hidden className='flex gap-0.5'>
            {[0, 150, 300].map((delay) => (
              <span
                className='size-1 animate-pulse rounded-full bg-foreground/70 motion-reduce:animate-none'
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
        <span className='tabular-nums'>
          Waiting {phase.seconds.toFixed(1)}s before typing
        </span>
      )}
    </p>
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
    <div className='flex flex-col sm:grid sm:min-h-[22.5rem] sm:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]'>
      <div className='flex flex-col sm:border-border/60 sm:border-r'>
        <ChannelHeader />
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
              className='grid min-h-11 w-full grid-cols-[2.25rem_1fr] items-center gap-x-3 rounded-lg px-2.5 py-2 text-left outline-none transition-colors duration-150 hover:bg-muted/70 focus-visible:ring-[3px] focus-visible:ring-ring/50 data-checked:bg-muted data-checked:ring-1 data-checked:ring-black/5 dark:data-checked:ring-white/10'
              key={s.id}
              value={s.id}
            >
              <Avatar who={s.author} />
              <span className='min-w-0'>
                {s.context && (
                  <span className='block truncate text-muted-foreground text-xs'>
                    {s.context}
                  </span>
                )}
                <span className='block text-sm leading-tight'>
                  <span className='font-medium'>{PEOPLE[s.author].name}</span>
                </span>
                <span className='block text-[0.9375rem] text-foreground/90 leading-snug'>
                  {s.mention && <Mention />}
                  {s.text}
                </span>
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

  return (
    <div
      aria-live='polite'
      className='flex flex-col gap-5 border-border/60 border-t p-4 sm:justify-center sm:border-t-0 sm:p-6'
    >
      <Step label='Ping, DM or keyword?' number={1}>
        <p className='text-sm'>
          {trigger?.kind === 'ping' && 'Yes, a ping. He always answers those.'}
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
      </Step>

      <Step
        dimmed={trigger !== null}
        label='Is it for me?'
        meta='gpt-4.1-nano'
        number={2}
      >
        <Meter.Root
          aria-label='How likely the message is for Zenix'
          className='flex flex-col gap-2'
          value={percent}
        >
          <div className='flex items-baseline justify-between text-sm'>
            <span className='text-muted-foreground'>
              {trigger ? 'Skipped' : 'Example guess'}
            </span>
            <Meter.Value className='font-medium tabular-nums'>
              {(_, value) => (trigger ? '' : `${value}%`)}
            </Meter.Value>
          </div>
          <div className='relative'>
            <Meter.Track className='block h-2 overflow-hidden rounded-full bg-muted ring-1 ring-black/5 dark:ring-white/5'>
              <Meter.Indicator
                className={cn(
                  'block h-full rounded-full transition-[width,background-color] duration-500 ease-out-strong motion-reduce:transition-none',
                  probability > 0.5 ? 'bg-primary' : 'bg-muted-foreground/50'
                )}
              />
            </Meter.Track>
            {/* The line he has to clear */}
            <span
              aria-hidden
              className='absolute -top-1 -bottom-1 left-1/2 w-0.5 -translate-x-1/2 rounded-full bg-foreground/70'
            />
          </div>
          <div className='flex justify-center text-[0.6875rem] text-muted-foreground'>
            <span>50% line</span>
          </div>
        </Meter.Root>
        {!trigger && sample.guess && (
          <p className='mt-2 text-muted-foreground text-xs'>
            Its reason: “{sample.guess.reason}”
          </p>
        )}
      </Step>

      <div
        className={cn(
          'flex items-center gap-2.5 rounded-[10px] px-3.5 py-3 font-medium text-sm transition-colors duration-200',
          replies
            ? 'bg-primary/12 text-primary'
            : 'bg-muted text-muted-foreground'
        )}
      >
        {replies ? (
          <Icons.success className='size-[1.125rem] shrink-0' />
        ) : (
          <Icons.ban className='size-[1.125rem] shrink-0' />
        )}
        {replies ? 'Zenix jumps in' : 'Zenix stays quiet'}
      </div>
    </div>
  )
}

function Step({
  children,
  dimmed,
  label,
  meta,
  number,
}: {
  children: ReactNode
  dimmed?: boolean
  label: string
  meta?: string
  number: number
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 transition-opacity duration-200',
        dimmed && 'opacity-45'
      )}
    >
      <p className='flex items-baseline gap-2 text-muted-foreground text-xs'>
        <span className='font-mono tabular-nums'>{number}</span>
        <span className='font-medium text-foreground'>{label}</span>
        {meta && <span className='ml-auto font-mono'>{meta}</span>}
      </p>
      {children}
    </div>
  )
}

function Keyword({ children }: { children: ReactNode }) {
  return (
    <span className='rounded-[4px] bg-muted px-1 py-px font-mono text-[0.8125rem]'>
      {children}
    </span>
  )
}
