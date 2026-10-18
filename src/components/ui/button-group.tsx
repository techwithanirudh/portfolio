import { cva, type VariantProps } from 'class-variance-authority'

import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

const buttonGroupVariants = cva(
  'flex w-fit items-stretch *:focus-visible:relative *:focus-visible:z-10',
  {
    variants: {
      orientation: {
        // Matches [data-slot] children, not :first-child/:last-child, because an
        // open Base UI menu drops focus-guard spans next to its trigger, which
        // squared off the trigger's outer corners while the menu was open
        horizontal:
          '[&>[data-slot]~[data-slot]]:rounded-l-none [&>[data-slot]~[data-slot]]:border-l-0 [&>[data-slot]:has(~[data-slot])]:rounded-r-none',
        vertical:
          'flex-col [&>[data-slot]~[data-slot]]:rounded-t-none [&>[data-slot]~[data-slot]]:border-t-0 [&>[data-slot]:has(~[data-slot])]:rounded-b-none',
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
    },
  }
)

function ButtonGroup({
  className,
  orientation,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof buttonGroupVariants>) {
  return (
    <div
      className={cn(buttonGroupVariants({ orientation }), className)}
      data-orientation={orientation}
      data-slot='button-group'
      role='group'
      {...props}
    />
  )
}

function ButtonGroupSeparator({
  className,
  orientation = 'vertical',
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      className={cn(
        'relative self-stretch bg-input data-horizontal:mx-px data-vertical:my-px data-vertical:h-auto data-horizontal:w-auto',
        className
      )}
      data-slot='button-group-separator'
      orientation={orientation}
      {...props}
    />
  )
}

export { ButtonGroup, ButtonGroupSeparator, buttonGroupVariants }
