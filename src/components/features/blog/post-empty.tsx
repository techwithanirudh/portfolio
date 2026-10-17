import Link from 'next/link'
import { PageSimba } from '@/components/features/assistant/mascot/page-simba'
import { Icons } from '@/components/icons/icons'
import { pages } from '@/constants/pages'
import { cn } from '@/lib/utils'

/**
 * Shown when a search or tag filter turns up no posts: bashful Simba, a line
 * saying so and a way back to every post
 */
export const PostEmpty = ({
  className,
  tag,
}: {
  className?: string
  /** The tag being filtered on, which the message names */
  tag?: string
}) => (
  <div
    className={cn(
      'flex flex-col items-center gap-3 px-6 py-12 text-center',
      className
    )}
    role='status'
  >
    <PageSimba pose='bashful' size={96} />
    <p className='font-medium'>
      {tag ? `Nothing tagged ${tag} yet.` : 'Nothing matches that yet.'}
    </p>
    <Link
      className='group inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground'
      href={pages.blog.path}
    >
      See every post
      <Icons.arrowRight
        aria-hidden
        className='size-4 transition-transform group-hover:translate-x-0.5'
      />
    </Link>
  </div>
)
