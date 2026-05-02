import { LinkIcon } from 'lucide-react'
import { Slot } from '@radix-ui/react-slot'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export function Prose({
  className,
  asChild = false,
  ...props
}: ComponentProps<'div'> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'div'

  return (
    <Comp
      data-slot='prose'
      className={cn(
        'prose max-w-none prose-zinc dark:prose-invert prose-content',
        className
      )}
      {...props}
    />
  )
}

export function InlineCode({ className, ...props }: ComponentProps<'code'>) {
  const isCodeBlock = 'data-language' in props || className?.includes('language-')

  return (
    <code
      data-slot={isCodeBlock ? 'code-block' : 'code-inline'}
      className={cn(!isCodeBlock && 'not-prose code-inline', className)}
      {...props}
    />
  )
}

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

type HeadingProps<T extends HeadingTag> = ComponentProps<T> & { as?: T }

export function Heading<T extends HeadingTag = 'h1'>({
  as,
  className,
  ...props
}: HeadingProps<T>): React.ReactElement {
  const Comp = (as ?? 'h1') as HeadingTag

  if (!props.id) {
    return <Comp className={className} {...(props as ComponentProps<typeof Comp>)} />
  }

  return (
    <Comp
      className={cn('flex flex-row items-center gap-2', className)}
      {...(props as ComponentProps<typeof Comp>)}
    >
      <a href={`#${props.id}`} className='peer not-prose'>
        {props.children}
      </a>
      <LinkIcon
        aria-hidden
        className='size-3.5 shrink-0 translate-y-px text-muted-foreground opacity-0 transition-opacity peer-hover:opacity-100'
      />
    </Comp>
  )
}
