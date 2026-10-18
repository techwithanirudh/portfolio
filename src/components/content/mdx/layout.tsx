import type { ReactNode } from 'react'
// TODO(slopradar): layering: a shared component imports PostComments from a route page.client, move PostComments into src/components/features or take it as a slot so components never depend on app/
import { PostComments } from '@/app/(home)/blog/[slug]/page.client'
import { Prose } from '@/components/prose'
import { cn } from '@/lib/utils'

interface MdxContentProps {
  beforeComments?: ReactNode
  children: ReactNode
  className?: string
  // TODO(slopradar): boolean-prop: the one caller always passes comments with slug, and className/commentsClassName are never passed; take comments?: ReactNode (the caller renders PostComments) and drop the flag pair
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
    <Prose
      className={cn('min-w-0 flex-1 px-4 text-foreground/90', proseClassName)}
    >
      {children}
    </Prose>
    {beforeComments}
    {comments && slug ? (
      <PostComments
        className={cn(
          '[&_form>div]:!rounded-none rounded-none border-0 border-border border-t border-b border-dashed lg:border-b-0',
          commentsClassName
        )}
        slug={slug}
      />
    ) : (
      <div className='py-2' />
    )}
  </div>
)
