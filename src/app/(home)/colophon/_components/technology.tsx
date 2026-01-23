import { technology } from '@/constants/portfolio/colophon'
import { cn } from '@/lib/utils'
import {
  colophonCardBorderClasses,
  colophonGridClassName,
} from './colophon-grid'

export const Technology = () => {
  const fillerCount = (3 - (technology.length % 3 || 3)) % 3
  const fillerKeys = Array.from(
    { length: fillerCount },
    (_, fillerIndex) => `tech-filler-${fillerIndex + 1}`
  )

  return (
    <div className={colophonGridClassName}>
      {technology.map((item, index) => {
        const hasLink = Boolean(item.url)
        const WrapperTag = hasLink ? 'a' : 'div'
        const linkProps = hasLink
          ? {
              href: item.url,
              target: '_blank',
              rel: 'noopener noreferrer',
            }
          : {}

        return (
          <WrapperTag
            className={cn(
              'flex h-full flex-col gap-2 bg-card/50 p-6 text-left transition-colors',
              colophonCardBorderClasses(index),
              hasLink && 'hover:bg-card/80'
            )}
            key={item.name}
            {...linkProps}
          >
            <h3 className='font-medium text-foreground text-sm'>{item.name}</h3>
            <p className='text-muted-foreground text-xs'>{item.description}</p>
          </WrapperTag>
        )
      })}
      {fillerKeys.map((key) => (
        <div
          className='hidden size-full border-border border-t border-dashed bg-dashed lg:block'
          key={key}
        />
      ))}
    </div>
  )
}
