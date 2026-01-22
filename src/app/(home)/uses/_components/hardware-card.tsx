import type { HardwareItem } from '@/types'

type HardwareCardProps = HardwareItem

export function HardwareCard({ name, description, url }: HardwareCardProps) {
  const Wrapper = url ? 'a' : 'div'
  const linkProps = url
    ? { href: url, target: '_blank', rel: 'noopener noreferrer' }
    : {}

  return (
    <Wrapper
      className='flex h-full flex-col gap-4 bg-card/50 p-6 transition-colors hover:bg-card/80'
      {...linkProps}
    >
      <div className='flex flex-1 flex-col gap-2'>
        <h3 className='font-medium text-lg'>{name}</h3>
        <p className='text-muted-foreground text-sm'>{description}</p>
      </div>
      {url && (
        <span className='text-primary text-sm hover:underline'>Learn more</span>
      )}
    </Wrapper>
  )
}
