import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { cn } from '@/lib/utils'

export const proseMeasure =
  '[&>:is(ul,ol,dl,blockquote,h2,h3,h4,h5,h6)]:max-w-[68ch] [&_p]:max-w-[68ch]'

export function Prose({
  className,
  render,
  ...props
}: useRender.ComponentProps<'div'>) {
  return useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(
      {
        className: cn(
          'prose prose-zinc dark:prose-invert prose-content max-w-none',
          className
        ),
      },
      props
    ),
    render,
    state: { slot: 'prose' },
  })
}
