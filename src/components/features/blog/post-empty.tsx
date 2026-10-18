import Link from 'next/link'
import { PageSimba } from '@/components/features/assistant/mascot/page-simba'
import { Icons } from '@/components/icons/icons'
import { pages } from '@/constants/pages'
import { cn } from '@/lib/utils'

interface EmptyLink {
  href: string
  label: string
}

const everyPost: EmptyLink = { href: pages.blog.path, label: 'See every post' }

export const PostEmpty = ({
  className,
  link = everyPost,
  tag,
}: {
  className?: string
  /** Where the way back goes; null leaves it out */
  link?: EmptyLink | null
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
    {link && (
      <Link
        className='group inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground'
        href={link.href}
      >
        {link.label}
        <Icons.arrowRight
          aria-hidden
          className='size-4 transition-transform group-hover:translate-x-0.5'
        />
      </Link>
    )}
  </div>
)
