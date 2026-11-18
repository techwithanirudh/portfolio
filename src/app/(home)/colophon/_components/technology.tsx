import { externalLinkProps } from '@/components/external-link'
import { technology } from '@/constants/portfolio/colophon'
import { cn } from '@/lib/utils'
import {
  COLOPHON_COLUMNS,
  colophonCardBorderClasses,
  colophonGridClassName,
} from './colophon-grid'

export const Technology = () => {
  const fillerCount =
    (COLOPHON_COLUMNS -
      (technology.length % COLOPHON_COLUMNS || COLOPHON_COLUMNS)) %
    COLOPHON_COLUMNS
  const fillerKeys = Array.from(
    { length: fillerCount },
    (_, fillerIndex) => `tech-filler-${fillerIndex + 1}`
  )

  return (
    <div className={colophonGridClassName}>
      {technology.map((item, index) => {
        const className = cn(
          'flex h-full flex-col gap-2 bg-card/50 p-6 text-left transition-colors',
          colophonCardBorderClasses(index),
          item.url && 'hover:bg-card/80'
        )
        const content = (
          <>
            <h3 className='font-medium text-foreground text-sm'>{item.name}</h3>
            <p className='text-muted-foreground text-xs'>{item.description}</p>
          </>
        )

        return item.url ? (
          <a
            className={className}
            href={item.url}
            key={item.name}
            {...externalLinkProps}
          >
            {content}
          </a>
        ) : (
          <div className={className} key={item.name}>
            {content}
          </div>
        )
      })}
      {fillerKeys.map((key, fillerIndex) => (
        <div
          className={cn(
            'hidden size-full bg-dashed lg:block',
            colophonCardBorderClasses(technology.length + fillerIndex)
          )}
          key={key}
        />
      ))}
    </div>
  )
}
