'use client'

import dynamic from 'next/dynamic'
import { useIntersectionObserver } from 'usehooks-ts'
import { useSignInModal } from '@/components/features/auth/sign-in-modal'
import { cn } from '@/lib/utils'

// The comment widget ships a whole editor plus highlight.js (about 200KB
// gzipped), so it only loads once the end of the post is a screen away
const Comments = dynamic(
  () => import('@fuma-comment/react').then((mod) => mod.Comments),
  { ssr: false }
)

// min-h-59 (236px) is the form plus one comment, which is what both posts
// load, so the footer doesn't jump when the widget arrives
export function PostComments({
  slug,
  className,
}: {
  slug: string
  className?: string
}) {
  const { openSignIn } = useSignInModal()
  const { ref, isIntersecting } = useIntersectionObserver({
    freezeOnceVisible: true,
    rootMargin: '100% 0px',
  })

  return (
    <div className='min-h-59' ref={ref}>
      {isIntersecting && (
        <Comments
          auth={{
            signIn: () => {
              openSignIn(`/blog/${slug}`)
            },
            type: 'api',
          }}
          // The form's toolbar is 40px with the 32px sign in button but 36px with the send button
          // shown while the widget checks the session; min-h-10 keeps 40px so nothing shifts
          className={cn(
            'w-full [&>div:first-child>form>div>div:last-child]:min-h-10 [&>div:first-child>form>div>p]:mb-10',
            className
          )}
          page={slug}
        />
      )}
    </div>
  )
}
