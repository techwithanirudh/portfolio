import { Button as ButtonPrimitive } from '@base-ui/react/button'
import type { VariantProps } from 'class-variance-authority'

import { buttonVariants } from '@/components/ui/button-variants'
import { cn } from '@/lib/utils'

function Button({
  className,
  variant = 'default',
  size = 'default',
  shape = 'default',
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      className={cn(buttonVariants({ variant, size, shape, className }))}
      data-shape={shape}
      data-size={size}
      data-slot='button'
      data-variant={variant}
      {...props}
    />
  )
}

export { Button }
