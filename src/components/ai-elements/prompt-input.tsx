'use client'

import type { ChatStatus } from 'ai'
import {
  type ComponentProps,
  type FormEvent,
  type KeyboardEvent,
  useLayoutEffect,
  useRef,
} from 'react'
import { Icons } from '@/components/icons/icons'
import { Button } from '@/components/ui/button'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from '@/components/ui/input-group'
import { cn } from '@/lib/utils'

interface PromptInputMessage {
  text: string
}

type PromptInputProps = Omit<ComponentProps<'form'>, 'onSubmit'> & {
  onSubmit: (
    message: PromptInputMessage,
    event: FormEvent<HTMLFormElement>
  ) => void | Promise<void>
}

// Text-only slice of AI Elements' PromptInput
export const PromptInput = ({
  className,
  onSubmit,
  children,
  ...props
}: PromptInputProps) => (
  // react-doctor-disable-next-line react-doctor/no-prevent-default -- the chat owns submission on the client; a form action would run it as a transition, delaying the input clear until the reply finishes streaming
  <form
    className={cn('w-full', className)}
    onSubmit={(event) => {
      event.preventDefault()
      const text = new FormData(event.currentTarget).get('message')
      onSubmit({ text: typeof text === 'string' ? text : '' }, event)
    }}
    {...props}
  >
    <InputGroup className='h-auto flex-col items-stretch border-0 shadow-none has-[[data-slot=input-group-control]:focus-visible]:ring-0 dark:bg-transparent'>
      {children}
    </InputGroup>
  </form>
)

type PromptInputBodyProps = ComponentProps<'div'>

export const PromptInputBody = ({
  className,
  ...props
}: PromptInputBodyProps) => (
  <div className={cn('flex items-start', className)} {...props} />
)

type PromptInputTextareaProps = ComponentProps<typeof InputGroupTextarea>

export const PromptInputTextarea = ({
  className,
  enterKeyHint = 'send',
  onKeyDown,
  placeholder = 'What would you like to know?',
  value,
  ...props
}: PromptInputTextareaProps) => {
  const ref = useRef<HTMLTextAreaElement>(null)

  // field-sizing grows the box natively; elsewhere, size it to its content
  useLayoutEffect(() => {
    const el = ref.current
    if (
      !el ||
      value === undefined ||
      (typeof CSS !== 'undefined' && CSS.supports('field-sizing', 'content'))
    ) {
      return
    }
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [value])

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) {
      return
    }
    // IME composition is left alone so CJK input can confirm a candidate with Enter
    if (
      event.key !== 'Enter' ||
      event.shiftKey ||
      event.nativeEvent.isComposing
    ) {
      return
    }
    event.preventDefault()
    const form = event.currentTarget.form
    const submit = form?.querySelector<HTMLButtonElement>(
      'button[type="submit"]'
    )
    if (submit?.disabled) {
      return
    }
    form?.requestSubmit()
  }

  return (
    <InputGroupTextarea
      className={cn(
        'field-sizing-content max-h-40 min-h-0 px-3 py-2.5 text-sm md:text-sm',
        className
      )}
      enterKeyHint={enterKeyHint}
      name='message'
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      ref={ref}
      rows={1}
      value={value}
      {...props}
    />
  )
}

type PromptInputHeaderProps = Omit<
  ComponentProps<typeof InputGroupAddon>,
  'align'
>

export const PromptInputHeader = ({
  className,
  ...props
}: PromptInputHeaderProps) => (
  <InputGroupAddon
    align='block-start'
    className={cn('cursor-default p-0', className)}
    {...props}
  />
)

type PromptInputFooterProps = Omit<
  ComponentProps<typeof InputGroupAddon>,
  'align'
>

export const PromptInputFooter = ({
  className,
  ...props
}: PromptInputFooterProps) => (
  <InputGroupAddon
    align='block-end'
    className={cn('cursor-default justify-end gap-1.5 p-2', className)}
    {...props}
  />
)

type PromptInputButtonProps = ComponentProps<typeof Button>

export const PromptInputButton = ({
  className,
  variant = 'dashed',
  size = 'icon-sm',
  ...props
}: PromptInputButtonProps) => (
  <Button
    className={cn('[&_svg]:size-4', className)}
    size={size}
    type='button'
    variant={variant}
    {...props}
  />
)

type PromptInputSubmitProps = Omit<PromptInputButtonProps, 'type'> & {
  status?: ChatStatus
  onStop?: () => void
}

export const PromptInputSubmit = ({
  className,
  status,
  onStop,
  children,
  ...props
}: PromptInputSubmitProps) => {
  const isBusy = status === 'submitted' || status === 'streaming'
  const filled =
    'border-primary bg-primary text-primary-foreground hover:bg-primary/80 data-[disabled]:bg-primary data-[disabled]:opacity-50'

  if (isBusy && onStop) {
    return (
      <PromptInputButton
        aria-label='Stop generating'
        className={cn(filled, '[&_svg]:size-3', className)}
        onClick={onStop}
        {...props}
      >
        <Icons.square className='fill-current' />
      </PromptInputButton>
    )
  }

  return (
    <PromptInputButton
      aria-label='Send message'
      className={cn(filled, className)}
      type='submit'
      {...props}
    >
      {children ?? <Icons.arrowUp />}
    </PromptInputButton>
  )
}
