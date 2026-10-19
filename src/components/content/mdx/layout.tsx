import type { ReactNode } from 'react'
import { PostComments } from '@/components/features/blog/post-comments'
import { Prose } from '@/components/prose'
import { cn } from '@/lib/utils'

interface MdxContentProps {
  beforeComments?: ReactNode
  children: ReactNode
  proseClassName?: string
  /** Shows the comments thread for this post */
  slug?: string
}

export const MdxContent = ({
  children,
  beforeComments,
  slug,
  proseClassName,
}: MdxContentProps) => (
  <div className='flex min-w-0 flex-1 flex-col gap-4'>
    <Prose
      className={cn('min-w-0 flex-1 px-4 text-foreground/90', proseClassName)}
    >
      {children}
    </Prose>
    {beforeComments}
    {slug ? (
      <PostComments
        className='[&_form>div]:!rounded-none rounded-none border-0 border-border border-t border-b border-dashed lg:border-b-0'
        slug={slug}
      />
    ) : (
      <div className='py-2' />
    )}
  </div>
)
