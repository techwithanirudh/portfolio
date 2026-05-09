import { Slot } from '@radix-ui/react-slot'
import type { ComponentProps } from 'react'
import { Icons } from '@/components/icons/icons'
import { cn } from '@/lib/utils'

export function Prose({
  className,
  asChild = false,
  ...props
}: ComponentProps<'div'> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'div'

  return (
    <Comp
      className={cn(
        'prose prose-zinc dark:prose-invert prose-content max-w-none',
        className
      )}
      data-slot='prose'
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
    return (
      <Comp className={className} {...(props as ComponentProps<typeof Comp>)} />
    )
  }

  return (
    <Comp
      className={cn('flex flex-row items-center gap-2', className)}
      {...(props as ComponentProps<typeof Comp>)}
    >
      <a className='peer not-prose' href={`#${props.id}`}>
        {props.children}
      </a>
      <Icons.link
        aria-hidden
        className='size-3.5 shrink-0 translate-y-px text-muted-foreground opacity-0 transition-opacity peer-hover:opacity-100 peer-focus:opacity-100'
      />
    </Comp>
  )
}
