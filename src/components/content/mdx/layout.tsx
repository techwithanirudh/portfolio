import type { ReactNode } from 'react'
import { PostComments } from '@/app/(home)/blog/[slug]/page.client'
import { cn } from '@/lib/utils'

interface MdxContentProps {
  beforeComments?: ReactNode
  children: ReactNode
  className?: string
  comments?: boolean
  commentsClassName?: string
  proseClassName?: string
  slug?: string
}

export const MdxContent = ({
  children,
  beforeComments,
  comments,
  slug,
  className,
  proseClassName,
  commentsClassName,
}: MdxContentProps) => (
  <div className={cn('flex min-w-0 flex-1 flex-col gap-4', className)}>
    <div
      className={cn(
        'prose prose-zinc dark:prose-invert prose-content min-w-0 flex-1 px-4 text-fd-foreground/90',
        proseClassName
      )}
    >
      {children}
    </div>
    {beforeComments}
    {comments && slug ? (
      <PostComments
        className={cn(
          'border-0 border-line border-y [&_form]:border-line [&_form]:border-b',
          commentsClassName
        )}
        slug={slug}
      />
    ) : (
      <div className='py-2' />
    )}
  </div>
)
